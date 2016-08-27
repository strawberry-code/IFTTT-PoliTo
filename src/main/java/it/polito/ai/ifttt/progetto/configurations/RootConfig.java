package it.polito.ai.ifttt.progetto.configurations;

import java.util.Properties;

import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import it.polito.ai.ifttt.progetto.models.CalendarAction;
import it.polito.ai.ifttt.progetto.models.CalendarTrigger;
import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.GmailTrigger;
import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.Roles;
import it.polito.ai.ifttt.progetto.models.TwitterAction;
import it.polito.ai.ifttt.progetto.models.TwitterTrigger;
import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.WeatherTrigger;
import it.polito.ai.ifttt.progetto.services.CalendarManager;
import it.polito.ai.ifttt.progetto.services.CalendarManagerImpl;
import it.polito.ai.ifttt.progetto.services.GmailManager;
import it.polito.ai.ifttt.progetto.services.GmailManagerImpl;
import it.polito.ai.ifttt.progetto.services.LoadFile;
import it.polito.ai.ifttt.progetto.services.LoadFileImpl;
import it.polito.ai.ifttt.progetto.services.LoginManager;
import it.polito.ai.ifttt.progetto.services.LoginManagerImpl;
import it.polito.ai.ifttt.progetto.services.RecipesManager;
import it.polito.ai.ifttt.progetto.services.RecipesManagerImpl;
import it.polito.ai.ifttt.progetto.services.TwitterManager;
import it.polito.ai.ifttt.progetto.services.TwitterManagerImpl;
import it.polito.ai.ifttt.progetto.services.WeatherManager;
import it.polito.ai.ifttt.progetto.services.WeatherManagerImpl;

@Configuration
@ComponentScan("it.polito.ai.ifttt.progetto")
public class RootConfig {

	@Bean
	SessionFactory sessionFactory() {
		org.hibernate.cfg.Configuration c = new org.hibernate.cfg.Configuration();
		c.setProperty(Environment.USER, "root");
		c.setProperty(Environment.PASS, "mysqladmin");
		c.setProperty(Environment.DRIVER, "com.mysql.jdbc.Driver");
		c.setProperty(Environment.URL, "jdbc:mysql://localhost:3306/ifttt");
		c.addAnnotatedClass(Users.class);
		c.addAnnotatedClass(Roles.class);
		c.addAnnotatedClass(CalendarAction.class);
		c.addAnnotatedClass(CalendarTrigger.class);
		c.addAnnotatedClass(GmailAction.class);
		c.addAnnotatedClass(GmailTrigger.class);
		c.addAnnotatedClass(Recipes.class);
		c.addAnnotatedClass(WeatherTrigger.class);
		c.addAnnotatedClass(TwitterTrigger.class);
		c.addAnnotatedClass(TwitterAction.class);
		c.setProperty(Environment.DIALECT, "org.hibernate.dialect.MySQL5InnoDBDialect");
		c.setProperty(Environment.HBM2DDL_AUTO, "validate");
		return c.buildSessionFactory();
	}
	/*
	create/validate ROLE_USER  (tabella roles) 
	*/

	@Bean
	public DataSource dataSource() {
		DriverManagerDataSource ds = new DriverManagerDataSource();
		ds.setDriverClassName("com.mysql.jdbc.Driver");
		ds.setUrl("jdbc:mysql://localhost:3306/ifttt");
		ds.setUsername("root");
		ds.setPassword("mysqladmin");
		return ds;
	}

	@Bean
	Session sessionMail() {
		final String username = "ifttt.ai2016@gmail.com";
		final String password = "iftttai2016";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		return session;
	}

	@Bean
	public ApplicationListener<ContextRefreshedEvent> contextInitFinishListener() {
		return new ContextInitFinishListener(loginManager(), gmailManager(), recipesManager(), sessionMail(),
				weatherManager(), calendarManager(), twitterManager());
	}
	
	@Bean
	LoadFile loadFile() {
		return new LoadFileImpl();
	}

	@Bean
	LoginManager loginManager() {
		return new LoginManagerImpl();
	}

	@Bean
	RecipesManager recipesManager() {
		return new RecipesManagerImpl();
	}

	@Bean
	GmailManager gmailManager() {
		return new GmailManagerImpl();
	}

	@Bean
	WeatherManager weatherManager() {
		return new WeatherManagerImpl();
	}

	@Bean
	CalendarManager calendarManager() {
		return new CalendarManagerImpl();
	}
	
	@Bean
	TwitterManager twitterManager() {
		return new TwitterManagerImpl();
	}
}
