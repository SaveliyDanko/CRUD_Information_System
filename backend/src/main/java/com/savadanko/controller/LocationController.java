package com.savadanko.controller;

import com.savadanko.domain.request.CreateLocationRequest;
import com.savadanko.domain.dto.LocationDTO;
import com.savadanko.domain.request.UpdateLocationRequest;
import com.savadanko.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Список всех локаций")
    public List<LocationDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Найти локацию по id")
    public LocationDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать локацию (без привязки к пользователю)")
    public LocationDTO create(@Valid @RequestBody CreateLocationRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить локацию (только имя/координаты)")
    public LocationDTO update(@PathVariable Long id, @Valid @RequestBody UpdateLocationRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить локацию по id")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
