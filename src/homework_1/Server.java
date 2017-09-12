package homework_1;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Scanner;

public class Server {
    private ServerSocket socket;
    private InetSocketAddress saddr;
    private LinkedList<Thread> clients;
    private boolean active;
    private Thread clientListener;
    private String commandList = "help - display this usage\n" +
            "active - activate server for accepting connections\n" +
            "inactive - deactivate server for accepting connections\n" +
            "quit - inactivate server and close\n";

    private void printUsage() {
        System.out.println(commandList);
    }
    public ServerSocket getSocket() {
        return socket;
    }

    Server() throws IOException {
        clients = new LinkedList<Thread>();
        active = false;
        saddr = null;
        socket = new ServerSocket();
        clientListener = null;
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
            System.out.print(">> ");
            if (s.hasNext()) {
                server.processCommand(s.next());
            }
        }
    }

    public synchronized boolean isActive() {
        return active;
    }

    public void setAddress(String lhost, int lport) {
        saddr = new InetSocketAddress(lhost, lport);
    }

    private synchronized int acceptClient(Socket client) {
        clients.add(new Thread(new ClientThread(client, clients.size())));
        clients.peekLast().start();
        return clients.size() - 1;
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

    private void processCommand(String command) {
        try {
            switch (command.toUpperCase()) {
                case "ACTIVE":
                    if (isActive()) {
                        System.out.println("Server is already active!");
                        break;
                    }
                    setActive(true);
                    if (isActive()) {
                        System.out.println("Successfully activated client listener");
                    } else {
                        System.out.println("Could not activate client listener");
                    }
                    break;
                case "INACTIVE":
                    if (!isActive()) {
                        System.out.println("Server is already inactive!");
                        break;
                    }
                    setActive(false);
                    if (!isActive()) {
                        System.out.println("Successfully inactivated client listener");
                    } else {
                        System.out.println("Could not inactivate client listener");
                    }
                    break;
                case "HELP":
                    printUsage();
                    break;
                case "QUIT":
                    System.out.println("Cleaning up and closing...");
                    System.exit(0);
                default:
                    System.out.println("Unrecognized command: '" + command + "' type 'help' for list of commands.");
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

        @Override
        public void run() {
        /*
         * this way, the server's active variable is only locked once after each time a client is connected.
         * clients is only locked by this thread once when adding a client, allowing the admin thread or an admin
         * client to issue moderator commands without this thread interfering
         */
            System.out.println("Waiting for new clients...");
            try {
                int id = 0;
                while (isActive()) {
                    id = acceptClient(socket.accept());
                    System.out.println("Accepted new client with ID= " + id);
                    System.out.println("Waiting for new clients...");
                }
            } catch (IOException ex) {
                System.out.println("Error accepting new client!");
            }
        }
    }

}


class ClientThread implements Runnable {

    private Socket socket;
    private int id;

    ClientThread(Socket sock, int id) {
        this.socket = sock;
        this.id = id;
    }

    @Override
    public void run() {
        printConnectionInfo();
    }

    public void printConnectionInfo() {
        System.out.println("Client " + id + " remote address: " + socket.getRemoteSocketAddress());
    }
}
