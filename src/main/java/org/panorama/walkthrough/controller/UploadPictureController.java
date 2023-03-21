package org.panorama.walkthrough.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    String uploadPic(@RequestBody Map data){
        return "upload pic";
    }
}
