package homework_1;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Scanner;

public class Server {
    private ServerSocket socket;
    private InetSocketAddress saddr;
    private LinkedList<ClientThread> clients;
    private boolean active;
    private Thread clientListener;
    private String commandList = "help - display this usage\n" +
            "active - activate server for accepting connections\n" +
            "inactive - deactivate server for accepting connections\n" +
            "quit - inactivate server and close\n";
    private String welcome = "****Welcome to this simple chat server****";

    Server() throws IOException {
        clients = new LinkedList<ClientThread>();
        active = false;
        saddr = null;
        socket = new ServerSocket();
        clientListener = null;
    }

    public ServerSocket getSocket() {
        return socket;
    }

    public static void main(String[] args){
        Server server = null;
        try {
            server = new Server();
            server.setAddress("localhost", 4444);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Scanner s = new Scanner(System.in);
        System.out.println("Main server thread started: type 'active' to start listening for clients, 'help' for list of supported commands.");
        while (true) {
            server.printToServerAdmin(">> ");
            if (s.hasNext()) {
                server.processCommand(s.next());
            }
        }
    }

    private synchronized void printUsage() {
        System.out.println(commandList);
    }

    private synchronized void printToServerAdmin(String output) {
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
            if (socket.isClosed()) {
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
        clients.forEach(client -> client.printToClient(message));
    }

    /**
     * Similar to broadcast, but allows for specifying a client id that the message was sent from
     * this id will be used to skip printing to the same client that sent the message.
     *
     * @param message  the message to broadcast
     * @param clientid the id of the sending client
     */
    private synchronized void broadcast(String message, int clientid) {
        //TODO print skipped client to log rather than server admin.
        //TODO added verbose logging here
        //TODO print to server UI as well
        printToServerAdmin("Message from client id= " + clientid + " - " + message + "\n");
        for (ClientThread c : clients) {
            if (clientid != c.id) {
                c.printToClient(message);
            } else {
                printToServerAdmin("Skipped broadcast to client id= " + clientid + "\n");
            }
            ;
        }

    }

    private void processCommand(String command) {
        try {
            switch (command.toUpperCase()) {
                case "ACTIVE":
                    if (isActive()) {
                        printToServerAdmin("Server is already active!\n");
                        break;
                    }
                    setActive(true);
                    if (isActive()) {
                        printToServerAdmin("Successfully activated client listener\n");
                    } else {
                        printToServerAdmin("Could not activate client listener\n");
                    }
                    break;
                case "INACTIVE":
                    if (!isActive()) {
                        printToServerAdmin("Server is already inactive!\n");
                        break;
                    }
                    setActive(false);
                    if (!isActive()) {
                        printToServerAdmin("Successfully inactivated client listener\n");
                    } else {
                        printToServerAdmin("Could not inactivate client listener\n");
                    }
                    break;
                case "HELP":
                    printUsage();
                    break;
                case "QUIT":
                    printToServerAdmin("Cleaning up and closing...\n");
                    System.exit(0);
                default:
                    printToServerAdmin("Unrecognized command: '" + command + "' type 'help' for list of commands.\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
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
            printToServerAdmin("Waiting for new clients...\n");
            try {
                int id = 0;
                while (isActive()) {
                    id = acceptClient(socket.accept());
                    printToServerAdmin("Accepted new client with ID= " + id + "\n");
                    printToServerAdmin("Waiting for new clients...\n");
                }
            } catch (IOException ex) {
                printToServerAdmin("Error accepting new client!\n");
            }
        }
    }

    class ClientThread extends Thread {

        private Socket socket;
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
                while (socket.isConnected()) {
                    if (in.hasNextLine()) processClientCommand(in.nextLine());
                }
            } catch (IOException e) {
                printToServerAdmin(e.getMessage());
            }
        }

        private void processClientCommand(String command) {
            //check if first part of the command is a valid command
            String[] cmd = command.toUpperCase().split(" ");
            switch (cmd[0]) {
                case "TEXT":
                    broadcast(in.nextLine(), this.id);
                    break;
                case "IMAGE":
                    break;
                default:
            }
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
            printToServerAdmin("Client " + id + " remote address: " + socket.getRemoteSocketAddress() + "\n");
        }

        public synchronized void printToClient(String message) {
            out.print(message);
            out.flush();
        }
    }
}
