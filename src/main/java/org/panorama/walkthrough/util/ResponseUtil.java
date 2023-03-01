package org.panorama.walkthrough.util;

import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ResponseUtil.java
 * @Description TODO
 * @createTime 2023/03/01
 */
public class ResponseUtil {


    /**
     * 成功返回
     * @param object 返回数据
     * @return
     */
    public static ResponseEntity success(Object object){
        return success(object,1);
    }
    public static ResponseEntity success(Object object,Integer count){
        ResponseEntity resp = new ResponseEntity();
        resp.setCode(ResponseEnum.SUCCESS.getCode());
        resp.setMsg(ResponseEnum.SUCCESS.getMsg());
        resp.setData(object);
        resp.setCount(count);
        return resp;
    }

    /**
     * 成功返回  无数据
     * @return
     */
    public static ResponseEntity success(){
        return success(null);
    }


    /**
     * 失败返回
     * @param responseEnum 响应标识
     * @return
     */
    public static ResponseEntity error(ResponseEnum responseEnum){
        ResponseEntity resp = new ResponseEntity();
        resp.setCode(responseEnum.getCode());
        resp.setMsg(responseEnum.getMsg());
        return resp;
    }
}
