package net.ideaslibres.superstore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import net.ideaslibres.superstore.controller.ItemsController;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Date;

@Entity
@Table(name = "items")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDto {
    @Id
    @Column(name = "item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long itemId;
    public String code;
    @NotEmpty(groups = ItemsController.class)
    @Length(max = 100)
    public String name;
    @NotEmpty(groups = ItemsController.class)
    @Length(max = 2000)
    public String description;
    @NotEmpty(groups = ItemsController.class)
    @Pattern(regexp = "2x2|3x3|4x4|5x5|6x6|7x7|8x8|MxN|NxN|other")
    public String category;
    @NotNull(groups = ItemsController.class)
    public Float price;
    @Transient
    @NotBlank(groups = ItemsController.class)
    @URL
    public String pictureUrl;
    public byte[] picture;
    @Column(name = "creation_timestamp")
    public Date creationTimestamp;
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    public ItemDto(){}

    public ItemDto(String code, String name, String category, Float price, byte[] picture) {
        this.code = code;
        this.name = name;
        this.category = category;
        this.price = price;
        this.picture = picture;
    }

    public ItemDto(String name, String description, String category, Float price, String pictureUrl){
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.pictureUrl = pictureUrl;
    }
}
