package it.polito.ai.ifttt.progetto.configurations;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class Initializer extends AbstractAnnotationConfigDispatcherServletInitializer {
 	
	@Override
	protected Class<?>[] getRootConfigClasses() {
		return new Class[]{RootConfig.class, SecurityConfig.class};
	}
	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class[]{WebConfig.class};
	}
	@Override
	protected String[] getServletMappings() {
		return new String[]{"/api/*"};
	}

}
