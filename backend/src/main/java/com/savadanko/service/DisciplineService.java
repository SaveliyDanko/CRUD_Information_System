package com.savadanko.service;

import com.savadanko.domain.Discipline;
import com.savadanko.domain.request.CreateDisciplineRequest;
import com.savadanko.domain.dto.DisciplineDTO;
import com.savadanko.domain.request.UpdateDisciplineRequest;
import com.savadanko.exceptions.ConflictException;
import com.savadanko.repository.DisciplineRepository;
import com.savadanko.exceptions.NotFoundException;
import com.savadanko.repository.LabWorkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DisciplineService {

    private final DisciplineRepository repo;
    private final LabWorkRepository labWorkRepo;

    public DisciplineService(DisciplineRepository repo, LabWorkRepository labWorkRepo) {
        this.repo = repo;
        this.labWorkRepo = labWorkRepo;
    }

    @Transactional(readOnly = true)
    public List<DisciplineDTO> findAll() {
        return repo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public DisciplineDTO findById(Long id) {
        Discipline d = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Discipline not found"));
        return toDto(d);
    }

    @Transactional
    public DisciplineDTO create(CreateDisciplineRequest req) {
        Discipline d = new Discipline();
        d.setName(req.name());
        d.setPracticeHours(req.practiceHours());
        d.setLabsCount(req.labsCount());
        Discipline saved = repo.save(d);
        return toDto(saved);
    }

    @Transactional
    public DisciplineDTO update(Long id, UpdateDisciplineRequest req) {
        Discipline d = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Discipline not found"));
        if (req.name() != null) d.setName(req.name());
        if (req.practiceHours() != null) d.setPracticeHours(req.practiceHours());
        if (req.labsCount() != null) d.setLabsCount(req.labsCount());
        return toDto(d);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Discipline not found");
        if (labWorkRepo.existsByDisciplineId(id)) {
            throw new ConflictException("Discipline is used by LabWork(s). Delete related LabWorks first.");
        }
        repo.deleteById(id);
    }

    private DisciplineDTO toDto(Discipline d) {
        return new DisciplineDTO(
                d.getId(),
                d.getName(),
                d.getPracticeHours(),
                d.getLabsCount()
        );
    }
}

