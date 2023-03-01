package org.panorama.walkthrough.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ResponseEntity.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Getter
@Setter
public class ResponseEntity<T> implements Serializable {


    private static final long serialVersionUID = 3595741978061989861L;
    private Integer code;//状态码
    private String msg;//状态码对应信息
    private Integer count = 1;//数据量
    private T data;//要返回的数据
}
