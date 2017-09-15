package homework_1;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
                getActiveConnection().sendToServer("IMAGE");
                //send filepath
                getActiveConnection().setFile_send_path(command.substring(5).trim());
                getActiveConnection().sendToServer(getActiveConnection().getFile_send_name());
                break;
            default:
                getActiveConnection().sendToServer(command);
        }
    }

    class ConnectionThread extends Thread {

        private InetSocketAddress saddr;
        private Scanner in;
        private PrintWriter out;
        private PrintWriter dataOut;
        private Socket sock;
        private Socket dataSock;
        private Path file_send_path;

        ConnectionThread(InetSocketAddress saddr) {
            this.saddr = saddr;
        }

        private synchronized void sendToServer(String message) {
            out.println(message);
            out.flush();
        }

        private void setFile_send_path(String path) {
            file_send_path = Paths.get(path);
        }

        private String getFile_send_name() {
            return file_send_path.getName(file_send_path.getNameCount() - 1).toString();
        }
        private Socket connect() throws IOException {
            socket = new Socket();
            socket.connect(this.saddr);
            return socket;
        }

        private void sendImage() throws IOException {
            BufferedImage image = ImageIO.read(ImageIO.createImageInputStream(Files.newInputStream(file_send_path)));
            ImageIO.write(image, "png", ImageIO.createImageOutputStream(dataSock.getOutputStream()));
        }

        private String processResponse(String res) {
            //check if first part of the command is a valid command
            String[] cmd = res.toUpperCase().split(" ");
            switch (cmd[0]) {
                case "IMG_ACK":
                    try {
                        dataSock = new Socket();
                        dataSock.connect(saddr);
                        dataOut = new PrintWriter(dataSock.getOutputStream());
                        //print clientid back to server so it will add second socket to existing connection
                        dataOut.println(cmd[1]);
                        dataOut.flush();

                    } catch (IOException e) {
                        e.printStackTrace();
                        return "An error occurred while trying to send file!";
                    }
                    break;
                case "IMG_RDY":
                    try {
                        sendToServer("IMG_SEND");
                        sendImage();
                    } catch (IOException e) {
                        e.printStackTrace();
                        return "An error occurred while trying to send file! IMG_SEND";
                    }
                    break;
                case "IMG_OK":
                    return "File transferred successfully";
                default:
            }
            return res;
        }

        @Override
        public void run() {
            try {
                sock = connect();
                in = new Scanner(new BufferedInputStream(sock.getInputStream()));
                out = new PrintWriter(sock.getOutputStream());
                out.println(-1);
                out.flush();
                while (in.hasNextLine()) {
                    printToClient(processResponse(in.nextLine()));

                }

            } catch (IOException ex) {
                printToClient("Could not connect to server at: " + this.saddr.getHostName() + ":" +
                        this.saddr.getPort());
            }
        }

    }
}


