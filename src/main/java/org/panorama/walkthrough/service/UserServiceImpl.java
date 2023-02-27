package org.panorama.walkthrough.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.repositories.UserRepository;
import org.panorama.walkthrough.util.EncryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName UserServiceImpl.java
 * @Description TODO
 * @createTime 2023/02/27
 */
@Slf4j
@Service(value = "UserService")
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Boolean doSignin(User registrant) {
        try {
            String salt=EncryptUtil.getSalt(6);
            String passWithEntry=EncryptUtil.MD5Encry.encryWithSalt(registrant.getPassword(),salt);
            registrant.setSalt(salt);
            registrant.setPassword(passWithEntry);
            userRepository.save(registrant);
        } catch (Exception ex) {
            log.info("用户" + registrant.getUserName(), ex);
            return false;
        }
        return true;
    }

    @Override
    public Boolean userCheck(User man) {
        if (null == man || null == man.getUserName()) {
            return false;
        }
        try {
            User user = userRepository.findUserByUserName(man.getUserName());
            if (null == user) {
                return false;
            }
            if (StringUtils.equals(EncryptUtil.MD5Encry
                    .encryWithSalt(man.getPassword(), user.getSalt()), user.getPassword())) {
                return true;
            }else{
                return false;
            }
        } catch (Exception ex) {
            log.info("userCheck failed...", ex);
            return false;
        }
    }
    @Override
    public Boolean dologout(User user) {
        return null;
    }

    @Override
    public User findUserByName(String userName){
        return userRepository.findUserByUserName(userName);
    }
}
