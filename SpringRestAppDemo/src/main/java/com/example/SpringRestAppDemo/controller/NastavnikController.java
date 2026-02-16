/*
* Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
* Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
*/
package com.example.SpringRestAppDemo.controller;
 
import com.example.SpringRestAppDemo.dto.DodajNastavnikaDto;
import com.example.SpringRestAppDemo.dto.NastavnikPredmetDto;
import com.example.SpringRestAppDemo.entity.Nastavnik;
import com.example.SpringRestAppDemo.entity.NastavnikPredmet;
import com.example.SpringRestAppDemo.entity.Predmet;
import com.example.SpringRestAppDemo.entity.Zvanje;
import com.example.SpringRestAppDemo.repository.NastavnikRepository;
import com.example.SpringRestAppDemo.repository.ZvanjeRepository;
import com.example.SpringRestAppDemo.service.NastavnikPredmetService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final ZvanjeRepository zvanjeRepository;

    public NastavnikController(NastavnikRepository nastavnikRepository, NastavnikPredmetService npService, ZvanjeRepository zvanjeRepository) {
        this.nastavnikRepository = nastavnikRepository;
        this.npService = npService;
        this.zvanjeRepository = zvanjeRepository;
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
    
    @GetMapping("/uloge")
    public Map<Long, String> getUlogeNastavnika() {
        List<Nastavnik> nastavnici = nastavnikRepository.findAll();
        Map<Long, String> ulogeMap = new HashMap<>();

        for (Nastavnik n : nastavnici) {
            if (n.getKorisnickiProfil() != null && n.getKorisnickiProfil().getUloga() != null) {
                ulogeMap.put(n.getNastavnikID(), n.getKorisnickiProfil().getUloga().getTip());
            } else {
                ulogeMap.put(n.getNastavnikID(), "Nema ulogu");
            }
        }

        return ulogeMap;
    }

    @PostMapping
    public Nastavnik dodajNastavnika(@RequestBody DodajNastavnikaDto dto) {
        if (dto.getIme() == null || dto.getIme().isEmpty() ||
            dto.getPrezime() == null || dto.getPrezime().isEmpty() ||
            dto.getZvanjeID() == null) {
            throw new RuntimeException("Sva polja su obavezna!");
        }

        Zvanje zvanje = zvanjeRepository.findById(dto.getZvanjeID())
                .orElseThrow(() -> new RuntimeException("Zvanje nije pronađeno!"));

        Nastavnik nastavnik = new Nastavnik();
        nastavnik.setIme(dto.getIme());
        nastavnik.setPrezime(dto.getPrezime());
        nastavnik.setZvanje(zvanje);

        return nastavnikRepository.save(nastavnik);
    }
    
    @PostMapping("/predmet")
    public NastavnikPredmet dodajPredmetNastavniku(@RequestBody NastavnikPredmetDto dto) {
        return npService.dodaj(dto.getNastavnikID(), dto.getPredmetID());
    }

    @DeleteMapping("/nastavnici/{nastavnikId}")
    public void obrisiNastavnika(@PathVariable Long nastavnikId) {
        npService.obrisiNastavnika(nastavnikId);
    }

    @DeleteMapping("/nastavnici/{nastavnikId}/predmeti/{predmetId}")
    public void obrisiPredmetZaNastavnika(@PathVariable Long nastavnikId,
                                          @PathVariable Long predmetId) {
        npService.obrisiPredmetZaNastavnika(nastavnikId, predmetId);
    }
}