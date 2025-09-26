package com.savadanko.controller;

import com.savadanko.domain.dto.*;
import com.savadanko.domain.request.CreateLabWorkRequest;
import com.savadanko.domain.request.UpdateLabWorkRequest;
import com.savadanko.service.LabWorkService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labworks")
public class LabWorkController {

    private final LabWorkService service;

    public LabWorkController(LabWorkService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Список всех лабораторных работ")
    public List<LabWorkDTO> findAll() { return service.findAll(); }

    @GetMapping("/full")
    @Operation(summary = "Список всех лабораторных работ (полная древовидная структура)")
    public List<LabWorkFullDTO> findAllFull() { return service.findAllFull(); }

    @GetMapping("/{id}")
    @Operation(summary = "Найти лабораторную работу по id")
    public LabWorkDTO findById(@PathVariable Long id) { return service.findById(id); }

    @GetMapping("/{id}/full")
    @Operation(summary = "Лабораторная работа по id (полная древовидная структура)")
    public LabWorkFullDTO findFullById(@PathVariable Long id) { return service.findFullById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать лабораторную работу")
    public LabWorkDTO create(@Valid @RequestBody CreateLabWorkRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить лабораторную работу")
    public LabWorkDTO update(@PathVariable Long id, @Valid @RequestBody UpdateLabWorkRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить лабораторную работу")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @DeleteMapping("/by-minimal-point/{value}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Удалить все LabWork с указанным minimalPoint")
    public DeleteResultDTO deleteAllByMinimalPoint(@PathVariable int value) {
        return service.deleteAllByMinimalPoint(value);
    }

    @GetMapping("/minimal-point/sum")
    @Operation(summary = "Сумма значений minimalPoint по всем LabWork")
    public SumDTO sumMinimalPoint() {
        return service.sumMinimalPoint();
    }

    @GetMapping("/count/author-id-gt/{authorId}")
    @Operation(summary = "Количество LabWork, у которых authorId больше заданного")
    public CountDTO countByAuthorIdGreaterThan(@PathVariable Long authorId) {
        return service.countByAuthorIdGreaterThan(authorId);
    }

    @PostMapping("/{id}/decrease-difficulty")
    @Operation(summary = "Понизить сложность LabWork на указанное количество шагов")
    public LabWorkDTO decreaseDifficulty(@PathVariable Long id, @RequestParam @Min(1) int steps) {
        return service.decreaseDifficulty(id, steps);
    }

    @PostMapping("/assign-top10-hardest-to-discipline/{disciplineId}")
    @Operation(summary = "Добавить в указанную дисциплину 10 самых сложных LabWork")
    public List<LabWorkDTO> assignTop10HardestToDiscipline(@PathVariable Long disciplineId) {
        return service.assignTop10HardestToDiscipline(disciplineId);
    }
}
