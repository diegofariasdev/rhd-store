package net.ideaslibres.superstore.model.repository;

import net.ideaslibres.superstore.model.dto.OrderItemDto;
import net.ideaslibres.superstore.model.dto.OrderItemKey;
import org.springframework.data.repository.CrudRepository;

public interface OrderItemRepository extends CrudRepository<OrderItemDto, OrderItemKey> {
}
