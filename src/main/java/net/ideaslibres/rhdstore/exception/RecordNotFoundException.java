package net.ideaslibres.rhdstore.exception;

public class RecordNotFoundException extends Exception {
    public RecordNotFoundException(String reason) {
        super(reason);
    }
}
