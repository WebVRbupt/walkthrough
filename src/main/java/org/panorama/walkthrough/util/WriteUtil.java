package org.panorama.walkthrough.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName WriteUtil.java
 * @Description TODO
 * @createTime 2023/03/02
 */
public class WriteUtil {
    /**
     * 方法 5：使用 BufferedOutputStream 写文件
     *
     * @param filepath 文件目录
     * @param content  待写入内容
     * @throws IOException
     */
    public static void bufferedOutputStreamMethod(String filepath, String content) throws IOException {
        try (BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(
                new FileOutputStream(filepath))) {
            bufferedOutputStream.write(content.getBytes());
        }
    }

    public static void write2end(String filepath, String content) throws IOException {
        File file = new File(filepath);
        if(!file.exists()){
            file.createNewFile();
        }
        Files.write(Paths.get(filepath), content.getBytes(), StandardOpenOption.APPEND);
    }
}
