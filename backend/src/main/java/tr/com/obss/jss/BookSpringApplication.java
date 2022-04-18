package tr.com.obss.jss;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tr.com.obss.jss.interceptor.RequestInInterceptor;

@SpringBootApplication
public class BookSpringApplication implements WebMvcConfigurer {
	@Autowired
	private RequestInInterceptor requestInInterceptor;


	public static void main(String[] args) {
		SpringApplication.run(BookSpringApplication.class, args);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		registry.addInterceptor(requestInInterceptor);
	}
}
