package com.savadanko.domain.request;

import com.savadanko.domain.Color;
import com.savadanko.domain.Country;
import jakarta.validation.constraints.Positive;

public record UpdatePersonRequest(
        String name,
        Color eyeColor,
        Color hairColor,
        @Positive Double weight,
        Country nationality,
        Long locationId
) {}