package org.panorama.walkthrough.service.storage;

/**
 * @author WangZx
 * @version 1.0
 * @className StorageFileNotFoundException
 * @date 2023/3/28
 * @createTime 10:58
 */
public class StorageFileNotFoundException extends StorageException {
    public StorageFileNotFoundException(String message) {
        super(message);
    }

    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
