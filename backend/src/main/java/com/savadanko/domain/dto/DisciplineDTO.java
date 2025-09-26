package com.savadanko.domain.dto;

public record DisciplineDTO(
        Long id,
        String name,
        Long practiceHours,
        Long labsCount
) {}
