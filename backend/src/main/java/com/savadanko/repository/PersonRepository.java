package com.savadanko.repository;

import com.savadanko.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
    boolean existsByLocationId(Long locationId);
}

