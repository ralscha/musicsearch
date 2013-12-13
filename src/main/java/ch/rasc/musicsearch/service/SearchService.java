package ch.rasc.musicsearch.service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParserBase;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;
import ch.ralscha.extdirectspring.bean.ExtDirectStoreReadRequest;
import ch.ralscha.extdirectspring.filter.StringFilter;
import ch.rasc.musicsearch.model.Artist;
import ch.rasc.musicsearch.model.Info;
import ch.rasc.musicsearch.model.Song;

@Service
public class SearchService {

	private static final Log logger = LogFactory.getLog(SearchService.class);

	private final static String[] FIELDS = { "fileName", "directory", "title", "artist", "album", "comment", "year",
			"composer" };

	@Autowired
	private Environment environement;

	@Autowired
	private IndexService indexService;

	@ExtDirectMethod
	public Info getInfo() {

		Info info = new Info();
		try {
			Path infoFile = Paths.get(environement.getProperty("indexDir"), "info.properties");
			Properties properties;
			try (BufferedReader br = Files.newBufferedReader(infoFile, StandardCharsets.UTF_8)) {
				properties = new Properties();
				properties.load(br);
			}

			String totalDurationString = (String) properties.get("totalDuration");
			String noOfSongsString = (String) properties.get("noOfSongs");

			if (StringUtils.hasText(totalDurationString)) {
				info.setTotalDuration(Integer.valueOf(totalDurationString));
			}
			if (StringUtils.hasText(noOfSongsString)) {
				info.setNoOfSongs(Integer.valueOf(noOfSongsString));
			}

		} catch (FileNotFoundException e) {
			logger.error("getInfo", e);
		} catch (IOException e) {
			logger.error("getInfo", e);
		}

		return info;
	}

	@ExtDirectMethod(value = ExtDirectMethodType.STORE_READ)
	public List<Artist> readArtists() throws IOException {
		Path artistsFile = Paths.get(environement.getProperty("indexDir"), "artists.txt");
		List<String> artists = Files.readAllLines(artistsFile, StandardCharsets.UTF_8);

		List<Artist> artistsList = new ArrayList<>();
		for (String artist : artists) {
			artistsList.add(new Artist(artist));
		}
		return artistsList;
	}

	@ExtDirectMethod(value = ExtDirectMethodType.STORE_READ)
	public List<Song> search(ExtDirectStoreReadRequest storeRequest) {

		String filterValue = null;
		if (!storeRequest.getFilters().isEmpty()) {
			StringFilter filter = (StringFilter) storeRequest.getFilters().iterator().next();
			filterValue = filter.getValue();
		}

		List<Song> resultList = new ArrayList<>();

		try (Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_46)) {

			MultiFieldQueryParser parser = new MultiFieldQueryParser(Version.LUCENE_46, FIELDS, analyzer);
			parser.setDefaultOperator(QueryParserBase.AND_OPERATOR);
			parser.setAllowLeadingWildcard(true);

			Query query;
			try {
				query = parser.parse(filterValue);
			} catch (ParseException e) {
				try {
					query = parser.parse(QueryParserBase.escape(filterValue));
				} catch (ParseException e1) {
					logger.error("lucene query parse", e1);
					return Collections.emptyList();
				}
			}

			TopDocs results = indexService.getIndexSearcher().search(query, 10000);
			for (ScoreDoc scoreDoc : results.scoreDocs) {
				Document doc = indexService.getIndexSearcher().doc(scoreDoc.doc);

				Song song = new Song();
				song.setId(scoreDoc.doc);

				song.setTitle(doc.get("title"));
				song.setArtist(doc.get("artist"));
				song.setAlbum(doc.get("album"));
				song.setYear(doc.get("year"));

				song.setEncoding(doc.get("encoding"));

				if (!StringUtils.hasText(song.getArtist()) && !StringUtils.hasText(song.getAlbum())
						&& !StringUtils.hasText(song.getTitle())) {
					song.setTitle(doc.get("fileName"));
				}

				IndexableField field = doc.getField("duration");
				if (field != null) {
					song.setDurationInSeconds(field.numericValue().intValue());
				} else {
					song.setDurationInSeconds(null);
				}

				field = doc.getField("bitrate");
				if (field != null) {
					song.setBitrate(field.numericValue().longValue());
				} else {
					song.setBitrate(null);
				}

				resultList.add(song);

			}

		} catch (IOException e) {
			logger.error("search service", e);
		}

		return resultList;

	}
}
