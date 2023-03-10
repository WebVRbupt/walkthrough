package org.panorama.walkthrough.controller;

import org.panorama.walkthrough.model.ProjectIntro;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.repositories.ProjectInfo;
import org.panorama.walkthrough.service.ProjectService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectManager.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@RestController
@RequestMapping("/project")
public class ProjectManager {
    @Autowired
    ProjectService projectService;

    @GetMapping("list")
    public ResponseEntity getUserProjects(@RequestParam("userId") Long userId) {
        List<ProjectInfo> res = projectService.getProjectIntroList(userId);
        if (null == res){
            return ResponseUtil.error(ResponseEnum.ERROR_404);
        }else{
            return ResponseUtil.success(res,res.size());
        }
    }

    @PostMapping("add")
    public ResponseEntity addProject(@RequestBody ProjectIntro projectIntro, HttpServletRequest request){
        if(projectService.addProject(projectIntro,request)){
            return ResponseUtil.success();
        }else{
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }
    @GetMapping("delete")
    public ResponseEntity deleteProject(@RequestParam("projectId") Long projectId){
        if(projectService.deleteByProjectId(projectId)){
            return ResponseUtil.success();
        }else{
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }
    @PostMapping("updateIntro")
    public ResponseEntity updateProjectIntro(@RequestBody ProjectIntro projectIntro){
        if(projectService.updateProjectIntro(projectIntro)){
            return ResponseUtil.success();
        }else{
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }
}
