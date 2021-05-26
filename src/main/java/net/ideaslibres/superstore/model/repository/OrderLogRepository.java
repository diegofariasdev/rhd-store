package net.ideaslibres.superstore.model.repository;

import net.ideaslibres.superstore.model.dto.OrderLogDto;
import org.springframework.data.repository.CrudRepository;

public interface OrderLogRepository extends CrudRepository<OrderLogDto, Long> {
}
