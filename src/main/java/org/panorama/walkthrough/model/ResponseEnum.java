package org.panorama.walkthrough.model;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ResponseEnum.java
 * @Description TODO
 * @createTime 2023/03/01
 */
public enum ResponseEnum {


    SUCCESS(0, "成功"),
    FAIL(-1, "失败"),
    ERROR_400(400, "错误的请求"),
    ERROR_404(404, "访问资源不存在"),
    ERROR_500(500, "服务器异常");


    private Integer code;
    private String msg;

    ResponseEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }


    public Integer getCode() {
        return code;
    }


    public void setCode(Integer code) {
        this.code = code;
    }


    public String getMsg() {
        return msg;
    }


    public void setMsg(String msg) {
        this.msg = msg;
    }
}