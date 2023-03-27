package org.panorama.walkthrough.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.util.DigestUtils;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName EncryptUtil.java
 * @Description TODO
 * @createTime 2023/02/27
 */
public class EncryptUtil {
    private static final String INSERT_CHARS="!@#";

    public static class MD5Encry {
        public static String encry(String password) {
            return DigestUtils.md5DigestAsHex(password.getBytes());
        }

        public static String encryWithSalt(String password, String salt) {
            String passWithSalt = password + INSERT_CHARS + salt;
            return DigestUtils.md5DigestAsHex(passWithSalt.getBytes());
        }
    }

    public static String getSalt(int salt_number) {
        return RandomStringUtils.randomAlphanumeric(salt_number);
    }
}
