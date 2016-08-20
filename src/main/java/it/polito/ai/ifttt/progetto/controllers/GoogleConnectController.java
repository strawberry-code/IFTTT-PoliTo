package it.polito.ai.ifttt.progetto.controllers;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;
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

import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.requestClass;
import it.polito.ai.ifttt.progetto.models.returnClass;
import it.polito.ai.ifttt.progetto.services.LoginManager;

@Controller
@RequestMapping("/connect")
public class GoogleConnectController {

	private final static Log logger = LogFactory.getLog(GoogleConnectController.class);
	private static HttpTransport httpTransport;
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

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
		res.setGoogleLogged(ret);
		return res;
	}
}
