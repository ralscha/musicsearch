package ch.rasc.musicsearch.web;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import ch.rasc.musicsearch.service.IndexService;

@Controller
public class DownloadMusicController {

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	private String nginxSendFileContext;

	private boolean apacheSendFile;

	@PostConstruct
	public void init() {
		nginxSendFileContext = environement.getProperty("nginxSendFileContext");
		apacheSendFile = environement.getProperty("apacheSendFile", Boolean.class, false);
	}

	@RequestMapping(value = "/downloadMusic", method = RequestMethod.GET)
	public void download(@RequestParam(value = "docId", required = true) int docId, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		Document doc = indexService.getIndexSearcher().doc(docId);

		if (doc != null) {

			Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"), doc.get("fileName"));

			String contentType = Files.probeContentType(musicFile);
			response.setContentType(contentType);
			long fileSize = Files.size(musicFile);

			if (nginxSendFileContext != null) {
				String redirectUrl = nginxSendFileContext + "/" + doc.get("directory") + "/" + doc.get("fileName");
				response.setHeader("X-Accel-Redirect", redirectUrl);
			} else if (apacheSendFile) {
				response.setHeader("X-SendFile", musicFile.toAbsolutePath().toString());
			} else if (Boolean.TRUE.equals(request.getAttribute("org.apache.tomcat.sendfile.support"))) {
				long startAt = 0;
				long end = fileSize - 1;
				String rangeHeader = request.getHeader("Range");
				if (rangeHeader != null) {
					response.setStatus(206);

					String[] startEnd = rangeHeader.replace("bytes=", "").split("-");
					if (startEnd.length >= 1) {
						startAt = Long.parseLong(startEnd[0]);
					}
					if (startEnd.length == 2) {
						end = Long.parseLong(startEnd[1]);
					}

					response.setHeader("Content-Range", String.format("bytes %d-%d/%d", startAt, end, fileSize));
					long dataToWrite = (end + 1) - startAt;
					response.setContentLength((int) dataToWrite);
				} else {
					response.setContentLength((int) fileSize);
				}

				request.setAttribute("org.apache.tomcat.sendfile.filename", musicFile.toString());
				request.setAttribute("org.apache.tomcat.sendfile.start", startAt);
				request.setAttribute("org.apache.tomcat.sendfile.end", end + 1);

			} else {
				response.setContentLength((int) fileSize);
				try (OutputStream out = response.getOutputStream()) {
					Files.copy(musicFile, out);
				}
			}
		}

	}
}