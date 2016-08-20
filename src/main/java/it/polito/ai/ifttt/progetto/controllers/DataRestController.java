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

		// i=0 : You have successfully signed. To complete the registration, please check your email
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
		Integer code = recipesManager.addRecipe(data);
		return code;
	}
	
	@RequestMapping(value = "userRecipes", method = RequestMethod.GET)
	List<recipeJsonClass> getRecipes() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		List<Recipes> recipes = user.getRecipes();
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
		}
		return list;
	}
	
	@RequestMapping(value = "userRecipes/{id}", method = RequestMethod.PUT)
	Integer modifyRecipe(@PathVariable("id") Integer id, @RequestBody String data) {
		System.out.println(data);
		Integer code = recipesManager.modifyRecipe(id, data);
		// -1 if error
		return code;
	}
	
	@RequestMapping(value = "userRecipes/{id}", method = RequestMethod.DELETE)
	Integer deleteRecipe(@PathVariable("id") Integer id) {
		Integer code = recipesManager.deleteRecipe(id);
		// -1 if error
		return code;
	}
	
	
	//To check if he/her is authenticated
	@RequestMapping(value = "prova", method = RequestMethod.POST)
	returnClass provaLogin() {
		
		String ret = "";
		String retG = "";
		String retT = "";
		
		//check if he/her is auhenticated to ifttt polito
		String user = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if(user!=null && user.compareTo("anonymousUser")!=0) {
			ret = "true";
		}
		else {
			ret = "false";
		}
		
		//check if he/her is auhenticated to google
		Boolean connectedG = loginManager.checkGoogleConnection(user);
		if(connectedG) {
			retG = "true";
		}
		else {
			retT = "false";
		}
		
		//check if he/her is auhenticated to twitter
		Boolean connectedT = loginManager.checkTwitterConnection(user);
		if(connectedT) {
			retT = "true";
		}
		else {
			retT = "false";
		}
		
		returnClass res = new returnClass();
		res.setIftttLogged(ret);
		res.setGoogleLogged(retG);
		res.setTwitterLogged(retT);
		return res;
	}
	
	@RequestMapping(value = "disconnectGoogle", method = RequestMethod.POST)
	returnClass disconnectGoogle() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		loginManager.disconnectGoogle(username);
		
		//TODO: occorre invalidare anche tutte le ricette dell'utente
		//		con google (ad esempio ponendo un booleano "valid" e 
		//		aggiungendo tutti i controlli nella logica
		
		returnClass res = new returnClass();
		res.setDisconnected(true);
		return res;
	}
	
	@RequestMapping(value = "disconnectTwitter", method = RequestMethod.POST)
	returnClass disconnectTwitter() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		loginManager.disconnectTwitter(username);
		
		//TODO: occorre invalidare anche tutte le ricette dell'utente
		//		con twitter (ad esempio ponendo un booleano "valid" e 
		//		aggiungendo tutti i controlli nella logica
		
		returnClass res = new returnClass();
		res.setDisconnected(true);
		return res;
	}
	
	@RequestMapping(value = "changepassword", method = RequestMethod.POST)
	Integer changePassword(@RequestBody requestClass data) {
		
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		
		String newpass = data.getNewpassword();		
		Integer code = loginManager.changePassword(username, newpass);
		
		//-1 if error
		return code;
	}
}
