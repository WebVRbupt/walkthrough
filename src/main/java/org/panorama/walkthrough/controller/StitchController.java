package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.service.algorithm.ImgStitchService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.panorama.walkthrough.util.WriteUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @Value("${customer.work-dir}")
    private String WORK_DIR;
    private static final String CONFIG_FILE = "image_list.txt";
    private ImgStitchService imgStitchService;

    @Autowired
    public StitchController(ImgStitchService imgStitchService) {
        this.imgStitchService = imgStitchService;
    }

    @GetMapping("page")
    public String page() {
        return "stitch-panorama";
    }

    @PostMapping("upload")
    @ResponseBody
    public ResponseEntity upload(@RequestPart("file") MultipartFile multipartFile, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        String fileName = multipartFile.getOriginalFilename();
        String stitchTempDir = WORK_DIR + "/tmp/" + user.getUserId() + "/stitch/";

        String filePath = stitchTempDir + fileName;
        session.setAttribute("stitchTempDir", stitchTempDir);
        try {
            Files.createDirectories(Paths.get(stitchTempDir));
            Path path = Paths.get(filePath);
            Files.copy(multipartFile.getInputStream(), path);
            WriteUtil.write2end(stitchTempDir + CONFIG_FILE, fileName + " " + "830\r");
            return ResponseUtil.success();
        } catch (Exception ex) {
            log.error("failed", ex);
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @GetMapping(value = "getPanorama",produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public byte[] stitch(HttpServletRequest request) throws IOException {
        HttpSession session = request.getSession();
//        String stitchTempDir = WORK_DIR + "/tmp/1/stitch";
        String stitchTempDir = (String) session.getAttribute("stitchTempDir");
        byte[] bytes = null;
        if (imgStitchService.stitch(stitchTempDir)) {
            File file = new File(stitchTempDir + "/cropped.jpg");
            FileInputStream inputStream = new FileInputStream(file);
            bytes = new byte[inputStream.available()];
            inputStream.read(bytes, 0, inputStream.available());
        }
        return bytes;
    }
}
