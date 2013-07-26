package ch.rasc.musicsearch.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ch.ralscha.extdirectspring.util.ExtDirectSpringUtil;

public class ResourceServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private final byte[] data;

	private final String contentType;

	private final String etag;
	
	private final Integer cacheInMonths;

	public ResourceServlet(final byte[] data, final String etag, final Integer cacheInMonths, final String contentType) {
		this.data = data;
		this.contentType = contentType;
		this.etag = "\"" + etag + "\"";
		this.cacheInMonths = cacheInMonths;
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

		ExtDirectSpringUtil.addCacheHeaders(response, etag, cacheInMonths);

		@SuppressWarnings("resource")
		ServletOutputStream out = response.getOutputStream();
		out.write(data);
		out.flush();
	}
}
