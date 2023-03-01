package org.panorama.walkthrough.repositories;

import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.model.ProjectIntro;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectRepository.java
 * @Description TODO
 * @createTime 2023/02/21
 */
public interface ProjectRepository extends CrudRepository<Project, Long> {
    List<ProjectInfo> findAllByUserId(Long userId);

    Project findByProjectId(Long projectId);

}
