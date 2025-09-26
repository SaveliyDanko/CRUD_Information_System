package com.savadanko.service;

import com.savadanko.domain.Location;
import com.savadanko.domain.Person;
import com.savadanko.domain.dto.LocationDTO;
import com.savadanko.domain.dto.PersonDTO;
import com.savadanko.domain.dto.PersonFullDTO;
import com.savadanko.domain.requests.CreatePersonRequest;
import com.savadanko.domain.requests.UpdatePersonRequest;
import com.savadanko.repository.LabWorkRepository;
import com.savadanko.repository.LocationRepository;
import com.savadanko.repository.PersonRepository;
import com.savadanko.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonService {

    private final PersonRepository perRepo;
    private final LocationRepository locRepo;
    private final LabWorkRepository labWorkRepo;

    public PersonService(PersonRepository perRepo, LocationRepository locRepo, LabWorkRepository labWorkRepo) {
        this.perRepo = perRepo;
        this.locRepo = locRepo;
        this.labWorkRepo = labWorkRepo;
    }

    @Transactional(readOnly = true)
    public List<PersonDTO> findAll() {
        return perRepo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PersonDTO findById(Long id) {
        Person p = perRepo.findById(id).orElseThrow(() -> new NotFoundException("Person not found"));
        return toDto(p);
    }

    @Transactional(readOnly = true)
    public List<PersonFullDTO> findAllFull() {
        return perRepo.findAll().stream()
                .map(this::toFullDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PersonFullDTO findFullById(Long id) {
        Person p = perRepo.findById(id).orElseThrow(() -> new NotFoundException("Person not found"));
        return toFullDto(p);
    }

    @Transactional
    public PersonDTO create(CreatePersonRequest req) {
        Person p = new Person();
        p.setName(req.name());
        p.setEyeColor(req.eyeColor());
        p.setHairColor(req.hairColor());
        p.setWeight(req.weight());
        p.setNationality(req.nationality());

        if (req.locationId() != null) {
            Location loc = locRepo.findById(req.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found"));
            p.setLocation(loc);
        }

        return toDto(perRepo.save(p));
    }

    @Transactional
    public PersonDTO update(Long id, UpdatePersonRequest req) {
        Person p = perRepo.findById(id).orElseThrow(() -> new NotFoundException("Person not found"));

        if (req.name() != null)        p.setName(req.name());
        if (req.eyeColor() != null)    p.setEyeColor(req.eyeColor());
        if (req.hairColor() != null)   p.setHairColor(req.hairColor());
        if (req.weight() != null)      p.setWeight(req.weight());
        if (req.nationality() != null) p.setNationality(req.nationality());
        if (req.locationId() != null) {
            Location loc = locRepo.findById(req.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found"));
            p.setLocation(loc);
        }

        return toDto(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!perRepo.existsById(id)) throw new NotFoundException("Person not found");
        if (labWorkRepo.existsByAuthorId(id)) {
            throw new ConflictException("Person is used as LabWork author. Delete related LabWorks first.");
        }
        perRepo.deleteById(id);
    }

    private PersonDTO toDto(Person p) {
        Long locId = null;
        String locName = null;
        Location loc = p.getLocation();
        if (loc != null) {
            locId = loc.getId();
            locName = loc.getName();
        }
        return new PersonDTO(
                p.getId(),
                p.getName(),
                p.getEyeColor(),
                p.getHairColor(),
                p.getWeight(),
                p.getNationality(),
                locId,
                locName
        );
    }

    private PersonFullDTO toFullDto(Person p) {
        LocationDTO lDto = null;
        Location loc = p.getLocation();
        if (loc != null) {
            lDto = new LocationDTO(loc.getId(), loc.getName(), loc.getX(), loc.getY());
        }
        return new PersonFullDTO(
                p.getId(),
                p.getName(),
                p.getEyeColor(),
                p.getHairColor(),
                p.getWeight(),
                p.getNationality(),
                lDto
        );
    }
}

