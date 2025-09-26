package com.savadanko.domain.dto;

import com.savadanko.domain.Difficulty;
import java.time.ZonedDateTime;

public record LabWorkDTO(
        Long id,
        String name,
        String description,
        Difficulty difficulty,
        Long minimalPoint,
        ZonedDateTime creationDate,
        Long coordinatesId,
        Long authorId,
        String authorName,
        Long disciplineId,
        String disciplineName
) {}
