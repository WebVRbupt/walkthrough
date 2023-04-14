package org.panorama.walkthrough.controller;

import org.panorama.walkthrough.model.*;
import org.panorama.walkthrough.repositories.ProjectInfo;
import org.panorama.walkthrough.service.project.ProjectService;
import org.panorama.walkthrough.service.storage.StorageService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.InputStream;
import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectManager.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Controller
@RequestMapping("/project")
public class ProjectManager {

    ProjectService projectService;
    StorageService storageService;

    public ProjectManager(ProjectService projectService, StorageService storageService) {
        this.projectService = projectService;
        this.storageService = storageService;
    }

    @GetMapping("list")
    @ResponseBody
    public ResponseEntity getUserProjects(HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<ProjectInfo> res = projectService.getProjectIntroList(user.getUserId());
        if (null == res) {
            return ResponseUtil.error(ResponseEnum.ERROR_404);
        } else {
            return ResponseUtil.success(res, res.size());
        }
    }

    @PostMapping("add")
    @ResponseBody
    public ResponseEntity addProject(@RequestBody ProjectIntro projectIntro, HttpServletRequest request) {
        if (projectService.addProject(projectIntro, request)) {
            return ResponseUtil.success();
        } else {
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @GetMapping("delete")
    @ResponseBody
    public ResponseEntity deleteProject(@RequestParam("projectId") Long projectId) {
        if (projectService.deleteProject(projectId)) {
            return ResponseUtil.success();
        } else {
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @PostMapping("updateIntro")
    @ResponseBody
    public ResponseEntity updateProjectIntro(@RequestBody ProjectIntro projectIntro) {
        if (projectService.updateProjectIntro(projectIntro)) {
            return ResponseUtil.success();
        } else {
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @GetMapping("edit")
    public String edit(@RequestParam("projectId") Long projectId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        Project info = projectService.getProjectInfo(projectId);
        session.setAttribute("configurationFileId", info.getConfigFileId());
        System.out.println("edit:" + projectId + "-" + info.getConfigFileId());
        return "u-project-edit";
    }

    @GetMapping(value = "getEditSources/{userId}/{configFileId}/{sourceName}", produces = MediaType.ALL_VALUE)
    @ResponseBody
    public byte[] getEditSource(HttpServletRequest request, @PathVariable(name = "userId") Long userId,
                                @PathVariable(name = "configFileId") String configFileId,
                                @PathVariable(name = "sourceName") String sourceName) {
        String prefix = userId + "/" + configFileId + "/";
        byte[] bytes;
        try (InputStream inputStream = storageService.getSource(prefix, sourceName)) {
            bytes = new byte[inputStream.available()];
            inputStream.read(bytes, 0, inputStream.available());
            return bytes;
        } catch (Exception e) {
            return "404".getBytes();
        }
    }

    @GetMapping("tour")
    public String tour(@RequestParam("projectId") Long projectId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        Project info = projectService.getProjectInfo(projectId);
        session.setAttribute("configurationFileId", info.getConfigFileId());
        System.out.println("tour:" + projectId + "-" + info.getConfigFileId());
        return "u-project-tour";
    }
}
