package net.ideaslibres.superstore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "orders")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDto {
    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long orderId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    public UserDto user;
    public String code;
    public Float total;
    @OneToMany(mappedBy = "order")
    public Set<OrderItemDto> orderItems;
    @OneToMany(mappedBy = "order")
    public Set<OrderLogDto> orderLog;
    @Column(name = "creation_timestamp")
    public Date creationTimestamp;

    public OrderDto() {
    }

    public OrderDto(String code, Float total, Date creationTimestamp) {
        this.code = code;
        this.total = total;
        this.creationTimestamp = creationTimestamp;
    }
}
