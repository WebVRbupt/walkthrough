package org.panorama.walkthrough.service.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * @author WangZx
 * @version 1.0
 * @className StorageService
 * @date 2023/3/28
 * @createTime 10:45
 */
public interface StorageService {

    void init();

    void store(MultipartFile file,String prefix,String picId);

    void store(String str,String prefix);

}
