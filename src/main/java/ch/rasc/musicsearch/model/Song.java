package ch.rasc.musicsearch.model;

import ch.ralscha.extdirectspring.generator.Model;

@Model(value="MusicSearch.Song", readMethod="searchService.search")
public class Song {

	private String fileName;

	private String directory;

	private String album;

	private String artist;

	private String title;

	private String year;

	private Integer durationInSeconds;

	public String getDirectory() {
		return directory;
	}

	public void setDirectory(String directory) {
		this.directory = directory;
	}

	public String getAlbum() {
		return album;
	}

	public void setAlbum(String album) {
		this.album = album;
	}

	public String getArtist() {
		return artist;
	}

	public void setArtist(String artist) {
		this.artist = artist;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String name) {
		this.fileName = name;
	}

	public Integer getDurationInSeconds() {
		return durationInSeconds;
	}

	public void setDurationInSeconds(Integer durationInSeconds) {
		this.durationInSeconds = durationInSeconds;
	}

}
