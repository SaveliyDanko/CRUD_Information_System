package com.savadanko.service;

import com.savadanko.domain.*;
import com.savadanko.domain.dto.*;
import com.savadanko.domain.request.CreateLabWorkRequest;
import com.savadanko.domain.request.UpdateLabWorkRequest;
import com.savadanko.exceptions.NotFoundException;
import com.savadanko.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LabWorkService {

    private final LabWorkRepository labWorkRepo;
    private final CoordinatesRepository coordinatesRepo;
    private final PersonRepository personRepo;
    private final DisciplineRepository disciplineRepo;

    public LabWorkService(LabWorkRepository labWorkRepo,
                          CoordinatesRepository coordinatesRepo,
                          PersonRepository personRepo,
                          DisciplineRepository disciplineRepo) {
        this.labWorkRepo = labWorkRepo;
        this.coordinatesRepo = coordinatesRepo;
        this.personRepo = personRepo;
        this.disciplineRepo = disciplineRepo;
    }

    @Transactional(readOnly = true)
    public List<LabWorkDTO> findAll() {
        return labWorkRepo.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public LabWorkDTO findById(Long id) {
        LabWork lw = labWorkRepo.findById(id).orElseThrow(() -> new NotFoundException("LabWork not found"));
        return toDto(lw);
    }

    @Transactional(readOnly = true)
    public List<LabWorkFullDTO> findAllFull() {
        return labWorkRepo.findAll().stream().map(this::toFullDto).toList();
    }

    @Transactional(readOnly = true)
    public LabWorkFullDTO findFullById(Long id) {
        LabWork lw = labWorkRepo.findById(id).orElseThrow(() -> new NotFoundException("LabWork not found"));
        return toFullDto(lw);
    }

    @Transactional
    public LabWorkDTO create(CreateLabWorkRequest req) {
        Coordinates coordinates = coordinatesRepo.findById(req.coordinatesId())
                .orElseThrow(() -> new NotFoundException("Coordinates not found"));

        LabWork lw = new LabWork();
        lw.setName(req.name());
        lw.setCoordinates(coordinates);
        lw.setDescription(req.description());
        lw.setDifficulty(req.difficulty());
        lw.setMinimalPoint(req.minimalPoint());

        if (req.authorId() != null) {
            Person author = personRepo.findById(req.authorId())
                    .orElseThrow(() -> new NotFoundException("Author not found"));
            lw.setAuthor(author);
        }

        if (req.disciplineId() != null) {
            Discipline discipline = disciplineRepo.findById(req.disciplineId())
                    .orElseThrow(() -> new NotFoundException("Discipline not found"));
            lw.setDiscipline(discipline);
        }

        return toDto(labWorkRepo.save(lw));
    }

    @Transactional
    public LabWorkDTO update(Long id, UpdateLabWorkRequest req) {
        LabWork lw = labWorkRepo.findById(id).orElseThrow(() -> new NotFoundException("LabWork not found"));

        if (req.name() != null)         lw.setName(req.name());
        if (req.description() != null)  lw.setDescription(req.description());
        if (req.difficulty() != null)   lw.setDifficulty(req.difficulty());
        if (req.minimalPoint() != null) lw.setMinimalPoint(req.minimalPoint());

        if (req.coordinatesId() != null) {
            Coordinates coordinates = coordinatesRepo.findById(req.coordinatesId())
                    .orElseThrow(() -> new NotFoundException("Coordinates not found"));
            lw.setCoordinates(coordinates);
        }

        if (req.authorId() != null) {
            Person author = personRepo.findById(req.authorId())
                    .orElseThrow(() -> new NotFoundException("Author not found"));
            lw.setAuthor(author);
        }

        if (req.disciplineId() != null) {
            Discipline discipline = disciplineRepo.findById(req.disciplineId())
                    .orElseThrow(() -> new NotFoundException("Discipline not found"));
            lw.setDiscipline(discipline);
        }

        return toDto(lw);
    }

    @Transactional
    public void delete(Long id) {
        if (!labWorkRepo.existsById(id)) throw new NotFoundException("LabWork not found");
        labWorkRepo.deleteById(id);
    }

    @Transactional
    public DeleteResultDTO deleteAllByMinimalPoint(int minimalPoint) {
        int affected = labWorkRepo.deleteByMinimalPoint(minimalPoint);
        return new DeleteResultDTO(affected);
    }

    @Transactional(readOnly = true)
    public SumDTO sumMinimalPoint() {
        long sum = labWorkRepo.sumMinimalPoint();
        return new SumDTO(sum);
    }

    @Transactional(readOnly = true)
    public CountDTO countByAuthorIdGreaterThan(Long authorId) {
        long cnt = labWorkRepo.countByAuthorIdGreaterThan(authorId);
        return new CountDTO(cnt);
    }

    @Transactional
    public LabWorkDTO decreaseDifficulty(Long labWorkId, int steps) {
        if (steps < 1) throw new IllegalArgumentException("steps must be >= 1");
        LabWork lw = labWorkRepo.findById(labWorkId)
                .orElseThrow(() -> new NotFoundException("LabWork not found"));
        lw.setDifficulty(decreaseEnum(lw.getDifficulty(), steps));
        return toDto(lw);
    }

    private Difficulty decreaseEnum(Difficulty d, int steps) {
        java.util.List<Difficulty> order = java.util.List.of(
                Difficulty.VERY_EASY, Difficulty.EASY, Difficulty.INSANE, Difficulty.HOPELESS
        );
        int idx = order.indexOf(d);
        int newIdx = Math.max(0, idx - steps);
        return order.get(newIdx);
    }

    @Transactional
    public List<LabWorkDTO> assignTop10HardestToDiscipline(Long disciplineId) {
        Discipline disc = disciplineRepo.findById(disciplineId)
                .orElseThrow(() -> new NotFoundException("Discipline not found"));
        var top10 = labWorkRepo.findHardest(PageRequest.of(0, 10));
        top10.forEach(l -> l.setDiscipline(disc));
        return top10.stream().map(this::toDto).toList();
    }

    private LabWorkDTO toDto(LabWork lw) {
        Long coordinatesId = lw.getCoordinates() != null ? lw.getCoordinates().getId() : null;
        Long authorId = lw.getAuthor() != null ? lw.getAuthor().getId() : null;
        String authorName = lw.getAuthor() != null ? lw.getAuthor().getName() : null;
        Long disciplineId = lw.getDiscipline() != null ? lw.getDiscipline().getId() : null;
        String disciplineName = lw.getDiscipline() != null ? lw.getDiscipline().getName() : null;

        return new LabWorkDTO(
                lw.getId(),
                lw.getName(),
                lw.getDescription(),
                lw.getDifficulty(),
                lw.getMinimalPoint(),
                lw.getCreationDate(),
                coordinatesId,
                authorId,
                authorName,
                disciplineId,
                disciplineName
        );
    }

    private LabWorkFullDTO toFullDto(LabWork lw) {
        CoordinatesDTO coord = null;
        if (lw.getCoordinates() != null) {
            var c = lw.getCoordinates();
            coord = new CoordinatesDTO(c.getId(), c.getX(), c.getY());
        }

        DisciplineDTO disc = null;
        if (lw.getDiscipline() != null) {
            var d = lw.getDiscipline();
            disc = new DisciplineDTO(d.getId(), d.getName(), d.getPracticeHours(), d.getLabsCount());
        }

        PersonFullDTO author = null;
        if (lw.getAuthor() != null) {
            var p = lw.getAuthor();
            LocationDTO locDto = null;
            if (p.getLocation() != null) {
                var l = p.getLocation();
                locDto = new LocationDTO(l.getId(), l.getName(), l.getX(), l.getY());
            }
            author = new PersonFullDTO(
                    p.getId(),
                    p.getName(),
                    p.getEyeColor(),
                    p.getHairColor(),
                    p.getWeight(),
                    p.getNationality(),
                    locDto
            );
        }

        return new LabWorkFullDTO(
                lw.getId(),
                lw.getName(),
                lw.getDescription(),
                lw.getDifficulty(),
                lw.getMinimalPoint(),
                lw.getCreationDate(),
                coord,
                author,
                disc
        );
    }
}
