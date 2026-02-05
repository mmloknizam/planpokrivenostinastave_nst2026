/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.service.impl;

import com.example.SpringRestAppDemo.dto.ConfirmEmailRequestDto;
import com.example.SpringRestAppDemo.dto.KorisnickiProfilDto;
import com.example.SpringRestAppDemo.dto.LoginRequestDto;
import com.example.SpringRestAppDemo.dto.LoginResponseDto;
import com.example.SpringRestAppDemo.dto.RegisterRequestDto;
import com.example.SpringRestAppDemo.dto.RegisterResponseDto;
import com.example.SpringRestAppDemo.entity.KorisnickiProfil;
import com.example.SpringRestAppDemo.entity.Nastavnik;
import com.example.SpringRestAppDemo.entity.Uloga;
import com.example.SpringRestAppDemo.entity.Verifikacija;
import com.example.SpringRestAppDemo.entity.Zvanje;
import com.example.SpringRestAppDemo.repository.KorisnickiProfilRepository;
import com.example.SpringRestAppDemo.repository.NastavnikRepository;
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
public class KorisnickiProfilServiceImpl implements KorisnickiProfilService {

    private final KorisnickiProfilRepository korisnickiProfilRepository;
    private final UlogaRepository ulogaRepository;
    private final VerifikacijaRepository verifikacijaRepository;
    private final NastavnikRepository nastavnikRepository;

    public KorisnickiProfilServiceImpl(KorisnickiProfilRepository korisnickiProfilRepository, UlogaRepository ulogaRepository, VerifikacijaRepository verifikacijaRepository, NastavnikRepository nastavnikRepository) {
        this.korisnickiProfilRepository = korisnickiProfilRepository;
        this.ulogaRepository = ulogaRepository;
        this.verifikacijaRepository = verifikacijaRepository;
        this.nastavnikRepository = nastavnikRepository;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) throws Exception {
        Optional<KorisnickiProfil> korisnikOpt = korisnickiProfilRepository.findByEmail(request.getEmail());

        if (korisnikOpt.isEmpty()) {
            throw new Exception("Korisnik ne postoji");
        }

        KorisnickiProfil korisnik = korisnikOpt.get();

        if (!korisnik.getLozinka().equals(request.getLozinka())) {
            throw new Exception("Pogrešna lozinka");
        }

        if (!korisnik.isEnabled()) {
            throw new Exception("Nalog nije aktiviran. Proverite email i potvrdite kod.");
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
            throw new Exception("Korisnik sa ovim email-om već postoji.");
        }

        String passwordError = validatePassword(request.getLozinka());
        if (passwordError != null) {
            throw new Exception(passwordError);
        }

        String kod = UUID.randomUUID().toString();
        Verifikacija verifikacija = new Verifikacija();
        verifikacija.setEmail(request.getEmail());
        verifikacija.setKod(kod);
        verifikacija.setVreme(LocalDateTime.now());

        verifikacijaRepository.save(verifikacija);

        System.out.println("Verifikacioni kod za " + request.getEmail() + ": " + kod);

        return new RegisterResponseDto(
                "Registracija uspešna! Proverite mejl i unesite verifikacioni kod. Kod važi 10 minuta."
        );
    }
    @Override
    public RegisterResponseDto confirmEmail(ConfirmEmailRequestDto request) throws Exception {

        Verifikacija verifikacija = verifikacijaRepository
                .findByEmailAndKod(request.getEmail(), request.getKod())
                .orElseThrow(() -> new Exception("Nevažeći kod!"));

        if (verifikacija.getVreme().plusMinutes(10).isBefore(LocalDateTime.now())) {
            throw new Exception("Kod je istekao!");
        }

        String passwordError = validatePassword(request.getLozinka());
        if (passwordError != null) {
            throw new Exception(passwordError);
        }

        Uloga uloga = ulogaRepository.findById(request.getUlogaID())
                .orElseThrow(() -> new Exception("Uloga ne postoji!"));

        if (request.getNastavnikID() != null &&
            korisnickiProfilRepository.findByNastavnik_NastavnikID(request.getNastavnikID()).isPresent()) {
            throw new Exception("Ovaj nastavnik je već registrovan!");
        }

        KorisnickiProfil korisnik = new KorisnickiProfil();
        korisnik.setEmail(request.getEmail());
        korisnik.setLozinka(request.getLozinka());
        korisnik.setUloga(uloga);
        korisnik.setEnabled(true);

        if (request.getNastavnikID() != null) {
            Nastavnik nastavnik = nastavnikRepository
                    .findById(request.getNastavnikID())
                    .orElseThrow(() -> new Exception("Nastavnik ne postoji!"));

            korisnik.setNastavnik(nastavnik);
        }

        korisnik = korisnickiProfilRepository.save(korisnik);

        if (request.getNastavnikID() != null) {
            Nastavnik nastavnik = korisnik.getNastavnik();
            nastavnik.setKorisnickiProfil(korisnik);
            nastavnikRepository.save(nastavnik);
        }

        verifikacijaRepository.delete(verifikacija);

        return new RegisterResponseDto("Korisnik uspešno aktiviran!");
    }





    @Override
    public RegisterResponseDto resendVerificationCode(String email) throws Exception {
        Verifikacija verifikacija = verifikacijaRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Ne postoji verifikacija za ovaj email. Registrujte se ponovo."));

        String noviKod = UUID.randomUUID().toString();
        verifikacija.setKod(noviKod);
        verifikacija.setVreme(LocalDateTime.now());

        verifikacijaRepository.save(verifikacija);

        System.out.println("Novi verifikacioni kod za " + email + ": " + noviKod);

        return new RegisterResponseDto(
                "Novi verifikacioni kod je generisan i važi 10 minuta. Kod je ispisan u logu za testiranje."
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

}