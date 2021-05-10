package net.ideaslibres.rhdstore.service;

import net.ideaslibres.rhdstore.exception.RecordNotFoundException;
import net.ideaslibres.rhdstore.model.Constants;
import net.ideaslibres.rhdstore.model.dto.*;
import net.ideaslibres.rhdstore.model.repository.*;
import net.ideaslibres.rhdstore.util.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.transaction.Transactional;
import javax.validation.constraints.Pattern;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static org.aspectj.util.LangUtil.isEmpty;

@Service
public class OrdersService {

    private static final Logger logger = LoggerFactory.getLogger(OrdersService.class);

    private OrdersRepository ordersRepository;
    private OrderItemRepository orderItemRepository;
    private OrderLogRepository orderLogRepository;
    private ItemsRepository itemsRepository;
    private UsersRepository usersRepository;

    public OrdersService(OrdersRepository ordersRepository, OrderItemRepository orderItemRepository, OrderLogRepository orderLogRepository, ItemsRepository itemsRepository, UsersRepository usersRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderLogRepository = orderLogRepository;
        this.itemsRepository = itemsRepository;
        this.usersRepository = usersRepository;
    }

    @Transactional
    public OrderDto placeOrder(OrderDto order, Principal principal) throws IllegalAccessException {

        order.user = getUserIdFromUsername(principal.getName());
        calculateOrderCode(order, principal);
        completeOrderItemsAndCalculateTotal(order.orderItems, order);

        logger.info("order code {} generated for order from user {}", order.code, principal.getName());

        OrderDto savedOrder = ordersRepository.save(order);

        for (OrderItemDto orderItem : order.orderItems) {
            orderItem.order = savedOrder;
            orderItem.id.orderId = savedOrder.orderId;
            orderItemRepository.save(orderItem);
        }

        OrderLogDto orderLog = new OrderLogDto();
        orderLog.order = savedOrder;
        orderLog.status = Constants.ORDER_PLACED;
        orderLogRepository.save(orderLog);

        return new OrderDto(savedOrder.code, savedOrder.total, savedOrder.creationTimestamp);
    }

    @Transactional
    public OrderDto update(OrderDto order) throws IllegalAccessException {
        completeOrderItemsAndCalculateTotal(order.orderItems, order);

        OrderDto dbOrder = ordersRepository.findByCode(order.code)
                .orElseThrow(() -> new IllegalArgumentException("order doesn't exists"));

        dbOrder.orderItems.stream().forEach((orderItem) -> {
            orderItemRepository.delete(orderItem);
        });

        dbOrder.orderItems = order.orderItems;
        dbOrder.total = order.total;
        for (OrderItemDto orderItem : order.orderItems) {
            orderItem.order = dbOrder;
            orderItem.id.orderId = dbOrder.orderId;
            orderItemRepository.save(orderItem);
        }

        List<OrderLogDto> newLogs = order.orderLog.stream().filter(log -> {
            OrderLogDto orderLog = dbOrder.orderLog.stream()
                    .filter(log1 -> log.status.equals(log1.status))
                    .findAny()
                    .orElse(null);
            return orderLog == null;
        }).collect(Collectors.toList());

        for (OrderLogDto log : newLogs) {
            log.order = dbOrder;
            orderLogRepository.save(log);
        }

        ordersRepository.save(dbOrder);

        return new OrderDto(dbOrder.code, dbOrder.total, dbOrder.creationTimestamp);
    }

    public Page<OrderDto> getOrders(String username, Date startDate, Date endDate, List<@Pattern(regexp = "(desc|asc)\\([a-zA-Z]+\\)+") String> orderBy, Integer pageSize, Integer pageNumber) throws IllegalAccessException {
        Sort sort = SystemUtils.parseOrderBy(orderBy);
        UserDto user = null;
        if(!isEmpty(username)) {
            user = getUserIdFromUsername(username);
        }

        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sort);
        Page<OrderDto> orderPage = null;

        if (!isEmpty(username) && startDate != null && endDate != null) {
            if (startDate.after(endDate)) throw new IllegalArgumentException("start date must be before or equals to end date");
            endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));
            orderPage = ordersRepository
                    .findAllByUserAndCreationTimestampBetween(user, startDate, endDate, pageRequest);
        } else if (!isEmpty(username) && startDate == null && endDate == null) {
            orderPage = ordersRepository
                    .findAllByUser(user, pageRequest);
        } else if (isEmpty(username) && (startDate != null || endDate != null)) {
            if (startDate == null || endDate == null) throw new IllegalArgumentException("start date or end date is missing");
            if (startDate.after(endDate)) throw new IllegalArgumentException("start date must be before or equals to end date");
            endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));
            orderPage = ordersRepository
                    .findAllByCreationTimestampBetween(startDate, endDate, pageRequest);
        } else {
            orderPage = ordersRepository.findAll(pageRequest);
        }

        orderPage.stream().forEach((order) -> {
            cleanOrder(order);
        });

        return orderPage;
    }

    public Page<OrderDto> getOrdersByUsername(String username, List<String> orderBy, Integer pageSize, Integer pageNumber, Principal principal) throws IllegalAccessException {
        if (!principal.getName().equals(username)) {
            throw new IllegalAccessException("A user can get only their own orders");
        }

        return getOrders(username, null, null, orderBy, pageSize, pageNumber);
    }

    public OrderDto getOrderByCode(String code) throws RecordNotFoundException {
        OrderDto order = ordersRepository.findByCode(code)
                .orElseThrow(() -> new RecordNotFoundException("Order doesn't exist"));
        cleanOrder(order);

        return order;
    }

    public void calculateOrderCode(OrderDto order, Principal principal) {
        order.code = DigestUtils.md5DigestAsHex((order.user.userId + new Date().toString()).getBytes(StandardCharsets.UTF_8));
    }

    private void completeOrderItemsAndCalculateTotal(Set<OrderItemDto> orderItems, OrderDto order) {
        List<String> codes = orderItems.stream().map(orderItem -> orderItem.item.code).collect(Collectors.toList());
        Iterable<ItemDto> items = itemsRepository.findAllByCodeIn(codes);

        AtomicInteger totalItems = new AtomicInteger();
        order.total = 0.0f;

        items.forEach((item) -> {
            OrderItemDto orderItem = order.orderItems.stream()
                    .filter((orderItem1) -> orderItem1.item.code.equals(item.code))
                    .findAny()
                    .orElse(null);

            orderItem.item = item;
            orderItem.id = new OrderItemKey(-1l, item.itemId);

            order.total += (item.price * orderItem.quantity);
            totalItems.getAndIncrement();
        });

        if (totalItems.get() < codes.size()) {
            throw new IllegalArgumentException("One or more items in the order don't exists");
        }
    }

    private UserDto getUserIdFromUsername(String username) throws IllegalAccessException {
        UserDto user = usersRepository
                .findByUsername(username)
                .orElseThrow(() -> new IllegalAccessException("User is not registered"));

        return new UserDto(user.userId);
    }

    private void cleanOrder(OrderDto order) {
        order.orderId = null;
        order.user = new UserDto(order.user.username);
        order.orderItems.stream().forEach((orderItem) -> {
            orderItem.order = null;
            orderItem.id = null;
            orderItem.item = new ItemDto(
                    orderItem.item.code,
                    orderItem.item.name,
                    orderItem.item.category,
                    orderItem.item.price,
                    orderItem.item.picture
            );
        });
        order.orderLog.stream().forEach((orderLog) -> {
            orderLog.order = null;
            orderLog.orderLogEntryId = null;
        });
    }

}
