package net.ideaslibres.superstore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.*;

@Entity
@Table(name = "orders_items")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderItemDto {
    @EmbeddedId
    public OrderItemKey id;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    public ItemDto item;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    public OrderDto order;

    public Long quantity;
}
