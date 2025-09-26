package com.savadanko.service;

import com.savadanko.domain.Coordinates;
import com.savadanko.domain.dto.CoordinatesDTO;
import com.savadanko.domain.request.CreateCoordinatesRequest;
import com.savadanko.domain.request.UpdateCoordinatesRequest;
import com.savadanko.exceptions.ConflictException;
import com.savadanko.exceptions.NotFoundException;
import com.savadanko.repository.CoordinatesRepository;
import com.savadanko.repository.LabWorkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CoordinatesService {

    private final CoordinatesRepository repo;
    private final LabWorkRepository labWorkRepo;

    public CoordinatesService(CoordinatesRepository repo, LabWorkRepository labWorkRepo) {
        this.repo = repo;
        this.labWorkRepo = labWorkRepo;
    }

    @Transactional(readOnly = true)
    public List<CoordinatesDTO> findAll() {
        return repo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CoordinatesDTO findById(Long id) {
        Coordinates c = repo.findById(id)
                .orElseThrow(() -> new com.savadanko.exceptions.NotFoundException("Coordinates not found"));
        return toDto(c);
    }

    @Transactional
    public CoordinatesDTO create(CreateCoordinatesRequest req) {
        Coordinates c = new Coordinates();
        c.setX(req.x());
        c.setY(req.y());
        return toDto(repo.save(c));
    }

    @Transactional
    public CoordinatesDTO update(Long id, UpdateCoordinatesRequest req) {
        Coordinates c = repo.findById(id)
                .orElseThrow(() -> new com.savadanko.exceptions.NotFoundException("Coordinates not found"));

        if (req.x() != null) c.setX(req.x());
        if (req.y() != null) c.setY(req.y());

        return toDto(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Coordinates not found");
        if (labWorkRepo.existsByCoordinatesId(id)) {
            throw new ConflictException("Coordinates are used by LabWork(s). Delete related LabWorks first.");
        }
        repo.deleteById(id);
    }

    private CoordinatesDTO toDto(Coordinates c) {
        return new CoordinatesDTO(c.getId(), c.getX(), c.getY());
    }
}

