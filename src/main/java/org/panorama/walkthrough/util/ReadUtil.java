package org.panorama.walkthrough.util;

import java.io.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ReadUtil.java
 * @Description TODO
 * @createTime 2023/02/16
 */
public class ReadUtil {
    public static String readLocalFile2String(String path) {
        String res;
        System.out.println(path);
        try {
            File file = new File(path);
            FileReader fileReader = new FileReader(file);

            Reader reader = new InputStreamReader(new FileInputStream(file), "utf-8");
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }

            fileReader.close();
            reader.close();
            res = sb.toString();
            return res;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}


