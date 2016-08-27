package it.polito.ai.ifttt.progetto.services;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;

import org.springframework.web.context.ServletContextAware;

public class RuntimeConfiguration implements ServletContextAware {

    private ServletContext context;
    private ServletConfig config;

    public void setServletContext(final ServletContext servletContext) {
        this.context = servletContext;
    }

    public ServletContext getServletContext(){
        return context;
    }
    //do other tasks
}
