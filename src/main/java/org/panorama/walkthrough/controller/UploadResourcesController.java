package org.panorama.walkthrough.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.function.impl.ToLong;
import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.repositories.ProjectRepository;
import org.panorama.walkthrough.service.project.ProjectService;
import org.panorama.walkthrough.service.storage.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.Map;


/**
 * @author WangZx
 * @version 1.0
 * @className UploadResourcesController
 * @date 2023/3/1
 * @createTime 16:45
 */
@RestController
public class UploadResourcesController {

    private static final Logger log = LoggerFactory.getLogger(UploadResourcesController.class);

    @Autowired
    ProjectService projectService;

    ProjectRepository projectRepository;

    private final StorageService storageService;

    @Autowired
    public UploadResourcesController(StorageService service, ProjectRepository projectRepository) {
        this.storageService = service;
        this.projectRepository = projectRepository;
    }

    @PostMapping("/uploadPic/{userId}/{projectId}/{picId}")
    String uploadPic(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("picId") String picId) {
        String fileName = file.getOriginalFilename();
        log.info("Resources Upload:[Type-Picture] " + fileName);
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId + "/";
        storageService.store(file, prefix, picId);

        return JSON.toJSONString(statusInfo);
    }

    @PostMapping("/uploadModel/{userId}/{projectId}/{modelId}")
    String uploadModel(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("modelId") String modelId) {

        String fileName = file.getOriginalFilename();
        log.info("Resources Upload:[Type-Space Model] " + fileName);
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId + "/";
        storageService.store(file, prefix, modelId);

        return JSON.toJSONString(statusInfo);

    }

    // 生成配置文件，h2数据库项目表插入新项目并保存相关信息
    @PostMapping("/uploadConfigFile/{userId}/{projectId}")
    String uploadConfigFile(@RequestBody String configFile, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId) {

        log.info("Resources Upload:[Type-Project Configuration File Create] ID:" + projectId);
        JSONObject projectConfig = JSON.parseObject(configFile);
        JSONObject metaInfo = projectConfig.getJSONObject("metadata");

        String prefix = userId + "/" + projectId + "/";

        //projectService.addProject();
        Project project = new Project();

        project.setProjectName(metaInfo.getString("name"));
        project.setUserId(metaInfo.getLong("userId"));
        project.setConfigFileId(metaInfo.getString("id"));
        project.setProjectPath(metaInfo.getString("path"));
        project.setProfile(metaInfo.getString("description"));
        project.setStatus(0);
        project.setCreationTime(new Date(System.currentTimeMillis()));
        try {
            project = projectRepository.save(project);
            Long dbProjectId = project.getProjectId();

            int endPos = configFile.indexOf("projectId");
            StringBuffer strBuffer = new StringBuffer();
            strBuffer.append(configFile.substring(0, endPos + 11));
            strBuffer.append(dbProjectId);
            strBuffer.append(configFile.substring(endPos + 13));

            storageService.store(strBuffer.toString(), prefix);
        } catch (Exception ex) {

            System.out.println(ex.getMessage());

        }
        return "upload configFile success";
    }

    @PostMapping("/updateConfigFile/{userId}/{projectId}")
    String updateConfigFile(@RequestBody String configFile, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId) {
        log.info("Resources Upload:[Type-Project Configuration File Update] ID:" + projectId);
        String prefix = userId + "/" + projectId + "/";
        String path = prefix + "projectConfig.json";
        storageService.delete(path);

        try {
            storageService.store(configFile, prefix);
        } catch (Exception ex) {

            System.out.println(ex.getMessage());

        }
        return "update configFile success";
    }


}