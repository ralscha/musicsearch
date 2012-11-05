import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;

public class Test {

	public static void main(String[] args) throws CannotReadException, IOException, TagException,
			ReadOnlyFileException, InvalidAudioFrameException {
		Path p = Paths
				.get("E:/_download/music/Armin Van Buuren - A State Of Trance 585 (2012-11-01) (Inspiron)/03 Beat Service, Ana Criado - Whispers.mp3");
		AudioFile f = AudioFileIO.read(p.toFile());
		Tag tag = f.getTag();
		AudioHeader ah = f.getAudioHeader();

		System.out.println(ah.getBitRate());
		System.out.println(ah.getBitRateAsNumber());
		System.out.println(ah.getChannels());
		System.out.println(ah.getEncodingType());
		System.out.println(ah.getFormat());
		System.out.println(ah.getSampleRate());
		System.out.println(ah.getSampleRateAsNumber());
		System.out.println(ah.getTrackLength());

		System.out.println("artist:" + tag.getFirst(FieldKey.ARTIST));
		System.out.println("album:" + tag.getFirst(FieldKey.ALBUM));
		System.out.println("title:" + tag.getFirst(FieldKey.TITLE));
		System.out.println(tag.getFirst(FieldKey.COMMENT));
		System.out.println("year:" + tag.getFirst(FieldKey.YEAR));
		System.out.println(tag.getFirst(FieldKey.TRACK));
		System.out.println(tag.getFirst(FieldKey.DISC_NO));
		System.out.println(tag.getFirst(FieldKey.COMPOSER));
		System.out.println(tag.getFirst(FieldKey.ARTIST_SORT));
	}

}
