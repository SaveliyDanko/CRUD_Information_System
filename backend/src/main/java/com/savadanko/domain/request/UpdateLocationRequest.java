package com.savadanko.domain.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateLocationRequest(
        @NotNull String name,
        @NotNull @Positive Double x,
        @NotNull @Positive Integer y
) {}
