package com.msc.ftcunidad4.controller;

import com.msc.ftcunidad4.model.Item;
import com.msc.ftcunidad4.service.FirebaseCrudService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/items")
@Tag(name = "Items", description = "CRUD básico sobre colección de Firebase")
public class ItemController {

    private final FirebaseCrudService service;

    public ItemController(FirebaseCrudService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar elementos", description = "Obtiene todos los documentos de la colección")
    public List<Item> findAll() throws ExecutionException, InterruptedException {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar elemento por ID")
    @ApiResponse(responseCode = "404", description = "Elemento no encontrado")
    public Item findById(@PathVariable String id) throws ExecutionException, InterruptedException {
        return service.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Elemento no encontrado"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear elemento")
    public Item create(@Valid @RequestBody Item item) throws ExecutionException, InterruptedException {
        return service.create(item);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar elemento")
    @ApiResponse(responseCode = "404", description = "Elemento no encontrado")
    public Item update(@PathVariable String id, @Valid @RequestBody Item item) throws ExecutionException, InterruptedException {
        return service.update(id, item)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Elemento no encontrado"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar elemento")
    @ApiResponse(responseCode = "404", description = "Elemento no encontrado")
    public void delete(@PathVariable String id) throws ExecutionException, InterruptedException {
        if (!service.delete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Elemento no encontrado");
        }
    }
}
