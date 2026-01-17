/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.service.impl;

import com.example.SpringRestAppDemo.entity.PokrivenostNastave;
import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;
import com.example.SpringRestAppDemo.mapper.impl.PokrivenostNastaveDtoEntityMapper;
import com.example.SpringRestAppDemo.repository.PokrivenostNastaveRepository;
import com.example.SpringRestAppDemo.service.PokrivenostNastaveService;
import org.springframework.stereotype.Service;

/**
 *
 * @author Marija
 */
@Service
public class PokrivenostNastaveServiceImpl implements PokrivenostNastaveService{
    private PokrivenostNastaveRepository pokrivenostNastaveRepository;
    private PokrivenostNastaveDtoEntityMapper pokrivenostNastaveDtoEntityMapper;

    public PokrivenostNastaveServiceImpl(PokrivenostNastaveRepository pokrivenostNastaveRepository, PokrivenostNastaveDtoEntityMapper pokrivenostNastaveDtoEntityMapper) {
        this.pokrivenostNastaveRepository = pokrivenostNastaveRepository;
        this.pokrivenostNastaveDtoEntityMapper = pokrivenostNastaveDtoEntityMapper;
    }

     /*  
    @Override
    public List<CityDto> findAll() {
        List<City> cities =  cityRepository.findAll();
        
        List<CityDto> citiesDto = new ArrayList<>();
        for (City city : cities) {
            citiesDto.add(cityDtoEntityMapper.toDto(city));
        }
        return citiesDto;
    }

    @Override
    public CityDto findByZipcode(Long zipcode) throws Exception{
        Optional<City> cityOptional =  cityRepository.findById(zipcode);
        if(cityOptional.isPresent()){
            return cityDtoEntityMapper.toDto(cityOptional.get());
        }
        throw new Exception("City (" + zipcode+ ") does not exist!");
    }

    @Override
    public CityDto save(CityDto cityDto) throws Exception {
        //validator
        
        City city = cityDtoEntityMapper.toEntity(cityDto);
        city =  cityRepository.save(city);
        return cityDtoEntityMapper.toDto(city);
    }
    */

    @Override
    public PokrivenostNastaveDto save(PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception {
       PokrivenostNastave pokrivenostNastave=pokrivenostNastaveDtoEntityMapper.toEntity(pokrivenostNastaveDto);
       pokrivenostNastave=pokrivenostNastaveRepository.save(pokrivenostNastave);
       return pokrivenostNastaveDtoEntityMapper.toDto(pokrivenostNastave);
    }

}
