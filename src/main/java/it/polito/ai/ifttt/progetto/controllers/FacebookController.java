package it.polito.ai.ifttt.progetto.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.gmail.GmailScopes;

import facebook4j.Account;
import facebook4j.Facebook;
import facebook4j.FacebookException;
import facebook4j.FacebookFactory;
import facebook4j.Friendlist;
import facebook4j.Post;
import facebook4j.ResponseList;
import facebook4j.auth.AccessToken;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.PagedList;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/facebook")
public class FacebookController {

	public static final String FB_APP_ID = "1039662899420948";
	public static final String FB_APP_SECRET = "fa8b2c17a5c40496abb43de4450bfa82";
	public static final String REDIRECT_URI = "http://localhost:8080/progetto/api/facebook/fb.do";

	static String accessToken = "";

	@RequestMapping(value = "/fb.do", method = RequestMethod.GET)
	public RedirectView getFBAuthUrl() {
		String fbLoginUrl = "";
		try {

			fbLoginUrl = "http://www.facebook.com/dialog/oauth?" + "client_id=" + FacebookController.FB_APP_ID
					+ "&redirect_uri=" + URLEncoder.encode(FacebookController.REDIRECT_URI, "UTF-8") + "&scope=email";
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		// return fbLoginUrl;
		return new RedirectView(fbLoginUrl);
	}

	@SuppressWarnings("deprecation")
	@RequestMapping(value = "/fb.do", method = RequestMethod.GET, params = "code")
	public String getFBGraphUrl(@RequestParam(value = "code") String code) {
		
		String fbGraphUrl = "";
		try {
			fbGraphUrl = "https://graph.facebook.com/oauth/access_token?" + "client_id=" + FacebookController.FB_APP_ID
					+ "&redirect_uri=" + URLEncoder.encode(FacebookController.REDIRECT_URI, "UTF-8") + "&client_secret="
					+ FB_APP_SECRET + "&code=" + code;

		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		System.out.println(fbGraphUrl);
		String accessToken = getAccessToken(fbGraphUrl);
		System.out.println(accessToken);
		
		String[] splits = accessToken.split("&");
		String token = splits[0].split("=")[1];
		String expire = splits[1].split("=")[1];
		
		System.out.println(token);
		System.out.println(expire);	
		
	/*	FacebookClient facebookClient = new DefaultFacebookClient(token);
		AccessToken extendedAccessToken = facebookClient.obtainExtendedAccessToken(FB_APP_ID, FB_APP_SECRET, token);
		String extendedToken = extendedAccessToken.getAccessToken();
		//save in the db: dura due mesi, dopodiche' chiudo il canale
		
		User user = facebookClient.fetchObject("me", User.class);
		System.out.println(user.getName());
		System.out.println(user.getBirthday()); */
		
		Facebook facebook = new FacebookFactory().getInstance();
		facebook.setOAuthAppId(FB_APP_ID, FB_APP_SECRET);
		facebook.setOAuthPermissions("email,user_birthday");		
		AccessToken extendedToken = null;
		String shortLivedToken = token;
		try {
			extendedToken = facebook.extendTokenExpiration(shortLivedToken);
		} catch (FacebookException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		facebook.setOAuthAccessToken(extendedToken); 
		
		
	/*	ResponseList<Account> accounts;
		try {
			accounts = facebook.getAccounts();
			System.out.println("Size accounts: "+accounts.size());
			Account yourPageAccount = accounts.get(0);  // if index 0 is your page account.			
			String pageAccessToken = yourPageAccount.getAccessToken();
			
			facebook.setOAuthAccessToken(extendedToken);
			System.out.println(facebook.getMe().getName());
			System.out.println(facebook.getMe().getEmail());
			
			System.out.println(yourPageAccount.getName());
			System.out.println("Permessi: ");
			for(String s : yourPageAccount.getPerms()) {
				System.out.println(s);
			} 		

			
		} catch (FacebookException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} */
	
		
		try {
			System.out.println(facebook.getMe().getName());
			System.out.println(facebook.getMe().getEmail());
			// facebook.postStatusMessage("Hello World from Facebook4J.");
			// System.out.println("Posted");
			ResponseList<Post> results = facebook.searchPosts("semifinale");
			for(Post p : results) {
				System.out.println(p.getDescription());
			}
		} catch (FacebookException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
		return "authpage";
	}

	public String getAccessToken(String fbGraphUrl) {
		URL url = null;
		try {
			url = new URL(fbGraphUrl);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		URLConnection fbConnection;
		StringBuffer b = null;
		try {
			fbConnection = url.openConnection();
			BufferedReader in;
			in = new BufferedReader(new InputStreamReader(fbConnection.getInputStream()));
			String inputLine;
			b = new StringBuffer();
			while ((inputLine = in.readLine()) != null)
				b.append(inputLine + "\n");
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("Unable to connect with Facebook " + e);
		}

		accessToken = b.toString();
		if (accessToken.startsWith("{")) {
			throw new RuntimeException("ERROR: Access Token Invalid: " + accessToken);
		}
		return accessToken;
	}
}
