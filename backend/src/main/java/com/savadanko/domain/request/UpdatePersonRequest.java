package com.savadanko.domain.request;

import com.savadanko.domain.Color;
import com.savadanko.domain.Country;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotNull;

public record UpdatePersonRequest(
        @NotNull String name,
        @NotNull Color eyeColor,
        @NotNull Color hairColor,
        @NotNull @Positive Double weight,
        @NotNull Country nationality,
        @NotNull @Positive Long locationId
) {}