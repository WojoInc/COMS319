package homework_1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Scanner;

public class Server {
    private ServerSocket socket;
    private LinkedList<Thread> clients;
    private boolean active;
    private Thread clientListener;

    public ServerSocket getSocket() {
        return socket;
    }

    public void setSocket(ServerSocket socket) {
        this.socket = socket;
    }

    Server() {
        clients = new LinkedList<Thread>();
        active = false;
        socket = null;
        clientListener = null;
    }

    public static void main(String[] args){
        Server server = new Server();
        try {
            server.setSocket(new ServerSocket(4444));
        } catch(IOException ex){
            ex.printStackTrace();
        }
        Scanner s = new Scanner(System.in);
        System.out.println("Main server thread started: type 'active' to start listening for clients, 'help' for list of supported commands.");
        while (true) {
            System.out.print(">> ");
            server.processCommand(s.next());
        }
    }

    public synchronized boolean isActive() {
        return active;
    }

    public synchronized void setActive(boolean active) {
        this.active = active;
        if (active) {
            clientListener = new Thread(new ClientListener());
            clientListener.start();
        } else {
            //Remove the client listener when not active, force garbage collection and remove clients
            //This allows restarting the server's connection to clean clients array
            clientListener.stop();
            clientListener = null;
            clients.forEach(client -> client = null);
            clients = null;
            System.gc();
        }
    }

    private synchronized int acceptClient(Socket client) {
        clients.add(new Thread(new ClientThread(client, clients.size())));
        clients.peekLast().start();
        return clients.size() - 1;
    }

    private void processCommand(String command) {
        switch (command.toUpperCase()) {
            case "ACTIVE":
                setActive(true);
                if (isActive()) {
                    System.out.println("Successfully activated client listener");
                } else {
                    System.out.println("Could not activate client listener");
                }
                break;
            case "INACTIVE":
                setActive(false);
                if (!isActive()) {
                    System.out.println("Successfully inactivated client listener");
                } else {
                    System.out.println("Could not inactivate client listener");
                }
                break;
            case "QUIT":
                System.out.println("Cleaning up and closing...");
                System.exit(0);
            default:
                System.out.println("Unrecognized command: '" + command + "' type 'help' for list of commands.");
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
            try {
                int id = 0;
                while (isActive()) {
                    System.out.println("Waiting for new clients...");
                    id = acceptClient(socket.accept());
                    System.out.println("Accepted new client with ID= " + id);
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

    }
}
