package org.panorama.walkthrough.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.panorama.walkthrough.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    private final StorageService storageService;

    @Autowired
    public UploadResourcesController(StorageService service) {
        this.storageService = service;
    }

    @PostMapping("/uploadPic/{userId}/{projectId}/{picId}")
    String uploadPic(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("picId") String picId) {
        String fileName = file.getOriginalFilename();
        System.out.println(fileName);
        System.out.println("upload pic");
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId+"/";
        storageService.store(file, prefix, picId);

        return JSON.toJSONString(statusInfo);
    }

    @PostMapping("/uploadModel/{userId}/{projectId}/{modelId}")
    String uploadModel(@RequestParam("file") MultipartFile file, @PathVariable("userId") String userId, @PathVariable("projectId") String projectId, @PathVariable("modelId") String modelId){

        String fileName = file.getOriginalFilename();
        System.out.println(fileName);
        System.out.println("upload model");
        JSONObject statusInfo = new JSONObject();
        statusInfo.put("code", 0);
        statusInfo.put("msg", "upload success");
        String prefix = userId + "/" + projectId+"/";
        storageService.store(file, prefix, modelId);

        return JSON.toJSONString(statusInfo);

    }

    @PostMapping("/uploadConfigFile/{userId}/{projectId}")
    String uploadConfigFile(@RequestBody String configFile,@PathVariable("userId") String userId, @PathVariable("projectId") String projectId){
        System.out.println(configFile);
        String prefix = userId + "/" + projectId+"/";
        storageService.store(configFile,prefix);
        return "upload configFile success";
    }


}
