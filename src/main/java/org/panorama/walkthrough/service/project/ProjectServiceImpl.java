package org.panorama.walkthrough.service.project;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.model.ProjectIntro;
import org.panorama.walkthrough.repositories.ProjectInfo;
import org.panorama.walkthrough.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectServiceImpl.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Slf4j
@Service("ProjectService")
public final class ProjectServiceImpl implements ProjectService {
    private ProjectRepository projectRepository;
    @Value("#{'${customer.work-dir}' ?: systemProperties['user.dir']}")
    private String PROJECTS_PATH;
    @Value("#{systemProperties['file.separator']}")
    private String FILE_SEPARATOR;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * @title getProjectIntroList
     * @description 获取用户项目列表
     */
    @Override
    public List<ProjectInfo> getProjectIntroList(Long userId) {
        try {
            return projectRepository.findAllByUserId(userId);
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * @title deleteProject
     * @description 删除项目
     */
    @Override
    public Boolean deleteProject(Long projectId) {
        try {
            projectRepository.deleteById(projectId);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * @title updateProject
     * @description 更新项目
     */

    @Override
    public Boolean updateProject(Project project) {
        try {
            if (projectRepository.existsById(project.getProjectId())) {
                projectRepository.save(project);
                return true;
            } else {
                throw new NullPointerException("project-" + project.getProjectId() + " dont exist");
            }
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * @title addProject
     * @description 新建项目
     */
    @Override
    public Boolean addProject(ProjectIntro projectIntro, HttpServletRequest httpRequest) {
        try {
            this.initProject(projectIntro, httpRequest);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * @title updateProjectIntro
     * @description 更新项目介绍
     */
    public Boolean updateProjectIntro(ProjectIntro projectIntro) {
        try {
            Project project = projectRepository.findByProjectId(projectIntro.getProjectId());
            project.setProjectName(projectIntro.getProjectName());
            project.setProfile(projectIntro.getProfile());
            this.updateProject(project);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * @title initProject
     * @description 1.数据库存储project 2.session保存项目路径
     */

    public Boolean initProject(ProjectIntro projectIntro, HttpServletRequest request) {
        HttpSession session = request.getSession();
        //模拟，测试
        session.setAttribute("userId", 1L);
        Project project = new Project();
        project.setProjectName(projectIntro.getProjectName());
        project.setProfile(projectIntro.getProfile());
        project.setUserId((Long) session.getAttribute("userId"));
        project.setCreationTime(new Date(System.currentTimeMillis()));
        //1. 将项目信息保存
        try {
            project = projectRepository.save(project);
            Long projectId = project.getProjectId();
            Path projectWorkDir = Paths.get(PROJECTS_PATH + FILE_SEPARATOR + "tmp" + FILE_SEPARATOR + projectId);
            projectWorkDir = Files.createDirectories(projectWorkDir);
            session.setAttribute("new_project_path", projectWorkDir);
        } catch (Exception ex) {
            return false;
        }
        return true;
    }
}
