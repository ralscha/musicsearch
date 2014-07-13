package ch.rasc.musicsearch;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.EnumSet;

import javax.servlet.DispatcherType;

import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import org.springframework.web.filter.CharacterEncodingFilter;

import ch.rasc.edsutil.optimizer.WebResourceProcessor;

@Configuration
@ComponentScan(basePackages = { "ch.ralscha.extdirectspring", "ch.rasc.musicsearch" })
@EnableAutoConfiguration
public class Main extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Main.class);
	}

	public static void main(String[] args) throws Exception {
		System.setProperty("spring.profiles.active",
				System.getProperty("spring.profiles.active", "development"));
		SpringApplication.run(Main.class, args);
	}

	@Bean
	public ServletContextInitializer servletContextInitializer(
			final Environment environment) {
		return servletContext -> {
			try {
				WebResourceProcessor processor = new WebResourceProcessor(servletContext,
						environment.acceptsProfiles("production"));
				processor.process();

				ClassPathResource cpr = new ClassPathResource("/index.html");
				ClassPathResource loaderCpr = new ClassPathResource("/loader.css");
				String indexHtml = StreamUtils.copyToString(cpr.getInputStream(),
						StandardCharsets.UTF_8);
				indexHtml = indexHtml.replace("application.app_css",
						(String) servletContext.getAttribute("app_css"));
				indexHtml = indexHtml.replace("application.app_js",
						(String) servletContext.getAttribute("app_js"));
				indexHtml = indexHtml.replace("loader.css", StreamUtils.copyToString(
						loaderCpr.getInputStream(), StandardCharsets.UTF_8));
				indexHtml = indexHtml.replace("application.getContextPath()",
						servletContext.getContextPath());
				servletContext.setAttribute("index.html", indexHtml);
			}
			catch (IOException e) {
				LoggerFactory.getLogger(Main.class).error(
						"read index.html and loader.css", e);
			}

			final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
			characterEncodingFilter.setEncoding("UTF-8");
			characterEncodingFilter.setForceEncoding(false);
			servletContext.addFilter("characterEncodingFilter", characterEncodingFilter)
					.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), false,
							"/*");
		};
	}

}
