package net.ideaslibres.rhdstore.exception;

import java.io.IOException;

public class InvalidDataException extends Exception {
    public InvalidDataException(String message, IOException ex) {
        super(message, ex);
    }
}
