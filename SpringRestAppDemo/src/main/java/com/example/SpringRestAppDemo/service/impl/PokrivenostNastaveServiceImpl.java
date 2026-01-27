/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.service.impl;

import com.example.SpringRestAppDemo.dto.PlanPokrivenostiNastaveDto;
import com.example.SpringRestAppDemo.entity.PokrivenostNastave;
import com.example.SpringRestAppDemo.dto.PokrivenostNastaveDto;
import com.example.SpringRestAppDemo.mapper.impl.PokrivenostNastaveDtoEntityMapper;
import com.example.SpringRestAppDemo.repository.PokrivenostNastaveRepository;
import com.example.SpringRestAppDemo.service.PokrivenostNastaveService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    
    @Override
    public List<PokrivenostNastaveDto> findAll() {
        List<PokrivenostNastave> pokrivenostiNastave =  pokrivenostNastaveRepository.findAll();
        
        List<PokrivenostNastaveDto> planDto = new ArrayList<>();
        for (PokrivenostNastave plan : pokrivenostiNastave) {
            planDto.add(pokrivenostNastaveDtoEntityMapper.toDto(plan));
        }
        return planDto;
    }
    
    @Override
    public PokrivenostNastaveDto save(PokrivenostNastaveDto pokrivenostNastaveDto) throws Exception {
       PokrivenostNastave pokrivenostNastave=pokrivenostNastaveDtoEntityMapper.toEntity(pokrivenostNastaveDto);
       pokrivenostNastave=pokrivenostNastaveRepository.save(pokrivenostNastave);
       return pokrivenostNastaveDtoEntityMapper.toDto(pokrivenostNastave);
    }

    @Override
    public List<PlanPokrivenostiNastaveDto> getPlanZaGodinu(Long skolskaGodinaID) {

        List<PokrivenostNastave> lista =
                pokrivenostNastaveRepository
                        .findAllBySkolskaGodina_SkolskaGodinaID(skolskaGodinaID);

        Map<Long, PlanPokrivenostiNastaveDto> rezultat = new LinkedHashMap<>();

        Map<Long, Map<String, Map<Long, Integer>>> satiMap = new HashMap<>();

        for (PokrivenostNastave pn : lista) {

            Long predmetID = pn.getPredmet().getPredmetID();
            Long nastavnikID = pn.getNastavnik().getNastavnikID();
            String oblik = pn.getOblikNastave().getTip();

            rezultat.computeIfAbsent(
                    predmetID,
                    id -> {
                        PlanPokrivenostiNastaveDto dto=
                        new PlanPokrivenostiNastaveDto(
                                predmetID,
                                pn.getPredmet().getNaziv(),
                                null, null, null,
                                pn.getSkolskaGodina().getGodina(),
                                0, null
                        );
                        dto.setPokrivenostNastaveIDs(new ArrayList<>());
                        return dto;
                    }
            );
            
            rezultat.get(predmetID).getPokrivenostNastaveIDs().add(pn.getPokrivenostNastaveID());

            satiMap
                    .computeIfAbsent(predmetID, k -> new HashMap<>())
                    .computeIfAbsent(oblik, k -> new LinkedHashMap<>())
                    .putIfAbsent(nastavnikID, pn.getBrojSatiNastave());
        }

        for (Long predmetID : satiMap.keySet()) {

            PlanPokrivenostiNastaveDto dto = rezultat.get(predmetID);
            int ukupnoSati = 0;

            for (var oblikEntry : satiMap.get(predmetID).entrySet()) {

                String oblik = oblikEntry.getKey();
                Map<Long, Integer> nastavnici = oblikEntry.getValue();

                String vrednost = nastavnici.entrySet().stream()
                        .map(e -> {
                            PokrivenostNastave pn = lista.stream()
                                    .filter(x ->
                                            x.getPredmet().getPredmetID().equals(predmetID)
                                            && x.getNastavnik().getNastavnikID().equals(e.getKey())
                                    )
                                    .findFirst()
                                    .orElse(null);

                            if (pn == null) return "";
                            return pn.getNastavnik().getIme() + " "
                                    + pn.getNastavnik().getPrezime()
                                    + " (" + e.getValue() + ")";
                        })
                        .filter(s -> !s.isEmpty())
                        .reduce((a, b) -> a + ", " + b)
                        .orElse(null);

                switch (oblik) {
                    case "Predavanja":
                        dto.setPredavanja(vrednost);
                        break;
                    case "Vezbe":
                        dto.setVezbe(vrednost);
                        break;
                    case "Laboratorijske vezbe":
                        dto.setLaboratorijskeVezbe(vrednost);
                        break;
                }

                ukupnoSati += nastavnici.values().stream().mapToInt(Integer::intValue).sum();
            }

            dto.setBrojSatiNastave(ukupnoSati);
        }

        return new ArrayList<>(rezultat.values());
    }

    @Override
    public void deleteBatch(List<Long> ids) {
        pokrivenostNastaveRepository.deleteAllById(ids);
    }

    @Override
    public List<PokrivenostNastaveDto> findByPredmetAndGodina(
            Long predmetID,
            Long skolskaGodinaID
    ) {
        return pokrivenostNastaveRepository
                .findByPredmet_PredmetIDAndSkolskaGodina_SkolskaGodinaID(
                        predmetID, skolskaGodinaID
                )
                .stream()
                .map(pokrivenostNastaveDtoEntityMapper::toDto)
                .toList();
    }
    @Override
    public void deleteOne(Long id) {
        pokrivenostNastaveRepository.deleteById(id);
    }


}
