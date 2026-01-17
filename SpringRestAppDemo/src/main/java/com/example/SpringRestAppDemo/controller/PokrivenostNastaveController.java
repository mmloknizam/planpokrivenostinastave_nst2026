/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.controller;

import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;
import com.example.SpringRestAppDemo.service.PokrivenostNastaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Marija
 */
@RestController
@RequestMapping("/api/pokrivenostNastave")
@CrossOrigin(origins = "http://localhost:3000")
public class PokrivenostNastaveController {

    private PokrivenostNastaveService pokrivenostNastaveService;

    public PokrivenostNastaveController(PokrivenostNastaveService pokrivenostNastaveService) {
        this.pokrivenostNastaveService = pokrivenostNastaveService;
    }

    @PostMapping()
    public ResponseEntity<PokrivenostNastaveDto> save(@RequestBody PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception{
        return new ResponseEntity<>(pokrivenostNastaveService.save(pokrivenostNastaveDto), HttpStatus.OK);
    }
    
    /*
    @GetMapping()
    public List<CityDto> findAll() throws Exception {
        return cityService.findAll();
    }
    @GetMapping("/{zipcode}")
    public ResponseEntity<CityDto> findByZipcode(@PathVariable (value = "zipcode") Long zipcode) 
            throws Exception{
        //try {
            //return cityService.findByZipcode(zipcode);
            return new ResponseEntity<>(
                    cityService.findByZipcode(zipcode), 
                    HttpStatus.OK);
        //} catch (Exception ex) {
        //    return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
        //}
    }
    /*
    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleException(Exception e){
        return e.getMessage();
    }
    */
    
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
