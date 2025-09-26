package com.savadanko.domain.request;

public record UpdateLocationRequest(
        String name,
        Double x,
        Integer y
) {}
