package ch.rasc.musicsearch.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class IndexService {

	private static final Log logger = LogFactory.getLog(IndexService.class);

	private Directory indexDirectory;

	private IndexReader indexReader;

	private IndexSearcher indexSearcher;

	@Autowired
	private Environment environement;

	@PostConstruct
	public void init() {
		Path ixDir = Paths.get(environement.getProperty("indexDir"));
		try {
			indexDirectory = FSDirectory.open(ixDir.toFile());
			indexReader = DirectoryReader.open(indexDirectory);
			indexSearcher = new IndexSearcher(indexReader);
		} catch (IOException e) {
			logger.error("init searcher service", e);
		}
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

}
