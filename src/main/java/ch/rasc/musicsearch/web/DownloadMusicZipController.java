package ch.rasc.musicsearch.web;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.Deflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.lucene.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ch.rasc.musicsearch.service.IndexService;

@Controller
public class DownloadMusicZipController {

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	@RequestMapping("/downloadMusicZip")
	public void export(@RequestParam(value = "sf", required = true) String selectedMusicIds,
			HttpServletResponse response) throws IOException {

		if (StringUtils.hasText(selectedMusicIds)) {

			Path tempFile = Files.createTempFile("mp3", "zip");

			try (OutputStream os = Files.newOutputStream(tempFile);
					BufferedOutputStream bos = new BufferedOutputStream(os);
					ZipOutputStream zip = new ZipOutputStream(bos)) {
				zip.setMethod(ZipOutputStream.DEFLATED);
				zip.setLevel(Deflater.NO_COMPRESSION);

				for (String id : selectedMusicIds.split(",")) {
					Document doc = indexService.getIndexSearcher().doc(Integer.valueOf(id));

					if (doc != null) {

						Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"),
								doc.get("fileName"));
						ZipEntry entry = new ZipEntry(musicFile.getFileName().toString());
						entry.setTime(System.currentTimeMillis());
						zip.putNextEntry(entry);
						zip.write(Files.readAllBytes(musicFile));
						zip.closeEntry();
					}
				}
			}

			response.setContentLength((int) Files.size(tempFile));

			try (OutputStream out = response.getOutputStream()) {
				Files.copy(tempFile, out);
			}

			Files.delete(tempFile);
		}
	}
}