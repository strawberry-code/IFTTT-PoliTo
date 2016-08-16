package it.polito.ai.ifttt.progetto.configurations;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	/*@Autowired
	DataSource dataSource;*/
	@Autowired
	CustomAuthenticationProvider authProvider;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		/*auth.jdbcAuthentication().dataSource(dataSource)
		.usersByUsernameQuery("select username, password, enabled from users where username=?")
		.authoritiesByUsernameQuery("select username, name from users_roles where username=?");*/
		auth.authenticationProvider(authProvider);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/static/**");
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		.antMatchers(HttpMethod.GET, "/index.jsp", "/api/registration", "/api/index.html", "/index.html", "/api/activation.html", "/api/twitter/tw.token").permitAll()
		.antMatchers(HttpMethod.POST, "/api/registration", "/api/prova").permitAll()
        .anyRequest().hasRole("USER")
		.and()
		.formLogin()
		.loginPage("/")
		.loginProcessingUrl("/login")
		.successHandler(new AuthenticationSuccessHandler() {
			
			public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication arg2)
					throws IOException, ServletException {
				//response.setStatus(200);
				response.sendRedirect("./#/index/myRecipes");
			}
		})
		.failureHandler(new AuthenticationFailureHandler() {
			public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
					AuthenticationException exception) throws IOException, ServletException {
				
				HttpSession session = request.getSession();
				synchronized (session) {
					session.setAttribute("msg", exception.getMessage());
				} 
				//response.sendError(HttpServletResponse.SC_UNAUTHORIZED, exception.getMessage());
				response.sendRedirect("./");				
			}
		})
		.and()
		.logout().logoutUrl("/logout")
		.and()
		.csrf().disable();
		
/*		http
		.exceptionHandling()
		.authenticationEntryPoint(new AuthenticationEntryPoint() {			
			public void commence(HttpServletRequest request, HttpServletResponse response,
					AuthenticationException authException) throws IOException, ServletException {
				System.out.println(HttpServletResponse.SC_UNAUTHORIZED);
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
			}
		});*/
	}

	
}
