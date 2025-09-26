package com.savadanko.domain.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateLocationRequest(
        @NotBlank String name,
        @NotNull Double x,
        @NotNull Integer y
) {}
