package net.ideaslibres.rhdstore.model.repository;

import net.ideaslibres.rhdstore.model.dto.OrderDto;
import net.ideaslibres.rhdstore.model.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UsersRepository extends PagingAndSortingRepository<UserDto, Long> {
    Optional<UserDto> findByUsername(String username);
    Page<UserDto> findAllByProfile(String profile, Pageable pageable);
    Page<UserDto> findAllByEnabled(Boolean enabled, Pageable pageable);
    Page<UserDto> findAllByProfileAndEnabled(String profile, Boolean enabled, Pageable pageable);
}
