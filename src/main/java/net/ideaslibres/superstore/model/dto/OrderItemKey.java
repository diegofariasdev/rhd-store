package net.ideaslibres.superstore.model.dto;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class OrderItemKey implements Serializable {

    public OrderItemKey() {
    }

    public OrderItemKey(Long orderId, Long itemId) {
        this.orderId = orderId;
        this.itemId = itemId;
    }

    @Column(name = "order_id")
    public Long orderId;

    @Column(name = "item_id")
    public Long itemId;

}
