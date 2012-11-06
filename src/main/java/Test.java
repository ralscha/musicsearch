import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;
import org.springframework.web.util.UriUtils;

public class Test {

	public static void main(String[] args) throws CannotReadException, IOException, TagException,
			ReadOnlyFileException, InvalidAudioFrameException {

		String s = UriUtils.encodePathSegment("test/test", StandardCharsets.UTF_8.name());
		System.out.println(s);

		// Path mdir = Paths.get("E:/Music");
		// Path p = Paths
		// .get("E:/Music/Black Eyed Peas/E.N.D_/03 Mare.mp3");
		//
		// System.out.println(p.getFileName());
		// System.out.println(mdir.relativize(p.getParent()));

		// AudioFile f = AudioFileIO.read(p.toFile());
		// Tag tag = f.getTag();
		// AudioHeader ah = f.getAudioHeader();
		//
		// System.out.println(ah.getBitRate());
		// System.out.println(ah.getBitRateAsNumber());
		// System.out.println(ah.getChannels());
		// System.out.println(ah.getEncodingType());
		// System.out.println(ah.getFormat());
		// System.out.println(ah.getSampleRate());
		// System.out.println(ah.getSampleRateAsNumber());
		// System.out.println(ah.getTrackLength());
		//
		// System.out.println("artist:" + tag.getFirst(FieldKey.ARTIST));
		// System.out.println("album:" + tag.getFirst(FieldKey.ALBUM));
		// System.out.println("title:" + tag.getFirst(FieldKey.TITLE));
		// System.out.println(tag.getFirst(FieldKey.COMMENT));
		// System.out.println("year:" + tag.getFirst(FieldKey.YEAR));
		// System.out.println(tag.getFirst(FieldKey.TRACK));
		// System.out.println(tag.getFirst(FieldKey.DISC_NO));
		// System.out.println(tag.getFirst(FieldKey.COMPOSER));
		// System.out.println(tag.getFirst(FieldKey.ARTIST_SORT));
	}

}
