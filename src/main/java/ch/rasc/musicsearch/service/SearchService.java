package ch.rasc.musicsearch.service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;
import ch.ralscha.extdirectspring.bean.ExtDirectStoreReadRequest;
import ch.ralscha.extdirectspring.filter.StringFilter;
import ch.rasc.musicsearch.model.Info;
import ch.rasc.musicsearch.model.Song;

import com.google.common.collect.Lists;

@Service
public class SearchService {

	private static final Log logger = LogFactory.getLog(SearchService.class);

	@Autowired
	private Environment environement;

	@ExtDirectMethod
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
				info.setTotalDuration(Integer.valueOf(totalDurationString));
			}
			if (StringUtils.isNotBlank(noOfSongsString)) {
				info.setNoOfSongs(Integer.valueOf(noOfSongsString));
			}

		} catch (FileNotFoundException e) {
			logger.error("getInfo", e);
		} catch (IOException e) {
			logger.error("getInfo", e);
		}

		return info;
	}

	@ExtDirectMethod(value=ExtDirectMethodType.STORE_READ)
	public List<Song> search(ExtDirectStoreReadRequest storeRequest) {
		
		String filterValue = null;
		if (!storeRequest.getFilters().isEmpty()) {
			StringFilter filter = (StringFilter) storeRequest.getFilters().iterator().next();
			filterValue = filter.getValue();
		}
		
		logger.info("SEARCH FOR: " + filterValue);

		List<Song> resultList = Lists.newArrayList();
		Song s = new Song();
		s.setAlbum("album");
		s.setArtist("artist");
		s.setDirectory("dir");
		s.setFileName("file");
		s.setDurationInSeconds(100);
		s.setTitle("title");
		s.setYear("year");
		resultList.add(s);
		
//		Searcher searcher = new IndexSearcher(indexDir);
//		try {
//			String[] fields = { "title", "author", "album", "date", "fileName", "directory" };
//			MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, new StandardAnalyzer());
//
//			parser.setDefaultOperator(QueryParser.AND_OPERATOR);
//			parser.setAllowLeadingWildcard(true);
//
//			Query query;
//			try {
//				query = parser.parse(queryString);
//			} catch (ParseException e) {
//				query = parser.parse(QueryParser.escape(queryString));
//			}
//
//			Hits hits = searcher.search(query);
//			logger.info("FOUND:      " + hits.length());
//
//			for (int i = 0; i < hits.length(); i++) {
//				Songs song = new Songs();
//				song.setFileName(hits.doc(i).get("fileName"));
//
//				File dir = new File(hits.doc(i).get("directory"));
//				File f = new File(dir, song.getFileName());
//				song.setDirectory(f.getPath());
//
//				song.setArtist(hits.doc(i).get("author"));
//				song.setYear(hits.doc(i).get("date"));
//				song.setAlbum(hits.doc(i).get("album"));
//				song.setTitle(hits.doc(i).get("title"));
//
//				if (StringUtils.isBlank(song.getArtist()) && StringUtils.isBlank(song.getAlbum())
//						&& StringUtils.isBlank(song.getTitle())) {
//					song.setTitle(song.getFileName());
//				}
//
//				String durationString = hits.doc(i).get("duration");
//				if (StringUtils.isNotBlank(durationString)) {
//					song.setDuration(new Integer(durationString));
//				} else {
//					song.setDuration(null);
//				}
//
//				resultList.add(song);
//			}
//		} finally {
//			if (searcher != null) {
//				searcher.close();
//			}
//		}

		return resultList;

	}
}
