package ch.rasc.musicsearch.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.Deflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.document.Document;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ch.rasc.musicsearch.service.IndexService;

import com.google.common.base.Splitter;
import com.google.common.io.ByteStreams;

@Controller
public class DownloadMusicZipController {

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	@RequestMapping("/downloadMusicZip")
	public void export(@RequestParam(value = "sf", required = true) String selectedMusicIds,
			HttpServletResponse response) throws IOException {

		if (StringUtils.isNotBlank(selectedMusicIds)) {

			Path tempFile = Files.createTempFile("mp3", "zip");
			tempFile.toFile().deleteOnExit();

			try (FileOutputStream fos = new FileOutputStream(tempFile.toFile());
					BufferedOutputStream bos = new BufferedOutputStream(fos);
					ZipOutputStream zip = new ZipOutputStream(bos)) {
				zip.setMethod(ZipOutputStream.DEFLATED);
				zip.setLevel(Deflater.NO_COMPRESSION);

				for (String id : Splitter.on(",").split(selectedMusicIds)) {
					Document doc = indexService.getIndexSearcher().doc(Integer.valueOf(id));

					if (doc != null) {

						Path musicFile = Paths.get(environement.getProperty("musicDir"), doc.get("directory"),
								doc.get("fileName"));
						try (FileInputStream fis = new FileInputStream(musicFile.toFile())) {
							ZipEntry entry = new ZipEntry(musicFile.getFileName().toString());
							entry.setTime(DateTime.now().getMillis());
							zip.putNextEntry(entry);
							zip.write(ByteStreams.toByteArray(fis));
							zip.closeEntry();
						}
					}
				}
			}

			response.setContentLength((int) Files.size(tempFile));

			try (FileInputStream fis = new FileInputStream(tempFile.toFile());
					BufferedInputStream bis = new BufferedInputStream(fis);
					OutputStream out = response.getOutputStream();) {

				ByteStreams.copy(bis, out);
			}
		}
	}
}