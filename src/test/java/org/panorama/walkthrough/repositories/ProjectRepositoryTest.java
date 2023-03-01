package org.panorama.walkthrough.repositories;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.model.ProjectIntro;
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
        Project project=new Project();
        project.setProjectName("123");
        project.setProfile("vr");
        project.setUserId(1L);
        projectRepository.save(project);
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void findAllByUserId() {
        List<ProjectInfo> list = projectRepository.findAllByUserId(1L);
        ProjectInfo projectInfo=list.get(0);
        log.info(projectInfo.getProjectId()+" "+projectInfo.getProjectName());
    }

    @Test
    void findByProjectID() {
    }
}