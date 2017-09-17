package homework_1;

import com.sun.istack.internal.NotNull;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.*;
import java.util.Scanner;

public class Client {
    //TODO Change to array to support multiple connections, and allow for switching connection by command
    private ConnectionThread connectionThread;
    private int activeConnection;

    public static void main(String[] args) {
        Client client = new Client();
        Scanner s = new Scanner(System.in);
        client.setActiveConnection(client.addConnection(new InetSocketAddress("localhost", 4444),
                new InetSocketAddress("localhost", 4445)));
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
    public int addConnection(@NotNull InetSocketAddress textSocket, @NotNull InetSocketAddress dataSocket) {
        connectionThread = new ConnectionThread(textSocket, dataSocket);
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
        private InputStream iStream;
        private OutputStream oStream;
        private Scanner in;
        private PrintWriter out;
        private Socket sock;
        private Path file_send_path;
        private String file_recv_name;
        private Path file_recv_path;
        private BufferedImage recv_img;

        ConnectionThread(InetSocketAddress saddr, InetSocketAddress daddr) {
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

        private void connect() throws IOException {
            sock = new Socket();
            sock.connect(this.saddr);
        }

        private String createImageFilename(ImageDescriptor id) {
            return "image/" + id.getFilename() + "." + id.getExtension();
        }

        private void processImage() {
            try {
                recv_img = ImageIO.read(ImageIO.createImageInputStream(iStream));

            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in transferring image: " + file_recv_name);

            }
            ImageDescriptor imgID;
            try {
                imgID = new ImageDescriptor(file_recv_name);
            } catch (ArrayIndexOutOfBoundsException ex) {
                printToClient("An error occurred in receiving image: No file extension found. Cannot determine file type!");
                return;
            }

            try {
                Files.createDirectory(Paths.get("image"));
            } catch (FileAlreadyExistsException ex) {
                //Ignore, as we are creating directory only if not existing
            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in receiving image: " + file_recv_name);
                return;
            }
            try {
                file_recv_path = Paths.get(createImageFilename(imgID));
                Files.createFile(file_recv_path);
            } catch (FileAlreadyExistsException ex) {
                printToClient("Cannot save image: File already exists! " + file_recv_name);
                return;
            } catch (IOException e) {
                e.printStackTrace();
                return;
            }
            try {
                ImageIO.write(recv_img, imgID.getExtension(), Files.newOutputStream(file_recv_path, StandardOpenOption.WRITE));
                printToClient("IMG_OK");
            } catch (IOException e) {
                e.printStackTrace();
                printToClient("An error occurred in receiving image: " + file_recv_name);
            }
        }

        private void sendImage() throws IOException {
            BufferedImage image = ImageIO.read(ImageIO.createImageInputStream(Files.newInputStream(file_send_path)));
            ImageIO.write(image, "png", ImageIO.createImageOutputStream(sock.getOutputStream()));
        }

        private String processResponse(String res) {
            //check if first part of the command is a valid command
            String[] cmd = res.toUpperCase().split(" ");
            switch (cmd[0]) {
                case "IMG_ACK":
                    try {
                        printToClient("Server acknowledged request for image xfer. Sending image...");
                        res = "";
                        sendToServer("IMG_SEND");
                        sendImage();
                    } catch (IOException e) {
                        e.printStackTrace();
                        return "An error occurred while trying to send file! IMG_SEND";
                    }
                    break;
                case "IMG_OK":
                    return "File transferred successfully";
                case "IMAGE":
                    file_recv_name = in.nextLine();
                    processImage();
                    sendToServer("IMG_ACK");
                default:
            }
            return res;
        }

        @Override
        public void run() {
            try {
                connect();
                iStream = new BufferedInputStream(sock.getInputStream());
                oStream = new BufferedOutputStream(sock.getOutputStream());
                in = new Scanner(iStream);
                out = new PrintWriter(oStream);
                while (in.hasNextLine()) {
                    //processes response to check for any valid server commands before sending server response to client
                    printToClient(processResponse(in.nextLine()));

                }

            } catch (IOException ex) {
                //TODO make this more informative
                printToClient("Could not connect to server!");
            }
        }

    }
}


