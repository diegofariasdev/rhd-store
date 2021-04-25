package net.ideaslibres.rhdstore.model.repository;

import net.ideaslibres.rhdstore.model.dto.OrderLogDto;
import org.springframework.data.repository.CrudRepository;

public interface OrderLogRepository extends CrudRepository<OrderLogDto, Long> {
}
