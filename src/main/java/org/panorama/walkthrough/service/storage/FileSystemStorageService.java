package org.panorama.walkthrough.service.storage;

import org.apache.commons.io.filefilter.SuffixFileFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
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

    private final Path rootLocation;

    @Autowired
    public FileSystemStorageService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
        init();
    }

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
        } catch (IOException e) {
            throw new StorageException("Failed to store file" + file.getOriginalFilename(), e);
        }
    }

    @Override
    public void store(String str, String prefix) {

        try {

            try {
                if (!Files.exists(rootLocation.resolve(prefix))) {
                    Files.createDirectories(rootLocation.resolve(prefix));
                }

            } catch (IOException e) {

                throw new StorageException("Could not initialize storage", e);
            }
            String storageName = prefix + "projectConfig.json";
            Files.copy(new ByteArrayInputStream(str.getBytes()), rootLocation.resolve(storageName));

        } catch(IOException e) {
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

            throw new StorageException("Could not initialize storage", e);
        }

    }
}
