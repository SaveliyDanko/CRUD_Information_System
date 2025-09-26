package com.savadanko.domain.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDisciplineRequest(
        @NotBlank String name,
        @NotNull Long practiceHours,
        @NotNull Long labsCount
) {}
