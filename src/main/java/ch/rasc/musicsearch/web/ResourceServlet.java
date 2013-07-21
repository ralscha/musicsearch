package ch.rasc.musicsearch.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.DigestUtils;

import ch.ralscha.extdirectspring.util.ExtDirectSpringUtil;

public class ResourceServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private final byte[] data;

	private final String contentType;

	private final String etag;

	public ResourceServlet(byte[] data, String contentType) {
		this.data = data;
		this.contentType = contentType;
		etag = "\"0" + DigestUtils.md5DigestAsHex(data) + "\"";
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		handleCacheableResponse(request, response);
	}

	public void handleCacheableResponse(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String ifNoneMatch = request.getHeader("If-None-Match");

		if (etag.equals(ifNoneMatch)) {
			response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
			return;
		}

		response.setContentType(contentType);
		response.setContentLength(data.length);

		ExtDirectSpringUtil.addCacheHeaders(response, etag, 6);

		@SuppressWarnings("resource")
		ServletOutputStream out = response.getOutputStream();
		out.write(data);
		out.flush();
	}
}
