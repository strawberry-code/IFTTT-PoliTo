package it.polito.ai.ifttt.progetto.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import it.polito.ai.ifttt.progetto.models.CalendarAction;
import it.polito.ai.ifttt.progetto.models.CalendarTrigger;
import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.GmailTrigger;
import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.TwitterAction;
import it.polito.ai.ifttt.progetto.models.TwitterTrigger;
import it.polito.ai.ifttt.progetto.models.Types;
import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.WeatherTrigger;
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
		String timezone = null;

		Integer i = null;

		username = user.getUsername();
		password = user.getPassword();
		email = user.getEmail();
		timezone = user.getTimezone();

		List<String> timezones = new ArrayList<String>(Arrays.asList(TimeZone.getAvailableIDs()));	
		if(timezones.contains(timezone)==false) {
			i=7;
		}
		else {
			try {
				email = URLDecoder.decode(email, "UTF-8");
				if (username != null && password != null && email != null)
					i = loginManager.register(username, password, email, timezone);
			} catch (UnsupportedEncodingException e) {
				i=6;
			}
		}

		// i=0 : You have successfully signed. To complete the registration, please check your email
		// i=1 : user already exist
		// i=2 : email already exist
		// i=3 : email not valid
		// i=4 : password too short
		// i=5 : username too short
		// i=6 : some errors
		// i=7 : timezone not valid

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
		for (Recipes r : recipes) {
			recipeJsonClass ricettaJson = new recipeJsonClass();
			ricettaJson.setId(r.getRid());
			ricettaJson.setDescription(r.getDescription());

			// prelevo trigger e setto
			String triggerType = r.getTriggerType();
			Integer triggerid = r.getTriggerid();
			Object trigger = null;
			if (triggerType.compareTo("gmail") == 0) {
				trigger = gmailManager.findGmailTriggerById(triggerid);
			} else if (triggerType.compareTo("calendar") == 0) {
				trigger = calendarManager.findCalendarTriggerById(triggerid);
			} else if (triggerType.compareTo("weather") == 0) {
				trigger = weatherManager.findWeatherTriggerById(triggerid);
			} else if (triggerType.compareTo("twitter") == 0) {
				trigger = twitterManager.findTwitterTriggerById(triggerid);
			} else {
				// valore non valido
				return null;
			}
			ricettaJson.setTrigger(trigger);

			// prelevo action e setto
			String actionType = r.getActionType();
			Integer actionid = r.getActionid();
			Object action = null;
			if (actionType.compareTo("gmail") == 0) {
				action = gmailManager.findGmailActionById(actionid);
			} else if (actionType.compareTo("calendar") == 0) {
				action = calendarManager.findCalendarActionById(actionid);
			} else if (actionType.compareTo("twitter") == 0) {
				action = twitterManager.findTwitterActionById(actionid);
			} else {
				// valore non valido
				return null;
			}
			ricettaJson.setAction(action);

			ricettaJson.setPublish(r.getPublish());
			ricettaJson.setValid(r.getValid());

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

	// To check if he/her is authenticated
	@RequestMapping(value = "prova", method = RequestMethod.POST)
	returnClass provaLogin() {

		String ret = "";
		String retG = "";
		String retT = "";

		// check if he/her is auhenticated to ifttt polito
		String user = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (user != null && user.compareTo("anonymousUser") != 0) {
			ret = "true";
		} else {
			ret = "false";
		}

		// check if he/her is auhenticated to google
		Boolean connectedG = loginManager.checkGoogleConnection(user);
		if (connectedG) {
			retG = "true";
		} else {
			retT = "false";
		}

		// check if he/her is auhenticated to twitter
		Boolean connectedT = loginManager.checkTwitterConnection(user);
		if (connectedT) {
			retT = "true";
		} else {
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
		Integer code = 0;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		
		loginManager.disconnectGoogle(username);
		
		Users user = loginManager.findUserByUsername(username);
		if(user != null) {
			code = recipesManager.invalidateGoogleRecipes(user);
		}
		else {
			code = -1;
		}	
		
		returnClass res = new returnClass();
		if(code==-1) {
			res.setDisconnected(false);
		}
		else {
			res.setDisconnected(true);
		}	
		return res;
	}

	@RequestMapping(value = "disconnectTwitter", method = RequestMethod.POST)
	returnClass disconnectTwitter() {
		Integer code = 0;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		
		loginManager.disconnectTwitter(username);

		Users user = loginManager.findUserByUsername(username);
		if(user != null) {
			code = recipesManager.invalidateTwitterRecipes(user);
		}
		else {
			code = -1;
		}	
		
		returnClass res = new returnClass();
		if(code==-1) {
			res.setDisconnected(false);
		}
		else {
			res.setDisconnected(true);
		}	
		return res;
	}

	@RequestMapping(value = "changepassword", method = RequestMethod.POST)
	Integer changePassword(@RequestBody requestClass data) {

		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		String newpass = data.getNewpassword();
		Integer code = loginManager.changePassword(username, newpass);

		// -1 if error
		return code;
	}

	@RequestMapping(value = "publish/userRecipes/{id}", method = RequestMethod.PUT)
	Integer publishRecipe(@PathVariable("id") Integer id, @RequestBody Boolean data) {

		System.out.println(data);
		Integer code = 0;

		Recipes recipe = recipesManager.findRecipesById(id);
		if (recipe == null) {
			code = -1;
		} else {
			if (data==true) {
				recipe.setPublish(true);
				recipesManager.publishRecipe(recipe);
			} else if(data==false) {
				recipe.setPublish(false);
				recipesManager.publishRecipe(recipe);
			} else {
				code = -1;
			}
		}
		// -1 if error
		return code;
	}
	
	@RequestMapping(value = "publish/userRecipes", method = RequestMethod.GET)
	Set<Types> getPublishRecipe() {
	//	String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
	//	Users user = loginManager.findUserByUsername(username);
	//	List<Recipes> recipes = user.getRecipes();
		
		// devo prendere TUTTE le ricette presenti nel db
		List<Recipes> recipes = recipesManager.findAllRecipes();
		if(recipes==null) {
			return null;
		}
	//	List<recipeJsonClass> list = new ArrayList<recipeJsonClass>();
		Set<Types> handleDup = new HashSet<Types>();
		for (Recipes r : recipes) {
			
			// controllo se sono state pubblicate
			if(r.getPublish()) {
				
				Types retClass = new Types();
				
//				recipeJsonClass ricettaJson = new recipeJsonClass();
//				ricettaJson.setId(r.getRid());
//				ricettaJson.setDescription(r.getDescription());
				
				// prelevo trigger e setto
				String triggerType = r.getTriggerType();
				Integer triggerid = r.getTriggerid();
				Integer triggerIngredientCode = null;
//				Object trigger = null;
				if (triggerType.compareTo("gmail") == 0) {
					GmailTrigger trigger = gmailManager.findGmailTriggerById(triggerid);
					triggerIngredientCode = trigger.getIngredientCode();
				} else if (triggerType.compareTo("calendar") == 0) {
					CalendarTrigger trigger = calendarManager.findCalendarTriggerById(triggerid);
					triggerIngredientCode = trigger.getIngredientCode();
				} else if (triggerType.compareTo("weather") == 0) {
					WeatherTrigger trigger = weatherManager.findWeatherTriggerById(triggerid);
					triggerIngredientCode = trigger.getIngredientCode();
				} else if (triggerType.compareTo("twitter") == 0) {
					TwitterTrigger trigger = twitterManager.findTwitterTriggerById(triggerid);
					triggerIngredientCode = trigger.getIngredientCode();
				} else {
					// valore non valido
					return null;
				}
//				ricettaJson.setTrigger(trigger);
				retClass.setTriggerIngredientCode(triggerIngredientCode);
				
				// prelevo action e setto
				String actionType = r.getActionType();
				Integer actionIngredientCode = null;
				Integer actionid = r.getActionid();
//				Object action = null;
				if (actionType.compareTo("gmail") == 0) {
					GmailAction action = gmailManager.findGmailActionById(actionid);
					actionIngredientCode = action.getIngredientCode();
				} else if (actionType.compareTo("calendar") == 0) {
					CalendarAction action = calendarManager.findCalendarActionById(actionid);
					actionIngredientCode = action.getIngredientCode();
				} else if (actionType.compareTo("twitter") == 0) {
					TwitterAction action = twitterManager.findTwitterActionById(actionid);
					actionIngredientCode = action.getIngredientCode();
				} else {
					// valore non valido
					return null;
				}
				retClass.setActionIngredientCode(actionIngredientCode);
			//	ricettaJson.setAction(action);
			//	ricettaJson.setPublish(r.getPublish());
				
//				list.add(ricettaJson);
				handleDup.add(retClass);
			}
		}
		
		//DEBUG
//		for(Types r : handleDup) {
//			System.out.println(r.getTriggerIngredientCode()+" - "+r.getActionIngredientCode());
//		}
//		
		return handleDup;
	}
	
	@RequestMapping(value = "deleteAccount", method = RequestMethod.POST)
	returnClass deleteAccount(@RequestBody String data) {
		Integer code = 0;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if(user==null) {
			code = -1;
		}
		else {
			code = loginManager.deleteAccount(user);
		}		
	
		returnClass res = new returnClass();
		if(code==-1) {
			res.setDisconnected(false);
		}
		else {
			res.setDisconnected(true);
		}	
		return res;
	}	
}
