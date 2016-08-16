package it.polito.ai.ifttt.progetto.controllers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.repackaged.org.apache.commons.codec.binary.StringUtils;
import com.google.api.client.util.Base64;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;

import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.requestClass;
import it.polito.ai.ifttt.progetto.models.returnClass;
import it.polito.ai.ifttt.progetto.services.LoginManager;

@Controller
@RequestMapping("/connect")
public class GoogleConnectController {

	private final static Log logger = LogFactory.getLog(GoogleConnectController.class);
	private static final String APPLICATION_NAME = "";
	private static HttpTransport httpTransport;
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	private static com.google.api.services.calendar.Calendar client;
	private static com.google.api.services.gmail.Gmail clientGmail;

	GoogleClientSecrets clientSecrets;
	GoogleAuthorizationCodeFlow flow;
	Credential credential;
	
	String nextPath = null;

	@Autowired
	LoginManager loginManager;

	// abbiamo creato il progetto IFTTT su
	// https://console.developers.google.com/apis/credentials?project=ifttt-1362
	// e creato le credenziali necessarie per poi accedere a Google (clientId,
	// secretId e URI) settate qui di seguito:
	private String clientId = "1010562379502-80tkh1u5dflsqofh7piqdnr77kmjmfck.apps.googleusercontent.com";
	private String clientSecret = "hxF4ikAFwDvJ_fipGPpbHzCg";
	private String redirectURI = "http://localhost:8080/progetto/api/connect/google.do";
	// private Set<Event> events = new HashSet<Event>();

	/*
	 * public void setEvents(Set<Event> events) { this.events = events; }
	 * 
	 * public Set<Event> getEvents() throws IOException { return this.events; }
	 */

	// get iniziale:
	// quando si fa una richiesta che richiede autenticazione di google,
	// richiama authorize()
	@RequestMapping(value = "/google.do", method = RequestMethod.GET)
	public RedirectView googleConnectionStatus() throws Exception {
		return new RedirectView(authorize());
	}

	// dopo aver creato il codice di autorizzazione (l'utente ha premuto su
	// accetta),
	// viene chiamato questo metodo nella cui url c'è proprio questo codice
	@RequestMapping(value = "/google.do", method = RequestMethod.GET, params = "code")
	public RedirectView oauth2Callback(@RequestParam(value = "code") String code) {
		try {
			// quindi viene creato un token con una certa scadenza,
			// usato poi per ricevere le credenziali dnecessarie
			TokenResponse response = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
			credential = flow.createAndStoreCredential(response, "userID");

			// update db with the new token for the authenticated user
			String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
			Users user = loginManager.findUserByUsername(username);
			//loginManager.setCredentials(user, credential.getAccessToken(), credential.getExpirationTimeMilliseconds());
			loginManager.setGoogleCredentials(user, credential.getRefreshToken(), credential.getExpirationTimeMilliseconds());

			// Events events = client.events();
			// com.google.api.services.calendar.model.Events eventList =
			// events.list("primary").execute();
			// mv.addObject("events", eventList.getItems());
			
			//useful when we will want to get the token from the db String
//			String username1 = SecurityContextHolder.getContext().getAuthentication().
//			getPrincipal().toString(); 
//			Users user1 = loginManager.findUserByUsername(username1); 
//			final HttpTransport HTTP_TRANSPORT = new NetHttpTransport(); 
//			GoogleCredential c = new GoogleCredential.Builder()
//								.setTransport(HTTP_TRANSPORT)
//								.setJsonFactory(JSON_FACTORY)
//								.setClientSecrets(clientId, clientSecret).build(); 
//			c.setAccessToken(user1.getToken());
//			c.setExpirationTimeMilliseconds(user1.getExpire()); 
//			client = new com.google.api.services.calendar.Calendar.Builder(httpTransport,
//					JSON_FACTORY, c) .setApplicationName(APPLICATION_NAME).build();
//			  
//			com.google.api.services.calendar.model.Events eventList =  client.events().list("primary").execute();
//			for(com.google.api.services.calendar.model.Event e :  eventList.getItems()) { 
//				  	e.getCre
//				  	e.getStart() 
//			 }			
			
//			//GOOGLE CALENDAR:
//			// si crea un client a cui si danno le credenziali appena create,
//			// che verra' usato per compiere le operazioni desiderate
//			client = new com.google.api.services.calendar.Calendar.Builder(httpTransport, JSON_FACTORY, credential)
//					.setApplicationName(APPLICATION_NAME).build();	
			
//
//			Event event = new Event().setSummary("Google I/O 2015")
//					.setLocation("800 Howard St., San Francisco, CA 94103")
//					.setDescription("A chance to hear more about Google's developer products.");
//
//			DateTime startDateTime = new DateTime("2016-07-04T09:00:00-07:00");
//			EventDateTime start = new EventDateTime().setDateTime(startDateTime).setTimeZone("America/Los_Angeles");
//			event.setStart(start);
//			DateTime endDateTime = new DateTime("2016-07-04T17:00:00-07:00");
//			EventDateTime end = new EventDateTime().setDateTime(endDateTime).setTimeZone("America/Los_Angeles");
//			event.setEnd(end);
//
//			event = client.events().insert("primary", event).execute();
//			System.out.println("Event inserted"); 
			
			/*********************************************************************************************************/

//			// GMAIL
//			clientGmail = new com.google.api.services.gmail.Gmail.Builder(httpTransport, JSON_FACTORY, credential)
//				.setApplicationName(APPLICATION_NAME).build();
//
//			// creo un messaggio
//			Properties props = new Properties();
//			Session session = Session.getDefaultInstance(props, null);
//
//			MimeMessage email = new MimeMessage(session);
//			System.out.println(user.getEmail());
//			
//			// saranno tutti ingredienti passati dall'utente
//			InternetAddress tAddress = new InternetAddress(user.getEmail());
//			//InternetAddress fAddress = new InternetAddress("ifttt.ai2016@gmail.com");
//			//email.setFrom(fAddress);
//			//email.setSender(fAddress);
//			email.addRecipient(javax.mail.Message.RecipientType.TO, tAddress);
//			email.setSubject("Email di Prova");
//			email.setText("Ciao, come va?");
//
//			ByteArrayOutputStream bytes = new ByteArrayOutputStream();
//			email.writeTo(bytes);
//			String encodedEmail = Base64.encodeBase64URLSafeString(bytes.toByteArray());
//			Message message = new Message();
//			message.setRaw(encodedEmail);
//			clientGmail.users().messages().send("me", message).execute();
//			System.out.println("Message sent");
//			
//			//servira' poi 
//			/*Users user1 = loginManager.findUserByUsername(username); 
//			final HttpTransport HTTP_TRANSPORT = new NetHttpTransport(); 
//			GoogleCredential c = new GoogleCredential.Builder()
//								.setTransport(HTTP_TRANSPORT)
//								.setJsonFactory(JSON_FACTORY)
//								.setClientSecrets(clientId, clientSecret).build(); 
//			c.setAccessToken(user1.getToken());
//			c.setExpirationTimeMilliseconds(user1.getExpire()); */ 
//			
//			//stampa email utente autenticato con google
//			com.google.api.services.gmail.Gmail clientg = new com.google.api.services.gmail.Gmail.Builder(httpTransport,
//					JSON_FACTORY, credential) .setApplicationName(APPLICATION_NAME).build();
//			 
//			String query = "in:inbox";
//			System.out.println("Prima di execute");
//			ListMessagesResponse responseMess = clientg.users().messages().list("me").setQ(query).execute();
//			System.out.println("Subito dopo di execute");
//			
//			List<Message> messages = new ArrayList<Message>(responseMess.getMessages());		    
//			
//		    System.out.println("Prima della stampa");	 
//	        System.out.println(messages.size());
//	        for (Message m : messages) {
//	        	System.out.println(m.toPrettyString());
//	        	System.out.println("Id: "+m.getId());
//	        	Message mex = clientg.users().messages().get("me", m.getId()).setFormat("raw").execute();
//	        	
//	        	 byte[] emailBytes = Base64.decodeBase64(mex.getRaw());
//	        	 MimeMessage email1 = new MimeMessage(session, new ByteArrayInputStream(emailBytes));
//	        	 System.out.println(email1.getSubject());
//	        	// System.out.println("From: "+email1.getFrom());
//	        	// System.out.println("Dest: "+email1.getRecipients(javax.mail.Message.RecipientType.TO)[0]);
//	        	 Address[] froms = email1.getFrom();
//	        	 System.out.println( ((InternetAddress) froms[0]).getAddress());
//	        	
//	        	//System.out.println(mex.toPrettyString());
//	        	System.out.println("-----------------------------------------------------------");
//	        }
	        
	        /*********************************************************************************************************/

		} catch (Exception e) {
			logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + ")."
					+ " Redirecting to google connection status page.");
		}
	//	mv.setViewName("./#/createRecipe");
		// mv.setViewName("eventList");
//		return mv;
		String path = "/progetto/#/"+this.nextPath;
		System.out.println(path);
		return new RedirectView(path);
	}

	// metodo per implementare l'autorizzazione di google
	private String authorize() throws Exception {
		AuthorizationCodeRequestUrl authorizationUrl;
		if (flow == null) {

			// creiamo un oggetto che popoliamo con le credenziali impostate
			// sopra
			Details web = new Details();
			web.setClientId(clientId);
			web.setClientSecret(clientSecret);
			clientSecrets = new GoogleClientSecrets().setWeb(web);

			// creiamo l'AuthorizationCodeFlow con le informazioni necessarie;
			// ci servira' per effettuare l'autorizzazione
			httpTransport = GoogleNetHttpTransport.newTrustedTransport();
			List<String> SCOPES = Arrays.asList(CalendarScopes.CALENDAR, GmailScopes.MAIL_GOOGLE_COM);
			flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY, clientSecrets, SCOPES).setApprovalPrompt("force").setAccessType("offline").build();
		
		}

		// per reindirizzare il browser dell'utente ad una pagina di
		// autorizzazione di google
		// e in seguito veniamo reindirizzati all'url specificata all'inizio,
		// che drovra'
		// essere mappata con un'altra get
		authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(redirectURI).setApprovalPrompt("force").setAccessType("offline");

		// a questo punto il codice di autorizzazione e' generato e viene
		// ritornato
		// dunque viene richiamata la seconda get di questo controllore
		return authorizationUrl.build();
	}
	
	@RequestMapping(value = "requestGoogle", method = RequestMethod.POST)
	@ResponseBody returnClass checkGoogleConnection(@RequestBody requestClass data) {
		
		System.out.println(data.getUrlNext());		
		
		this.nextPath = data.getUrlNext(); 
				
		String ret = null;
		
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Boolean connected = loginManager.checkGoogleConnection(username);
		
		if(connected == true) {
			ret = "true";
		}
		else {
			ret = "false";
		}
		
		returnClass res = new returnClass();
		res.setAuthenticated(ret);
		return res;
	}
}
