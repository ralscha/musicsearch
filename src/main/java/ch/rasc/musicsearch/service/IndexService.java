package ch.rasc.musicsearch.service;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.common.base.Stopwatch;

@Service
public class IndexService {

	private static final Log logger = LogFactory.getLog(IndexService.class);

	private Directory indexDirectory;

	private IndexReader indexReader;

	private IndexSearcher indexSearcher;

	@Autowired
	private Environment environement;

	@PostConstruct
	public void init() throws IOException {

		Path ixDir = Paths.get(environement.getProperty("indexDir"));

		if (!Files.exists(ixDir)) {
			indexMusic(ixDir);
		}

		indexDirectory = FSDirectory.open(ixDir.toFile());
		indexReader = DirectoryReader.open(indexDirectory);
		indexSearcher = new IndexSearcher(indexReader);
	}

	@PreDestroy
	public void destroy() {
		if (indexReader != null) {
			try {
				indexReader.close();
			} catch (IOException e) {
				// ignore exception
			}
		}
		if (indexDirectory != null) {
			try {
				indexDirectory.close();
			} catch (IOException e) {
				// ignore exception
			}
		}
	}

	public IndexSearcher getIndexSearcher() {
		return indexSearcher;
	}

	private void indexMusic(Path ixDir) throws IOException {

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