package org.panorama.walkthrough.service.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author WangZx
 * @version 1.0
 * @className FileSystemStorageService
 * @date 2023/3/28
 * @createTime 10:50
 */

@Service
public class FileSystemStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(FileSystemStorageService.class);

    private final Path rootLocation;

    @Autowired
    public FileSystemStorageService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
        init();
    }

    // 将前端提交的全景图像或模型文件存储到服务端.
    @Override
    public void store(MultipartFile file, String prefix, String picId) {
        String fileName = file.getOriginalFilename();
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to storage empty file" + file.getOriginalFilename());
            }

            String suffix = fileName.substring(fileName.lastIndexOf('.'));
            String storageName = prefix + picId + suffix;
            try {
                if (!Files.exists(rootLocation.resolve(prefix))) {
                    Files.createDirectories(rootLocation.resolve(prefix));
                }

            } catch (IOException e) {

                throw new StorageException("Could not initialize storage", e);
            }

            InputStream fos = file.getInputStream();
            Files.copy(fos, rootLocation.resolve(storageName));
            fos.close();
            log.info("Resources Save Success:" + storageName);

        } catch (IOException e) {
            log.error("Resources Save Failed:" + file.getOriginalFilename() + " " + e.getMessage());
            throw new StorageException("Failed to store file" + file.getOriginalFilename(), e);
        }
    }

    // 将前端提交的项目配置json字符串流存储为json格式文件.
    @Override
    public void store(String str, String prefix) {

        try {

            try {
                if (!Files.exists(rootLocation.resolve(prefix))) {
                    Files.createDirectories(rootLocation.resolve(prefix));
                }

            } catch (IOException e) {
                log.error("Resources Save Failed:" + prefix + " configuration file " + e.getMessage());
                throw new StorageException("Could not initialize storage", e);
            }
            String storageName = prefix + "projectConfig.json";
            Files.copy(new ByteArrayInputStream(str.getBytes()), rootLocation.resolve(storageName));
            log.info("Resources Save Success:" + storageName);

        } catch (IOException e) {
            log.error("Resources Save Failed:" + prefix + " configuration file " + e.getMessage());
            System.out.println(e.getMessage());
        }
    }

    @Override
    public void init() {

        try {
            if (!Files.exists(this.rootLocation)) {
                Files.createDirectory(this.rootLocation);
            }

        } catch (IOException e) {
            log.error("Resources Save Failed:" + "FileSystemStorageService init Failed " + e.getMessage());
            throw new StorageException("Could not initialize storage", e);
        }

    }

    @Override
    public InputStream getSource(String prefix, String simpleSourceName) throws StorageException,IOException{
        String sourceFileName=prefix+simpleSourceName;
        Path sourcePath=rootLocation.resolve(sourceFileName);
        if (!Files.exists(sourcePath)){
            throw new StorageException("No Such Resource Exception");
        }
        return Files.newInputStream(sourcePath);
    }

    @Override
    public void delete(String path) {
        try {
            Files.deleteIfExists(this.rootLocation.resolve(path));
            log.info("Resource Delete Successful:" + path);
        } catch (IOException e) {
            log.error("Resources Delete Failed:" + e.getMessage());
        }
    }
}
