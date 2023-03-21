package org.panorama.walkthrough.controller;

import org.panorama.walkthrough.model.ProjectIntro;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.repositories.ProjectInfo;
import org.panorama.walkthrough.service.project.ProjectService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
    @Autowired
    ProjectService projectService;

    @GetMapping("list")
    @ResponseBody
    public ResponseEntity getUserProjects(HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user= (User) session.getAttribute("user");
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
    public String edit(@RequestParam("projectId")Long projectId){
       return "newSceneEdit";
    }
}
