package org.panorama.walkthrough.service;

import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.model.ProjectIntro;
import org.panorama.walkthrough.repositories.ProjectInfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectService.java
 * @Description TODO
 * @createTime 2023/03/01
 */
public interface ProjectService {
    List<ProjectInfo> getProjectIntroList(Long userId);
    Boolean deleteByProjectId(Long projectId);
    Boolean updateProject(Project project);
    Boolean addProject(ProjectIntro projectIntro, HttpServletRequest httpRequest);
    Boolean updateProjectIntro(ProjectIntro projectIntro);
}
