package org.panorama.walkthrough.util;

import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName StitchUtil.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Slf4j
public class StitchUtil {
    public static Boolean doStitch(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String stitchTempDir = (String) session.getAttribute("stitchTempDir");
        try {
            String[] args = new String[]{"python"
                    , "/home/yang/Workspace/VR/panoramas-image-stitching/src/main.py"
                    , stitchTempDir
                    , stitchTempDir};
            Process proc = Runtime.getRuntime().exec(args);// 执行py文件

            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String line = null;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
            in.close();
            proc.waitFor();
        } catch (IOException e) {
            log.error("failed", e);
        } catch (InterruptedException e) {
            log.error("failed", e);
        }
        return true;
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        // TODO Auto-generated method stub
        try {
            String[] args1 = new String[]{"python", "/home/yang/Workspace/VR/panoramas-image-stitching/src/main.py"
                    , "/home/yang/Workspace/VR/walkthrough/tmp/1/stitch/"
                    , "/home/yang/Workspace/VR/walkthrough/tmp/1/stitch/"};
            Process proc = Runtime.getRuntime().exec(args1);// 执行py文件

            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String line = null;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
            in.close();
            proc.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
