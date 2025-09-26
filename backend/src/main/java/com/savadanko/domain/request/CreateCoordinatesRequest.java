package com.savadanko.domain.request;

import jakarta.validation.constraints.NotNull;

public record CreateCoordinatesRequest(
        @NotNull Float x,
        @NotNull float y
) {}