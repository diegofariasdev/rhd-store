package net.ideaslibres.rhdstore.model.repository;

import net.ideaslibres.rhdstore.model.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UsersRepository extends PagingAndSortingRepository<UserDto, Long> {
    Optional<UserDto> findByUsername(String username);
    Iterable<UserDto> findAllByProfile(String profile, Sort sort);
    Iterable<UserDto> findAllByEnabled(Boolean enabled, Sort sort);
    Iterable<UserDto> findAllByProfileAndEnabled(String profile, Boolean enabled, Sort sort);

    Page<UserDto> findAllByProfile(String profile, Pageable pageable);
    Page<UserDto> findAllByEnabled(Boolean enabled, Pageable pageable);
    Page<UserDto> findAllByProfileAndEnabled(String profile, Boolean enabled, Pageable pageable);
}
