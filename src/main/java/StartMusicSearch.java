import org.slf4j.bridge.SLF4JBridgeHandler;

import ch.rasc.embeddedtc.EmbeddedTomcat;

public class StartMusicSearch {
	public static void main(String[] args) throws Exception {
		SLF4JBridgeHandler.install();
		EmbeddedTomcat.create().addContextEnvironmentAndResourceFromFile("./src/main/config/tomcat.xml").startAndWait();
	}
}
