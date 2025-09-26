package com.savadanko.repository;

import com.savadanko.domain.LabWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LabWorkRepository extends JpaRepository<LabWork, Long> {
    boolean existsByCoordinatesId(Long coordinatesId);
    boolean existsByDisciplineId(Long disciplineId);
    boolean existsByAuthorId(Long authorId);

    @Modifying
    @Query("delete from LabWork l where l.minimalPoint = :mp")
    int deleteByMinimalPoint(@Param("mp") int minimalPoint);

    @Query("select coalesce(sum(l.minimalPoint), 0) from LabWork l")
    long sumMinimalPoint();

    @Query("select count(l) from LabWork l where l.author is not null and l.author.id > :authorId")
    long countByAuthorIdGreaterThan(@Param("authorId") Long authorId);

    @Query("""
       select l from LabWork l
       order by 
         case l.difficulty
           when com.savadanko.domain.Difficulty.HOPELESS then 4
           when com.savadanko.domain.Difficulty.INSANE   then 3
           when com.savadanko.domain.Difficulty.EASY     then 2
           when com.savadanko.domain.Difficulty.VERY_EASY then 1
         end desc,
         l.minimalPoint desc, l.id desc
       """)
    List<LabWork> findHardest(Pageable pageable);
}
