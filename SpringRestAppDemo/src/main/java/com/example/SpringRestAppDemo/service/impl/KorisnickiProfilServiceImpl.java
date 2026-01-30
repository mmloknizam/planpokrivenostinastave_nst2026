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
import com.example.SpringRestAppDemo.entity.Verifikacija;
import com.example.SpringRestAppDemo.repository.KorisnickiProfilRepository;
import com.example.SpringRestAppDemo.repository.UlogaRepository;
import com.example.SpringRestAppDemo.repository.VerifikacijaRepository;
import com.example.SpringRestAppDemo.service.KorisnickiProfilService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.UUID;

/**
 *
 * @author Marija
 */
@Service
public class KorisnickiProfilServiceImpl implements KorisnickiProfilService{
    private KorisnickiProfilRepository korisnickiProfilRepository;
    private UlogaRepository ulogaRepository;
    private VerifikacijaRepository verifikacijaRepository;

    public KorisnickiProfilServiceImpl(KorisnickiProfilRepository korisnickiProfilRepository, UlogaRepository ulogaRepository, VerifikacijaRepository verifikacijaRepository) {
        this.korisnickiProfilRepository = korisnickiProfilRepository;
        this.ulogaRepository = ulogaRepository;
        this.verifikacijaRepository = verifikacijaRepository;
    }
 
    @Override
    public LoginResponseDto login(LoginRequestDto request) throws Exception {
    Optional<KorisnickiProfil> korisnikOpt = 
            korisnickiProfilRepository.findByEmail(request.getEmail());

    if (korisnikOpt.isEmpty()) {
        throw new Exception("Korisnik ne postoji");
    }

    KorisnickiProfil korisnik = korisnikOpt.get();

    if (!korisnik.getLozinka().equals(request.getLozinka())) {
        throw new Exception("Pogresna lozinka");
    }

    return new LoginResponseDto(
            "dummy-token",
            korisnik.getEmail(),
            korisnik.getUloga().toString()
    );
    }

    @Override
    public RegisterResponseDto register(RegisterRequestDto request) throws Exception {
        validateEmail(request.getEmail());
        
        if (korisnickiProfilRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("Email već postoji!");
        }
        
        String passwordError = validatePassword(request.getLozinka());
        if (passwordError != null) {
            throw new Exception(passwordError);
        }

        Uloga uloga = ulogaRepository.findById(request.getUlogaID())
                .orElseThrow(() -> new Exception("Uloga ne postoji!"));

        KorisnickiProfil korisnik = new KorisnickiProfil();
        korisnik.setEmail(request.getEmail());
        korisnik.setLozinka(request.getLozinka());
        korisnik.setUloga(uloga);
        korisnik.setEnabled(false);

        korisnickiProfilRepository.save(korisnik);

        String kod = UUID.randomUUID().toString();

        Verifikacija verifikacija = new Verifikacija();
        verifikacija.setEmail(request.getEmail());
        verifikacija.setKod(kod);
        verifikacija.setVreme(LocalDateTime.now());
        verifikacijaRepository.save(verifikacija);

        System.out.println("Verifikacioni kod za " + request.getEmail() + ": " + kod);

        return new RegisterResponseDto(
                "Korisnik registrovan! Za testiranje, verifikacioni kod je ispisan u logu. Kod važi 10 minuta."
        );
    }

        private void validateEmail(String email) throws Exception {
        if (email == null || !email.endsWith("@fon.bg.ac.rs")) {
            throw new Exception("Email mora biti u formatu @fon.bg.ac.rs");
        }
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
        return null;
    }

    @Override
    public RegisterResponseDto confirmEmail(String email, String kod) throws Exception {

        // Pronađi verifikaciju po email-u i kodu
        Optional<Verifikacija> verifikacijaOpt = verifikacijaRepository
                .findByEmailAndKod(email, kod);

        if (verifikacijaOpt.isEmpty()) {
            throw new Exception("Nevažeći kod za verifikaciju.");
        }

        Verifikacija verifikacija = verifikacijaOpt.get();

        if (verifikacija.getVreme().plusMinutes(10).isBefore(LocalDateTime.now())) {
            throw new Exception("Kod je istekao. Molimo generišite novi kod.");
        }

        KorisnickiProfil korisnik = korisnickiProfilRepository
                .findByEmail(email)
                .orElseThrow(() -> new Exception("Korisnik ne postoji."));

        korisnik.setEnabled(true);
        korisnickiProfilRepository.save(korisnik);

        verifikacijaRepository.delete(verifikacija);

        return new RegisterResponseDto("Korisnik uspešno aktiviran!");
    }
    
    
    @Override
    public RegisterResponseDto resendVerificationCode(String email) throws Exception {
        Optional<Verifikacija> verifikacijaOpt = verifikacijaRepository.findByEmail(email);

        if (verifikacijaOpt.isEmpty()) {
            throw new Exception("Ne postoji verifikacija za ovaj email. Molimo registrujte se ponovo.");
        }

        Verifikacija verifikacija = verifikacijaOpt.get();

        String noviKod = UUID.randomUUID().toString();
        verifikacija.setKod(noviKod);
        verifikacija.setVreme(LocalDateTime.now());

        verifikacijaRepository.save(verifikacija);

        System.out.println("Novi verifikacioni kod za " + email + ": " + noviKod);

        return new RegisterResponseDto(
                "Novi verifikacioni kod je generisan i važi 10 minuta. Kod je ispisan u logu za testiranje."
        );
    }


}
