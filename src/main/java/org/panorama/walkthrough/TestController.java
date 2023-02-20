package org.panorama.walkthrough;

import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName TestController.java
 * @Description TODO
 * @createTime 2023/02/20
 */
@RestController
public class TestController {
    @Autowired
    UserRepository userRepository;
    @GetMapping("/")
    public String testCase(){
        User user = userRepository.findByUserId(1L);
        return user.getUserName();
    }
}
