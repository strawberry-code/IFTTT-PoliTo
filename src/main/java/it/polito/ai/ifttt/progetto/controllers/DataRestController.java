package it.polito.ai.ifttt.progetto.controllers;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

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
import it.polito.ai.ifttt.progetto.models.returnProfileClass;
import it.polito.ai.ifttt.progetto.services.CalendarManager;
import it.polito.ai.ifttt.progetto.services.EmailValidator;
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
	@Autowired
	javax.mail.Session sessionMail;

	List<String> timezones = new ArrayList<String>(Arrays.asList(TimeZone.getAvailableIDs()));

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

		if (timezones.contains(timezone) == false) {
			i = 6;
		} else {
			try {
				email = URLDecoder.decode(email, "UTF-8");
				if (username != null && password != null && email != null)
					i = loginManager.register(username, password, email, timezone);
			} catch (UnsupportedEncodingException e) {
				i = 6;
			}
		}

		// i=0 : You have successfully signed. To complete the registration,
		// please check your email
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
		//System.out.println(data);
		Integer code = recipesManager.addRecipe(data);
		return code;
	}

	@RequestMapping(value = "userRecipes", method = RequestMethod.GET)
	List<recipeJsonClass> getRecipes() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if(user==null){
			return new ArrayList<recipeJsonClass>();
		}
		List<Recipes> recipes = user.getRecipes();
		if(recipes==null){
			return new ArrayList<recipeJsonClass>();
		}
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
				return new ArrayList<recipeJsonClass>();
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
				return new ArrayList<recipeJsonClass>();
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
		//System.out.println(data);
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
		if (user != null) {
			code = recipesManager.invalidateGoogleRecipes(user);
		} else {
			code = -1;
		}

		returnClass res = new returnClass();
		if (code == -1) {
			res.setDisconnected(false);
		} else {
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
		if (user != null) {
			code = recipesManager.invalidateTwitterRecipes(user);
		} else {
			code = -1;
		}

		returnClass res = new returnClass();
		if (code == -1) {
			res.setDisconnected(false);
		} else {
			res.setDisconnected(true);
		}
		return res;
	}

	@SuppressWarnings("static-access")
	@RequestMapping(value = "changepassword", method = RequestMethod.POST)
	Integer changePassword(@RequestBody requestClass data) {

		Integer code = 0; // both
		Boolean codp = false;
		Boolean codt = false;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			code = -1;
		} else {
			// check the old password
			if (user.getPassword().compareTo(this.computeMD5(data.getOldpassword())) == 0) {

				// set password
				if (data.getFlagPassword() == true) {
					if (data.getNewpassword() == null) {
						code = -3;
					} else {
						if (data.getNewpassword().length() < 8) {
							code = -3;
						} else {
							user.setPassword(this.computeMD5(data.getNewpassword()));
							codp = true;
							code = 1;
						}
					}
				}

				// set timezone
				if (data.getFlagTimezone() == true) {
					if (data.getTimezone() == null) {
						code = -1;
					} else {
						if (timezones.contains(data.getTimezone()) == false) {
							code = -1;
						} else {
							user.setTimezone(data.getTimezone());
							codt = true;
							code = 2;
						}
					}
				}

				loginManager.changePasswordTimezone(user);
			} else {
				// old password not valid
				code = -2;
			}
		}

		if (codt == true && codp == true) {
			// both
			code = 0;
		}

		// 0 timezone and password ok
		// 1 password ok
		// 2 timezone ok
		// -1 some errors
		// -2 old password not valid
		// -3 new password not valid

		return code;
	}

	@RequestMapping(value = "publish/userRecipes/{id}", method = RequestMethod.PUT)
	Integer publishRecipe(@PathVariable("id") Integer id, @RequestBody Boolean data) {

		//System.out.println(data);
		Integer code = 0;

		Recipes recipe = recipesManager.findRecipesById(id);
		if (recipe == null) {
			code = -1;
		} else {
			if (data == true) {
				recipe.setPublish(true);
				recipesManager.publishRecipe(recipe);
			} else if (data == false) {
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
		// String username =
		// SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		// Users user = loginManager.findUserByUsername(username);
		// List<Recipes> recipes = user.getRecipes();

		// devo prendere TUTTE le ricette presenti nel db
		List<Recipes> recipes = recipesManager.findAllRecipes();
		if (recipes == null) {
			return new HashSet<Types>();
		}
		// List<recipeJsonClass> list = new ArrayList<recipeJsonClass>();
		Set<Types> handleDup = new HashSet<Types>();
		for (Recipes r : recipes) {

			// controllo se sono state pubblicate
			if (r.getPublish()) {

				Types retClass = new Types();

				// recipeJsonClass ricettaJson = new recipeJsonClass();
				// ricettaJson.setId(r.getRid());
				// ricettaJson.setDescription(r.getDescription());

				// prelevo trigger e setto
				String triggerType = r.getTriggerType();
				Integer triggerid = r.getTriggerid();
				Integer triggerIngredientCode = null;
				// Object trigger = null;
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
					return new HashSet<Types>();
				}
				// ricettaJson.setTrigger(trigger);
				retClass.setTriggerIngredientCode(triggerIngredientCode);

				// prelevo action e setto
				String actionType = r.getActionType();
				Integer actionIngredientCode = null;
				Integer actionid = r.getActionid();
				// Object action = null;
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
					return new HashSet<Types>();
				}
				retClass.setActionIngredientCode(actionIngredientCode);
				// ricettaJson.setAction(action);
				// ricettaJson.setPublish(r.getPublish());

				// list.add(ricettaJson);
				handleDup.add(retClass);
			}
		}

		// DEBUG
		// for(Types r : handleDup) {
		// System.out.println(r.getTriggerIngredientCode()+" -
		// "+r.getActionIngredientCode());
		// }
		//
		return handleDup;
	}

	@SuppressWarnings("static-access")
	@RequestMapping(value = "deleteAccount", method = RequestMethod.POST)
	Integer deleteAccount(@RequestBody requestClass data) {
		Integer code = 0;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			code = -1;
		} else {
			if (data.getNewpassword() == null
					|| user.getPassword().compareTo(this.computeMD5(data.getNewpassword())) != 0) {
				code = -2;
			} else {
				code = loginManager.deleteAccount(user);
			}
		}

		// code:
		// 0 success
		// -1 error
		// -2 wrong password

		return code;
	}

	@RequestMapping(value = "forgotPassword", method = RequestMethod.POST)
	Integer forgotPassword(@RequestBody requestClass data) {
		Integer code = 0;
		// String username =
		// SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (data.getUsername() != null) {
			Users user = loginManager.findUserByUsername(data.getUsername());
			if (user == null) {
				code = -2;
			} else {
				//check email
				if (data.getEmail() != null) {
					EmailValidator emailvalidator = new EmailValidator(data.getEmail());
					if (emailvalidator.validate() == true && user.getEmail().compareTo(data.getEmail()) == 0) {

						// create new random password
						String newpassword = UUID.randomUUID().toString().substring(0, 10);

						// compute MD5 and save it in db
						user.setPassword(this.computeMD5(newpassword));
						loginManager.changePasswordTimezone(user);

						// send email with new password
						try {

							Message message = new MimeMessage(sessionMail);
							message.setFrom(new InternetAddress("ifttt.ai2016@gmail.com"));
							message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(data.getEmail()));
							message.setSubject("New Credentials");
							message.setContent("<p>Dear <b>" + data.getUsername() + "</b>,</p><p>these are your new credentials:</p>"
									+ "<p>Username: " + data.getUsername() + "<br>Password: " + newpassword +"</p>"
									+ "<p>Please, remember to change your password!</p>", "text/html");
							Transport.send(message);

						} catch (MessagingException e) {
							//System.out.println(e.getMessage());
							code = -1;
						}
					} else {
						code = -3;
					}
				} else {
					code = -3;
				}
			}
		} else {
			code = -1;
		}

		// code:
		// 0 success
		// -1 error
		// -2 invalid username
		// -3 invalid email
		return code;
	}

	@RequestMapping(value = "deleteAllRecipes", method = RequestMethod.POST)
	returnClass deleteAllRecipes() {
		Integer code = 0;
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			code = -1;
		} else {
			code = loginManager.deleteAllRecipes(user);
		}

		returnClass res = new returnClass();
		res.setDeleted(code);
		return res;
	}
	
	@RequestMapping(value = "infoProfile", method = RequestMethod.GET)
	returnProfileClass getInfoProfile() {
				
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if(user == null) {
			return null;
		}		
		returnProfileClass profile = new returnProfileClass();
		profile.setUsername(user.getUsername());
		profile.setEmail(user.getEmail());
		profile.setTimezone(user.getTimezone());
		
		return profile;
	}
	

	// function to compute an MD5 hash of the user password
	public static String computeMD5(String input) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] messageDigest = md.digest(input.getBytes());
			BigInteger number = new BigInteger(1, messageDigest);
			String hashtext = number.toString(16);
			// Now we need to zero pad it if you actually want the full 32
			// chars.
			while (hashtext.length() < 32) {
				hashtext = "0" + hashtext;
			}
			return hashtext;
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}
}
