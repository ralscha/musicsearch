import ch.rasc.embeddedtc.EmbeddedTomcat;

public class StartMusicSearch {
	public static void main(String[] args) throws Exception {
		// Comment out the following line to activate production profile
		System.setProperty("spring.profiles.active", "development");

		EmbeddedTomcat.create().useNio().setContextFile("./src/main/config/tomcat.xml").startAndWait();
	}
}
