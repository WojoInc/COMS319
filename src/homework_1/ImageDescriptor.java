package homework_1;

public class ImageDescriptor {
    private String filename;
    private String extension;

    public ImageDescriptor(String filename) {
        this.filename = filename;
        this.filename = filename.split("\\.")[0];
        this.extension = filename.split("\\.")[1];
    }

    public String getFilename() {
        return filename;
    }

    public String getExtension() {
        return extension;
    }
}
