package com.msc.ftcunidad4.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.msc.ftcunidad4.model.Item;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseCrudService {

    private final Firestore firestore;
    private final String collectionName;

    public FirebaseCrudService(Firestore firestore, @Value("${app.firebase.collection:items}") String collectionName) {
        this.firestore = firestore;
        this.collectionName = collectionName;
    }

    public List<Item> findAll() throws ExecutionException, InterruptedException {
        CollectionReference collection = firestore.collection(collectionName);
        ApiFuture<QuerySnapshot> future = collection.get();
        List<Item> items = new ArrayList<>();

        for (DocumentSnapshot document : future.get().getDocuments()) {
            Item item = document.toObject(Item.class);
            if (item != null) {
                items.add(item);
            }
        }
        return items;
    }

    public Optional<Item> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        if (!snapshot.exists()) {
            return Optional.empty();
        }

        Item item = snapshot.toObject(Item.class);
        if (item == null) {
            return Optional.empty();
        }
        return Optional.of(item);
    }

    public Item create(Item item) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(item.getId());
        docRef.set(item).get();
        return item;
    }

    public Optional<Item> update(String id, Item item) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(id);
        DocumentSnapshot existing = docRef.get().get();
        if (!existing.exists()) {
            return Optional.empty();
        }

        docRef.set(item).get();
        return Optional.of(item);
    }

    public boolean delete(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collectionName).document(id);
        DocumentSnapshot existing = docRef.get().get();
        if (!existing.exists()) {
            return false;
        }
        docRef.delete().get();
        return true;
    }

    public List<Item> loadFromCsv(MultipartFile file) throws IOException, ExecutionException, InterruptedException {
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setTrim(true)
                     .build()
                     .parse(reader)) {
            List<Item> createdItems = new ArrayList<>();

            for (CSVRecord record : parser) {
                Item item = new Item();
                item.setId(record.get("id"));
                item.setNombre(record.get("nombre"));
                item.setApellido(record.get("apellido"));
                item.setTelefono(record.get("telefono"));
                item.setEdad(Integer.parseInt(record.get("edad")));
                item.setCorreo(record.get("correo"));
                item.setDireccion(record.get("direccion"));
                item.setUniversidad(record.get("universidad"));
                item.setSemestre(Integer.parseInt(record.get("semestre")));
                item.setJornada(record.get("jornada"));
                item.setSexo(record.get("sexo"));

                createdItems.add(create(item));
            }

            return createdItems;
        }
    }
}
