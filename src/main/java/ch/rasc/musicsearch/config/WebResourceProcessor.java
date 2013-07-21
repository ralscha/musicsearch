package ch.rasc.musicsearch.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;

import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.rasc.musicsearch.web.ResourceServlet;

import com.yahoo.platform.yui.compressor.CssCompressor;
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

public class WebResourceProcessor {
	private static final String HTML_SCRIPTORLINK = "s";

	private static final String MODE_PRODUCTION = "p";

	private static final String MODE_DEVELOPMENT = "d";

	private final static Logger logger = LoggerFactory.getLogger(WebResourceProcessor.class);

	private final static Pattern DEV_CODE_PATTERN = Pattern.compile("/\\* <debug> \\*/.*?/\\* </debug> \\*/",
			Pattern.DOTALL);

	private final static Pattern CSS_URL_PATTERN = Pattern.compile("(.*?url.*?\\('*)([^\\)']*)('*\\))",
			Pattern.CASE_INSENSITIVE);

	private final static String JAVASCRIPT_TAG = "<script src=\"%s\"></script>";

	private final static String CSSLINK_TAG = "<link rel=\"stylesheet\" href=\"%s\">";

	private String webResourcesConfigName = "/webresources.txt";

	private String versionPropertiesName = "/version.properties";

	private final boolean production;

	private int cssLinebreakPos = 120;

	int jsLinebreakPos = 120;

	boolean jsCompressorMunge = false;

	boolean jsCompressorVerbose = false;

	boolean jsCompressorPreserveAllSemiColons = true;

	boolean jsCompressordisableOptimizations = true;

	public WebResourceProcessor(boolean production) {
		this.production = production;
	}

	public void setWebResourcesConfigName(String webResourcesConfigName) {
		this.webResourcesConfigName = webResourcesConfigName;
	}

	public void setVersionPropertiesName(String versionPropertiesName) {
		this.versionPropertiesName = versionPropertiesName;
	}

	public void setCssLinebreakPos(int cssLinebreakPos) {
		this.cssLinebreakPos = cssLinebreakPos;
	}

	public void setJsLinebreakPos(int jsLinebreakPos) {
		this.jsLinebreakPos = jsLinebreakPos;
	}

	public void setJsCompressorMunge(boolean jsCompressorMunge) {
		this.jsCompressorMunge = jsCompressorMunge;
	}

	public void setJsCompressorVerbose(boolean jsCompressorVerbose) {
		this.jsCompressorVerbose = jsCompressorVerbose;
	}

	public void setJsCompressorPreserveAllSemiColons(boolean jsCompressorPreserveAllSemiColons) {
		this.jsCompressorPreserveAllSemiColons = jsCompressorPreserveAllSemiColons;
	}

	public void setJsCompressordisableOptimizations(boolean jsCompressordisableOptimizations) {
		this.jsCompressordisableOptimizations = jsCompressordisableOptimizations;
	}

	public void process(ServletContext container) {

		Map<String, StringBuilder> scriptAndLinkTags = new HashMap<>();
		Map<String, StringBuilder> sourceCodes = new HashMap<>();

		Map<String, String> variables = readVariablesFromPropertyResource();
		List<String> webResourceLines = readAllLinesFromWebResourceConfigFile();

		String varName = null;

		for (String webResourceLine : webResourceLines) {
			String line = webResourceLine.trim();
			if (line.isEmpty() || line.startsWith("#")) {
				continue;
			}

			if (line.endsWith(":")) {
				varName = line.substring(0, line.length() - 1);
				scriptAndLinkTags.put(varName, new StringBuilder());
				sourceCodes.put(varName, new StringBuilder());
				continue;
			}

			if (varName == null) {
				continue;
			}

			int pos = line.lastIndexOf("[");
			String mode = MODE_PRODUCTION;
			if (pos != -1) {
				mode = line.substring(pos + 1, line.length() - 1);
				line = line.substring(0, pos);
			}

			line = replaceVariables(variables, line);

			if (!production && mode.contains(MODE_DEVELOPMENT)) {
				scriptAndLinkTags.get(varName).append(createHtmlCode(container, line, varName));
			} else if (production && mode.contains(MODE_PRODUCTION)) {
				if (mode.contains(HTML_SCRIPTORLINK)) {
					scriptAndLinkTags.get(varName).append(createHtmlCode(container, line, varName));
				} else {
					boolean jsProcessing = varName.endsWith("_js");
					for (String resource : enumerateResources(container, line, jsProcessing ? ".js" : ".css")) {
						try (InputStream lis = container.getResourceAsStream(resource)) {
							String sourcecode = inputStream2String(lis, StandardCharsets.UTF_8);
							if (jsProcessing) {
								sourceCodes.get(varName).append(minifyJs(cleanCode(sourcecode))).append('\n');
							} else {
								sourceCodes.get(varName).append(compressCss(changeImageUrls(sourcecode, line)));
							}
						} catch (IOException ioe) {
							logger.error("web resource processing: " + line, ioe);
						}
					}
				}
			}
		}

		for (Map.Entry<String, StringBuilder> entry : sourceCodes.entrySet()) {
			String key = entry.getKey();
			if (entry.getValue().length() > 0) {
				byte[] content = entry.getValue().toString().getBytes(StandardCharsets.UTF_8);

				if (key.endsWith("_js")) {
					String root = key.substring(0, key.length() - 3);

					String crc = Base62.generateMD5asBase62String(content);
					String servletPath = "/" + root + crc + ".js";
					container.addServlet(root + crc + "js", new ResourceServlet(content, "application/javascript"))
							.addMapping(servletPath);

					scriptAndLinkTags.get(key).append(
							String.format(JAVASCRIPT_TAG, container.getContextPath() + servletPath));

				} else if (key.endsWith("_css")) {
					String root = key.substring(0, key.length() - 4);
					String crc = Base62.generateMD5asBase62String(content);
					String servletPath = "/" + root + crc + ".css";
					container.addServlet(root + crc + "css", new ResourceServlet(content, "text/css")).addMapping(
							servletPath);

					scriptAndLinkTags.get(key).append(
							String.format(CSSLINK_TAG, container.getContextPath() + servletPath));
				}
			}
		}

		for (Map.Entry<String, StringBuilder> entry : scriptAndLinkTags.entrySet()) {
			container.setAttribute(entry.getKey(), entry.getValue());
		}

	}

	private List<String> enumerateResources(ServletContext container, String line, String suffix) {
		if (line.endsWith("/")) {
			List<String> resources = new ArrayList<>();

			Set<String> resourcePaths = container.getResourcePaths(line);
			if (resourcePaths != null) {
				for (String resource : resourcePaths) {
					resources.addAll(enumerateResources(container, resource, suffix));
				}
			}

			return resources;
		}

		if (line.endsWith(suffix)) {
			return Collections.singletonList(line);
		}

		return Collections.emptyList();
	}

	private static String cleanCode(String sourcecode) {
		Matcher matcher = DEV_CODE_PATTERN.matcher(sourcecode);
		StringBuffer cleanCode = new StringBuffer();
		while (matcher.find()) {
			matcher.appendReplacement(cleanCode, "");
		}
		matcher.appendTail(cleanCode);
		return cleanCode.toString();
	}

	private List<String> readAllLinesFromWebResourceConfigFile() {
		try (InputStream is = getClass().getResourceAsStream(webResourcesConfigName)) {
			return readAllLines(is, StandardCharsets.UTF_8);
		} catch (IOException ioe) {
			logger.error("read lines from web resource config '" + webResourcesConfigName + "'", ioe);
		}
		return Collections.emptyList();
	}

	private static List<String> readAllLines(InputStream is, Charset cs) throws IOException {
		CharsetDecoder decoder = cs.newDecoder();
		Reader inputStreamReader = new InputStreamReader(is, decoder);

		try (BufferedReader reader = new BufferedReader(inputStreamReader)) {
			List<String> result = new ArrayList<>();
			for (;;) {
				String line = reader.readLine();
				if (line == null) {
					break;
				}
				result.add(line);
			}
			return result;
		}
	}

	private static String inputStream2String(InputStream is, Charset cs) throws IOException {
		StringBuilder to = new StringBuilder();
		CharsetDecoder decoder = cs.newDecoder();
		try (Reader from = new InputStreamReader(is, decoder)) {
			CharBuffer buf = CharBuffer.allocate(0x800);
			while (from.read(buf) != -1) {
				buf.flip();
				to.append(buf);
				buf.clear();
			}
			return to.toString();
		}
	}

	private static String createHtmlCode(ServletContext container, String line, String varName) {
		String url = container.getContextPath() + line;
		if (varName.endsWith("_js")) {
			return String.format(JAVASCRIPT_TAG, url);
		} else if (varName.endsWith("_css")) {
			return String.format(CSSLINK_TAG, url);
		}
		logger.warn("Variable has to end with _js or _css");
		return null;
	}

	private static String changeImageUrls(String cssSourceCode, String cssPath) {
		Matcher matcher = CSS_URL_PATTERN.matcher(cssSourceCode);
		StringBuffer sb = new StringBuffer();

		Path basePath = Paths.get(cssPath.substring(1));

		while (matcher.find()) {
			String url = matcher.group(2);
			url = url.trim();
			if (url.equals("#default#VML")) {
				continue;
			}
			Path pa = basePath.resolveSibling(url).normalize();
			matcher.appendReplacement(sb, "$1" + pa.toString().replace("\\", "/") + "$3");
		}
		matcher.appendTail(sb);
		return sb.toString();
	}

	private String minifyJs(final String jsSourceCode) throws EvaluatorException, IOException {
		ErrorReporter errorReporter = new JavaScriptCompressorErrorReporter();

		JavaScriptCompressor jsc = new JavaScriptCompressor(new StringReader(jsSourceCode), errorReporter);
		StringWriter sw = new StringWriter();
		jsc.compress(sw, jsLinebreakPos, jsCompressorMunge, jsCompressorVerbose, jsCompressorPreserveAllSemiColons,
				jsCompressordisableOptimizations);
		return sw.toString();

	}

	private String compressCss(final String css) throws EvaluatorException, IOException {
		CssCompressor cc = new CssCompressor(new StringReader(css));
		StringWriter sw = new StringWriter();
		cc.compress(sw, cssLinebreakPos);
		return sw.toString();
	}

	private static String replaceVariables(final Map<String, String> variables, final String inputLine) {
		String processedLine = inputLine;
		for (Entry<String, String> entry : variables.entrySet()) {
			String var = "{" + entry.getKey() + "}";
			processedLine = processedLine.replace(var, entry.getValue());
		}
		return processedLine;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map<String, String> readVariablesFromPropertyResource() {
		try (InputStream is = getClass().getResourceAsStream(versionPropertiesName)) {
			Properties properties = new Properties();
			properties.load(is);
			return (Map) properties;
		} catch (IOException ioe) {
			logger.error("read variables from property '" + versionPropertiesName + "'", ioe);
		}
		return Collections.emptyMap();
	}

	private final class JavaScriptCompressorErrorReporter implements ErrorReporter {
		@Override
		public void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
			if (line < 0) {
				logger.warn("JavaScriptCompressor warning: {}", message);
			} else {
				logger.warn("JavaScriptCompressor warning: {}:{}:{}", line, lineOffset, message);
			}
		}

		@Override
		public void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
			if (line < 0) {
				logger.error("JavaScriptCompressor error: {}", message);
			} else {
				logger.error("JavaScriptCompressor error: {}:{}:{}", line, lineOffset, message);
			}
		}

		@Override
		public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource,
				int lineOffset) {
			error(message, sourceName, line, lineSource, lineOffset);
			return new EvaluatorException(message);
		}
	}

}
