package com.savadanko.controller;

import com.savadanko.domain.dto.CoordinatesDTO;
import com.savadanko.domain.requests.CreateCoordinatesRequest;
import com.savadanko.domain.requests.UpdateCoordinatesRequest;
import com.savadanko.service.CoordinatesService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinates")
public class CoordinatesController {

    private final CoordinatesService service;

    public CoordinatesController(CoordinatesService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Список координат")
    public List<CoordinatesDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Найти координаты по id")
    public CoordinatesDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать координаты")
    public CoordinatesDTO create(@Valid @RequestBody CreateCoordinatesRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить координаты")
    public CoordinatesDTO update(@PathVariable Long id, @Valid @RequestBody UpdateCoordinatesRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить координаты")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
