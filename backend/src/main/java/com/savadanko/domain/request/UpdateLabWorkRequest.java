package com.savadanko.domain.request;

import com.savadanko.domain.Difficulty;

public record UpdateLabWorkRequest(
        String name,
        Long coordinatesId,
        String description,
        Difficulty difficulty,
        Long minimalPoint,
        Long authorId,
        Long disciplineId
) {}
