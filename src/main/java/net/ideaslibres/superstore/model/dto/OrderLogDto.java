package net.ideaslibres.superstore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "orders_log")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderLogDto {

    @Id
    @Column(name = "order_log_entry_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long orderLogEntryId;
    @ManyToOne
    @JoinColumn(name = "order_id")
    public OrderDto order;
    public String status;
    public String comment;
    @Column(name = "creation_timestamp")
    public Date creationTimestamp;
}
