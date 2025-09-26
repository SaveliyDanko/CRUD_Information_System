package com.savadanko.domain.request;

import com.savadanko.domain.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateLabWorkRequest(
        @NotBlank String name,
        @NotNull Long coordinatesId,
        String description,
        @NotNull Difficulty difficulty,
        @Positive Long minimalPoint,
        Long authorId,
        Long disciplineId
) {}
