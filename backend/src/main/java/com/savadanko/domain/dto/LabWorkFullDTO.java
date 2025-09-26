package com.savadanko.domain.dto;

import com.savadanko.domain.Difficulty;

public record LabWorkFullDTO(
        Long id,
        String name,
        String description,
        Difficulty difficulty,
        Long minimalPoint,
        java.time.ZonedDateTime creationDate,
        CoordinatesDTO coordinates,
        PersonFullDTO author,
        DisciplineDTO discipline
) {}
