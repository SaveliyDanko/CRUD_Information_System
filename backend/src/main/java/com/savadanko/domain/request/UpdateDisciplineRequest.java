package com.savadanko.domain.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateDisciplineRequest(
        @NotNull String name,
        @NotNull @Positive Long practiceHours,
        @NotNull @Positive Long labsCount
) {}
