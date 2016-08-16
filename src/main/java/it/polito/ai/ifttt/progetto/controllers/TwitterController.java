package it.polito.ai.ifttt.progetto.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.services.LoginManager;
import twitter4j.DirectMessage;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.UserList;
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
	
	@Autowired
	LoginManager loginManager;

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
	//	String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
	//	this.user = loginManager.findUserByUsername(username);

		RequestToken requestToken = null;
		try {
			requestToken = twitter.getOAuthRequestToken();
		} catch (TwitterException e1) {

			e1.printStackTrace();
		}
		return new RedirectView(requestToken.getAuthorizationURL());
	}

	@RequestMapping(value = "/tw.token", method = RequestMethod.GET, params = { "oauth_token", "oauth_verifier" })
	public ModelAndView oauth2Callback(@RequestParam(value = "oauth_token") String oauth_token,
			@RequestParam(value = "oauth_verifier") String oauth_verifier, ModelAndView mv) {

		AccessToken accessToken = null;
		try {
			accessToken = twitter.getOAuthAccessToken(oauth_verifier);
			// System.out.println(accessToken);						
		} catch (TwitterException e) {
			e.printStackTrace();
		}
		// save accessToken.getToken o getSecretToken o oauth_verifier
		if(this.auth !=null) {
			SecurityContextHolder.getContext().setAuthentication(auth);
			String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
			System.out.println(username);		
			this.user = loginManager.findUserByUsername(username);
			loginManager.setTwitterCredentials(user, accessToken.getToken(), accessToken.getTokenSecret());
			
		}
			

//		try {
//			System.out.println(twitter.getScreenName());
//
//			// ACTION 1
//			// Status status = twitter.updateStatus("Prova da mia app");
//			// System.out.println("posted: "+status.getText());
//
			// TRIGGER 1
//			List<Status> statuses = twitter.getHomeTimeline();
//			System.out.println(">>>>>>>> Showing last tweets of SimonaPrino.");
//			for (Status st : statuses) {
//				//System.out.println(st.getUser().getScreenName());
//				if (st.getCreatedAt().getTime() > 1469001328 && st.getUser().getName().compareTo("Simona Prino") == 0) {
//					System.out.println(st.getUser().getName() + ":" + st.getText());
//					System.out.println("----------------------------------------");
//				}
//
//			}
//			System.out.println(">>>>>>>>> Showing BrunoPeres hashtag.");
//			QueryResult result = twitter.search(new Query("#BrunoPeres"));
//		//	System.out.println(result);
//			List<Status> qrTweets = result.getTweets();
//			for (Status st : qrTweets) {
//				System.out.println("Date: " + st.getCreatedAt());
//				System.out.println(st.getUser().getName() + ":" + st.getText());
//				System.out.println("----------------------------------------");
//			}

//			// ACTION 2
////			// destinatario definito dall'utente: il nome deve essere lo username ESATTO della persona
////			String recipient = "SimonaPrino";
////			// messaggio definito dall'utente: body
////			String body = "Sarà il body dei vari trigger";
////		
////			//occorre catturare l'eccezione di user not found
////			User user = twitter.showUser(recipient);
////			// System.out.println(user);
////			DirectMessage message = twitter.sendDirectMessage(user.getId(), body);
////			System.out.println("Sent: " + message.getText() + " to @" + message.getRecipientScreenName());
//
//			
//			//TRIGGER 2
//			String sender = "Simona Prino";
//			String body1 = "Messaggio di Prova";
//			
//			ResponseList<User> users = twitter.searchUsers(sender, 1);
//			System.out.println(">>>>>>>>> Ricerca 1: ");
//			System.out.println("#: "+users.size());
//			for(User u : users) {
//				System.out.println(u.getScreenName());
//				System.out.println(u.getId());
//				System.out.println("----------------------------");
//			}
//			
//			ResponseList<User> users2 = twitter.searchUsers("SimonaPrino", 1);
//			System.out.println(">>>>>>>>> Ricerca 2: ");
//			System.out.println("#: "+users2.size());
//			for(User u : users2) {
//				System.out.println(u.getScreenName());
//				System.out.println(u.getId());
//				System.out.println("----------------------------");
//			}
//			
//			ResponseList<User> users3 = twitter.searchUsers("Massimo Caputi", 1);
//			System.out.println(">>>>>>>>> Ricerca 3: ");
//			System.out.println("#: "+users3.size());
//			for(User u : users3) {
//				System.out.println(u.getScreenName());
//				System.out.println(u.getId());
//				System.out.println("----------------------------");
//			}
//			
//			ResponseList<User> users4 = twitter.searchUsers("Simona", 1);
//			System.out.println(">>>>>>>>> Ricerca 4: ");
//			System.out.println("#: "+users4.size());
//			for(User u : users4) {
//				System.out.println(u.getScreenName());
//				System.out.println(u.getId());
//				System.out.println("----------------------------");
//			}
//			
//			ResponseList<User> users5 = twitter.searchUsers("Fiorello", 1);
//			System.out.println(">>>>>>>>> Ricerca 5: ");
//			System.out.println("#: "+users5.size());
//			for(User u : users5) {
//				System.out.println(u.getScreenName());
//				System.out.println(u.getId());
//				System.out.println("----------------------------");
//			}
//			
//			
//			ResponseList<DirectMessage> messages = twitter.getDirectMessages();
//			for(DirectMessage d : messages) {
//				if(d.getCreatedAt().getTime()>1469001328 && d.getSender().getId()==twitter.showUser(sender).getId()
//						&& d.getText().compareTo(body1)==0) {
//					System.out.println("Message: "+d.getSenderScreenName()+", "+d.getText());
//				}
//			}
//			
//			
//
//		} catch (IllegalStateException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (TwitterException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}

		mv.setViewName("authpage");
		return mv;
	}

}
