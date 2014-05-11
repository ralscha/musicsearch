package ch.rasc.musicsearch;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
public class AppConfig {

	private String musicDir;

	private String indexDir;

	private String nginxSendFileContext;

	private boolean apacheSendFile = false;

	public String getMusicDir() {
		return musicDir;
	}

	public void setMusicDir(String musicDir) {
		this.musicDir = musicDir;
	}

	public String getIndexDir() {
		return indexDir;
	}

	public void setIndexDir(String indexDir) {
		this.indexDir = indexDir;
	}

	public String getNginxSendFileContext() {
		return nginxSendFileContext;
	}

	public void setNginxSendFileContext(String nginxSendFileContext) {
		this.nginxSendFileContext = nginxSendFileContext;
	}

	public boolean isApacheSendFile() {
		return apacheSendFile;
	}

	public void setApacheSendFile(boolean apacheSendFile) {
		this.apacheSendFile = apacheSendFile;
	}

}
