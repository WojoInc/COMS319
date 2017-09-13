package homework_1;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Scanner;

public class Client {
    private Socket socket;
    //TODO Change to array to support multiple connections, and allow for switching connection by command
    private ConnectionThread connectionThread;
    private int activeConnection;

    public static void main(String[] args) {
        Client client = new Client();
        Scanner s = new Scanner(System.in);
        client.setActiveConnection(client.addConnection("localhost", 4444));
        while (true) {
            client.processCommand(s.nextLine());
        }
    }

    public ConnectionThread getActiveConnection() {
        //TODO return connection at index later.
        return connectionThread;
    }

    public void setActiveConnection(int activeConnection) {
        this.activeConnection = activeConnection;
    }

    Client() {
        //socket = new Socket();
    }

    private synchronized void printToClient(String output) {
        System.out.println(output);
    }

    //TODO edit this to add an additional connection rather than change the original
    public int addConnection(String rhost, int rport) {
        connectionThread = new ConnectionThread(new InetSocketAddress(rhost, rport));
        connectionThread.start();
        //will update to return a connection id once updated to support multiple connections
        return 0;
    }

    private void processCommand(String command) {
        //check if first part of the command is a valid command
        String[] cmd = command.toUpperCase().split(" ");
        switch (cmd[0]) {
            case "TEXT":
                getActiveConnection().sendToServer("TEXT");
                getActiveConnection().sendToServer(command.substring(4));
                break;
            case "IMAGE":
                break;
            default:
                getActiveConnection().sendToServer(command);
        }
    }

    class ConnectionThread extends Thread {

        private InetSocketAddress saddr;
        private Scanner in;
        private PrintWriter out;
        private Socket sock;

        ConnectionThread(InetSocketAddress saddr) {
            this.saddr = saddr;
        }

        private synchronized void sendToServer(String message) {
            out.println(message);
            out.flush();
        }

        private Socket connect() throws IOException {
            socket = new Socket();
            socket.connect(this.saddr);
            return socket;
        }

        @Override
        public void run() {
            try {
                sock = connect();
                in = new Scanner(new BufferedInputStream(sock.getInputStream()));
                out = new PrintWriter(sock.getOutputStream());
                while (in.hasNextLine()) {
                    printToClient(in.nextLine());
                }

            } catch (IOException ex) {
                printToClient("Could not connect to server at: " + this.saddr.getHostName() + ":" +
                        this.saddr.getPort());
            }
        }

    }
}


