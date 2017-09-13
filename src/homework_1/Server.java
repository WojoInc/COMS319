package homework_1;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.channels.FileChannel;
import java.util.LinkedList;
import java.util.Scanner;

enum LOG_LEVEL {
    NONE, CHAT, VERBOSE
}

public class Server {
    private ServerSocket socket;
    private InetSocketAddress saddr;
    private LinkedList<ClientThread> clients;
    private long msg_num;
    private String logFile;
    private String chatLogFile;
    private PrintWriter logWriter;
    private PrintWriter chatLogWriter;
    private boolean active;
    private LOG_LEVEL loglevel;
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
    }

    public static void main(String[] args){
        //create server object
        Server server = null;
        server = new Server();
        server.setAddress("localhost", 4444);
        server.setLoglevel(LOG_LEVEL.VERBOSE);
        server.setLogFile("log/serverlog.txt");
        server.setChatLogFile("log/log.txt");
        //create admin console
        Scanner s = new Scanner(System.in);
        System.out.println("Main server thread started: type 'active' to start listening for clients, 'help' for list of supported commands.");
        while (true) {
            server.printToServerAdminUI(">> ");
            if (s.hasNext()) {
                server.processCommand(s.next());
            }
        }
    }

    public void setLogFile(String logFile) {
        this.logFile = logFile;
    }

    public void setChatLogFile(String chatLogFile) {
        this.chatLogFile = chatLogFile;
    }

    public LOG_LEVEL getLoglevel() {
        return loglevel;
    }

    public ServerSocket getSocket() {
        return socket;
    }

    public void setLoglevel(LOG_LEVEL loglevel) {
        this.loglevel = loglevel;
    }

    private synchronized void printUsage() {
        System.out.println(commandList);
    }

    private synchronized void printToServerAdminUI(String output) {
        switch (loglevel) {
            case NONE:
                System.out.print(output);
                break;
            case CHAT:
                System.out.print(output);
                break;
            case VERBOSE:
                System.out.print(output);
                break;

        }
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
        } else {
            //Remove the client listener when not active, force garbage collection and remove clients
            //This allows restarting the server's connection to clean clients array
            clientListener.stop();
            socket.close();

            clientListener = null;
            clients.clear();
            System.gc();
        }
    }

    private synchronized void broadcast(String message) {
        clients.forEach(client -> client.printToClient("SERVER: " + message));
    }

    private void updateServerLog() {

    }

    private void updateChatLog() {

    }
    /**
     * Similar to broadcast, but allows for specifying a client id that the message was sent from
     * this id will be used to skip printing to the same client that sent the message.
     *
     * @param message  the message to broadcast
     * @param clientInfo the info of the sending client
     */
    private synchronized void broadcast(String message, ClientInfo clientInfo) {
        //TODO print skipped client to log rather than server admin.
        //TODO added verbose logging here
        printToServerAdminUI("Message from client: " + clientInfo.name +
                " id: " + clientInfo.clientID + " -- " + message + "\n");
        for (ClientThread c : clients) {
            if (clientInfo.clientID != c.id) {
                c.printToClient(clientInfo.name + ":" + message);
            } else {
                printToServerAdminUI("Skipped broadcast to client id: " + clientInfo.clientID + "\n");
            }
        }
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
                    System.exit(0);
                default:
                    printToServerAdminUI("Unrecognized command: '" + command + "' type 'help' for list of commands.\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    class ServerLogger extends Thread {
        String logFilePath, chatlogFilePath;
        File serverLog, chatLog;
        FileWriter sWriter, cWriter;
        FileOutputStream sOutStream, cOutStream;
        FileChannel sChannel, cChannel;
        boolean serverActive;
        LOG_LEVEL log_level;

        ServerLogger(String logFilePath, String chatlogFilePath, LOG_LEVEL log_level) {
            this.logFilePath = logFilePath;
            this.chatlogFilePath = chatlogFilePath;
            this.log_level = log_level;
        }

        public void setServerActive(boolean serverActive) {
            this.serverActive = serverActive;
            if (serverActive) {
                sChannel = sOutStream.getChannel();
                try {
                    sChannel.position(sChannel.size());
                    sChannel.tryLock();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        public void log(String message) {

        }

        public void setup() throws IOException {
            serverLog.createNewFile(); // will only create if not already existing
            chatLog.createNewFile();
            sOutStream = new FileOutputStream(serverLog, true);
        }

        @Override
        public void run() {
            serverLog = new File(logFilePath);
            chatLog = new File(chatlogFilePath);

            try {
                setup();


            } catch (IOException e) {
                e.printStackTrace();
            }
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

    class ClientListener implements Runnable {

        /*  private Server mainServer;
          ClientListener(Server mainServer){this.mainServer = mainServer;}*/
        ClientListener() {
        }

        private synchronized int acceptClient(Socket client) {
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
                    printToServerAdminUI("Waiting for new clients...\n");
                }
            } catch (IOException ex) {
                printToServerAdminUI("Error accepting new client!\n");
            }
        }
    }

    class ClientThread extends Thread {

        private Socket socket;
        private ClientInfo info;
        private int id;
        private Scanner in;
        private PrintWriter out;
        private String name;

        ClientThread(Socket sock, int id) {
            this.socket = sock;
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
                    break;
                default:
            }
        }

        public String getClientName() {
            return name;
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
