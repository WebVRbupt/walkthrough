package org.panorama.walkthrough.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
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
import java.util.HashMap;
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

    /**
     * 前端创建项目页面 '添加场景' 调用的接口,将前端传入的全景图存储为文件,存储路径:项目工作路径/userData/projectResources/{userId}/{projectId}/{picId}
     *
     * @param file      转换为 'cubeMap' 的场景全景图贴图
     * @param userId
     * @param projectId
     * @param picId
     * @return statusInfo
     */
    @PostMapping("/uploadPic/{userId}/{projectId}/{picId}")
    String uploadPic(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("picId") String picId) {
        String fileName = file.getOriginalFilename();
        log.info("Resources\t[Upload]\tPicture:" + fileName);
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId + "/";
        storageService.store(file, prefix, picId);

        return JSON.toJSONString(statusInfo);
    }

    /**
     * 前端可视化编辑页面 ‘添加场景’ 功能调用的接口,存储全景图文件并更新服务器上的项目配置文件.
     *
     * @param file      转换为 'cubeMap' 的场景全景图贴图
     * @param sceneName 添加的场景名称
     * @param userId    用户id
     * @param projectId 项目的存储id\configurationId
     * @param picId     添加的贴图id
     * @param skyboxId  添加的天空盒id
     * @return statusInfo   {code|返回给前端的状态码,msg|返回给前端的信息,sceneName,skyboxId,tetureUrl}
     */
    @PostMapping("/addSkybox/{userId}/{projectId}/{picId}/{skyboxId}")
    String addSkybox(@RequestParam("file") MultipartFile file, @RequestParam("sceneName") String sceneName,
                     @PathVariable("userId") String userId, @PathVariable("projectId") String projectId,
                     @PathVariable("picId") String picId, @PathVariable("skyboxId") String skyboxId) {

        log.info("Request\t[Post]/addSkybox\tpath:/" + userId + "/" + projectId + "/" + picId + "/" + skyboxId);
        JSONObject statusInfo = new JSONObject();

        String configurationFilePath = userId + "/" + projectId + "/" + "projectConfig.json";
        byte[] configurationFile = storageService.readJsonFile(configurationFilePath);
        if (configurationFile.length == 0) {
            statusInfo.put("code", 1);
            statusInfo.put("msg", "add skybox failed");
        } else {
            String fileName = file.getOriginalFilename();
            String prefix = userId + "/" + projectId + "/";
            String suffix = fileName.substring(fileName.lastIndexOf('.'));
            String path = prefix + "projectConfig.json";
            statusInfo.put("code", 0);
            statusInfo.put("msg", "add skybox success");
            statusInfo.put("sceneName", sceneName);
            statusInfo.put("skyboxId", skyboxId);
            statusInfo.put("textureUrl", "/project/getEditSources/" + userId + "/" + projectId + "/" + picId + suffix);
            JSONObject configData = JSON.parseObject(configurationFile);
            JSONObject sceneData = configData.getJSONObject("scene");
            JSONArray skyboxData = sceneData.getJSONArray("skybox");
            JSONArray texturesData = configData.getJSONArray("textures");

            int offset = skyboxData.size();

            JSONObject newSkybox = skyboxData.addObject();
            JSONObject newTexture = texturesData.addObject();


            newTexture.put("id", picId);
            newTexture.put("name", sceneName);
            newTexture.put("type", "skybox");
            newTexture.put("url", "/project/getEditSources/" + userId + "/" + projectId + "/" + picId + suffix);

            newSkybox.put("name", sceneName);
            newSkybox.put("id", skyboxId);
            newSkybox.put("texture", new String[]{picId});

            JSONObject positionData = newSkybox.putObject("position");
            positionData.put("x", 0);
            positionData.put("y", 0);
            positionData.put("z", offset);

            JSONObject geometryScaleData = newSkybox.putObject("geometryScale");
            geometryScaleData.put("x", 1);
            geometryScaleData.put("y", 1);
            geometryScaleData.put("z", -1);

            JSONObject scaleData = newSkybox.putObject("scale");
            scaleData.put("x", 1);
            scaleData.put("y", 1);
            scaleData.put("z", 1);

            JSONObject rotationData = newSkybox.putObject("rotation");
            rotationData.put("x", 0);
            rotationData.put("y", 0);
            rotationData.put("z", 0);
            storageService.delete(path);
            try {
                storageService.store(file, prefix, picId);
                storageService.store(configData.toJSONString(), prefix);
            } catch (Exception ex) {

                System.out.println(ex.getMessage());

            }

        }

        return JSON.toJSONString(statusInfo);
    }

    /**
     * 前端可视化编辑页面 ‘添加热点’ 功能调用的接口,存储热点贴图文件并更新服务器上的项目配置文件.
     *
     * @param file      热点贴图文件
     * @param naviName  热点名称
     * @param userId    项目所属用户id
     * @param projectId 项目的配置文件id
     * @param picId     热点贴图id
     * @param naviId    热点id
     * @param skyboxId  热点绑定的场景天空盒id
     * @return statusInfo   {code|返回给前端的状态码,msg|返回给前端的信息,naviName,naviId,textureUrl,map}
     */
    @PostMapping("/addNavi/{userId}/{projectId}/{picId}/{naviId}/{skyboxId}")
    String addNavi(@RequestParam("file") MultipartFile file, @RequestParam("naviName") String naviName,
                   @PathVariable("userId") String userId, @PathVariable("projectId") String projectId,
                   @PathVariable("picId") String picId, @PathVariable("naviId") String naviId, @PathVariable("skyboxId") String skyboxId) {

        log.info("Request\t[Post]/addNavi\tpath:/" + userId + "/" + projectId + "/" + picId + "/" + naviId);
        JSONObject statusInfo = new JSONObject();

        String configurationFilePath = userId + "/" + projectId + "/" + "projectConfig.json";
        byte[] configurationFile = storageService.readJsonFile(configurationFilePath);
        if (configurationFile.length == 0) {
            statusInfo.put("code", 1);
            statusInfo.put("msg", "add navi failed");
        } else {
            String fileName = file.getOriginalFilename();
            String prefix = userId + "/" + projectId + "/";
            String suffix = fileName.substring(fileName.lastIndexOf('.'));
            String path = prefix + "projectConfig.json";
            statusInfo.put("code", 0);
            statusInfo.put("msg", "add navi success");
            statusInfo.put("naviName", naviName);
            statusInfo.put("naviId", naviId);
            statusInfo.put("textureUrl", "/project/getEditSources/" + userId + "/" + projectId + "/" + picId + suffix);
            statusInfo.put("map", skyboxId);
            JSONObject configData = JSON.parseObject(configurationFile);
            JSONObject sceneData = configData.getJSONObject("scene");
            JSONArray skyboxData = sceneData.getJSONArray("skybox");
            JSONArray naviData = sceneData.getJSONArray("navi");
            JSONArray texturesData = configData.getJSONArray("textures");
            Map<String, JSONObject> skyboxMap = new HashMap<>();
            for (int i = 0; i < skyboxData.size(); ++i) {
                skyboxMap.put(skyboxData.getJSONObject(i).getString("id"), skyboxData.getJSONObject(i));
            }


            JSONObject newNavi = naviData.addObject();
            JSONObject newTexture = texturesData.addObject();


            newTexture.put("id", picId);
            newTexture.put("name", naviName);
            newTexture.put("type", "navi");
            newTexture.put("url", "/project/getEditSources/" + userId + "/" + projectId + "/" + picId + suffix);

            newNavi.put("name", naviName);
            newNavi.put("id", naviId);
            newNavi.put("texture", picId);
            newNavi.put("map", skyboxId);

            JSONObject positionData = newNavi.putObject("position");
            JSONObject naviMapSkybox = skyboxMap.get(skyboxId);
            positionData.put("x", naviMapSkybox.getJSONObject("position").getIntValue("x"));
            positionData.put("y", naviMapSkybox.getJSONObject("position").getIntValue("y") - naviMapSkybox.getJSONObject("scale").getIntValue("y") / 2);
            positionData.put("z", naviMapSkybox.getJSONObject("position").getIntValue("z"));

            JSONObject geometryScaleData = newNavi.putObject("geometryScale");
            geometryScaleData.put("x", -1);
            geometryScaleData.put("y", 1);
            geometryScaleData.put("z", 1);

            JSONObject scaleData = newNavi.putObject("scale");
            scaleData.put("x", 1);
            scaleData.put("y", 1);
            scaleData.put("z", 1);

            JSONObject rotationData = newNavi.putObject("rotation");
            rotationData.put("x", 1.5707963267948966);
            rotationData.put("y", 0);
            rotationData.put("z", 0);
            storageService.delete(path);
            try {
                storageService.store(file, prefix, picId);
                storageService.store(configData.toJSONString(), prefix);
            } catch (Exception ex) {

                System.out.println(ex.getMessage());

            }

        }
        return JSON.toJSONString(statusInfo);

    }

    /**
     * 前端创建项目页面上传空间模型调用的接口,将模型文件按id存储为文件.
     *
     * @param file      空间模型文件
     * @param userId
     * @param projectId
     * @param modelId
     * @return statusInfo
     */
    @PostMapping("/uploadModel/{userId}/{projectId}/{modelId}")
    String uploadModel(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("modelId") String modelId) {

        String fileName = file.getOriginalFilename();
        log.info("Resources\t[Upload]\tSpaceModel:" + fileName);
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId + "/";
        storageService.store(file, prefix, modelId);

        return JSON.toJSONString(statusInfo);

    }

    /**
     * 前端创建项目页面,创建项目调用的接口,将前端传入的json字符串生成配置文件并存储为文件,h2数据库项目表插入新项目并保存相关信息.
     *
     * @param configFile
     * @param userId
     * @param projectId
     * @return statusInfo
     */
    @PostMapping("/uploadConfigFile/{userId}/{projectId}")
    String uploadConfigFile(@RequestBody String configFile, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId) {

        String prefix = userId + "/" + projectId + "/";
        log.info("Request\t[Post]/uploadConfigFile\tuserId:" + userId + " projectId:" + projectId);
        log.info("Resources\t[Upload]\t[Project Configuration File Create]\tID:" + projectId);
        JSONObject projectConfig = JSON.parseObject(configFile);
        JSONObject metaInfo = projectConfig.getJSONObject("metadata");


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
            log.info("Project\t[ADD]    ProjectId:" + dbProjectId + " userId:" + project.getUserId());
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

    /**
     * 前端可视化编辑页面 ‘保存全景漫游’ 功能调用的接口,使用前端传入的json字符串覆盖服务器对应的项目配置文件.
     *
     * @param configFile
     * @param userId
     * @param projectId
     * @return statusInfo
     */
    @PostMapping("/updateConfigFile/{userId}/{projectId}")
    String updateConfigFile(@RequestBody String configFile, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId) {
        log.info("Resources\t[Upload]\t[Project Configuration File Update]\tProjectId:" + projectId);
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