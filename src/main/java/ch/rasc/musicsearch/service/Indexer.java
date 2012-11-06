package ch.rasc.musicsearch.service;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.google.common.base.Stopwatch;

@Component
public class Indexer {

	private static final Log logger = LogFactory.getLog(Indexer.class);

	@Autowired
	private Environment environement;

	@PostConstruct
	public void checkIndex() {
		Path ixDir = Paths.get(environement.getProperty("indexDir"));

		if (!Files.exists(ixDir)) {
			try {
				indexMusic(ixDir);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void indexMusic(Path ixDir) throws IOException {

		Path musicDir = Paths.get(environement.getProperty("musicDir"));

		try (Directory dir = FSDirectory.open(ixDir.toFile());
				Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_40)) {
			IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_40, analyzer);
			// iwc.setOpenMode(OpenMode.CREATE);
			iwc.setOpenMode(OpenMode.CREATE_OR_APPEND);

			Stopwatch stopwatch = new Stopwatch();
			stopwatch.start();

			IndexFileWalker walker = null;

			try (IndexWriter writer = new IndexWriter(dir, iwc)) {
				walker = new IndexFileWalker(writer, musicDir);
				Files.walkFileTree(musicDir, walker);

				writer.forceMerge(1);
			}

			stopwatch.stop();
			logger.info("INDEXING TIME: " + stopwatch.elapsedTime(TimeUnit.SECONDS));

			Path infoFile = ixDir.resolve("info.properties");
			try (FileWriter fw = new FileWriter(infoFile.toFile())) {
				Properties properties = new Properties();
				properties.put("totalDuration", String.valueOf(walker.getTotalDuration()));
				properties.put("noOfSongs", String.valueOf(walker.getNoOfSongs()));
				properties.store(fw, "dbinfo");
			}
		}
	}
}
