package it.polito.ai.ifttt.progetto.controllers;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.gmail.GmailScopes;

import it.polito.ai.ifttt.progetto.models.CalendarTrigger;
import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.recipeJsonClass;
import it.polito.ai.ifttt.progetto.models.requestClass;
import it.polito.ai.ifttt.progetto.models.returnClass;
import it.polito.ai.ifttt.progetto.services.CalendarManager;
import it.polito.ai.ifttt.progetto.services.GmailManager;
import it.polito.ai.ifttt.progetto.services.LoginManager;
import it.polito.ai.ifttt.progetto.services.RecipesManager;
import it.polito.ai.ifttt.progetto.services.TwitterManager;
import it.polito.ai.ifttt.progetto.services.WeatherManager;

@RestController
@RequestMapping("/")
public class DataRestController {

	@Autowired
	LoginManager loginManager;
	@Autowired
	RecipesManager recipesManager;
	@Autowired
	GmailManager gmailManager;
	@Autowired
	WeatherManager weatherManager;;
	@Autowired
	CalendarManager calendarManager;
	@Autowired
	TwitterManager twitterManager;

	@RequestMapping(value = "registration", method = RequestMethod.POST)
	Integer registerUser(@RequestBody Users user) {

		String username = null;
		String password = null;
		String email = null;

		System.out.println(user.toString());

		username = user.getUsername();
		password = user.getPassword();
		email = user.getEmail();

		System.out.println(username + ", " + password + ", " + email);

		/*
		 * String[] splits = user.split("&"); username =
		 * splits[0].split("=")[1]; password = splits[2].split("=")[1]; email =
		 * splits[1].split("=")[1];
		 */

		try {
			email = URLDecoder.decode(email, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Integer i = null;
		if (username != null && password != null && email != null)
			i = loginManager.register(username, password, email);

		System.out.println(i);

		// i=0 : ok
		// i=1 : user already exist
		// i=2 : email already exist
		// i=3 : email not valid
		// i=4 : password too short
		// i=5 : username too short
		// i=6 : some errors

		return i;
	}

	@RequestMapping(value = "userRecipes", method = RequestMethod.POST)
	Integer fillDatabase(@RequestBody String data) {
		System.out.println(data);
		Integer recipeid = recipesManager.addRecipe(data);
		return recipeid;
	}
	
	@RequestMapping(value = "userRecipes", method = RequestMethod.GET)
	List<recipeJsonClass> getRecipes() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		List<Recipes> recipes = user.getRecipes();
		System.out.println("Recipes list size: "+recipes.size());
		List<recipeJsonClass> list = new ArrayList<recipeJsonClass>();
		for(Recipes r : recipes) {
			recipeJsonClass ricettaJson = new recipeJsonClass();
			ricettaJson.setId(r.getRid());
			ricettaJson.setDescription(r.getDescription());
			
			//prelevo trigger e setto
			String triggerType = r.getTriggerType();
			Integer triggerid = r.getTriggerid();
			Object trigger = null;
			if(triggerType.compareTo("gmail")==0) {
				trigger = gmailManager.findGmailTriggerById(triggerid);
			} else if(triggerType.compareTo("calendar")==0) {
				trigger = calendarManager.findCalendarTriggerById(triggerid);
			} else if(triggerType.compareTo("weather")==0) {
				trigger = weatherManager.findWeatherTriggerById(triggerid);
			} else if(triggerType.compareTo("twitter")==0) {
				trigger = twitterManager.findTwitterTriggerById(triggerid);
			}
			else {
				//valore non valido
				return null;
			}			
			ricettaJson.setTrigger(trigger);
			
			//prelevo action e setto
			String actionType = r.getActionType();
			Integer actionid = r.getActionid();
			Object action = null;
			if(actionType.compareTo("gmail")==0) {
				action = gmailManager.findGmailActionById(actionid);
			} else if(actionType.compareTo("calendar")==0) {
				action = calendarManager.findCalendarActionById(actionid);
			} else if(actionType.compareTo("twitter")==0) {
				action = twitterManager.findTwitterActionById(actionid);
			}
			else {
				//valore non valido
				return null;
			}	
			ricettaJson.setAction(action);
			
			ricettaJson.setPublish(r.getPublish());
			
			list.add(ricettaJson);
			System.out.println(ricettaJson);
		}
		return list;
	}
	
	
	//To check if he/her is authenticated
	@RequestMapping(value = "prova", method = RequestMethod.POST)
	returnClass provaLogin() {
		
		String ret = "";
		String user = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if(user!=null && user.compareTo("anonymousUser")!=0) {
			ret = "true";
		}
		else {
			ret = "false";
		}
		
		returnClass res = new returnClass();
		res.setAuthenticated(ret);
		System.out.println(ret);
		return res;
	}
	

	// @RequestMapping(value = "login", method = RequestMethod.POST)
	// Integer login(@RequestBody String credentials) {
	//
	// String username = null;
	// String password = null;
	//
	// System.out.println(credentials);
	// String[] splits = credentials.split("&");
	// username = splits[0].split("=")[1];
	// password = splits[1].split("=")[1];
	//
	// int code = loginManager.login(username, password);
	//
	//// code=0 : ok
	//// code=1 : Wrong combination uername/password
	//// code=2 : User not activated
	//// code=3 : Some Errors (database)
	//
	// return code;
	// }
}
