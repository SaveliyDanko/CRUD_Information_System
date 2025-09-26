package com.savadanko.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

// http://localhost:8080/swagger-ui/index.html

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "IS LabWork API",
                version = "v1",
                description = "IS LabWork"
        )
)
public class OpenApiConfig {}

