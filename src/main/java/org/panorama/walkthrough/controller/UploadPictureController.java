package org.panorama.walkthrough.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.panorama.walkthrough.model.Project;
import org.panorama.walkthrough.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * @author WangZx
 * @version 1.0
 * @className UploadPictureController
 * @date 2023/3/1
 * @createTime 16:45
 */
@RestController
public class UploadPictureController {

    private final StorageService storageService;

    @Autowired
    public UploadPictureController(StorageService service) {
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
}
