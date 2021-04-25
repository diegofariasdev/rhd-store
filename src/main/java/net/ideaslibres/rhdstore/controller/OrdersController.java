package net.ideaslibres.rhdstore.controller;

import net.ideaslibres.rhdstore.model.Constants;
import net.ideaslibres.rhdstore.model.dto.OrderDto;
import net.ideaslibres.rhdstore.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import java.security.Principal;
import java.util.Date;
import java.util.List;

import static net.ideaslibres.rhdstore.model.Constants.ROLE_ADMIN;
import static net.ideaslibres.rhdstore.model.Constants.ROLE_CLIENT;

@RestController
@RequestMapping("/orders")
@Validated
public class OrdersController {

    private static final Logger logger = LoggerFactory.getLogger(OrdersController.class);

    private OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @RolesAllowed(ROLE_CLIENT)
    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(@Valid @RequestBody OrderDto order, Principal principal) throws IllegalAccessException {
        return ResponseEntity
                .ok(ordersService.placeOrder(order, principal));
    }

    @RolesAllowed(ROLE_ADMIN)
    @PutMapping
    public ResponseEntity<OrderDto> updateOrder(@Valid @RequestBody OrderDto order) throws IllegalAccessException {
        return ResponseEntity
                .ok(ordersService.update(order));
    }

    @RolesAllowed(ROLE_ADMIN)
    @GetMapping
    public ResponseEntity<Page<OrderDto>> getOrders(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) @DateTimeFormat(pattern = Constants.DATE_TIME_FORMAT) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = Constants.DATE_TIME_FORMAT) Date endDate,
            @RequestParam(required = false, defaultValue = "desc(creationTimestamp)")
                List<@Pattern(regexp = "(desc|asc)\\([a-zA-Z]+\\)+") String> orderBy,
            @RequestParam(required = false, defaultValue = "8") Integer pageSize,
            @RequestParam(required = false, defaultValue = "0") Integer pageNumber
    ) throws IllegalAccessException {
        return ResponseEntity
                .ok(ordersService.getOrders(username, startDate, endDate, orderBy, pageSize, pageNumber));
    }

    @RolesAllowed(ROLE_CLIENT)
    @GetMapping("/client/{username}")
    public ResponseEntity<Page<OrderDto>> getOrdersByUsername(
            @PathVariable String username,
            @RequestParam(required = false, defaultValue = "desc(creationTimestamp)")
                List<@Pattern(regexp = "(desc|asc)\\([a-zA-Z]+\\)+") String> orderBy,
            @RequestParam(required = false, defaultValue = "8") Integer pageSize,
            @RequestParam(required = false, defaultValue = "0") Integer pageNumber,
            Principal principal
    ) throws IllegalAccessException {
        return ResponseEntity
                .ok(ordersService.getOrdersByUsername(username, orderBy, pageSize, pageNumber, principal));
    }
}
