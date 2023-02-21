package org.panorama.walkthrough.repositories;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.panorama.walkthrough.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.logging.LogLevel;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectRepositoryTest.java
 * @Description TODO
 * @createTime 2023/02/21
 */
@DataJpaTest
@Log4j2
class ProjectRepositoryTest {

    @Autowired
    ProjectRepository projectRepository;
    @BeforeEach
    void setUp() {
        projectRepository.save(new Project("p1","/p1",3));
        projectRepository.save(new Project("p2","/p2",3));
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void findAllByUserId() {
        List<Project> list=projectRepository.findAllByUserId(3);
        for(Project project:list){
           log.info(project);
        }
    }

    @Test
    void findByProjectID() {
    }
}