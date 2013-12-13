package ch.rasc.musicsearch.model;

import ch.rasc.extclassgenerator.Model;

@Model(value = "MusicSearch.model.Artist", readMethod = "searchService.readArtists")
public class Artist {
	private final String first;

	private final String name;

	public Artist(String name) {
		this.first = name.substring(0, 1).toUpperCase();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getFirst() {
		return first;
	}

}
