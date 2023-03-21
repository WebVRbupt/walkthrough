package org.panorama.walkthrough.util;

import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ShellCommandUtil.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@Slf4j
public class ShellCommandUtil {
    /**
     * @param command if you don't specify a #direction,command will use relative path.
     * @title runCommand
     * @description run a shell command
     */
    public static Integer runCommand(String[] command) throws IOException, ExecutionException, InterruptedException, TimeoutException {
        return runCommand(command, null);
    }

    public static Integer runCommand(String[] command, String directory) throws IOException, InterruptedException, ExecutionException, TimeoutException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(command);
        if (null != directory) {
            processBuilder.directory(new File(directory));
        }
        Process process = processBuilder.start();
        StreamReader streamReader = new StreamReader(process.getErrorStream(), log::error);
        Future future = Executors.newSingleThreadExecutor().submit(streamReader);
        int exitCode = process.waitFor();
        future.get(10, TimeUnit.SECONDS);
        return exitCode;
    }

    private static class StreamReader implements Runnable {
        private InputStream inputStream;
        private Consumer<String> consumer;

        StreamReader(InputStream inputStream, Consumer<String> consumer) {
            this.inputStream = inputStream;
            this.consumer = consumer;
        }

        @Override
        public void run() {
            new BufferedReader(new InputStreamReader(inputStream)).lines()
                    .forEach(consumer);
        }
    }
}

