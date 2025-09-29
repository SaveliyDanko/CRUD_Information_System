package com.savadanko.domain.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateCoordinatesRequest(
        @NotNull @Positive Float x,
        @NotNull @Positive Float y
) {}
