package org.panorama.walkthrough.service;

import org.panorama.walkthrough.model.User;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName userService.java
 * @Description TODO
 * @createTime 2023/02/27
 */
public interface UserService {
    Boolean doSignin(User registrant);
    User userCheck(User user);
    Boolean dologout(User user);
    User findUserByName(String userName);
}
