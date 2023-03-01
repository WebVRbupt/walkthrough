package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName StitchController.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@RequestMapping("/stitch")
@Slf4j
@Controller
public class StitchController {

    @GetMapping("page")
    public String page(){
        return "uploadtest";
    }
    @PostMapping("upload")
    @ResponseBody
    public String upload(@RequestPart MultipartFile multipartFile, HttpServletRequest request) {
//        log.info(multipartFile.getOriginalFilename());
        return "success";
    }
}
