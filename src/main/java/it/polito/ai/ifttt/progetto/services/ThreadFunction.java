package it.polito.ai.ifttt.progetto.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.json.JSONException;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Base64;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import it.polito.ai.ifttt.progetto.models.CalendarAction;
import it.polito.ai.ifttt.progetto.models.CalendarTrigger;
import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.GmailTrigger;
import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.TwitterAction;
import it.polito.ai.ifttt.progetto.models.TwitterTrigger;
import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.models.WeatherTrigger;
import net.aksingh.owmjapis.CurrentWeather;
import net.aksingh.owmjapis.DailyForecast;
import net.aksingh.owmjapis.OpenWeatherMap;
import net.aksingh.owmjapis.OpenWeatherMap.Units;
import twitter4j.DirectMessage;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.auth.AccessToken;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

public class ThreadFunction extends Thread {

	LoginManager loginManager;
	GmailManager gmailManager;
	WeatherManager weatherManager;
	RecipesManager recipesManager;
	CalendarManager calendarManager;
	TwitterManager twitterManager;
	Session sessionMail;

	private static final String APPLICATION_NAME = "IFTTT-Polito";
	private static HttpTransport httpTransport = new NetHttpTransport();
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	private static com.google.api.services.calendar.Calendar clientCal = null;
	private static com.google.api.services.gmail.Gmail clientGmail = null;
	Twitter twitter = null;

	private String clientId = "1010562379502-80tkh1u5dflsqofh7piqdnr77kmjmfck.apps.googleusercontent.com";
	private String clientSecret = "hxF4ikAFwDvJ_fipGPpbHzCg";
	public static final String tw_appid = "quh3sSXVjZsPJD0858lbzk1ch";
	public static final String tw_appsecret = "4B2XJn3D0lCkVuFoQf3fY3P1oEsHV5GRDH1IlYKPnuY2ilWm8h";

	public ThreadFunction(LoginManager lm, GmailManager gm, RecipesManager rm, Session sm, WeatherManager wm,
			CalendarManager cm, TwitterManager tm) {
		loginManager = lm;
		gmailManager = gm;
		recipesManager = rm;
		sessionMail = sm;
		weatherManager = wm;
		calendarManager = cm;
		twitterManager = tm;
	}

	public void run() {
		while (true) {

			System.out.println("Hello from a thread!");
			try {
				List<Users> users = loginManager.findAllUsers();
				if (users != null && users.size() != 0) {
					for (Users u : users) {
						System.out.println("----------------------------------------------");
						if ((u.getGoogleToken() != null && u.getGoogleExpire() != null)
								|| (u.getTwitterToken() != null && u.getTwitterTokenSecret() != null)) {
							try {
								System.out.println(u.getUsername());

								// setto i client
								Events eventList = null;
								if (u.getGoogleToken() != null && u.getGoogleExpire() != null) {
									GoogleCredential c = new GoogleCredential.Builder().setTransport(httpTransport)
											.setJsonFactory(JSON_FACTORY).setClientSecrets(clientId, clientSecret)
											.build();

									c.setRefreshToken(u.getGoogleToken());
									// c.setAccessToken(u.getToken());
									c.setExpirationTimeMilliseconds(u.getGoogleExpire());
									if (u.getGoogleExpire() < System.currentTimeMillis()) {
										// scaduto --> refresh
										c.refreshToken();
										loginManager.setGoogleCredentials(u, c.getRefreshToken(),
												c.getExpirationTimeMilliseconds());
									}
									clientGmail = new com.google.api.services.gmail.Gmail.Builder(httpTransport,
											JSON_FACTORY, c).setApplicationName(APPLICATION_NAME).build();
									/*
									 * String query = "in:inbox is:unread";
									 * ListMessagesResponse responseMess =
									 * clientGmail.users().messages().list("me")
									 * .setQ( query) .execute();
									 */

									// ricevo tutti gli eventi subito
									try {
										clientCal = new com.google.api.services.calendar.Calendar.Builder(httpTransport,
												JSON_FACTORY, c).setApplicationName(APPLICATION_NAME).build();
										eventList = clientCal.events().list("primary").execute();
									} catch (UnknownHostException e) {
										// e.printStackTrace();
									}

								}

								if (u.getTwitterToken() != null && u.getTwitterTokenSecret() != null) {
									ConfigurationBuilder builder = new ConfigurationBuilder();
									builder.setOAuthConsumerKey(tw_appid);
									builder.setOAuthConsumerSecret(tw_appsecret);
									Configuration configuration = builder.build();
									TwitterFactory factory = new TwitterFactory(configuration);
									this.twitter = factory.getInstance();
									twitter.setOAuthAccessToken(
											new AccessToken(u.getTwitterToken(), u.getTwitterTokenSecret()));
								}

								Properties props = new Properties();
								Session session = Session.getDefaultInstance(props, null);

								// per ogni sua ricetta => considero gia' solo
								// le
								// ricette dell'utente in questione
								List<Recipes> recipes = u.getRecipes();
								if (recipes.size() != 0) {
									for (Recipes r : recipes) {

										// controllo se la ricetta e' valida
										// altrimenti non faccio nulla
										if (r.getValid() == true) {
											// controllare il trigger (type e
											// id)
											String ttype = r.getTriggerType();
											Integer tid = r.getTriggerid();

											if (ttype.compareTo("gmail") == 0 && u.getGoogleToken() != null
													&& u.getGoogleExpire() != null) {
												GmailTrigger gt = gmailManager.findGmailTriggerById(tid);
												if (gt != null) {
													String subject = gt.getSubject();
													String emailsender = gt.getSender();
													String body = "";
													EmailValidator emailval = new EmailValidator(emailsender);
													if (emailval.validate() == true) {
														Date current = new Date(gt.getLastCheck());
														long epoch = current.getTime() / 1000;
														String query = "in:inbox after:" + epoch;
														if (subject != null && emailsender != null) {
															query = query + " from:" + emailsender + " subject:'"
																	+ subject + "'";
															body = "You have received an e-mail by " + emailsender
																	+ " with the following subject: " + subject;
														} else if (subject == null && emailsender != null) {
															query = query + " from:" + emailsender;
															body = "You have received an e-mail by " + emailsender;
														} else if (subject != null && emailsender == null) {
															query = query + " subject:" + subject;
															body = "You have received an e-mail with the following subject: "
																	+ subject;
														}
														ListMessagesResponse responseMess = clientGmail.users()
																.messages().list("me").setQ(query).execute();
														if (responseMess.getMessages() != null) {
															// c'ï¿½ qualche
															// messaggio
															for (Message m : responseMess.getMessages()) {
																List<Object[]> actions = recipesManager
																		.findAllActionsByTriggerId(tid, ttype);
																for (Object[] a : actions) {
																	Integer aid = (Integer) a[0];
																	String atype = (String) a[1];
																	this.executeAction(atype, aid, session, body);
																}
															}
														}
														gmailManager.setLastCheck(System.currentTimeMillis(), tid);
													}
												}

											} else if (ttype.compareTo("calendar") == 0 && u.getGoogleToken() != null
													&& u.getGoogleExpire() != null) {

												CalendarTrigger ct = calendarManager.findCalendarTriggerById(tid);
												if (ct != null) {
													if (eventList != null) {
														for (Event e : eventList.getItems()) {

															boolean success = false;
															boolean firstCheck = false;
															boolean secondCheck = false;

															if (ct.getEventAction() == false) {
																// significa
																// event starts
																Long diff = System.currentTimeMillis()
																		- e.getStart().getDateTime().getValue();
																if (diff > -60000 && (ct.getLastCheck() == null
																		|| ct.getLastCheck() < (e.getStart()
																				.getDateTime().getValue() - 60000))) {
																	firstCheck = true;
																}
															} else if (ct.getEventAction() == true) {
																// significa
																// event added
																if (ct.getLastCheck() == null || ct.getLastCheck() < e
																		.getCreated().getValue()) {
																	// se
																	// l'ultima
																	// data di
																	// controllo
																	// e' minore
																	// della
																	// data di
																	// creazione
																	// di un
																	// evento,
																	// allora
																	// scatena
																	// l'azione
																	secondCheck = true;
																}
															}

															if (firstCheck == true || secondCheck == true) {
																String line = "";
																if (firstCheck == true) {
																	line = "The following event is starting";
																} else if (secondCheck == true) {
																	line = "The following event was added";
																}
																String location = "";
																String description = "";
																String title = "";

																if (e.getLocation() != null) {
																	if (ct.getLocation() != null
																			&& ct.getDescription() == null
																			&& ct.getTitle() == null) {
																		if (ct.getLocation()
																				.compareTo(e.getLocation()) == 0) {
																			success = true;
																			location = e.getLocation();
																		}
																	} else if (ct.getLocation() != null
																			&& ct.getDescription() != null
																			&& ct.getTitle() == null) {
																		if (e.getDescription() != null) {
																			if (ct.getLocation()
																					.compareTo(e.getLocation()) == 0
																					&& ct.getDescription().compareTo(
																							e.getDescription()) == 0) {
																				success = true;
																				location = e.getLocation();
																				description = e.getDescription();
																			}
																		}
																	} else if (ct.getLocation() != null
																			&& ct.getDescription() == null
																			&& ct.getTitle() != null) {
																		if (e.getSummary() != null) {
																			if (ct.getLocation()
																					.compareTo(e.getLocation()) == 0
																					&& ct.getTitle().compareTo(
																							e.getSummary()) == 0) {
																				success = true;
																				location = e.getLocation();
																				title = e.getSummary();
																			}
																		}
																	} else if (ct.getLocation() != null
																			&& ct.getDescription() != null
																			&& ct.getTitle() != null) {
																		if (e.getDescription() != null
																				&& e.getSummary() != null) {
																			if (ct.getLocation()
																					.compareTo(e.getLocation()) == 0
																					&& ct.getTitle().compareTo(
																							e.getSummary()) == 0
																					&& ct.getDescription().compareTo(
																							e.getDescription()) == 0) {
																				success = true;
																				location = e.getLocation();
																				description = e.getDescription();
																				title = e.getSummary();
																			}
																		}
																	}
																} else if (ct.getLocation() == null
																		&& ct.getDescription() != null
																		&& ct.getTitle() == null) {
																	if (e.getDescription() != null) {
																		if (ct.getDescription()
																				.compareTo(e.getDescription()) == 0) {
																			success = true;
																			description = e.getDescription();
																		}
																	}
																} else if (ct.getLocation() == null
																		&& ct.getDescription() == null
																		&& ct.getTitle() != null) {
																	if (e.getSummary() != null) {
																		if (ct.getTitle()
																				.compareTo(e.getSummary()) == 0) {
																			success = true;
																			title = e.getSummary();
																		}
																	}
																} else if (ct.getLocation() == null
																		&& ct.getDescription() != null
																		&& ct.getTitle() != null) {
																	if (e.getDescription() != null
																			&& e.getSummary() != null) {
																		if (ct.getDescription()
																				.compareTo(e.getDescription()) == 0
																				&& ct.getTitle().compareTo(
																						e.getSummary()) == 0) {
																			success = true;
																			description = e.getDescription();
																			title = e.getSummary();
																		}
																	}
																}

																if (success == true) {

																	List<Object[]> actions = recipesManager
																			.findAllActionsByTriggerId(tid, ttype);
																	for (Object[] a : actions) {
																		Integer aid = (Integer) a[0];
																		String atype = (String) a[1];

																		String body = line + System.lineSeparator();

																		Date date = new Date();
																		date.setTime(
																				e.getStart().getDateTime().getValue());
																		SimpleDateFormat format = new SimpleDateFormat(
																				"dd/MM/yyyy 'at' h:mm a");
																		String DateToStr = format.format(date);

																		body = body + "Date: " + DateToStr + ": "
																				+ System.lineSeparator();
																		if (title.compareTo("") != 0)
																			body = body + "Title: " + title
																					+ System.lineSeparator();
																		if (description.compareTo("") != 0)
																			body = body + "Description: " + description
																					+ System.lineSeparator();
																		if (location.compareTo("") != 0)
																			body = body + "Location: " + location
																					+ System.lineSeparator();
																		this.executeAction(atype, aid, session, body);
																	}
																}
															}
														}
													}
													calendarManager.setLastCheck(System.currentTimeMillis(), tid);
												}

											} else if (ttype.compareTo("weather") == 0) {
												// ricevo tutti i dati del tempo
												// logica:
												// 1. invio del file con tutte
												// le
												// localita'
												// 2. loro lo elaborano fornendo
												// eventualmente la scelta
												// all'utente
												// e ci forniscono il numerino
												// 3. prendiamo il numerino
												// fornito da
												// loro e le info relative

												// API Key: ho dovuto
												// registrarmi sul
												// loro sito e ricevere
												// questa chiave gratis (spero
												// non
												// scada)
												String apiKey = "7a270c3877b50b233c4873ffc56f3ff7";
												// declaring object of
												// "OpenWeatherMap"
												// class
												OpenWeatherMap owm = new OpenWeatherMap(apiKey);
												owm.setUnits(Units.METRIC);
												WeatherTrigger wt = weatherManager.findWeatherTriggerById(tid);
												if (wt != null) {
													if (wt.getType() == 1) {
														// ora dell'utente
														if (wt.getLastCheck() == null || (System.currentTimeMillis()
																- wt.getLastCheck()) > 86400000) {
															String hour = wt.getOra();
															String timezone = wt.getTimezone();
															DateFormat formatter = new SimpleDateFormat("HH:mm");
															try {

																formatter.setTimeZone(TimeZone.getTimeZone(timezone));
																Date date = formatter.parse(hour);
																// Date tomorrow
																// =
																// this.addDays(date,
																// 1);
																// Long timebd =
																// tomorrow.getTime();
																Long timecur = System.currentTimeMillis();
																Long diff = timecur - date.getTime();
																// margine deve
																// essere
																// minore del
																// tempo di
																// attesa del
																// ciclo
																if (diff > -60000) {
																	List<Object[]> actions = recipesManager
																			.findAllActionsByTriggerId(tid, ttype);
																	for (Object[] a : actions) {
																		Integer aid = (Integer) a[0];
																		String atype = (String) a[1];
																		DailyForecast df = owm.dailyForecastByCityCode(
																				wt.getLocation(), (byte) 2);
																		if (df.isValid()) {
																			Date date1 = new Date();
																			date1.setTime(df.getForecastInstance(1)
																					.getDateTime().getTime());
																			SimpleDateFormat format = new SimpleDateFormat(
																					"dd/MM/yyyy");
																			String DateToStr = format.format(date1);

																			String body = "The temperature in "
																					+ df.getCityInstance().getCityName()
																					+ " at " + DateToStr + " is: "
																					+ System.lineSeparator();
																			body = body + "Morning temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getMorningTemperature())
																					+ " °C" + System.lineSeparator();
																			body = body + "Day temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getDayTemperature())
																					+ " °C" + System.lineSeparator();
																			body = body + "Evening temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getEveningTemperature())
																					+ " °C" + System.lineSeparator();
																			body = body + "Night temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getNightTemperature())
																					+ " °C" + System.lineSeparator();
																			body = body + "Maximum temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getMaximumTemperature())
																					+ " °C" + System.lineSeparator();
																			body = body + "Minimum temperature :"
																					+ String.format("%.02f",
																							df.getForecastInstance(1)
																									.getTemperatureInstance()
																									.getMinimumTemperature())
																					+ " °C" + System.lineSeparator();

																			body = body + "Weather description :"
																					+ df.getForecastInstance(1)
																							.getWeatherInstance(0)
																							.getWeatherDescription()
																					+ System.lineSeparator();

																			body = body + "Humidity percentage :"
																					+ df.getForecastInstance(1)
																							.getHumidity()
																					+ " %" + System.lineSeparator();

																			body = body + "Pressure percentage :"
																					+ df.getForecastInstance(1)
																							.getPressure()
																					+ " hPa" + System.lineSeparator();

																			body = body + "Wind speed :"
																					+ df.getForecastInstance(1)
																							.getWindSpeed()
																					+ " miles/hour"
																					+ System.lineSeparator();

																			this.executeAction(atype, aid, session,
																					body);
																			weatherManager.setLastCheck(
																					System.currentTimeMillis(), tid);
																		}
																	}
																}

															} catch (ParseException e) {
																// e.printStackTrace();
															}
														}

													} else if (wt.getType() == 2) {
														// sunrise/sunset
														CurrentWeather cwd = owm
																.currentWeatherByCityCode(wt.getLocation());
														if (cwd.isValid()) {
															if (cwd.hasDateTime()) {
																Long current = System.currentTimeMillis();
																// Long current
																// =
																// cwd.getDateTime().getTime();
																Long sunrise = owm
																		.currentWeatherByCityCode(wt.getLocation())
																		.getSysInstance().getSunriseTime().getTime();
																Long sunset = owm
																		.currentWeatherByCityCode(wt.getLocation())
																		.getSysInstance().getSunsetTime().getTime();
																SimpleDateFormat sdf = new SimpleDateFormat(
																		"dd/MM/yyyy 'at' h:mm a");
																String body = "Sunrise event is happening in "
																		+ wt.getLocationName() + " ( "
																		+ sdf.format(sunrise) + " )";
																if ((wt.getLastCheck() == null
																		|| wt.getLastCheck() < (sunrise - 60000))
																		&& (current - sunrise) > -60000) {
																	List<Object[]> actions = recipesManager
																			.findAllActionsByTriggerId(tid, ttype);
																	for (Object[] a : actions) {
																		Integer aid = (Integer) a[0];
																		String atype = (String) a[1];
																		this.executeAction(atype, aid, session, body);
																	}
																}

																body = "Sunset event is happening in "
																		+ wt.getLocationName() + " ( "
																		+ sdf.format(sunset) + " )";
																if ((wt.getLastCheck() == null
																		|| wt.getLastCheck() < (sunset - 60000))
																		&& (current - sunset) > -60000) {
																	List<Object[]> actions = recipesManager
																			.findAllActionsByTriggerId(tid, ttype);
																	for (Object[] a : actions) {
																		Integer aid = (Integer) a[0];
																		String atype = (String) a[1];
																		this.executeAction(atype, aid, session, body);
																	}
																}
															}
														}
														weatherManager.setLastCheck(System.currentTimeMillis(), tid);

													} else if (wt.getType() == 3) {
														// codice del tempo

														boolean onetimesuccess = false;
														boolean periodsuccess = false;

														CurrentWeather cwd = owm
																.currentWeatherByCityCode(wt.getLocation());
														if (cwd.isValid()) {

															if (wt.getPeriod() == null) {
																// l'utente
																// vuole che
																// l'evento
																// accada una ed
																// una sola
																// volta!
																// eseguo e
																// setto period
																// =
																// -1
																onetimesuccess = true;
															} else {
																// ogni tot
																// definito
																// dall'utente
																// controllo che
																// non sia -1,
																// perche' esso
																// si
																// riferisce ad
																// azioni da
																// eseguire una
																// sola volta
																if (wt.getPeriod() != -1) {
																	if (wt.getLastCheck() == null
																			|| (System.currentTimeMillis()
																					- wt.getLastCheck()) > wt
																							.getPeriod()) {
																		periodsuccess = true;
																	}
																}
															}

															if (onetimesuccess == true || periodsuccess == true) {
																if (cwd.getWeatherInstance(0).hasWeatherCode()) {
																	if (cwd.getWeatherInstance(0).getWeatherCode() == wt
																			.getTempo()) {
																		List<Object[]> actions = recipesManager
																				.findAllActionsByTriggerId(tid, ttype);
																		for (Object[] a : actions) {
																			Integer aid = (Integer) a[0];
																			String atype = (String) a[1];
																			SimpleDateFormat sdf = new SimpleDateFormat(
																					"dd/MM/yyyy 'at' h:mm a");
																			String body = "Weather conditions in "
																					+ cwd.getCityName()
																					+ " at this moment ("
																					+ sdf.format(cwd.getDateTime())
																					+ "): " + cwd.getWeatherInstance(0)
																							.getWeatherDescription();
																			this.executeAction(atype, aid, session,
																					body);
																			if (onetimesuccess == true)
																				weatherManager.setPeriod((long) -1,
																						tid);
																			else if (periodsuccess == true)
																				weatherManager.setLastCheck(
																						System.currentTimeMillis(),
																						tid);
																		}
																	}
																}
															}
														}
													} else if (wt.getType() == 4) {
														// th min e max

														boolean onetimesuccess = false;
														boolean periodsuccess = false;

														if (wt.getPeriod() == null) {
															// l'utente vuole
															// che l'evento
															// accada una ed una
															// sola volta!
															// eseguo e setto
															// period = -1
															onetimesuccess = true;

														} else {
															if (wt.getPeriod() != -1) {
																// ogni tot
																// definito
																// dall'utente
																if (wt.getLastCheck() == null
																		|| (System.currentTimeMillis()
																				- wt.getLastCheck()) > wt.getPeriod()) {
																	periodsuccess = true;
																}
															}
														}

														if (onetimesuccess == true || periodsuccess == true) {
															if (wt.getThmin() != null || wt.getThmax() != null) {
																Integer thmin = wt.getThmin();
																Integer thmax = wt.getThmax();

																CurrentWeather cwd;
																try {
																	// dato che
																	// arriva
																	// dal
																	// client: o
																	// quello
																	// scelto
																	// dall'utente
																	// o la
																	// localita'
																	// in cui si
																	// trova
																	cwd = owm
																			.currentWeatherByCityCode(wt.getLocation());
																	// checking
																	// data
																	// retrieval
																	// was
																	// successful
																	// or not
																	if (cwd.isValid()) {
																		Float currentTmp = null;
																		if (cwd.getMainInstance().hasTemperature()) {
																			currentTmp = cwd.getMainInstance()
																					.getTemperature();
																		}

																		if (currentTmp != null) {
																			String body = "";
																			if (wt.getThmin() != null
																					&& wt.getThmin() >= (-70)
																					&& wt.getThmin() <= 70) {
																				if (currentTmp < thmin) {
																					List<Object[]> actions = recipesManager
																							.findAllActionsByTriggerId(
																									tid, ttype);
																					for (Object[] a : actions) {
																						Integer aid = (Integer) a[0];
																						String atype = (String) a[1];
																						body = "The current temperature in "
																								+ cwd.getCityName()
																								+ " is under the minimum threshold of "
																								+ thmin + "°C: "
																								+ String.format("%.02f",
																										cwd.getMainInstance()
																												.getTemperature())
																								+ " °C";
																						this.executeAction(atype, aid,
																								session, body);
																						if (onetimesuccess == true)
																							weatherManager.setPeriod(
																									(long) -1, tid);
																						else if (periodsuccess == true)
																							weatherManager.setLastCheck(
																									System.currentTimeMillis(),
																									tid);
																					}
																				}
																			}
																			if (wt.getThmax() != null
																					&& wt.getThmax() >= (-70)
																					&& wt.getThmax() <= 70) {
																				if (currentTmp > thmax) {
																					List<Object[]> actions = recipesManager
																							.findAllActionsByTriggerId(
																									tid, ttype);
																					for (Object[] a : actions) {
																						Integer aid = (Integer) a[0];
																						String atype = (String) a[1];
																						body = "The current temperature in "
																								+ cwd.getCityName()
																								+ " is over the maximum threshold of "
																								+ thmax + "°C: "
																								+ String.format("%.02f",
																										cwd.getMainInstance()
																												.getTemperature())
																								+ " °C";
																						this.executeAction(atype, aid,
																								session, body);
																						if (onetimesuccess == true)
																							weatherManager.setPeriod(
																									(long) -1, tid);
																						else if (periodsuccess == true)
																							weatherManager.setLastCheck(
																									System.currentTimeMillis(),
																									tid);
																					}
																				}
																			}
																		}
																	}
																} catch (JSONException e) {
																	// e.printStackTrace();
																} catch (IOException e) {
																	// e.printStackTrace();
																}
															}
														}
													}
												}
											} else if (ttype.compareTo("twitter") == 0 && u.getTwitterToken() != null
													&& u.getTwitterTokenSecret() != null) {
												TwitterTrigger tt = twitterManager.findTwitterTriggerById(tid);
												if (tt != null) {
													String username_sender = tt.getUsername_sender();
													String hashtag_text = tt.getHashtag_text();

													if (tt.getType() != null && tt.getType() == false) {
														// check tweets
														try {
															if (username_sender != null && hashtag_text == null) {
																// check only
																// user tweet
																List<Status> tweets = twitter.getHomeTimeline();
																for (Status t : tweets) {
																	if ((tt.getLastCheck() == null || t.getCreatedAt()
																			.getTime() > tt.getLastCheck())
																			&& t.getUser().getScreenName()
																					.compareTo(username_sender) == 0) {
																		// trigger
																		// verify,
																		// execute
																		// all
																		// actions
																		List<Object[]> actions = recipesManager
																				.findAllActionsByTriggerId(tid, ttype);
																		for (Object[] a : actions) {
																			Integer aid = (Integer) a[0];
																			String atype = (String) a[1];

																			String body = "" + username_sender
																					+ " published the following tweet:"
																					+ System.lineSeparator()
																					+ t.getText();
																			this.executeAction(atype, aid, session,
																					body);
																		}
																	}
																}
															} else if (username_sender == null
																	&& hashtag_text != null) {
																// check only
																// hashtag
																QueryResult result = twitter
																		.search(new Query(hashtag_text));
																if (result != null) {
																	List<Status> qrTweets = result.getTweets();
																	for (Status t : qrTweets) {
																		if (tt.getLastCheck() == null
																				|| t.getCreatedAt().getTime() > tt
																						.getLastCheck()) {
																			// trigger
																			// verify,
																			// execute
																			// all
																			// relative
																			// actions
																			List<Object[]> actions = recipesManager
																					.findAllActionsByTriggerId(tid,
																							ttype);
																			for (Object[] a : actions) {
																				Integer aid = (Integer) a[0];
																				String atype = (String) a[1];

																				String body = "The term '"
																						+ hashtag_text
																						+ "' is present in the following tweet:"
																						+ System.lineSeparator()
																						+ t.getText();
																				this.executeAction(atype, aid, session,
																						body);
																			}
																		}
																	}
																}
															} else if (username_sender != null
																	&& hashtag_text != null) {
																// check both
																QueryResult result = twitter
																		.search(new Query(hashtag_text));
																if (result != null) {
																	List<Status> qrTweets = result.getTweets();
																	for (Status t : qrTweets) {
																		if ((tt.getLastCheck() == null
																				|| t.getCreatedAt().getTime() > tt
																						.getLastCheck())
																				&& t.getUser().getScreenName()
																						.compareTo(
																								username_sender) == 0) {
																			// trigger
																			// verify,
																			// execute
																			// all
																			// relative
																			// actions
																			List<Object[]> actions = recipesManager
																					.findAllActionsByTriggerId(tid,
																							ttype);
																			for (Object[] a : actions) {
																				Integer aid = (Integer) a[0];
																				String atype = (String) a[1];

																				String body = "The term '"
																						+ hashtag_text
																						+ "' is present in the following tweet of "
																						+ username_sender + ":"
																						+ System.lineSeparator()
																						+ t.getText();
																				this.executeAction(atype, aid, session,
																						body);
																			}
																		}
																	}
																}
															}

														} catch (TwitterException e) {
															// e.printStackTrace();
														}
														twitterManager.setLastCheck(System.currentTimeMillis(), tid);
													} else if (tt.getType() != null && tt.getType() == true) {
														// check direct messages
														try {

															ResponseList<DirectMessage> messages = twitter
																	.getDirectMessages();

															if (username_sender != null && hashtag_text == null) {
																// check only
																// user direct
																// message
																for (DirectMessage d : messages) {

																	if ((tt.getLastCheck() == null || d.getCreatedAt()
																			.getTime() > tt.getLastCheck())
																			&& d.getSenderScreenName()
																					.compareTo(username_sender) == 0) {
																		// trigger
																		// verify,
																		// execute
																		// all
																		// actions

																		List<Object[]> actions = recipesManager
																				.findAllActionsByTriggerId(tid, ttype);
																		for (Object[] a : actions) {
																			Integer aid = (Integer) a[0];
																			String atype = (String) a[1];

																			String body = "" + username_sender
																					+ " sent the following message on Twitter:"
																					+ System.lineSeparator()
																					+ d.getText();
																			this.executeAction(atype, aid, session,
																					body);
																		}
																	}
																}
															} else if (username_sender == null
																	&& hashtag_text != null) {
																// check only
																// hashtag
																for (DirectMessage d : messages) {
																	if ((tt.getLastCheck() == null || d.getCreatedAt()
																			.getTime() > tt.getLastCheck())
																			&& d.getText()
																					.compareTo(hashtag_text) == 0) {
																		// trigger
																		// verify,
																		// execute
																		// all
																		// actions
																		List<Object[]> actions = recipesManager
																				.findAllActionsByTriggerId(tid, ttype);
																		for (Object[] a : actions) {
																			Integer aid = (Integer) a[0];
																			String atype = (String) a[1];

																			String body = "A message with this text is sent to you on Twitter:"
																					+ System.lineSeparator()
																					+ d.getText();
																			this.executeAction(atype, aid, session,
																					body);
																		}
																	}
																}
															} else if (username_sender != null
																	&& hashtag_text != null) {
																// check both
																for (DirectMessage d : messages) {
																	if ((tt.getLastCheck() == null || d.getCreatedAt()
																			.getTime() > tt.getLastCheck())
																			&& d.getSenderScreenName()
																					.compareTo(username_sender) == 0
																			&& d.getText()
																					.compareTo(hashtag_text) == 0) {
																		// trigger
																		// verify,
																		// execute
																		// all
																		// actions
																		List<Object[]> actions = recipesManager
																				.findAllActionsByTriggerId(tid, ttype);
																		for (Object[] a : actions) {
																			Integer aid = (Integer) a[0];
																			String atype = (String) a[1];

																			String body = "" + username_sender
																					+ " sent a message to you on Twitter with this text:"
																					+ System.lineSeparator()
																					+ d.getText();
																			this.executeAction(atype, aid, session,
																					body);
																		}
																	}
																}
															}

														} catch (TwitterException e) {
															// e.printStackTrace();
														}
														twitterManager.setLastCheck(System.currentTimeMillis(), tid);
													}
												}
											}
										}

									}
								}
							} catch (IOException e1) {
								e1.printStackTrace();
							} catch (MessagingException e) {
								// e.printStackTrace();
							} catch (Exception e) {
								// e.printStackTrace();
							}
						} // FINE check tokens
					}
				}

				try {
					ThreadFunction.sleep(60000);
				} catch (InterruptedException e) {
					// e.printStackTrace();
				}
			} catch (Exception e) {
				// e.printStackTrace();
			}
		}
	}

	public void executeAction(String atype, Integer aid, Session session, String body)
			throws MessagingException, IOException {
		if (atype.compareTo("gmail") == 0 && clientGmail != null) {
			GmailAction ga = gmailManager.findGmailActionById(aid);

			MimeMessage email = new MimeMessage(session);

			EmailValidator emailval = new EmailValidator(ga.getReceiver());
			if (emailval.validate() == true) {
				InternetAddress tAddress = new InternetAddress(ga.getReceiver());
				email.addRecipient(javax.mail.Message.RecipientType.TO, tAddress);
				if (ga.getSubject() != null)
					email.setSubject(ga.getSubject());
				if (ga.getBody() != null)
					email.setText(ga.getBody());
				else if (body != null) {
					email.setText(body);
					// save it in the db
					// ga.setBody(body);
					// gmailManager.saveUpdates(ga);
				}

				ByteArrayOutputStream bytes = new ByteArrayOutputStream();
				email.writeTo(bytes);
				String encodedEmail = Base64.encodeBase64URLSafeString(bytes.toByteArray());
				Message message = new Message();
				message.setRaw(encodedEmail);

				if (ga.isSender() == true) {
					// se ==true --> me
					clientGmail.users().messages().send("me", message).execute();
				} else {
					// se false --> ifttt
					javax.mail.Message message1 = new MimeMessage(sessionMail);
					message1.setFrom(new InternetAddress("ifttt.ai2016@gmail.com"));
					message1.setRecipients(javax.mail.Message.RecipientType.TO,
							InternetAddress.parse(ga.getReceiver()));
					if (ga.getSubject() != null)
						message1.setSubject(ga.getSubject());
					if (ga.getBody() != null)
						message1.setText(ga.getBody());
					else if (body != null)
						message1.setText(body);

					Transport.send(message1);
				}
			}

		} else if (atype.compareTo("calendar") == 0 && clientGmail != null) {

			CalendarAction ca = calendarManager.findCalendarActionById(aid);
			Event event = new Event();
			if (ca.getTitle() != null) {
				event.setSummary(ca.getTitle());
			}
			if (ca.getDescription() != null) {
				event.setDescription(ca.getDescription());
			}
			if (ca.getLocation() != null) {
				event.setLocation(ca.getLocation());
			}

			try {
				DateTime startDateTime = null;
				if (ca.getStartDate() != null) {
					// startDateTime = new DateTime(ca.getStartDate());
					Date d = null;
					final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss Z");
					TimeZone tz = TimeZone.getTimeZone(ca.getTimezone());
					try {
						String s = sdf.format(parseDate(ca.getStartDate(), tz));
						d = sdf.parse(s);
					} catch (ParseException e1) {
						e1.printStackTrace();
					}
					startDateTime = new DateTime(d);
				} else {
					startDateTime = new DateTime(new Date());
				}
				EventDateTime start = new EventDateTime().setDateTime(startDateTime);
				event.setStart(start);

				DateTime endDateTime = null;
				Long mill = event.getStart().getDateTime().getValue() + ca.getDuration();
				endDateTime = new DateTime(new Date(mill));
				EventDateTime end = new EventDateTime().setDateTime(endDateTime);
				event.setEnd(end);

				event = clientCal.events().insert("primary", event).execute();
			} catch (Exception e) {
				// try-catch to handle incorrect date
				System.out.println(e.getMessage());
			}

		} else if (atype.compareTo("twitter") == 0 && twitter != null) {
			TwitterAction ta = twitterManager.findTwitterActionById(aid);
			String text = ta.getBody();
			String dest = ta.getDestination();

			String txt = "";
			if (text != null) {
				txt = text;
			} else if (body != null) {
				txt = body;
				// save it in the db
				// ta.setBody(body);
				// twitterManager.saveUpdates(ta);

			}

			if (dest == null) {
				// post
				try {
					Status status = twitter.updateStatus(txt);
				} catch (TwitterException e) {
					// TODO Auto-generated catch block
					// e.printStackTrace();
				}
			} else {
				// direct message
				User user;
				try {
					user = twitter.showUser(dest);
					DirectMessage message = twitter.sendDirectMessage(user.getId(), txt);
				} catch (TwitterException e) {
					// TODO Auto-generated catch block
					// e.printStackTrace();
				}
			}
		}
	}

	// per convertire i gradi Fahrenheit ritornati in Celsius
	// public Float ConverToCelsius(Float temp) {
	// return ((temp - 32) * 5) / 9;
	// }

	public static Date addDays(Date date, int days) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DATE, days); // minus number would decrement the days
		return cal.getTime();
	}

	public static Date parseDate(final String str, final TimeZone tz) throws ParseException {
		final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(tz);
		return sdf.parse(str);
	}
}
