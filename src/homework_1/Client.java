package homework_1;

import java.io.IOException;
import java.net.Socket;

public class Client {
    private Socket socket;
    private String rhost;
    private int rport;
    //TODO Change to array to support multiple connections, and allow for switching connection by command
    private Thread connectionThread;

    Client() {
        //socket = new Socket();
    }

    public static void main(String[] args) {
        Client client = new Client();
        client.setRemoteHost("localhost", 4444);
        client.addConnection(null);

    }

    public void setRemoteHost(String rhost, int rport) {
        this.rhost = rhost;
        this.rport = rport;
    }

    //TODO edit this to add an additional connection rather than change the original
    public int addConnection(Socket rsock) {
        connectionThread = new Thread(new ConnectionThread());
        connectionThread.start();
        return 0;
    }

    //TODO add custom exception for server being alive but not actively accepting connections. use socket.isAlive() to test this
    public void connect() throws IOException {
        socket = new Socket(rhost, rport);
        if (!socket.isConnected()) {
            socket.close();
            throw new IOException("Could not connect to server!");
        }
    }

    class ConnectionThread implements Runnable {

        ConnectionThread() {
        }

        @Override
        public void run() {
            try {
                connect();
            } catch (IOException ex) {
                System.out.println("Could not connect to server at: " + rhost + ":" + rport);
            }
        }
    }
}


