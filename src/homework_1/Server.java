package homework_1;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.Charset;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.Scanner;

enum LOG_LEVEL {
    NONE, CHAT, VERBOSE
}

public class Server {
    private ServerSocket socket;
    private InetSocketAddress saddr;
    private LinkedList<ClientThread> clients;
    private ServerLogger logger;
    private boolean active;
    private Thread clientListener;
    private String commandList = "help - display this usage\n" +
            "active - activate server for accepting connections\n" +
            "inactive - deactivate server for accepting connections\n" +
            "quit - inactivate server and close\n";
    private String welcome = "****Welcome to this simple chat server****";

    Server() {
        clients = new LinkedList<ClientThread>();
        active = false;
        saddr = null;
        socket = null;
        clientListener = null;
        logger = null;
    }

    public static void main(String[] args){
        //create server object
        Server server = null;
        server = new Server();
        server.setAddress("localhost", 4444);
        server.addServerLogger(new ServerLogger("serverlog.txt", "chat.txt", LOG_LEVEL.VERBOSE));
        //create admin console
        Scanner s = new Scanner(System.in);
        server.printToServerAdminUI("Main server thread started: type 'active' to start listening for clients, 'help' for list of supported commands.\n");
        while (true) {
            server.printToServerAdminUI(">> ");
            if (s.hasNext()) {
                server.processCommand(s.next());
            }
        }
    }

    public void addServerLogger(ServerLogger logger) {
        this.logger = logger;
        logger.start();
    }

    public ServerSocket getSocket() {
        return socket;
    }

    private synchronized void printUsage() {
        System.out.println(commandList);
    }

    private synchronized void printToServerAdminUI(String output) {
        System.out.print(output);
    }

    public synchronized boolean isActive() {
        return active;
    }

    public void setAddress(String lhost, int lport) {
        saddr = new InetSocketAddress(lhost, lport);
    }

    public synchronized void setActive(boolean active) throws IOException {
        this.active = active;
        if (active) {
            clientListener = new Thread(new ClientListener());
            if (socket == null || socket.isClosed()) {
                socket = new ServerSocket();
            }
            socket.bind(saddr);
            clientListener.start();
            logger.setActive(true);
            logger.log("Server set active.");
        } else {
            //Remove the client listener when not active, force garbage collection and remove clients
            //This allows restarting the server's connection to clean clients array
            logger.log("Server set inactive.");
            clientListener.stop();
            socket.close();
            logger.setActive(false);
            clientListener = null;
            clients.clear();
            System.gc();
        }
    }

    private synchronized void broadcast(String message) {
        clients.forEach(client -> client.printToClient("SERVER: " + message));
    }

    /**
     * Similar to broadcast, but allows for specifying a client id that the message was sent from
     * this id will be used to skip printing to the same client that sent the message.
     *
     * @param message  the message to broadcast
     * @param clientInfo the info of the sending client
     */
    private synchronized void broadcast(String message, ClientInfo clientInfo) {

        printToServerAdminUI("Message from client: " + clientInfo.name +
                " id: " + clientInfo.clientID + " -- " + message + "\n");
        try {
            logger.logChat(message, clientInfo);
        } catch (IOException ex) {
            printToServerAdminUI("Could not write to chatlog!");
        }
        for (ClientThread c : clients) {
            if (clientInfo.clientID != c.id) {
                c.printToClient(clientInfo.name + ":" + message);
            } else {
                printToServerAdminUI("Skipped broadcast to sending client id: " + clientInfo.clientID + "\n");
                try {
                    logger.log("Skipped message broadcast to sending client id: " + clientInfo.clientID);
                } catch (IOException ex) {
                    printToServerAdminUI("Could not write to logfile!");
                }

            }
        }
    }

    private String getServerTime() {
        return logger.getSimpleTime();
    }

    private void cleanup() throws IOException {
        broadcast("Server is going down...");
        setActive(false);
        logger.cleanup();
    }

    private void processCommand(String command) {
        try {
            switch (command.toUpperCase()) {
                case "ACTIVE":
                    if (isActive()) {
                        printToServerAdminUI("Server is already active!\n");
                        break;
                    }
                    setActive(true);
                    if (isActive()) {
                        printToServerAdminUI("Successfully activated client listener\n");
                    } else {
                        printToServerAdminUI("Could not activate client listener\n");
                    }
                    break;
                case "INACTIVE":
                    if (!isActive()) {
                        printToServerAdminUI("Server is already inactive!\n");
                        break;
                    }
                    setActive(false);
                    if (!isActive()) {
                        printToServerAdminUI("Successfully inactivated client listener\n");
                    } else {
                        printToServerAdminUI("Could not inactivate client listener\n");
                    }
                    break;
                case "HELP":
                    printUsage();
                    break;
                case "QUIT":
                    printToServerAdminUI("Cleaning up and closing...\n");
                    cleanup();
                    System.exit(0);
                default:
                    printToServerAdminUI("Unrecognized command: '" + command + "' type 'help' for list of commands.\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    class ClientListener implements Runnable {
        private Scanner id_reader;

        private synchronized int acceptClient(Socket client) {
            //check if new connection is a secondary connection opened for client data xfer
            try {
                id_reader = new Scanner(client.getInputStream());
                if (id_reader.hasNextInt()) {
                    int clid = id_reader.nextInt();
                    //make sure received int wont cause an IndexOutOfBoundsException
                    if ((clid >= 0) && (clid < clients.size())) {
                        if (clients.get(clid).dataXferRequested) {
                            clients.get(clid).dataSocket = client;
                            return clients.size() - 1;
                        }
                        client.close();
                        return clients.size() - 1;
                    }

                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            clients.add(new ClientThread(client, clients.size()));
            clients.peekLast().start();
            return clients.size() - 1;
        }

        @Override
        public void run() {
        /*
         * this way, the server's active variable is only locked once after each time a client is connected.
         * clients is only locked by this thread once when adding a client, allowing the admin thread or an admin
         * client to issue moderator commands without this thread interfering
         */
            printToServerAdminUI("Waiting for new clients...\n");
            try {
                int id = 0;
                while (isActive()) {
                    id = acceptClient(socket.accept());
                    printToServerAdminUI("Accepted new client with ID= " + id + "\n");
                    logger.log("Accepted new client with ID= " + id);
                    printToServerAdminUI("Waiting for new clients...\n");
                }
            } catch (IOException ex) {
                printToServerAdminUI("Error accepting new client!\n");
                try {
                    logger.log("Error accepting new client!");
                } catch (IOException e) {
                    printToServerAdminUI("Could not write to logfile!");
                }

            }
        }
    }

    class ClientThread extends Thread {

        private Socket socket;
        private Socket dataSocket;
        private InputStream dataInput;
        private String file_recv_name;
        private Path file_recv_path;
        private BufferedImage recv_img;
        private boolean dataXferRequested;
        private boolean data_isReceiving;
        private ClientInfo info;
        private int id;
        private Scanner in;
        private PrintWriter out;
        private String name;

        ClientThread(Socket sock, int id) {
            this.socket = sock;
            this.dataSocket = null;
            this.file_recv_name = "";
            this.dataXferRequested = false;
            this.id = id;
        }

        @Override
        public void run() {
            printConnectionInfo();
            try {
                in = new Scanner(new BufferedInputStream(socket.getInputStream()));
                out = new PrintWriter(socket.getOutputStream());
                printWelcomeMessage();
                namePrompt();
                name = in.nextLine();

                //create client info object
                info = new ClientInfo(name, id, socket.getRemoteSocketAddress() + ":" + socket.getPort());

                while (socket.isConnected()) {
                    if (dataSocket != null && dataSocket.isConnected() && !data_isReceiving) {
                        printToClient("IMG_RDY");
                        data_isReceiving = true;
                    }
                    if (in.hasNextLine()) processClientCommand(in.nextLine());

                }
            } catch (IOException e) {
                printToServerAdminUI(e.getMessage());
            }
        }

        private void processClientCommand(String command) {
            //check if first part of the command is a valid command
            String[] cmd = command.toUpperCase().split(" ");
            switch (cmd[0]) {
                case "TEXT":
                    broadcast(in.nextLine(), this.info);
                    break;
                case "IMAGE":
                    dataXferRequested = true;
                    file_recv_name = in.nextLine();
                    printToClient("IMG_ACK " + info.clientID);
                    break;
                case "IMG_SEND":
                    if (dataXferRequested) processImage();
                default:
            }
        }

        private void cleanupDataConnection() {
            try {
                dataSocket.close();
                dataXferRequested = false;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        private void processImage() {
            try {
                recv_img = ImageIO.read(ImageIO.createImageInputStream(dataSocket.getInputStream()));

            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in transferring image: " + file_recv_name);
                cleanupDataConnection();
            }
            broadcast("Received file from " + info.name + ": " + file_recv_name);

            try {
                Files.createDirectory(Paths.get("image"));
            } catch (FileAlreadyExistsException ex) {
                //Ignore, as we are creating directory only if not existing
            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in transferring image: " + file_recv_name);
                cleanupDataConnection();
            }
            try {
                file_recv_path = Paths.get("image/" + info.name + "_" + file_recv_name + "_" + getServerTime());
                Files.createFile(file_recv_path);
            } catch (FileAlreadyExistsException ex) {
                printToClient("Cannot upload: File already exists! " + file_recv_name);
                cleanupDataConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                ImageIO.write(recv_img, "png", Files.newOutputStream(file_recv_path, StandardOpenOption.WRITE));
                printToClient("IMG_OK");
            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in transferring image: " + file_recv_name);
            }
            cleanupDataConnection();
        }

        private void namePrompt() {
            out.println("Enter your Name: (Type in your name, then press Enter) ");
            out.flush();
        }

        private void printWelcomeMessage() {
            out.println(welcome);
            out.flush();
        }

        private void printConnectionInfo() {
            printToServerAdminUI("Client " + id + " remote address: " + socket.getRemoteSocketAddress() + "\n");
        }

        public synchronized void printToClient(String message) {
            out.println(message);
            out.flush();
        }
    }
}

class ServerLogger extends Thread {
    private Path logFilePath, chatlogFilePath;
    private Date date;
    private BufferedWriter sWriter, cWriter;
    private boolean serverActive;
    private LOG_LEVEL log_level;
    private long message_count;

    ServerLogger(String logFilePath, String chatlogFilePath, LOG_LEVEL log_level) {
        this.logFilePath = Paths.get(logFilePath).toAbsolutePath();
        this.chatlogFilePath = Paths.get(chatlogFilePath).toAbsolutePath();
        this.log_level = log_level;
        this.date = new Date();
        this.message_count = 0;
    }

    public String getSimpleTime() {
        return new SimpleDateFormat("HHmmss").format(date);
    }

    public void setActive(boolean serverActive) {
        this.serverActive = serverActive;
        if (serverActive) {
            try {
                Files.createFile(chatlogFilePath);
            } catch (FileAlreadyExistsException e) {
                //ignore as we don't care if file already exists as we are appending
            } catch (IOException ex) {
                ex.printStackTrace();
            }

            try {
                cWriter = Files.newBufferedWriter(chatlogFilePath, Charset.forName("UTF-8"), StandardOpenOption.APPEND);
            } catch (IOException e) {
                e.printStackTrace();
            }

        } else {
            try {
                cWriter.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void log(String message) throws IOException {
        if (log_level == LOG_LEVEL.VERBOSE) {
            //uses line.separator to deal with stupid windows and stupid notepad being stupid.
            sWriter.write(date + ": " + message + System.getProperty("line.separator"));
            sWriter.flush();
        }
    }

    public void logChat(String message, ClientInfo clientInfo) throws IOException {
        if ((log_level == LOG_LEVEL.CHAT) || (log_level == LOG_LEVEL.VERBOSE)) {
            //uses line.separator to deal with stupid windows and stupid notepad being stupid.
            cWriter.write(message_count + ": " + date + " - " + clientInfo.name + ":" + message + System.getProperty("line.separator"));
            cWriter.flush();
            message_count++;
        }
    }

    public void cleanup() {
        try {
            cWriter.close();
            sWriter.write(date + ": Server is going down." + System.getProperty("line.separator"));
            sWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void setup() {
        try {
            Files.createFile(logFilePath);

        } catch (FileAlreadyExistsException ex) {
            //ignore because we're appending
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            sWriter = Files.newBufferedWriter(logFilePath, Charset.forName("UTF-8"), StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {

        setup();
        while (this.isAlive()) {
            if (!serverActive) {

            }
        }
    }
}

class ClientInfo {
    public String name;
    public int clientID;
    public String address;

    public ClientInfo(String name, int clientID, String address) {
        this.name = name;
        this.clientID = clientID;
        this.address = address;
    }
}