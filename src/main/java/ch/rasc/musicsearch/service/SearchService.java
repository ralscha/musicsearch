package ch.rasc.musicsearch.service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import ch.rasc.musicsearch.model.Info;

@Service
public class SearchService {

	private static final Log logger = LogFactory.getLog(SearchService.class);

	@Autowired
	private Environment environement;

	public Info getInfo() {

		Info info = new Info();
		try {
			Path infoFile = Paths.get(environement.getProperty("indexDir"), "info.properties");
			Properties properties;
			try (FileReader fr = new FileReader(infoFile.toFile())) {
				properties = new Properties();
				properties.load(fr);
			}

			String totalDurationString = (String) properties.get("totalDuration");
			String noOfSongsString = (String) properties.get("noOfSongs");

			if (StringUtils.isNotBlank(totalDurationString)) {
				info.setTotalDuration(new Integer(totalDurationString));
			}
			if (StringUtils.isNotBlank(noOfSongsString)) {
				info.setNoOfSongs(new Integer(noOfSongsString));
			}

		} catch (FileNotFoundException e) {
			logger.error("getInfo", e);
		} catch (IOException e) {
			logger.error("getInfo", e);
		}

		return info;
	}

	// public List<Songs> search(String queryString) throws
	// CorruptIndexException, IOException {
	//
	// logger.info("SEARCH FOR: " + queryString);
	//
	// List<Songs> resultList = new ArrayList<Songs>();
	// Searcher searcher = new IndexSearcher(indexDir);
	// try {
	// String[] fields = { "title", "author", "album", "date", "fileName",
	// "directory" };
	// MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, new
	// StandardAnalyzer());
	//
	// parser.setDefaultOperator(QueryParser.AND_OPERATOR);
	// parser.setAllowLeadingWildcard(true);
	//
	// Query query;
	// try {
	// query = parser.parse(queryString);
	// } catch (ParseException e) {
	// query = parser.parse(QueryParser.escape(queryString));
	// }
	//
	// Hits hits = searcher.search(query);
	// logger.info("FOUND:      " + hits.length());
	//
	// for (int i = 0; i < hits.length(); i++) {
	// Songs song = new Songs();
	// song.setFileName(hits.doc(i).get("fileName"));
	//
	// File dir = new File(hits.doc(i).get("directory"));
	// File f = new File(dir, song.getFileName());
	// song.setDirectory(f.getPath());
	//
	// song.setArtist(hits.doc(i).get("author"));
	// song.setYear(hits.doc(i).get("date"));
	// song.setAlbum(hits.doc(i).get("album"));
	// song.setTitle(hits.doc(i).get("title"));
	//
	// if (StringUtils.isBlank(song.getArtist()) &&
	// StringUtils.isBlank(song.getAlbum())
	// && StringUtils.isBlank(song.getTitle())) {
	// song.setTitle(song.getFileName());
	// }
	//
	// String durationString = hits.doc(i).get("duration");
	// if (StringUtils.isNotBlank(durationString)) {
	// song.setDuration(new Integer(durationString));
	// } else {
	// song.setDuration(null);
	// }
	//
	// resultList.add(song);
	// }
	// } finally {
	// if (searcher != null) {
	// searcher.close();
	// }
	// }
	//
	// return resultList;
	//
	// }
}
