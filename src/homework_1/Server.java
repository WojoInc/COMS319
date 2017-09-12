package homework_1;

public class Server {
    private ServerSocket socket;

    public ServerSocket getSocket() {
        return socket;
    }

    public void setSocket(ServerSocket socket) {
        this.socket = socket;
    }

    public static void main(String[] args){
        Server server = new Server();
        try {
            server.setSocket = new ServerSocket(4444);
        }
        catch(IOException ex){
            ex.printStackTrace();
        }
    }
}
