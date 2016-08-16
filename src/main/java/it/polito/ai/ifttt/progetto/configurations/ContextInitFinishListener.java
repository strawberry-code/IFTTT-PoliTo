package it.polito.ai.ifttt.progetto.configurations;

import javax.mail.Session;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import it.polito.ai.ifttt.progetto.services.CalendarManager;
import it.polito.ai.ifttt.progetto.services.GmailManager;
import it.polito.ai.ifttt.progetto.services.LoginManager;
import it.polito.ai.ifttt.progetto.services.RecipesManager;
import it.polito.ai.ifttt.progetto.services.ThreadFunction;
import it.polito.ai.ifttt.progetto.services.TwitterManager;
import it.polito.ai.ifttt.progetto.services.WeatherManager;

public class ContextInitFinishListener implements ApplicationListener<ContextRefreshedEvent> {

    LoginManager loginManager;
    GmailManager gmailManager;
    CalendarManager calendarManager;
    WeatherManager weatherManager;
    RecipesManager recipesManager;
    TwitterManager twitterManager;
    Session sessionMail;

    public ContextInitFinishListener(LoginManager loginManager, GmailManager gmailManager, 
    		RecipesManager recipesManager, Session sessionMail, WeatherManager weatherManager,
    		CalendarManager calendarManager, TwitterManager twitterManager) {
        this.loginManager = loginManager;
        this.gmailManager = gmailManager;
        this.recipesManager = recipesManager;
        this.sessionMail = sessionMail;
        this.weatherManager = weatherManager;
        this.calendarManager = calendarManager;
        this.twitterManager = twitterManager;
    }

	public void onApplicationEvent(ContextRefreshedEvent event) {
		if(event.getApplicationContext().getParent()==null) {
			System.out.println(">>>>>>>>>>> Sono in questo AppEvent! <<<<<<<<<<<<<");
			(new ThreadFunction(this.loginManager, this.gmailManager, this.recipesManager, 
					this.sessionMail, this.weatherManager, this.calendarManager, this.twitterManager)).start();
		}		
	}
}
