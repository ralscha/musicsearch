package ch.rasc.musicsearch.web;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ch.rasc.musicsearch.service.IndexService;

@Controller
public class DownloadMusicController {

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	private boolean xSendFile;

	@PostConstruct
	public void init() {
		Boolean xSendFileProperty = environement.getProperty("xSendFile", Boolean.class);
		if (xSendFileProperty != null) {
			xSendFile = xSendFileProperty;
		} else {
			xSendFile = false;
		}
	}

	@RequestMapping("/downloadMusic")
	public void download(@RequestParam(value = "docId", required = true) int docId, HttpServletResponse response)
			throws IOException {

		Document doc = indexService.getIndexSearcher().doc(docId);

		if (doc != null) {

			Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"), doc.get("fileName"));

			String contentType = Files.probeContentType(musicFile);
			response.setContentType(contentType);

			if (xSendFile) {
				String redirectUrl = environement.getProperty("xSendFileContext") + "/" + doc.get("directory") + "/" + doc.get("fileName");
				response.setHeader("X-Accel-Redirect", redirectUrl);
			} else {
				response.setContentLength((int) Files.size(musicFile));
				try (OutputStream out = response.getOutputStream()) {
					Files.copy(musicFile, out);
				}
			}
		}

	}
}