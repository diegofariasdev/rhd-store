package net.ideaslibres.rhdstore.model.repository;

import net.ideaslibres.rhdstore.model.dto.ItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface ItemsRepository extends PagingAndSortingRepository<ItemDto, Long> {
    Page<ItemDto> findAllByNameLike(String name, Pageable pageable);
    Iterable<ItemDto> findAllByCodeIn(Iterable<String> codes);
    Optional<ItemDto> findByCode(String code);
}
