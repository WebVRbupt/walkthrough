package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.service.UserService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName UserManager.java
 * @Description TODO
 * @createTime 2023/02/27
 */
@Controller
@RequestMapping("/user")
@Slf4j
public class UserManager {
    @Autowired
    UserService userService;

    @PostMapping("signin")
    public ResponseEntity signin(@RequestBody User registrant) {
        if (userService.doSignin(registrant)) {
            return ResponseUtil.success();
        } else {
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @RequestMapping("login")
    public String login(User user, HttpServletRequest request) {
        user = userService.userCheck(user);
        if (null == user) {
            return "login";
        } else {
            HttpSession session=request.getSession();
            session.setAttribute("user",user);
            return "project-manage";
        }
    }

    @RequestMapping("/u-project-table")
    public String uProjectTable() {
        return "u-project-table";
    }
    @RequestMapping("/stitch-panorama")
    public String getStitchPage(){
        return "stitch-panorama";
    }
}
