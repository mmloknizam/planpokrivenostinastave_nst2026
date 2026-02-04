/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
*/
package com.example.SpringRestAppDemo.controller;
import com.example.SpringRestAppDemo.entity.Nastavnik;
import com.example.SpringRestAppDemo.entity.Predmet;
import com.example.SpringRestAppDemo.repository.PredmetRepository;
import com.example.SpringRestAppDemo.service.NastavnikPredmetService;
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
    private final NastavnikPredmetService npService;

    public PredmetController(PredmetRepository predmetRepository, NastavnikPredmetService npService) {
        this.predmetRepository = predmetRepository;
        this.npService = npService;
    }
 
    @GetMapping
    public List<Predmet> findAll() {
        return predmetRepository.findAll();
    }
    
    @GetMapping("/{predmetID}/nastavnici")
    public List<Nastavnik> getNastavnici(@PathVariable Long predmetID) {
        return npService.nastavniciPredmeta(predmetID);
    }
}