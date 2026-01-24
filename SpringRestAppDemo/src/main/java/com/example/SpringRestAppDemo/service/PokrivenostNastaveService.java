/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.SpringRestAppDemo.service;

import com.example.SpringRestAppDemo.dto.PlanPokrivenostiNastaveDto;
import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;
import java.util.List;

/**
 *
 * @author Milena
 */
public interface PokrivenostNastaveService {
    List<PokrivenostNastaveDto> findAll();
    //PokrivenostNastaveDto findById(Long predmetID) throws Exception;
    PokrivenostNastaveDto save(PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception;
    List<PlanPokrivenostiNastaveDto> getPlanZaGodinu(Long skolskaGodinaID);
}
