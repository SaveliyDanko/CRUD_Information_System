package com.savadanko.domain.request;

import com.savadanko.domain.Color;
import com.savadanko.domain.Country;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreatePersonRequest(
        @NotBlank String name,
        Color eyeColor,
        @NotNull Color hairColor,
        @NotNull @Positive Double weight,
        Country nationality,
        Long locationId
) {}
