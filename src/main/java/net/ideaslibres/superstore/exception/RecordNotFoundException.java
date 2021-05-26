package net.ideaslibres.superstore.exception;

public class RecordNotFoundException extends Exception {
    public RecordNotFoundException(String reason) {
        super(reason);
    }
}
