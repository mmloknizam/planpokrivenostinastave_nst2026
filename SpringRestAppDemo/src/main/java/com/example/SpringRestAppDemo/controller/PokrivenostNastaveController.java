/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.controller;

import com.example.SpringRestAppDemo.dto.PlanPokrivenostiNastaveDto;
import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;
import com.example.SpringRestAppDemo.service.PokrivenostNastaveService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Marija
 */
@RestController
@RequestMapping("/api/pokrivenostnastave")
@CrossOrigin(origins = "http://localhost:3000")
public class PokrivenostNastaveController {

    private PokrivenostNastaveService pokrivenostNastaveService;

    public PokrivenostNastaveController(PokrivenostNastaveService pokrivenostNastaveService) {
        this.pokrivenostNastaveService = pokrivenostNastaveService;
    }

    @PostMapping()
    public ResponseEntity<PokrivenostNastaveDto> save(@Valid @RequestBody PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception{
        return new ResponseEntity<>(pokrivenostNastaveService.save(pokrivenostNastaveDto), HttpStatus.OK);
    }
    
    
    @GetMapping()
    public List<PokrivenostNastaveDto> findAll() throws Exception {
        return pokrivenostNastaveService.findAll();
    }
    
    @GetMapping("/plan/{skolskaGodinaID}")
    public List<PlanPokrivenostiNastaveDto> getPlan(@PathVariable Long skolskaGodinaID) {
        return pokrivenostNastaveService.getPlanZaGodinu(skolskaGodinaID);
    }
    
    @DeleteMapping
    public ResponseEntity<Void> deleteBatch(@RequestBody List<Long> ids){
        pokrivenostNastaveService.deleteBatch(ids);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/detalji/{predmetID}/{skolskaGodinaID}")
    public List<PokrivenostNastaveDto> getDetalji(
            @PathVariable Long predmetID,
            @PathVariable Long skolskaGodinaID
    ) {
        return pokrivenostNastaveService.findByPredmetAndGodina(predmetID, skolskaGodinaID);
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOne(@PathVariable Long id) {
        pokrivenostNastaveService.deleteOne(id);
        return ResponseEntity.noContent().build();
    }
    
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
