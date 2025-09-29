package com.savadanko.domain.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.savadanko.domain.Difficulty;

public record UpdateLabWorkRequest(
        @NotNull String name,
        @NotNull @Positive Long coordinatesId,
        @NotNull String description,
        @NotNull Difficulty difficulty,
        @NotNull @Positive Long minimalPoint,
        @NotNull @Positive Long authorId,
        @NotNull @Positive Long disciplineId
) {}
