package tr.com.obss.jss.filter;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

//import tr.com.obss.jss.model.MyUserDetails;

import javax.servlet.http.HttpServletRequest;

@Component
public class RequestInFilter extends CommonsRequestLoggingFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestInFilter.class);

    @Override
    protected boolean shouldLog(HttpServletRequest request) {
        String pathInfo = request.getRequestURI();
        return pathInfo.contains("/api/");
    }

    @Override
    protected void beforeRequest(HttpServletRequest request, String message) {
        LOGGER.info("Request filter başladı: {} {}", request.getRequestURI(), request.getMethod());
//    	if (request.getRequestURI().startsWith("/api/users/") && !request.getMethod().equals("GET")) {
//    		String[] params = request.getRequestURI().substring(11).split("/"); /* /api/users/1/aabbb */
//    		
//    		try
//    		{
//    			int uid = Integer.parseInt(params[0]);
//    			MyUserDetails details = (MyUserDetails)request.getUserPrincipal();
//    			if (!request.isUserInRole("ROLE_ADMIN") && details.getId() != uid)
//    			{
//    				
//    			}
//    		} catch (NumberFormatException ex) {}
//    	}
    }

    @Override
    protected void afterRequest(HttpServletRequest request, String message) {
        LOGGER.info("Request filter bitti: {} {}", request.getRequestURI(), request.getMethod());
    }
}
