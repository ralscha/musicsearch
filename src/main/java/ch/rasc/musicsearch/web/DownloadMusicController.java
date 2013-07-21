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

	private String nginxSendFile;

	@PostConstruct
	public void init() {
		nginxSendFile = environement.getProperty("sendFileContext");
	}

	@RequestMapping(value = "/downloadMusic", method = RequestMethod.HEAD)
	public void download(@RequestParam(value = "docId", required = true) int docId, HttpServletResponse response)
			throws IOException {
		System.out.println("head");
		Document doc = indexService.getIndexSearcher().doc(docId);

		if (doc != null) {

			Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"), doc.get("fileName"));
			String contentType = Files.probeContentType(musicFile);
			response.setContentType(contentType);
			long fileSize = Files.size(musicFile);
			response.setContentLength((int) fileSize);
		}
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

			if (Boolean.TRUE.equals(request.getAttribute("org.apache.tomcat.sendfile.support"))) {
				response.setContentLength((int) fileSize);
				System.out.println("send file");
				long startAt = 0;
				String rangeHeader = request.getHeader("Range");
				if (rangeHeader != null) {
					response.setStatus(206);
					
					response.addHeader("Connection", "keep-alive");
//					Content-Length:17314664
//					Content-Range:bytes 0-17314663/17314664
//					Content-Type:text/plain
//					Date:Sun, 21 Jul 2013 07:49:34 GMT
//					ETag:"51c94492-1083368"
//					Last-Modified:Tue, 25 Jun 2013 07:19:46 GMT
//					Server:nginx
					response.addHeader("Vary", "Accept-Encoding");
					
					
					startAt = Long.parseLong(rangeHeader.replace("bytes=", "").split("-")[0]);
					
					response.setHeader("Content-Range", String.format("bytes %d-%d/%d", startAt, fileSize - 1, fileSize));
					long dataToWrite = fileSize - startAt;
					
					System.out.println(String.format("bytes %d-%d/%d", startAt, fileSize - 1, fileSize));
					response.setContentLength((int) dataToWrite);
				} else {			
				
					response.setContentLength((int) fileSize);
				}
				
				request.setAttribute("org.apache.tomcat.sendfile.filename", musicFile.toString());
				request.setAttribute("org.apache.tomcat.sendfile.start", startAt);
				request.setAttribute("org.apache.tomcat.sendfile.end", fileSize);
				//response.flushBuffer();
			} else if (nginxSendFile != null) {
				String redirectUrl = nginxSendFile + "/" + doc.get("directory") + "/" + doc.get("fileName");
				response.setHeader("X-Accel-Redirect", redirectUrl);
				// } else if (apacheSendFile) {
				// response.setHeader("X-SendFile",
				// musicFile.toAbsolutePath().toString());
			} else {
				response.setContentLength((int) fileSize);
				try (OutputStream out = response.getOutputStream()) {
					Files.copy(musicFile, out);
				}
			}
		}

	}
}