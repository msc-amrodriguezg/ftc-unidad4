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
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
        item.setNombre("Carlos Andrés");
        item.setApellido("Martínez López");
        item.setTelefono("3101234567");
        item.setEdad(20);
        item.setCorreo("carlos.martinez@gmail.com");
        item.setDireccion("Calle 12 # 5-34, Bogotá");
        item.setUniversidad("UNAD");
        item.setSemestre(3);
        item.setJornada("Virtual");
        item.setSexo("Masculino");
        Mockito.when(service.findAll()).thenReturn(List.of(item));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].nombre").value("Carlos Andrés"))
            .andExpect(jsonPath("$[0].apellido").value("Martínez López"))
            .andExpect(jsonPath("$[0].telefono").value("3101234567"))
            .andExpect(jsonPath("$[0].edad").value(20))
            .andExpect(jsonPath("$[0].correo").value("carlos.martinez@gmail.com"))
            .andExpect(jsonPath("$[0].direccion").value("Calle 12 # 5-34, Bogotá"))
            .andExpect(jsonPath("$[0].universidad").value("UNAD"))
            .andExpect(jsonPath("$[0].semestre").value(3))
            .andExpect(jsonPath("$[0].jornada").value("Virtual"))
            .andExpect(jsonPath("$[0].sexo").value("Masculino"));
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
        request.setNombre("Carlos Andrés");
        request.setApellido("Martínez López");
        request.setTelefono("3101234567");
        request.setEdad(20);
        request.setCorreo("carlos.martinez@gmail.com");
        request.setDireccion("Calle 12 # 5-34, Bogotá");
        request.setUniversidad("UNAD");
        request.setSemestre(3);
        request.setJornada("Virtual");
        request.setSexo("Masculino");

        Item created = new Item();
        created.setNombre("Carlos Andrés");
        created.setApellido("Martínez López");
        created.setTelefono("3101234567");
        created.setEdad(20);
        created.setCorreo("carlos.martinez@gmail.com");
        created.setDireccion("Calle 12 # 5-34, Bogotá");
        created.setUniversidad("UNAD");
        created.setSemestre(3);
        created.setJornada("Virtual");
        created.setSexo("Masculino");

        Mockito.when(service.create(Mockito.any(Item.class))).thenReturn(created);

        mockMvc.perform(post("/api/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nombre").value("Carlos Andrés"))
            .andExpect(jsonPath("$.apellido").value("Martínez López"))
            .andExpect(jsonPath("$.telefono").value("3101234567"))
            .andExpect(jsonPath("$.edad").value(20))
            .andExpect(jsonPath("$.correo").value("carlos.martinez@gmail.com"))
            .andExpect(jsonPath("$.direccion").value("Calle 12 # 5-34, Bogotá"))
            .andExpect(jsonPath("$.universidad").value("UNAD"))
            .andExpect(jsonPath("$.semestre").value(3))
            .andExpect(jsonPath("$.jornada").value("Virtual"))
            .andExpect(jsonPath("$.sexo").value("Masculino"));
    }

            @Test
            void shouldLoadItemsFromCsv() throws Exception {
            Item created = new Item();
            created.setId("1");
            created.setNombre("Carlos Andrés");
            created.setApellido("Martínez López");
            created.setTelefono("3101234567");
            created.setEdad(20);
            created.setCorreo("carlos.martinez@gmail.com");
            created.setDireccion("Calle 12 # 5-34, Bogotá");
            created.setUniversidad("UNAD");
            created.setSemestre(3);
            created.setJornada("Virtual");
            created.setSexo("Masculino");

            Mockito.when(service.loadFromCsv(Mockito.any())).thenReturn(List.of(created));

            MockMultipartFile file = new MockMultipartFile(
                "file",
                "data.csv",
                "text/csv",
                ("id,nombre,apellido,telefono,edad,correo,direccion,universidad,semestre,jornada,sexo\n"
                    + "1,Carlos Andrés,Martínez López,3101234567,20,carlos.martinez@gmail.com,\"Calle 12 # 5-34, Bogotá\",UNAD,3,Virtual,Masculino\n")
                    .getBytes()
            );

            mockMvc.perform(multipart("/api/items/loadFile").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].nombre").value("Carlos Andrés"))
                .andExpect(jsonPath("$[0].apellido").value("Martínez López"));
            }
}
