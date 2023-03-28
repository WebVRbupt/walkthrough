package org.panorama.walkthrough.service.storage;

/**
 * @author WangZx
 * @version 1.0
 * @className StorageException
 * @date 2023/3/28
 * @createTime 10:55
 */
public class StorageException extends RuntimeException{

    public StorageException(String message){
        super(message);
    }

    public StorageException(String message,Throwable cause){
        super(message,cause);
    }
}
