package com.msc.ftcunidad4.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.msc.ftcunidad4.model.Item;
import com.msc.ftcunidad4.service.FirebaseCrudService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FirebaseCrudService service;

    @Test
    void shouldListItems() throws Exception {
        Item item = new Item();
        item.setId("1");
        item.setName("Producto");
        item.setDescription("Desc");
        Mockito.when(service.findAll()).thenReturn(List.of(item));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Producto"));
    }

    @Test
    void shouldReturnNotFoundWhenItemDoesNotExist() throws Exception {
        Mockito.when(service.findById("404")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/items/404"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateItem() throws Exception {
        Item request = new Item();
        request.setName("Nuevo");

        Item created = new Item();
        created.setId("abc");
        created.setName("Nuevo");

        Mockito.when(service.create(Mockito.any(Item.class))).thenReturn(created);

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("abc"))
                .andExpect(jsonPath("$.name").value("Nuevo"));
    }
}
