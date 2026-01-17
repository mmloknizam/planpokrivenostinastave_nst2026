/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.SpringRestAppDemo.service;

import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;

/**
 *
 * @author Milena
 */
public interface PokrivenostNastaveService {
    //List<CityDto> findAll();
    //CityDto findByZipcode(Long zipcode) throws Exception;
    PokrivenostNastaveDto save(PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception;
    
}
