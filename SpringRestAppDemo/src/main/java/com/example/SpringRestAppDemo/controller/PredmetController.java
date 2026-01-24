/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
*/
package com.example.SpringRestAppDemo.controller;
import com.example.SpringRestAppDemo.entity.Predmet;
import com.example.SpringRestAppDemo.repository.PredmetRepository;
import java.util.List;
import org.springframework.web.bind.annotation.*;
/**
*
* @author Milena
*/
@RestController
@RequestMapping("/api/predmet")
@CrossOrigin(origins = "http://localhost:3000")
public class PredmetController {
 
    private final PredmetRepository predmetRepository;
 
    public PredmetController(PredmetRepository predmetRepository) {
        this.predmetRepository = predmetRepository;
    }
 
    @GetMapping
    public List<Predmet> findAll() {
        return predmetRepository.findAll();
    }
}