package it.polito.ai.ifttt.progetto.services;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

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
import net.aksingh.owmjapis.OpenWeatherMap;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

public class RecipesManagerImpl implements RecipesManager {

	@Autowired
	SessionFactory sessionFactory;
	@Autowired
	LoginManager loginManager;
	@Autowired
	CalendarManager calendarManager;
	@Autowired
	GmailManager gmailManager;
	@Autowired
	WeatherManager weatherManager;
	@Autowired
	TwitterManager twitterManager;

	List<String> timezones = new ArrayList<String>(Arrays.asList(TimeZone.getAvailableIDs()));

	String apiKey = "7a270c3877b50b233c4873ffc56f3ff7";

	public static final String tw_appid = "quh3sSXVjZsPJD0858lbzk1ch";
	public static final String tw_appsecret = "4B2XJn3D0lCkVuFoQf3fY3P1oEsHV5GRDH1IlYKPnuY2ilWm8h";

	@SuppressWarnings("unchecked")
	public List<Recipes> findAllRecipes() {
		Session session = sessionFactory.openSession();
		List<Recipes> recipes = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Recipes";
			Query query = session.createQuery(hql);
			recipes = query.list();
		} catch (Exception e) {
			return null;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (recipes.size() == 0) {
			return null;
		}
		return recipes;
	}

	public Recipes findRecipesById(Integer id) {
		Session session = sessionFactory.openSession();
		Recipes recipe = null;
		try {
			recipe = session.get(Recipes.class, id);
		} catch (Exception e) {
			return null;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (recipe == null) {
			return null;
		}
		return recipe;
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> findAllActionsByTriggerId(Integer tid, String ttype) {
		Session session = sessionFactory.openSession();
		List<Object[]> actionsid = null;
		try {
			String hql = "select actionid, actionType from it.polito.ai.ifttt.progetto.models.Recipes r where r.triggerid=:t and r.triggerType=:tt";
			Query query = session.createQuery(hql);
			query.setInteger("t", tid);
			query.setString("tt", ttype);
			actionsid = query.list();
		} catch (Exception e) {
			return null;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if (actionsid.size() == 0) {
			return null;
		}
		return actionsid;
	}

	@SuppressWarnings("unused")
	public Integer addRecipe(String data) {

		// I need session e transaction here, because I have to
		// update 3 db for a single receipt.
		Session session = sessionFactory.openSession();
		
		JSONObject ricetta = null;
		String trig = null;
		String act = null;
		JSONObject trigger = null;
		JSONObject action = null;
		String triggerType = null;
		String actionType = null;

		Integer triggerid = null;
		Integer actionid = null;
		Integer recipeid = -1;
		try {
			ricetta = new JSONObject(data);
			trig = ricetta.get("trigger").toString();
			act = ricetta.get("action").toString();
			trigger = new JSONObject(trig);
			action = new JSONObject(act);
			triggerType = trigger.get("triggerType").toString();
			actionType = action.get("actionType").toString();
			
		}catch(Exception e) {
			//e.printStackTrace();
			return -1;
		}
		
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			return -1;
		}

		OpenWeatherMap owm = null;
		Twitter twitter = null;
		try {
			owm = new OpenWeatherMap(apiKey);

			if (user.getTwitterToken() != null && user.getTwitterTokenSecret() != null) {
				ConfigurationBuilder builder = new ConfigurationBuilder();
				builder.setOAuthConsumerKey(tw_appid);
				builder.setOAuthConsumerSecret(tw_appsecret);
				Configuration configuration = builder.build();
				TwitterFactory factory = new TwitterFactory(configuration);
				twitter = factory.getInstance();
				twitter.setOAuthAccessToken(new AccessToken(user.getTwitterToken(), user.getTwitterTokenSecret()));
			}
		} catch (Exception e) {
			return -1;
		}

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				
				if(ricetta.get("description").toString().length()>255) {
					return -4;
				}

				// TRIGGER
				if (triggerType.compareTo("calendar") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
					if (calendartrigger.getEventAction() == null) {
						tx.rollback();
						return -1;
					}
					if (calendartrigger.getTitle() == null && calendartrigger.getDescription() == null
							&& calendartrigger.getLocation() == null) {
						tx.rollback();
						return -1;
					}
					if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
						tx.rollback();
						return -1;
					} else {
						if (calendartrigger.getTitle() != null && calendartrigger.getTitle().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (calendartrigger.getDescription() != null
								&& calendartrigger.getDescription().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (calendartrigger.getLocation() != null && calendartrigger.getLocation().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
					}
					calendartrigger.setLastCheck(System.currentTimeMillis());
					session.save(calendartrigger);
					session.flush();
					triggerid = calendartrigger.getCtid();

				} else if (triggerType.compareTo("gmail") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					GmailTrigger gmailtrigger = mapper.readValue(trig, GmailTrigger.class);
					if (gmailtrigger.getIngredientCode() != 13) {
						tx.rollback();
						return -1;
					}
					if (gmailtrigger.getSender() != null && gmailtrigger.getSender().compareTo("") == 0) {
						tx.rollback();
						return -3;
					}
					if (gmailtrigger.getSubject() != null && gmailtrigger.getSubject().compareTo("") == 0) {
						tx.rollback();
						return -3;
					}
					gmailtrigger.setLastCheck(System.currentTimeMillis());
					if (gmailtrigger.getSender() != null) {
						EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
						if (emailval.validate() == false) {
							tx.rollback();
							return -1;
						}
					}
					session.save(gmailtrigger);
					session.flush();
					triggerid = gmailtrigger.getGtid();

				} else if (triggerType.compareTo("weather") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					WeatherTrigger weathertrigger = mapper.readValue(trig, WeatherTrigger.class);
					switch (weathertrigger.getIngredientCode()) {
					case 14:
						// weather trigger 1: tomorrow
						if (weathertrigger.getType() != 1 || weathertrigger.getOra() == null) {
							tx.rollback();
							return -1;
						}
						DateFormat formatter = new SimpleDateFormat("HH:mm");
						try {
							formatter.setLenient(false);
							Date date = formatter.parse(weathertrigger.getOra());
						}catch(Exception e) {
							tx.rollback();
							return -1;
						}
						break;

					case 15:
						// weather trigger 2: weather condition
						if (weathertrigger.getType() != 3 || weathertrigger.getTempo() == null) {
							tx.rollback();
							return -1;
						}
						break;

					case 16:
						// weather trigger 3: sunrise/sunset
						if (weathertrigger.getType() != 2
								|| (weathertrigger.getSunrise() == null && weathertrigger.getSunset() == null)) {
							tx.rollback();
							return -1;
						}
						break;

					case 17:
						// weather trigger 4: temp max/min
						if (weathertrigger.getType() != 4
								|| (weathertrigger.getThmax() == null && weathertrigger.getThmin() == null)) {
							tx.rollback();
							return -1;
						}
						if (weathertrigger.getThmin() != null) {
							if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
								tx.rollback();
								return -1;
							}
						}
						if (weathertrigger.getThmax() != null) {
							if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
								tx.rollback();
								return -1;
							}
						}
						break;

					default:
						tx.rollback();
						return -1;
					}
					if (weathertrigger.getLocation() == null) {
						tx.rollback();
						return -1;
					}
					if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
						try {
							CurrentWeather cwd = owm.currentWeatherByCityCode(weathertrigger.getLocation());
							if (cwd.isValid()) {
								if (cwd.hasCityName()) {
									if (cwd.getCityName().compareTo(weathertrigger.getLocationName()) != 0) {
										tx.rollback();
										return -1;
									}
								} else {
									tx.rollback();
									return -1;
								}
							} else {
								tx.rollback();
								return -1;
							}
						} catch (Exception e) {
							tx.rollback();
							return -1;
						}
					}
					String tz = null;
					if (weathertrigger.getTimezone() == null) {
						tz = user.getTimezone();
					} else {
						tz = weathertrigger.getTimezone();
					}
					if (timezones.contains(tz) == false) {
						tx.rollback();
						return -1;
					} else {
						weathertrigger.setTimezone(tz);
					}
					if (weathertrigger.getType() == 2) {
						weathertrigger.setLastCheck(System.currentTimeMillis());
					} else {
						weathertrigger.setLastCheck(null);
					}
					session.save(weathertrigger);
					session.flush();
					triggerid = weathertrigger.getWtid();

				} else if (triggerType.compareTo("twitter") == 0) {

					if (twitter == null) {
						tx.rollback();
						return -1;
					} else {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
						if (twittertrigger.getIngredientCode() != 18 && twittertrigger.getIngredientCode() != 19) {
							tx.rollback();
							return -1;
						}
						if (twittertrigger.getHashtag_text() == null && twittertrigger.getUsername_sender() == null) {
							tx.rollback();
							return -1;
						}
						if(twittertrigger.getUsername_sender()!=null && twittertrigger.getUsername_sender().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						if(twittertrigger.getHashtag_text()!=null && twittertrigger.getHashtag_text().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						if (twittertrigger.getUsername_sender() != null) {
							try {
								twitter.showUser(twittertrigger.getUsername_sender()).getId();
							} catch (TwitterException e) {
								if (e.getErrorCode() == 50) {
									tx.rollback();
									return -2;
								} else {
									tx.rollback();
									return -1;
								}
							}
						}
						if (twittertrigger.getType() == false && twittertrigger.getHashtag_text() != null) {
							if (twittertrigger.getHashtag_text().startsWith("#") == false) {
								twittertrigger.setHashtag_text("#" + twittertrigger.getHashtag_text());
							}
						}
						twittertrigger.setLastCheck(System.currentTimeMillis());
						session.save(twittertrigger);
						session.flush();
						triggerid = twittertrigger.getTwtid();
					}

				} else {
					// errore: valore non valido!
					tx.rollback();
					return -1;
				}

				// ACTION
				if (actionType.compareTo("calendar") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					CalendarAction calendaraction = mapper.readValue(act, CalendarAction.class);
					if (calendaraction.getIngredientCode() != 21) {
						tx.rollback();
						return -1;
					}
					else {
						if (calendaraction.getTitle() != null && calendaraction.getTitle().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (calendaraction.getDescription() != null
								&& calendaraction.getDescription().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (calendaraction.getLocation() != null && calendaraction.getLocation().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
					}
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					if (calendaraction.getStartDate() != null) {
						try {
							sdf.setLenient(false);
							sdf.parse(calendaraction.getStartDate());							
						} catch (ParseException e1) {
							tx.rollback();
							return -1;
						} catch (Exception e) {
							tx.rollback();
							return -1;
						}
					} else {
						String dstr = sdf.format(new Date());
						calendaraction.setStartDate(dstr);
					}
					if (calendaraction.getDuration() == null) {
						calendaraction.setDuration((long) 3600000);
					}
					String tz = null;
					if (calendaraction.getTimezone() == null) {
						tz = user.getTimezone();
					} else {
						tz = calendaraction.getTimezone();
					}
					if (timezones.contains(tz) == false) {
						tx.rollback();
						return -1;
					} else {
						calendaraction.setTimezone(tz);
					}
					session.save(calendaraction);
					session.flush();
					actionid = calendaraction.getCaid();

				} else if (actionType.compareTo("gmail") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					GmailAction gmailaction = mapper.readValue(act, GmailAction.class);
					if (gmailaction.getIngredientCode() < 22) {
						tx.rollback();
						return -1;
					}
					if(gmailaction.getReceiver()==null) {
						tx.rollback();
						return -1;
					}
					if (gmailaction.getReceiver() != null) {
						EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
						if (emailval.validate() == false) {
							tx.rollback();
							return -1;
						}
					}
					if(gmailaction.getSubject()!=null && gmailaction.getSubject().compareTo("")==0) {
						tx.rollback();
						return -3;
					}
					if(gmailaction.getBody()!=null && gmailaction.getBody().compareTo("")==0) {
						tx.rollback();
						return -3;
					}
					session.save(gmailaction);
					session.flush();
					actionid = gmailaction.getGaid();

				} else if (actionType.compareTo("twitter") == 0) {
					if (twitter == null) {
						tx.rollback();
						return -1;
					} else {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
						if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
							tx.rollback();
							return -1;
						}
						if(twitteraction.getIngredientCode()==23) {
							if(twitteraction.getBody()!=null && twitteraction.getBody().length()>140) {
								tx.rollback();
								return -1;
							}
						}
						if (twitteraction.getIngredientCode() == 24 && twitteraction.getDestination() == null) {
							tx.rollback();
							return -2;
						}
						if (twitteraction.getIngredientCode() == 24 && twitteraction.getBody()!=null && twitteraction.getBody().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						if (twitteraction.getDestination() != null) {
							try {
								twitter.showUser(twitteraction.getDestination());
							} catch (TwitterException e) {
								if (e.getErrorCode() == 50) {
									tx.rollback();
									return -2;
								} else {
									tx.rollback();
									return -1;
								}
							}
						}
						session.save(twitteraction);
						session.flush();
						actionid = twitteraction.getTwaid();
					}
				} else {
					// errore: valore non valido!
					tx.rollback();
					return -1;
				}

				// RECIPE
				Recipes recipe = new Recipes();
				recipe.setTriggerType(triggerType);
				recipe.setActionType(actionType);
				recipe.setTriggerid(triggerid);
				recipe.setActionid(actionid);
				recipe.setPublish((Boolean) ricetta.get("publish"));
				recipe.setDescription((String) ricetta.get("description"));
				recipe.setUser(user);
				session.save(recipe);
				session.flush();

				recipeid = recipe.getRid();

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				// System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		// se qualcosa e' andato storto, sara' -1
		return recipeid;
	}

	@SuppressWarnings("unused")
	public Integer modifyRecipe(Integer id, String data) {
		Session session = sessionFactory.openSession();
	//	System.out.println(data);
		
		// new data
		JSONObject ricetta = null;
		String trig = null;
		String act = null;
		JSONObject trigger = null;
		JSONObject action = null;
		String triggerType = null;
		String actionType = null;
		Integer flag = 0;
		// old data
		Recipes rec = null;
		String triggerTypeOld = null;
		String actionTypeOld = null;
		Integer triggerid = null;
		Integer actionid = null;
		try {
			// new data
			ricetta = new JSONObject(data);
			trig = ricetta.get("trigger").toString();
			act = ricetta.get("action").toString();
			trigger = new JSONObject(trig);
			action = new JSONObject(act);
			triggerType = trigger.get("triggerType").toString();
			actionType = action.get("actionType").toString();

			// old data
			rec = this.findRecipesById(id);
			triggerTypeOld = rec.getTriggerType();
			actionTypeOld = rec.getActionType();
			triggerid = rec.getTriggerid();
			actionid = rec.getActionid();
			
		} catch(Exception e) {
			//e.printStackTrace();
			return -1;
		}


		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			return -1;
		}

		OpenWeatherMap owm = null;
		Twitter twitter = null;
		try {
			owm = new OpenWeatherMap(apiKey);

			if (user.getTwitterToken() != null && user.getTwitterTokenSecret() != null) {
				ConfigurationBuilder builder = new ConfigurationBuilder();
				builder.setOAuthConsumerKey(tw_appid);
				builder.setOAuthConsumerSecret(tw_appsecret);
				Configuration configuration = builder.build();
				TwitterFactory factory = new TwitterFactory(configuration);
				twitter = factory.getInstance();
				twitter.setOAuthAccessToken(new AccessToken(user.getTwitterToken(), user.getTwitterTokenSecret()));
			}
		} catch (Exception e) {
			return -1;
		}

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				
				if(ricetta.get("description").toString().length()>255) {
					return -4;
				}
				if(rec.getDescription().compareTo(ricetta.get("description").toString())!=0) {
					//cambia solo la descrizione
					rec.setDescription((String) ricetta.get("description"));
					session.update(rec);
					session.flush();
					return 0;
				}

				// TRIGGER
				// check if trigger/action type is different
				// from passed data and handle this case
				if (rec.getTriggerType().compareTo(triggerType) == 0) {
					// they are the same, so only changes on fields
					if (triggerType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
						calendartrigger.setCtid(rec.getTriggerid());
						if (calendartrigger.getEventAction() == null) {
							tx.rollback();
							return -1;
						}
						if (calendartrigger.getTitle() == null && calendartrigger.getDescription() == null
								&& calendartrigger.getLocation() == null) {
							tx.rollback();
							return -1;
						}
						if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
							tx.rollback();
							return -1;
						} else {
							if (calendartrigger.getTitle() != null && calendartrigger.getTitle().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendartrigger.getDescription() != null
									&& calendartrigger.getDescription().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendartrigger.getLocation() != null
									&& calendartrigger.getLocation().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
						}
						calendartrigger.setLastCheck(System.currentTimeMillis());
						session.update(calendartrigger);
						session.flush();

					} else if (triggerType.compareTo("gmail") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						GmailTrigger gmailtrigger = mapper.readValue(trig, GmailTrigger.class);
						if (gmailtrigger.getIngredientCode() != 13) {
							tx.rollback();
							return -1;
						}
						if (gmailtrigger.getSender() != null && gmailtrigger.getSender().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (gmailtrigger.getSubject() != null && gmailtrigger.getSubject().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (gmailtrigger.getSender() != null) {
							EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
							if (emailval.validate() == false) {
								tx.rollback();
								return -1;
							}
						}
						gmailtrigger.setGtid(rec.getTriggerid());
						gmailtrigger.setLastCheck(System.currentTimeMillis());
						session.update(gmailtrigger);
						session.flush();

					} else if (triggerType.compareTo("weather") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						WeatherTrigger weathertrigger = mapper.readValue(trig, WeatherTrigger.class);
						switch (weathertrigger.getIngredientCode()) {
						case 14:
							// weather trigger 1: tomorrow
							if (weathertrigger.getType() != 1 || weathertrigger.getOra() == null) {
								tx.rollback();
								return -1;
							}
							DateFormat formatter = new SimpleDateFormat("HH:mm");
							try {
								formatter.setLenient(false);
								Date date = formatter.parse(weathertrigger.getOra());
							}catch(Exception e) {
								tx.rollback();
								return -1;
							}
							break;

						case 15:
							// weather trigger 2: weather condition
							if (weathertrigger.getType() != 3 || weathertrigger.getTempo() == null) {
								tx.rollback();
								return -1;
							}
							break;

						case 16:
							// weather trigger 3: sunrise/sunset
							if (weathertrigger.getType() != 2
									|| (weathertrigger.getSunrise() == null && weathertrigger.getSunset() == null)) {
								tx.rollback();
								return -1;
							}
							break;

						case 17:
							// weather trigger 4: temp max/min
							if (weathertrigger.getType() != 4
									|| (weathertrigger.getThmax() == null && weathertrigger.getThmin() == null)) {
								tx.rollback();
								return -1;
							}
							if (weathertrigger.getThmin() != null) {
								if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
									tx.rollback();
									return -1;
								}
							}
							if (weathertrigger.getThmax() != null) {
								if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
									tx.rollback();
									return -1;
								}
							}
							break;

						default:
							tx.rollback();
							return -1;
						}
						if (weathertrigger.getLocation() == null) {
							tx.rollback();
							return -1;
						}
						if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
							try {
								CurrentWeather cwd = owm.currentWeatherByCityCode(weathertrigger.getLocation());
								if (cwd.isValid()) {
									if (cwd.hasCityName()) {
										if (cwd.getCityName().compareTo(weathertrigger.getLocationName()) != 0) {
											tx.rollback();
											return -1;
										}
									} else {
										tx.rollback();
										return -1;
									}
								} else {
									tx.rollback();
									return -1;
								}
							} catch (Exception e) {
								tx.rollback();
								return -1;
							}
						}
						String tz = null;
						if (weathertrigger.getTimezone() == null) {
							tz = user.getTimezone();
						} else {
							tz = weathertrigger.getTimezone();
						}
						if (timezones.contains(tz) == false) {
							tx.rollback();
							return -1;
						} else {
							weathertrigger.setTimezone(tz);
						}
						if (weathertrigger.getType() == 2) {
							weathertrigger.setLastCheck(System.currentTimeMillis());
						} else {
							weathertrigger.setLastCheck(null);
						}
						weathertrigger.setWtid(rec.getTriggerid());
						session.update(weathertrigger);
						session.flush();

					} else if (triggerType.compareTo("twitter") == 0) {
						if (twitter == null) {
							tx.rollback();
							return -1;
						} else {
							ObjectMapper mapper = new ObjectMapper();
							mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
							TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
							if (twittertrigger.getIngredientCode() < 18 && twittertrigger.getIngredientCode() != 19) {
								return -1;
							}
							if(twittertrigger.getUsername_sender()!=null && twittertrigger.getUsername_sender().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if(twittertrigger.getHashtag_text()!=null && twittertrigger.getHashtag_text().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if (twittertrigger.getHashtag_text() == null
									&& twittertrigger.getUsername_sender() == null) {
								tx.rollback();
								return -1;
							}
							if (twittertrigger.getUsername_sender() != null) {
								try {
									twitter.showUser(twittertrigger.getUsername_sender()).getId();
								} catch (TwitterException e) {
									if (e.getErrorCode() == 50) {
										tx.rollback();
										return -2;
									} else {
										tx.rollback();
										return -1;
									}
								}
							}
							if (twittertrigger.getType() == false && twittertrigger.getHashtag_text() != null) {
								if (twittertrigger.getHashtag_text().startsWith("#") == false) {
									twittertrigger.setHashtag_text("#" + twittertrigger.getHashtag_text());
								}
							}
							twittertrigger.setTwtid(rec.getTriggerid());
							twittertrigger.setLastCheck(System.currentTimeMillis());
							session.update(twittertrigger);
							session.flush();
						}

					} else {
						// errore: valore non valido!
						tx.rollback();
						return -1;
					}
				} else {
					// the trigger type changed
					// delete the old trigger and insert the new one

					// TRIGGER to delete
					if (triggerTypeOld.compareTo("calendar") == 0) {
						CalendarTrigger caltr = calendarManager.findCalendarTriggerById(triggerid);
						session.delete(caltr);
						session.flush();
					} else if (triggerTypeOld.compareTo("gmail") == 0) {
						GmailTrigger gmailtr = gmailManager.findGmailTriggerById(triggerid);
						session.delete(gmailtr);
						session.flush();
					} else if (triggerTypeOld.compareTo("weather") == 0) {
						WeatherTrigger weatr = weatherManager.findWeatherTriggerById(triggerid);
						session.delete(weatr);
						session.flush();
					} else if (triggerTypeOld.compareTo("twitter") == 0) {
						TwitterTrigger twitr = twitterManager.findTwitterTriggerById(triggerid);
						session.delete(twitr);
						session.flush();
					} else {
						// type non valido
						tx.rollback();
						return -1;
					}

					// TRIGGER to add
					if (triggerType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
						if (calendartrigger.getEventAction() == null) {
							tx.rollback();
							return -1;
						}
						if (calendartrigger.getTitle() == null && calendartrigger.getDescription() == null
								&& calendartrigger.getLocation() == null) {
							tx.rollback();
							return -1;
						}
						if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
							tx.rollback();
							return -1;
						} else {
							if (calendartrigger.getTitle() != null && calendartrigger.getTitle().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendartrigger.getDescription() != null
									&& calendartrigger.getDescription().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendartrigger.getLocation() != null
									&& calendartrigger.getLocation().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
						}
						calendartrigger.setLastCheck(System.currentTimeMillis());
						session.save(calendartrigger);
						session.flush();
						triggerid = calendartrigger.getCtid();

					} else if (triggerType.compareTo("gmail") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						GmailTrigger gmailtrigger = mapper.readValue(trig, GmailTrigger.class);
						if (gmailtrigger.getIngredientCode() != 13) {
							tx.rollback();
							return -1;
						}
						if (gmailtrigger.getSender() != null && gmailtrigger.getSender().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (gmailtrigger.getSubject() != null && gmailtrigger.getSubject().compareTo("") == 0) {
							tx.rollback();
							return -3;
						}
						if (gmailtrigger.getSender() != null) {
							EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
							if (emailval.validate() == false) {
								tx.rollback();
								return -1;
							}
						}
						gmailtrigger.setLastCheck(System.currentTimeMillis());
						session.save(gmailtrigger);
						session.flush();
						triggerid = gmailtrigger.getGtid();

					} else if (triggerType.compareTo("weather") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						WeatherTrigger weathertrigger = mapper.readValue(trig, WeatherTrigger.class);
						switch (weathertrigger.getIngredientCode()) {
						case 14:
							// weather trigger 1: tomorrow
							if (weathertrigger.getType() != 1 || weathertrigger.getOra() == null) {
								tx.rollback();
								return -1;
							}
							DateFormat formatter = new SimpleDateFormat("HH:mm");
							try {
								formatter.setLenient(false);
								Date date = formatter.parse(weathertrigger.getOra());
							}catch(Exception e) {
								tx.rollback();
								return -1;
							}
							break;

						case 15:
							// weather trigger 2: weather condition
							if (weathertrigger.getType() != 3 || weathertrigger.getTempo() == null) {
								tx.rollback();
								return -1;
							}
							break;

						case 16:
							// weather trigger 3: sunrise/sunset
							if (weathertrigger.getType() != 2
									|| (weathertrigger.getSunrise() == null && weathertrigger.getSunset() == null)) {
								tx.rollback();
								return -1;
							}
							break;

						case 17:
							// weather trigger 4: temp max/min
							if (weathertrigger.getType() != 4
									|| (weathertrigger.getThmax() == null && weathertrigger.getThmin() == null)) {
								tx.rollback();
								return -1;
							}
							if (weathertrigger.getThmin() != null) {
								if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
									tx.rollback();
									return -1;
								}
							}
							if (weathertrigger.getThmax() != null) {
								if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
									tx.rollback();
									return -1;
								}
							}
							break;

						default:
							tx.rollback();
							return -1;
						}
						if (weathertrigger.getLocation() == null) {
							tx.rollback();
							return -1;
						}
						if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
							try {
								CurrentWeather cwd = owm.currentWeatherByCityCode(weathertrigger.getLocation());
								if (cwd.isValid()) {
									if (cwd.hasCityName()) {
										if (cwd.getCityName().compareTo(weathertrigger.getLocationName()) != 0) {
											tx.rollback();
											return -1;
										}
									} else {
										tx.rollback();
										return -1;
									}
								} else {
									tx.rollback();
									return -1;
								}
							} catch (Exception e) {
								tx.rollback();
								return -1;
							}
						}
						String tz = null;
						if (weathertrigger.getTimezone() == null) {
							tz = user.getTimezone();
						} else {
							tz = weathertrigger.getTimezone();
						}
						if (timezones.contains(tz) == false) {
							tx.rollback();
							return -1;
						} else {
							weathertrigger.setTimezone(tz);
						}
						if (weathertrigger.getType() == 2) {
							weathertrigger.setLastCheck(System.currentTimeMillis());
						} else {
							weathertrigger.setLastCheck(null);
						}
						session.save(weathertrigger);
						session.flush();
						triggerid = weathertrigger.getWtid();

					} else if (triggerType.compareTo("twitter") == 0) {
						if (twitter == null) {
							tx.rollback();
							return -1;
						} else {
							ObjectMapper mapper = new ObjectMapper();
							mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
							TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
							if (twittertrigger.getIngredientCode() != 18 && twittertrigger.getIngredientCode() != 19) {
								tx.rollback();
								return -1;
							}
							if(twittertrigger.getUsername_sender()!=null && twittertrigger.getUsername_sender().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if(twittertrigger.getHashtag_text()!=null && twittertrigger.getHashtag_text().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if (twittertrigger.getHashtag_text() == null
									&& twittertrigger.getUsername_sender() == null) {
								tx.rollback();
								return -1;
							}
							if (twittertrigger.getUsername_sender() != null) {
								try {
									twitter.showUser(twittertrigger.getUsername_sender()).getId();
								} catch (TwitterException e) {
									if (e.getErrorCode() == 50) {
										tx.rollback();
										return -2;
									} else {
										tx.rollback();
										return -1;
									}
								}
							}
							if (twittertrigger.getType() == false && twittertrigger.getHashtag_text() != null) {
								if (twittertrigger.getHashtag_text().startsWith("#") == false) {
									twittertrigger.setHashtag_text("#" + twittertrigger.getHashtag_text());
								}
							}
							twittertrigger.setLastCheck(System.currentTimeMillis());
							session.save(twittertrigger);
							session.flush();
							triggerid = twittertrigger.getTwtid();
						}

					} else {
						// errore: valore non valido!
						tx.rollback();
						return -1;
					}
				}

				// ACTION
				if (rec.getActionType().compareTo(actionType) == 0) {
					// they are the same, so only changes on fields
					if (actionType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarAction calendaraction = mapper.readValue(act, CalendarAction.class);
						if (calendaraction.getIngredientCode() != 21) {
							tx.rollback();
							return -1;
						}
						else {
							if (calendaraction.getTitle() != null && calendaraction.getTitle().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendaraction.getDescription() != null
									&& calendaraction.getDescription().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendaraction.getLocation() != null && calendaraction.getLocation().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
						}
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						if (calendaraction.getStartDate() != null) {
							try {
								sdf.setLenient(false);
								sdf.parse(calendaraction.getStartDate());
							} catch (ParseException e1) {
								tx.rollback();
								return -1;
							} catch (Exception e) {
								tx.rollback();
								return -1;
							}
						} else {
							String dstr = sdf.format(new Date());
							calendaraction.setStartDate(dstr);
						}
						if (calendaraction.getDuration() == null) {
							calendaraction.setDuration((long) 3600000);
						}
						String tz = null;
						if (calendaraction.getTimezone() == null) {
							tz = user.getTimezone();
						} else {
							tz = calendaraction.getTimezone();
						}
						if (timezones.contains(tz) == false) {
							tx.rollback();
							return -1;
						} else {
							calendaraction.setTimezone(tz);
						}
						calendaraction.setCaid(rec.getActionid());
						session.update(calendaraction);
						session.flush();

					} else if (actionType.compareTo("gmail") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						GmailAction gmailaction = mapper.readValue(act, GmailAction.class);
						if (gmailaction.getIngredientCode() != 22) {
							tx.rollback();
							return -1;
						}
						if(gmailaction.getReceiver()==null) {
							tx.rollback();
							return -1;
						}
						if (gmailaction.getReceiver() != null) {
							EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
							if (emailval.validate() == false) {
								tx.rollback();
								return -1;
							}
						}
						if(gmailaction.getSubject()!=null && gmailaction.getSubject().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						if(gmailaction.getBody()!=null && gmailaction.getBody().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						gmailaction.setGaid(rec.getActionid());
						session.update(gmailaction);
						session.flush();

					} else if (actionType.compareTo("twitter") == 0) {
						if (twitter == null) {
							tx.rollback();
							return -1;
						} else {
							ObjectMapper mapper = new ObjectMapper();
							mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
							TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
							if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
								tx.rollback();
								return -1;
							}
							if(twitteraction.getIngredientCode()==23) {
								if(twitteraction.getBody()!=null && twitteraction.getBody().length()>140) {
									tx.rollback();
									return -1;
								}
							}
							if (twitteraction.getIngredientCode() == 24 && twitteraction.getDestination() == null) {
								tx.rollback();
								return -2;
							}
							if (twitteraction.getIngredientCode() == 24 && twitteraction.getBody()!=null && twitteraction.getBody().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if (twitteraction.getDestination() != null) {
								try {
									twitter.showUser(twitteraction.getDestination());
								} catch (TwitterException e) {
									if (e.getErrorCode() == 50) {
										tx.rollback();
										return -2;
									} else {
										tx.rollback();
										return -1;
									}
								}
							}
							twitteraction.setTwaid(rec.getActionid());
							session.update(twitteraction);
							session.flush();
						}
					} else {
						// errore: valore non valido!
						tx.rollback();
						return -1;
					}
				} else {
					// the action type changed
					// delete the old action and insert the new one

					// ACTION to delete
					if (actionTypeOld.compareTo("calendar") == 0) {
						CalendarAction calac = calendarManager.findCalendarActionById(actionid);
						session.delete(calac);
						session.flush();
					} else if (actionTypeOld.compareTo("gmail") == 0) {
						GmailAction gmailac = gmailManager.findGmailActionById(actionid);
						session.delete(gmailac);
						session.flush();
					} else if (actionTypeOld.compareTo("twitter") == 0) {
						TwitterAction twiac = twitterManager.findTwitterActionById(actionid);
						session.delete(twiac);
						session.flush();
					} else {
						// type non valido
						tx.rollback();
						return -1;
					}

					// ACTION to add
					if (actionType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarAction calendaraction = mapper.readValue(act, CalendarAction.class);
						if (calendaraction.getIngredientCode() != 21) {
							tx.rollback();
							return -1;
						}
						else {
							if (calendaraction.getTitle() != null && calendaraction.getTitle().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendaraction.getDescription() != null
									&& calendaraction.getDescription().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
							if (calendaraction.getLocation() != null && calendaraction.getLocation().compareTo("") == 0) {
								tx.rollback();
								return -3;
							}
						}
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						if (calendaraction.getStartDate() != null) {
							try {
								sdf.setLenient(false);
								sdf.parse(calendaraction.getStartDate());
							} catch (ParseException e1) {
								tx.rollback();
								return -1;
							} catch (Exception e) {
								tx.rollback();
								return -1;
							}
						} else {
							String dstr = sdf.format(new Date());
							calendaraction.setStartDate(dstr);
						}
						if (calendaraction.getDuration() == null) {
							calendaraction.setDuration((long) 3600000);
						}
						String tz = null;
						if (calendaraction.getTimezone() == null) {
							tz = user.getTimezone();
						} else {
							tz = calendaraction.getTimezone();
						}
						if (timezones.contains(tz) == false) {
							tx.rollback();
							return -1;
						} else {
							calendaraction.setTimezone(tz);
						}
						session.save(calendaraction);
						session.flush();
						actionid = calendaraction.getCaid();

					} else if (actionType.compareTo("gmail") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						GmailAction gmailaction = mapper.readValue(act, GmailAction.class);
						if (gmailaction.getIngredientCode() != 22) {
							tx.rollback();
							return -1;
						}
						if(gmailaction.getReceiver()==null) {
							tx.rollback();
							return -1;
						}
						if (gmailaction.getReceiver() != null) {
							EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
							if (emailval.validate() == false) {
								tx.rollback();
								return -1;
							}
						}
						if(gmailaction.getSubject()!=null && gmailaction.getSubject().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						if(gmailaction.getBody()!=null && gmailaction.getBody().compareTo("")==0) {
							tx.rollback();
							return -3;
						}
						session.save(gmailaction);
						session.flush();
						actionid = gmailaction.getGaid();

					} else if (actionType.compareTo("twitter") == 0) {
						if (twitter == null) {
							tx.rollback();
							return -1;
						} else {
							ObjectMapper mapper = new ObjectMapper();
							mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
							TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
							if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
								tx.rollback();
								return -1;
							}
							if(twitteraction.getIngredientCode()==23) {
								if(twitteraction.getBody()!=null && twitteraction.getBody().length()>140) {
									tx.rollback();
									return -1;
								}
							}
							if (twitteraction.getIngredientCode() == 24 && twitteraction.getDestination() == null) {
								tx.rollback();
								return -2;
							}
							if (twitteraction.getIngredientCode() == 24 && twitteraction.getBody()!=null && twitteraction.getBody().compareTo("")==0) {
								tx.rollback();
								return -3;
							}
							if (twitteraction.getDestination() != null) {
								try {
									twitter.showUser(twitteraction.getDestination());
								} catch (TwitterException e) {
									if (e.getErrorCode() == 50) {
										tx.rollback();
										return -2;
									} else {
										tx.rollback();
										return -1;
									}
								}
							}
							session.save(twitteraction);
							session.flush();
							actionid = twitteraction.getTwaid();
						}

					} else {
						// errore: valore non valido!
						tx.rollback();
						return -1;
					}
				}

				// RECIPE
				Recipes recipe = new Recipes();
				recipe.setRid(id);
				recipe.setTriggerType(triggerType);
				recipe.setActionType(actionType);
				recipe.setTriggerid(triggerid);
				recipe.setActionid(actionid);
				recipe.setPublish((Boolean) ricetta.get("publish"));
				recipe.setDescription((String) ricetta.get("description"));
				recipe.setUser(user);
				session.update(recipe);
				session.flush();

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				//e.printStackTrace();
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		// se qualcosa e' andato storto, sara' -1
		return flag;
	}

	public Integer deleteRecipe(Integer id) {

		Session session = sessionFactory.openSession();
		Integer flag = 0;

		Recipes recipe = this.findRecipesById(id);
		if (recipe == null) {
			return -1;
		}
		String triggerType = recipe.getTriggerType();
		String actionType = recipe.getActionType();
		Integer triggerid = recipe.getTriggerid();
		Integer actionid = recipe.getActionid();

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				// TRIGGER to delete
				if (triggerType.compareTo("calendar") == 0) {
					CalendarTrigger caltr = calendarManager.findCalendarTriggerById(triggerid);
					session.delete(caltr);
					session.flush();
				} else if (triggerType.compareTo("gmail") == 0) {
					GmailTrigger gmailtr = gmailManager.findGmailTriggerById(triggerid);
					session.delete(gmailtr);
					session.flush();
				} else if (triggerType.compareTo("weather") == 0) {
					WeatherTrigger weatr = weatherManager.findWeatherTriggerById(triggerid);
					session.delete(weatr);
					session.flush();
				} else if (triggerType.compareTo("twitter") == 0) {
					TwitterTrigger twitr = twitterManager.findTwitterTriggerById(triggerid);
					session.delete(twitr);
					session.flush();
				} else {
					// type non valido
					flag = -1;
				}

				// ACTION to delete
				if (actionType.compareTo("calendar") == 0) {
					CalendarAction calac = calendarManager.findCalendarActionById(actionid);
					session.delete(calac);
					session.flush();
				} else if (actionType.compareTo("gmail") == 0) {
					GmailAction gmailac = gmailManager.findGmailActionById(actionid);
					session.delete(gmailac);
					session.flush();
				} else if (actionType.compareTo("twitter") == 0) {
					TwitterAction twiac = twitterManager.findTwitterActionById(actionid);
					session.delete(twiac);
					session.flush();
				} else {
					// type non valido
					flag = -1;
				}

				// RECIPE to delete
				session.delete(recipe);
				session.flush();

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		// -1 if some error
		return flag;
	}

	public void publishRecipe(Recipes recipe) {

		Session session = sessionFactory.openSession();

		try {
			session.update(recipe);
			session.flush();
		} catch (Exception e) {
			return;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		return;
	}

	public Integer invalidateGoogleRecipes(Users user) {
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				for (Recipes r : recipes) {
					if (r.getTriggerType().compareTo("calendar") == 0 || r.getTriggerType().compareTo("gmail") == 0
							|| r.getActionType().compareTo("calendar") == 0
							|| r.getActionType().compareTo("gmail") == 0) {
						r.setValid(false);
						session.update(r);
						session.flush();
					}
				}

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return 0;
	}

	public Integer validateGoogleRecipes(Users user) {
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				for (Recipes r : recipes) {
					if (r.getValid() == false) {
						if (r.getTriggerType().compareTo("calendar") == 0 || r.getTriggerType().compareTo("gmail") == 0
								|| r.getActionType().compareTo("calendar") == 0
								|| r.getActionType().compareTo("gmail") == 0) {
							r.setValid(true);
							session.update(r);
							session.flush();
						}
					}
				}

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return 0;
	}

	public Integer invalidateTwitterRecipes(Users user) {
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				for (Recipes r : recipes) {
					if (r.getTriggerType().compareTo("twitter") == 0 || r.getActionType().compareTo("twitter") == 0) {
						r.setValid(false);
						session.update(r);
						session.flush();
					}
				}

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return 0;
	}

	public Integer validateTwitterRecipes(Users user) {
		Session session = sessionFactory.openSession();
		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				List<Recipes> recipes = user.getRecipes();
				for (Recipes r : recipes) {
					if (r.getValid() == false) {
						if (r.getTriggerType().compareTo("twitter") == 0
								|| r.getActionType().compareTo("twitter") == 0) {
							r.setValid(true);
							session.update(r);
							session.flush();
						}
					}
				}

			} catch (Exception e) {
				// if some errors during the transaction occur,
				// rollback and return code -1
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} catch (Exception e) {
			return -1;
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return 0;
	}
}
