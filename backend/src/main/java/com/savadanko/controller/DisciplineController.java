package com.savadanko.controller;

import com.savadanko.domain.requests.CreateDisciplineRequest;
import com.savadanko.domain.dto.DisciplineDTO;
import com.savadanko.domain.requests.UpdateDisciplineRequest;
import com.savadanko.service.DisciplineService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplines")
public class DisciplineController {

    private final DisciplineService service;

    public DisciplineController(DisciplineService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Список дисциплин")
    public List<DisciplineDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Найти дисциплину по id")
    public DisciplineDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать дисциплину")
    public DisciplineDTO create(@Valid @RequestBody CreateDisciplineRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить дисциплину")
    public DisciplineDTO update(@PathVariable Long id, @Valid @RequestBody UpdateDisciplineRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить дисциплину")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
