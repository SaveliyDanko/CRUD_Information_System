package com.savadanko.controller;

import com.savadanko.domain.dto.PersonDTO;
import com.savadanko.domain.dto.PersonFullDTO;
import com.savadanko.domain.request.CreatePersonRequest;
import com.savadanko.domain.request.UpdatePersonRequest;
import com.savadanko.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService service;

    public PersonController(PersonService service) {
        this.service = service;
    }

    // short
    @GetMapping
    @Operation(summary = "Список персон")
    public List<PersonDTO> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    @Operation(summary = "Найти персону по id")
    public PersonDTO findById(@PathVariable Long id) { return service.findById(id); }

    // full
    @GetMapping("/full")
    @Operation(summary = "Список персон (полная структура с локацией)")
    public List<PersonFullDTO> findAllFull() { return service.findAllFull(); }

    @GetMapping("/{id}/full")
    @Operation(summary = "Персона по id (полная структура с локацией)")
    public PersonFullDTO findFullById(@PathVariable Long id) { return service.findFullById(id); }

    // create/update/delete
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать персону")
    public PersonDTO create(@Valid @RequestBody CreatePersonRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить персону")
    public PersonDTO update(@PathVariable Long id, @Valid @RequestBody UpdatePersonRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить персону")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
