/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
*/
package com.example.SpringRestAppDemo.controller;
 
import com.example.SpringRestAppDemo.entity.Nastavnik;
import com.example.SpringRestAppDemo.entity.Predmet;
import com.example.SpringRestAppDemo.repository.NastavnikRepository;
import com.example.SpringRestAppDemo.service.NastavnikPredmetService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
/**
*
* @author Milena
*/
@RestController
@RequestMapping("/api/nastavnik")
@CrossOrigin(origins = "http://localhost:3000")
public class NastavnikController {
 
    private final NastavnikRepository nastavnikRepository;
    private final NastavnikPredmetService npService;

    public NastavnikController(NastavnikRepository nastavnikRepository, NastavnikPredmetService npService) {
        this.nastavnikRepository = nastavnikRepository;
        this.npService = npService;
    }
 
    @GetMapping
    public List<Nastavnik> findAll() {
        return nastavnikRepository.findAll();
    }
    
    @GetMapping("/slobodni")
    public List<Nastavnik> findSlobodniNastavnici() {
        return nastavnikRepository.findSlobodniNastavnici();
    }
    
    @GetMapping("/{nastavnikID}/predmeti")
    public List<Predmet> getPredmeti(@PathVariable Long nastavnikID) {
        return npService.predmetiNastavnika(nastavnikID);
    }
    
    @GetMapping("/predmet/{predmetID}")
    public List<Nastavnik> getNastavniciZaPredmet(@PathVariable Long predmetID) {
        return nastavnikRepository.findNastavniciZaPredmet(predmetID);
    }
}