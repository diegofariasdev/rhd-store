package net.ideaslibres.rhdstore.model.repository;

import net.ideaslibres.rhdstore.model.dto.OrderItemDto;
import net.ideaslibres.rhdstore.model.dto.OrderItemKey;
import org.springframework.data.repository.CrudRepository;

public interface OrderItemRepository extends CrudRepository<OrderItemDto, OrderItemKey> {
}
