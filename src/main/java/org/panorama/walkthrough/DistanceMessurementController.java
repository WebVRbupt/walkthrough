package org.panorama.walkthrough;

import jep.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;


@RestController
public class DistanceMessurementController {

    private static boolean init = false;

    private void initJep(){
        if(!init)
        {
            JepConfig config = new JepConfig();
            config.addIncludePaths("src/main/resources/static/python");
            SharedInterpreter.setConfig(config);
            init=true;
        }
    }

    @PostMapping ("/dm")
    public String calcDistance(@RequestBody Map data) {

//		System.setProperty("java.library.path", "D:\\anaconda3");
//		PyConfig pyconfig = new PyConfig();
//		pyconfig.setPythonHome("D:\\anaconda3");
////		JepConfig config = new JepConfig();
//		MainInterpreter.setInitParams(pyconfig);
//		MainInterpreter.setJepLibraryPath("D:\\anaconda3");

        //config.addIncludePaths("C:\\Users\\IdeaProjects\\DailyLearning\\src\\python");
//        try (Interpreter interp = new SharedInterpreter()) {
//            interp.exec("print(1+1)");
//        }
//        Object value;
//        try (SharedInterpreter interpreter = new SharedInterpreter()) {
//            interpreter.exec("import sys");
//            value = interpreter.getValue("sys.path");
//            System.out.println(value);
//        }
        ArrayList<Double> point1 = (ArrayList<Double>) data.get("pos1");
        ArrayList<Double> point2 = (ArrayList<Double>) data.get("pos2");
        //Arrays point2 = (Arrays) data.get("pos2");

        System.out.println(point1);
        System.out.println(point2);

        int x1 =  point1.get(0).intValue();
        int y1 = point1.get(1).intValue();

        int x2 =  point2.get(0).intValue();
        int y2 =  point2.get(1).intValue();

        initJep();
        Object result;
        try (Interpreter interp = new SharedInterpreter()) {

            interp.eval("from depth2pointcloud import *");
            // test a basic invoke with no args
            result = interp.invoke("calcDistance",x1,y1,x2,y2);
            interp.exec("import sys");
            interp.exec("sys.stdout.flush()");
            System.out.println(result);
        }

        return (String)result;
    }
}
