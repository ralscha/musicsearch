package ch.rasc.musicsearch.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import ch.ralscha.extdirectspring.generator.ModelGenerator;
import ch.ralscha.extdirectspring.generator.OutputFormat;
import ch.rasc.musicsearch.model.Song;

@Controller
public class ModelController {

	@RequestMapping("/app/Song.js")
	public void user(HttpServletRequest request, HttpServletResponse response) throws IOException {
		ModelGenerator.writeModel(request, response, Song.class, OutputFormat.EXTJS4);
	}

}
