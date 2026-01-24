/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.service.impl;

import com.example.SpringRestAppDemo.dto.LoginRequestDto;
import com.example.SpringRestAppDemo.dto.LoginResponseDto;
import com.example.SpringRestAppDemo.dto.RegisterRequestDto;
import com.example.SpringRestAppDemo.dto.RegisterResponseDto;
import com.example.SpringRestAppDemo.entity.KorisnickiProfil;
import com.example.SpringRestAppDemo.entity.Uloga;
import com.example.SpringRestAppDemo.repository.KorisnickiProfilRepository;
import com.example.SpringRestAppDemo.repository.UlogaRepository;
import com.example.SpringRestAppDemo.service.KorisnickiProfilService;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 *
 * @author Marija
 */
@Service
public class KorisnickiProfilServiceImpl implements KorisnickiProfilService{
    private KorisnickiProfilRepository korisnickiProfilRepository;
    private UlogaRepository ulogaRepository;

    public KorisnickiProfilServiceImpl(KorisnickiProfilRepository korisnickiProfilRepository, UlogaRepository ulogaRepository) {
        this.korisnickiProfilRepository = korisnickiProfilRepository;
        this.ulogaRepository = ulogaRepository;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) throws Exception {
            // Pronađi korisnika po emailu
    Optional<KorisnickiProfil> korisnikOpt = 
            korisnickiProfilRepository.findByEmail(request.getEmail());

    if (korisnikOpt.isEmpty()) {
        throw new Exception("Korisnik ne postoji");
    }

    KorisnickiProfil korisnik = korisnikOpt.get();

    // Provera lozinke
    if (!korisnik.getLozinka().equals(request.getLozinka())) {
        throw new Exception("Pogresna lozinka");
    }

    // Vrati DTO sa tokenom, email-om i ulogom
    return new LoginResponseDto(
            "dummy-token",             // kasnije možeš ubaciti JWT
            korisnik.getEmail(),
            korisnik.getUloga().toString()
    );
    }

    @Override
    public RegisterResponseDto register(RegisterRequestDto request) throws Exception {
        
        // ✔ email ne sme da postoji
        if (korisnickiProfilRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("Email već postoji!");
        }

        String passwordError = validatePassword(request.getLozinka());
        if (passwordError != null) {
            throw new Exception(passwordError);
        }

        // ✔ uloga mora postojati
        Uloga uloga = ulogaRepository.findById(request.getUlogaID())
                .orElseThrow(() -> new Exception("Uloga ne postoji!"));

        // ✔ kreiranje korisnika
        KorisnickiProfil korisnik = new KorisnickiProfil();
        //  korisnik.setKorisnickiProfilID(null); // AUTO_INCREMENT ako imas u bazi
        korisnik.setEmail(request.getEmail());
        korisnik.setLozinka(request.getLozinka());
        korisnik.setUloga(uloga);

        korisnickiProfilRepository.save(korisnik);

        return new RegisterResponseDto("Uspešno ste registrovali korisnika!");
    }

        private String validatePassword(String lozinka) {
        if (lozinka.length() < 8) {
            return "Lozinka mora imati najmanje 8 karaktera";
        }
        if (!lozinka.matches(".*[A-Z].*")) {
            return "Lozinka mora imati bar jedno veliko slovo";
        }
        if (!lozinka.matches(".*\\d.*")) {
            return "Lozinka mora imati bar jedan broj";
        }
        if (!lozinka.matches(".*[@#$%^&+=!?.*].*")) {
            return "Lozinka mora imati bar jedan specijalan karakter (@#$%^&+=!?.*)";
        }
        return null; // sve je ok
    }
}
