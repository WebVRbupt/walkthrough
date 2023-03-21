package org.panorama.walkthrough.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/uploadPic")
    String uploadPic(@RequestParam("file")MultipartFile file){
        String fileName = file.getOriginalFilename();
        System.out.println(fileName);
        System.out.printf("upload pic");
        JSONObject statusInfo =new JSONObject();
        statusInfo.put("code",0);
        statusInfo.put("msg","upload success");


        return JSON.toJSONString(statusInfo);
    }
}
