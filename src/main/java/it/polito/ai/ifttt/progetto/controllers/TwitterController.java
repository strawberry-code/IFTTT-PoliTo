package it.polito.ai.ifttt.progetto.controllers;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.requestClass;
import it.polito.ai.ifttt.progetto.models.returnClass;
import it.polito.ai.ifttt.progetto.services.LoginManager;
import it.polito.ai.ifttt.progetto.services.RecipesManager;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

@Controller
@RequestMapping("/twitter")
public class TwitterController {

	public static final String tw_appid = "quh3sSXVjZsPJD0858lbzk1ch";
	public static final String tw_appsecret = "4B2XJn3D0lCkVuFoQf3fY3P1oEsHV5GRDH1IlYKPnuY2ilWm8h";
	public static final String redirect_uri = "http://localhost:8080/progetto/api/twitter/tw.do";

	Twitter twitter = null;
	Users user = null;
	Authentication auth = null;

	String nextPath = null;
	Object varencr;
	Object trigger;
	Object action;

	@Autowired
	LoginManager loginManager;
	@Autowired
	RecipesManager recipesManager;

	@RequestMapping(value = "/tw.do", method = RequestMethod.GET)
	public RedirectView connectTwitter() {
		// The factory instance is re-useable and thread safe.
		// Twitter twitter = TwitterFactory.getSingleton();
		// twitter.setOAuthConsumer(tw_appid, tw_appsecret);

		ConfigurationBuilder builder = new ConfigurationBuilder();
		builder.setOAuthConsumerKey(tw_appid);
		builder.setOAuthConsumerSecret(tw_appsecret);
		Configuration configuration = builder.build();
		TwitterFactory factory = new TwitterFactory(configuration);
		this.twitter = factory.getInstance();

		auth = SecurityContextHolder.getContext().getAuthentication();
		// String username =
		// SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		// this.user = loginManager.findUserByUsername(username);

		RequestToken requestToken = null;
		try {
			requestToken = twitter.getOAuthRequestToken();
		} catch (TwitterException e1) {

			e1.printStackTrace();
		}
		return new RedirectView(requestToken.getAuthorizationURL());
	}

	@RequestMapping(value = "/tw.token", method = RequestMethod.GET, params = { "oauth_token", "oauth_verifier" })
	public RedirectView oauth2Callback(@RequestParam(value = "oauth_token") String oauth_token,
			@RequestParam(value = "oauth_verifier") String oauth_verifier) {

		AccessToken accessToken = null;
		try {
			accessToken = twitter.getOAuthAccessToken(oauth_verifier);
			// System.out.println(accessToken);
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		// save accessToken.getToken o getSecretToken o oauth_verifier
		if (this.auth != null) {
			SecurityContextHolder.getContext().setAuthentication(auth);
			String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
			System.out.println(username);
			this.user = loginManager.findUserByUsername(username);
			loginManager.setTwitterCredentials(user, accessToken.getToken(), accessToken.getTokenSecret());

		}

		// validate twitter recipes
		if (this.user != null) {
			recipesManager.validateTwitterRecipes(this.user);
		}

		String path = "";
		try {
			if (this.trigger.toString().compareTo("") == 0 && this.action.toString().compareTo("") == 0) {
				path = "http://localhost:8080/progetto/#" + this.nextPath + "?varencr="
						+ URLEncoder.encode(this.varencr.toString(), "UTF-8");
			} else {
				// if (this.trigger.toString().compareTo("") != 0) {
				path = "http://localhost:8080/progetto/#" + this.nextPath + "?varencr="
						+ URLEncoder.encode(this.varencr.toString(), "UTF-8") + "&trigger="
						+ URLEncoder.encode(this.trigger.toString(), "UTF-8") + "&action="
						+ URLEncoder.encode(this.action.toString(), "UTF-8");
				// }
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// String path = "http://localhost:8080/progetto/#" +
		// this.nextPath+"?count="+this.count;
		System.out.println(path);
		return new RedirectView(path);
	}

	@RequestMapping(value = "/tw.token", method = RequestMethod.GET, params = { "denied" })
	public RedirectView oauth2CallbackDenied(@RequestParam(value = "denied") String denied) {

		// Ricavo il path precedente dal nextPath che il client mi passa
		String path = "";
		if (this.nextPath.startsWith("Trigger") == true) {
			path = "http://localhost:8080/progetto/#/allTriggers";
		} else if (this.nextPath.startsWith("Action") == true) {
			path = "http://localhost:8080/progetto/#/createDO";
		} else {
			path = "http://localhost:8080/progetto/#/index/myRecipes";
		}

		try {
			if (this.trigger.toString().compareTo("") == 0 && this.action.toString().compareTo("") == 0) {
				path = path + "?varencr=" + URLEncoder.encode(this.varencr.toString(), "UTF-8");
			} else {
				path = path + "&trigger=" + URLEncoder.encode(this.trigger.toString(), "UTF-8");
				path = path + "&action=" + URLEncoder.encode(this.action.toString(), "UTF-8");
			}

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println(path);
		return new RedirectView(path);
	}

	@RequestMapping(value = "requestTwitter", method = RequestMethod.POST)
	@ResponseBody
	returnClass checkGoogleConnection(@RequestBody requestClass data) {

		System.out.println(data.getUrlNext());

		this.nextPath = data.getUrlNext();
		try {
			this.varencr = URLDecoder.decode(data.getVarencr().toString(), "UTF-8");
			this.trigger = URLDecoder.decode(data.getTrigger().toString(), "UTF-8");
			this.action = URLDecoder.decode(data.getAction().toString(), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String ret = null;

		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Boolean connected = loginManager.checkTwitterConnection(username);

		if (connected == true) {
			ret = "true";
		} else {
			ret = "false";
		}

		returnClass res = new returnClass();
		res.setTwitterLogged(ret);
		return res;
	}

}
