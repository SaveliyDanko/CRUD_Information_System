package com.savadanko.domain.request;

public record UpdateDisciplineRequest(
        String name,
        Long practiceHours,
        Long labsCount
) {}
