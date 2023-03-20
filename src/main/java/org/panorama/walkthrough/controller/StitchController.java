package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.util.ResponseUtil;
import org.panorama.walkthrough.util.StitchUtil;
import org.panorama.walkthrough.util.WriteUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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

    @GetMapping("page")
    public String page() {
        return "stitch-panorama";
    }

    @PostMapping("upload")
    @ResponseBody
    public ResponseEntity upload(@RequestPart("file") MultipartFile multipartFile, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String fileName = multipartFile.getOriginalFilename();
        String stitchTempDir = WORK_DIR + "/tmp/1/stitch/";
        String filePath = stitchTempDir + fileName;
        session.setAttribute("stitchTempDir", stitchTempDir);
        try {
            Files.createDirectories(Paths.get(stitchTempDir));
            Path path = Paths.get(filePath);
            Files.copy(multipartFile.getInputStream(), path);
            WriteUtil.write2end(stitchTempDir+CONFIG_FILE,fileName+" "+"830\r");
            return ResponseUtil.success();
        } catch (Exception ex) {
            log.error("failed", ex);
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @GetMapping(value = "getPanorama")
    @ResponseBody
    public void doStitch(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        String stitchTempDir = WORK_DIR + "/tmp/1/stitch/";
        if (StitchUtil.doStitch(request)) {
            log.info("getPanorama");
        } else {

        }
    }
}
