package tr.com.obss.jss.config;

import com.google.common.collect.ImmutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import tr.com.obss.jss.entity.User;
import tr.com.obss.jss.service.UserService;

import static javax.servlet.http.HttpServletResponse.SC_FORBIDDEN;
import static javax.servlet.http.HttpServletResponse.SC_OK;
import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;

import java.util.Optional;

@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true)
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private static final String[] AUTH_WHITELIST = { //
            "/h2-console", //
            "/h2-console/**", //
            "/v2/api-docs", //
            "/swagger-resources", //
            "/swagger-resources/**", //
            "/configuration/ui", //
            "/configuration/security", //
            "/swagger-ui.html", //
            "/webjars/**", //
            "/graphiql", //
            "/api/graphql", //
    };

    @Autowired
    private UserService userService;

    @Bean
    public UserDetailsService userDetailsService() {
        return userService;
    }

    @Autowired
    private PasswordEncoder encoder;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(encoder);
        
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().authorizeRequests()
                .antMatchers(AUTH_WHITELIST).permitAll()
                .antMatchers(HttpMethod.POST, "/api/users").permitAll()
                .antMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .antMatchers("/api/users/has-role-user").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/books").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
                .anyRequest().hasAnyRole("ADMIN", "USER")
                .and()
                .exceptionHandling()
                .accessDeniedHandler((req, resp, ex) -> resp.setStatus(SC_FORBIDDEN)) // if someone tries to access protected resource but doesn't have enough permissions
                .authenticationEntryPoint((req, resp, ex) -> resp.setStatus(SC_UNAUTHORIZED)).and()
                .formLogin()
                .loginProcessingUrl("/login")
                .successHandler((req, resp, auth) -> 
                	{
                		String username = req.getParameter("username");
                		User usr = userService.findByUsername(username).get();
                		resp.setStatus(SC_OK);
                		resp.setContentType("application/json");
                		resp.getWriter().write(String.format("{ \"id\": %d, \"username\": \"%s\", \"isAdmin\": %b}", usr.getId(), username, usr.isAdmin()));
                		
                	}) // success authentication
                .failureHandler((req, resp, ex) -> resp.setStatus(SC_FORBIDDEN)).and() // bad credentials
                .sessionManagement()
                .invalidSessionStrategy((req, resp) -> resp.setStatus(SC_UNAUTHORIZED))
                .and()
                .logout().invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .logoutUrl("/logout")
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
                .and()
                .csrf().disable();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(ImmutableList.of("*"));
        configuration.setAllowedMethods(ImmutableList.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(ImmutableList.of("Authorization", "Cache-Control", "Content-Type", "Cookie", "Referer", "User-Agent", "Set-Cookie"));
        configuration.setExposedHeaders(ImmutableList.of("Authorization", "Cache-Control", "Content-Type", "Cookie", "Referer", "User-Agent", "Set-Cookie"));

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    
    
    
}
