package net.ideaslibres.rhdstore.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ValidationException;
import java.util.*;

import static java.util.Optional.ofNullable;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiCallError<String>> handleValidationException(HttpServletRequest request, ValidationException ex) {
        logger.error("ValidationException {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .badRequest()
                .body(new ApiCallError<>("Validation exception", Arrays.asList(ex.getMessage())));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiCallError<String>> handleMissingServletRequestParameterException(HttpServletRequest request, MissingServletRequestParameterException ex) {
        logger.error("handleMissingServletRequestParameterException {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .badRequest()
                .body(new ApiCallError<>("Missing request parameter", Arrays.asList(ex.getMessage())));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiCallError<Map<String, String>>> handleMethodArgumentTypeMismatchException(HttpServletRequest request, MethodArgumentTypeMismatchException ex) {
        logger.error("handleMethodArgumentTypeMismatchException {}\n", request.getRequestURI(), ex);

        Map<String, String> details = new HashMap<>();
        details.put("paramName", ex.getName());
        details.put("paramValue", ofNullable(ex.getValue()).map(Object::toString).orElse(""));
        details.put("errorMessage", ex.getMessage());

        return ResponseEntity
                .badRequest()
                .body(new ApiCallError<>("Method argument type mismatch", Arrays.asList(details)));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiCallError<Map<String, String>>> handleMethodArgumentNotValidException(HttpServletRequest request, MethodArgumentNotValidException ex) {
        logger.error("handleMethodArgumentNotValidException {}\n", request.getRequestURI(), ex);

        List<Map<String, String>> details = new ArrayList<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(fieldError -> {
                    Map<String, String> detail = new HashMap<>();
                    detail.put("objectName", fieldError.getObjectName());
                    detail.put("field", fieldError.getField());
                    detail.put("rejectedValue", "" + fieldError.getRejectedValue());
                    detail.put("errorMessage", fieldError.getDefaultMessage());
                    details.add(detail);
                });

        return ResponseEntity
                .badRequest()
                .body(new ApiCallError<>("Method argument validation failed", details));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiCallError<String>> handleAccessDeniedException(HttpServletRequest request, AccessDeniedException ex) {
        logger.error("handleAccessDeniedException {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ApiCallError<>("Access denied!", Arrays.asList(ex.getMessage())));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiCallError<String>> handleIllegalArgumentException(HttpServletRequest request, Exception ex) {
        logger.error("handleIllegalArgumentException {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiCallError<>("Invalid Data", Arrays.asList(ex.getMessage())));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiCallError<String>> handleBadCredentialsException(HttpServletRequest request, Exception ex) {
        logger.error("handleBadCredentialsException {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiCallError<>("Invalid Login", Arrays.asList(ex.getMessage())));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiCallError<String>> handleInternalServerError(HttpServletRequest request, Exception ex) {
        logger.error("handleInternalServerError {}\n", request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiCallError<>("Internal server error", Arrays.asList(ex.getMessage())));
    }

    public static class ApiCallError<T> {

        public String message;
        public List<T> details;

        public ApiCallError(String message, List<T> details) {
            this.message = message;
            this.details = details;
        }
    }
}



