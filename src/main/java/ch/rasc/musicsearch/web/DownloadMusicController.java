package ch.rasc.musicsearch.web;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ch.rasc.musicsearch.service.IndexService;

import com.google.common.io.ByteStreams;

@Controller
public class DownloadMusicController {

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	@RequestMapping("/downloadMusic")
	public void download(@RequestParam(value = "docId", required = true) int docId, HttpServletResponse response)
			throws IOException {

		Document doc = indexService.getIndexSearcher().doc(docId);

		if (doc != null) {

			Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"), doc.get("fileName"));

			response.setContentLength((int) Files.size(musicFile));

			try (FileInputStream fis = new FileInputStream(musicFile.toFile());
					BufferedInputStream bis = new BufferedInputStream(fis);
					OutputStream out = response.getOutputStream();) {

				ByteStreams.copy(bis, out);

			}
		}

	}
}