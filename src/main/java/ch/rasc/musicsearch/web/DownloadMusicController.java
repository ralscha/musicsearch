package ch.rasc.musicsearch.web;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.common.io.ByteStreams;

@Controller
public class DownloadMusicController {

	private static final Log logger = LogFactory.getLog(DownloadMusicController.class);

	@Autowired
	private Environment environement;

	@RequestMapping("/downloadMusic")
	public void download(@RequestParam(value = "name", required = true) String name, HttpServletResponse response)
			throws IOException {

		logger.info("downloading: " + name);

		Path musicFile = Paths.get(environement.getProperty("musicDir")).resolve(name);

		response.setContentLength((int) Files.size(musicFile));

		try (FileInputStream fis = new FileInputStream(musicFile.toFile());
				BufferedInputStream bis = new BufferedInputStream(fis);
				OutputStream out = response.getOutputStream();) {

			ByteStreams.copy(bis, out);

		}

	}
}