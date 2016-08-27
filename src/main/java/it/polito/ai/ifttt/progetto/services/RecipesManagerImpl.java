package it.polito.ai.ifttt.progetto.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
	Map<Long, String> cities = this.buildMap();

	@SuppressWarnings("unchecked")
	public List<Recipes> findAllRecipes() {
		Session session = sessionFactory.openSession();
		List<Recipes> recipes = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.Recipes";
			Query query = session.createQuery(hql);
			recipes = query.list();
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

	public Integer addRecipe(String data) {

		// I need session e transaction here, because I have to
		// update 3 db for a single receipt.
		Session session = sessionFactory.openSession();

		JSONObject ricetta = new JSONObject(data);
		String trig = ricetta.get("trigger").toString();
		String act = ricetta.get("action").toString();
		JSONObject trigger = new JSONObject(trig);
		JSONObject action = new JSONObject(act);

		String triggerType = trigger.get("triggerType").toString();
		String actionType = action.get("actionType").toString();

		Integer triggerid = null;
		Integer actionid = null;
		Integer recipeid = -1;

		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			return -1;
		}

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {

				// TRIGGER
				if (triggerType.compareTo("calendar") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
					if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
						return -1;
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
						return -1;
					}
					gmailtrigger.setLastCheck(System.currentTimeMillis());
					if (gmailtrigger.getSender() != null) {
						EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
						if (emailval.validate() == false) {
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
					if (weathertrigger.getIngredientCode() < 14 || weathertrigger.getIngredientCode() > 17) {
						return -1;
					}
					if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
						if (cities.containsKey(weathertrigger.getLocation()) == true) {
							String cityName = cities.get(weathertrigger.getLocation());
							if (cityName.compareTo(weathertrigger.getLocationName()) != 0) {
								return -1;
							}
						} else {
							return -1;
						}
					} else {
						return -1;
					}
					if (weathertrigger.getThmin() != null) {
						if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
							return -1;
						}
					}
					if (weathertrigger.getThmax() != null) {
						if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
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
						return -1;
					} else {
						weathertrigger.setTimezone(tz);
					}
					weathertrigger.setLastCheck(null);
					// weathertrigger.setLastCheck(System.currentTimeMillis());
					session.save(weathertrigger);
					session.flush();
					triggerid = weathertrigger.getWtid();

				} else if (triggerType.compareTo("twitter") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
					if (twittertrigger.getIngredientCode() != 18 && twittertrigger.getIngredientCode() != 19) {
						return -1;
					}
					twittertrigger.setLastCheck(System.currentTimeMillis());
					session.save(twittertrigger);
					session.flush();
					triggerid = twittertrigger.getTwtid();

				} else {
					// errore: valore non valido!
					recipeid = -1;
				}

				// ACTION
				if (actionType.compareTo("calendar") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					CalendarAction calendaraction = mapper.readValue(act, CalendarAction.class);
					if (calendaraction.getIngredientCode() != 21) {
						return -1;
					}
					if (calendaraction.getStartDate() != null) {
						try {
							SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
							sdf.parse(calendaraction.getStartDate());
						} catch (ParseException e1) {
							return -1;
						}
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
						return -1;
					}
					if (gmailaction.getReceiver() != null) {
						EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
						if (emailval.validate() == false) {
							return -1;
						}
					}
					session.save(gmailaction);
					session.flush();
					actionid = gmailaction.getGaid();

				} else if (actionType.compareTo("twitter") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
					if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
						return -1;
					}
					session.save(twitteraction);
					session.flush();
					actionid = twitteraction.getTwaid();

				} else {
					// errore: valore non valido!
					recipeid = -1;
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
				System.out.println(e);
				tx.rollback();
				return -1;
			}
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}

		// se qualcosa e' andato storto, sara' -1
		return recipeid;
	}

	public Integer modifyRecipe(Integer id, String data) {
		Session session = sessionFactory.openSession();

		// new data
		JSONObject ricetta = new JSONObject(data);
		String trig = ricetta.get("trigger").toString();
		String act = ricetta.get("action").toString();
		JSONObject trigger = new JSONObject(trig);
		JSONObject action = new JSONObject(act);
		String triggerType = trigger.get("triggerType").toString();
		String actionType = action.get("actionType").toString();

		Integer flag = 0;

		// old data
		Recipes rec = this.findRecipesById(id);
		String triggerTypeOld = rec.getTriggerType();
		String actionTypeOld = rec.getActionType();
		Integer triggerid = rec.getTriggerid();
		Integer actionid = rec.getActionid();

		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		Users user = loginManager.findUserByUsername(username);
		if (user == null) {
			return -1;
		}

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {

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
						if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
							return -1;
						}
						calendartrigger.setLastCheck(System.currentTimeMillis());
						session.update(calendartrigger);
						session.flush();

					} else if (triggerType.compareTo("gmail") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						GmailTrigger gmailtrigger = mapper.readValue(trig, GmailTrigger.class);
						if (gmailtrigger.getIngredientCode() != 13) {
							return -1;
						}
						if (gmailtrigger.getSender() != null) {
							EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
							if (emailval.validate() == false) {
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
						if (weathertrigger.getIngredientCode() < 14 || weathertrigger.getIngredientCode() > 17) {
							return -1;
						}
						if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
							if (cities.containsKey(weathertrigger.getLocation()) == true) {
								String cityName = cities.get(weathertrigger.getLocation());
								if (cityName.compareTo(weathertrigger.getLocationName()) != 0) {
									return -1;
								}
							} else {
								return -1;
							}
						} else {
							return -1;
						}
						if (weathertrigger.getThmin() != null) {
							if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
								return -1;
							}
						}
						if (weathertrigger.getThmax() != null) {
							if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
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
							return -1;
						} else {
							weathertrigger.setTimezone(tz);
						}
						weathertrigger.setWtid(rec.getTriggerid());
						// weathertrigger.setLastCheck(System.currentTimeMillis());
						weathertrigger.setLastCheck(null);
						session.update(weathertrigger);
						session.flush();

					} else if (triggerType.compareTo("twitter") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
						if (twittertrigger.getIngredientCode() < 18 && twittertrigger.getIngredientCode() != 19) {
							return -1;
						}
						twittertrigger.setTwtid(rec.getTriggerid());
						twittertrigger.setLastCheck(System.currentTimeMillis());
						session.update(twittertrigger);
						session.flush();

					} else {
						// errore: valore non valido!
						flag = -1;
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
						flag = -1;
					}

					// TRIGGER to add
					if (triggerType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
						if (calendartrigger.getIngredientCode() != 11 && calendartrigger.getIngredientCode() != 12) {
							return -1;
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
							return -1;
						}
						if (gmailtrigger.getSender() != null) {
							EmailValidator emailval = new EmailValidator(gmailtrigger.getSender());
							if (emailval.validate() == false) {
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
						if (weathertrigger.getIngredientCode() < 14 || weathertrigger.getIngredientCode() > 17) {
							return -1;
						}
						if (weathertrigger.getLocation() != null && weathertrigger.getLocationName() != null) {
							if (cities.containsKey(weathertrigger.getLocation()) == true) {
								String cityName = cities.get(weathertrigger.getLocation());
								if (cityName.compareTo(weathertrigger.getLocationName()) != 0) {
									return -1;
								}
							} else {
								return -1;
							}
						} else {
							return -1;
						}
						if (weathertrigger.getThmin() != null) {
							if (weathertrigger.getThmin() < (-70) || weathertrigger.getThmin() > 70) {
								return -1;
							}
						}
						if (weathertrigger.getThmax() != null) {
							if (weathertrigger.getThmax() < (-70) || weathertrigger.getThmax() > 70) {
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
							return -1;
						} else {
							weathertrigger.setTimezone(tz);
						}
						// weathertrigger.setLastCheck(System.currentTimeMillis());
						weathertrigger.setLastCheck(null);
						session.save(weathertrigger);
						session.flush();
						triggerid = weathertrigger.getWtid();

					} else if (triggerType.compareTo("twitter") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
						if (twittertrigger.getIngredientCode() != 18 && twittertrigger.getIngredientCode() != 19) {
							return -1;
						}
						twittertrigger.setLastCheck(System.currentTimeMillis());
						session.save(twittertrigger);
						session.flush();
						triggerid = twittertrigger.getTwtid();

					} else {
						// errore: valore non valido!
						flag = -1;
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
							return -1;
						}
						if (calendaraction.getStartDate() != null) {
							try {
								SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								sdf.parse(calendaraction.getStartDate());
							} catch (ParseException e1) {
								return -1;
							}
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
							return -1;
						}
						if (gmailaction.getReceiver() != null) {
							EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
							if (emailval.validate() == false) {
								return -1;
							}
						}
						gmailaction.setGaid(rec.getActionid());
						session.update(gmailaction);
						session.flush();

					} else if (actionType.compareTo("twitter") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
						if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
							return -1;
						}
						twitteraction.setTwaid(rec.getActionid());
						session.update(twitteraction);
						session.flush();
					} else {
						// errore: valore non valido!
						flag = -1;
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
						flag = -1;
					}

					// ACTION to add
					if (actionType.compareTo("calendar") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						CalendarAction calendaraction = mapper.readValue(act, CalendarAction.class);
						if (calendaraction.getIngredientCode() != 21) {
							return -1;
						}
						if (calendaraction.getStartDate() != null) {
							try {
								SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								sdf.parse(calendaraction.getStartDate());
							} catch (ParseException e1) {
								return -1;
							}
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
							return -1;
						}
						if (gmailaction.getReceiver() != null) {
							EmailValidator emailval = new EmailValidator(gmailaction.getReceiver());
							if (emailval.validate() == false) {
								return -1;
							}
						}
						session.save(gmailaction);
						session.flush();
						actionid = gmailaction.getGaid();

					} else if (actionType.compareTo("twitter") == 0) {
						ObjectMapper mapper = new ObjectMapper();
						mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
						TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
						if (twitteraction.getIngredientCode() != 23 && twitteraction.getIngredientCode() != 24) {
							return -1;
						}
						session.save(twitteraction);
						session.flush();
						actionid = twitteraction.getTwaid();

					} else {
						// errore: valore non valido!
						flag = -1;
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
				System.out.println(e);
				tx.rollback();
				return -1;
			}
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
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return 0;
	}

	public Map<Long, String> buildMap() {
		// String file = context.getRealPath("/WEB-INF/cityFile.txt");
		ClassLoader classLoader = getClass().getClassLoader();
//		File file = new File(classLoader.getResource("cityFile.txt").getFile());
		Map<Long, String> cities = new HashMap<Long, String>();
		FileReader f;
		try {
			f = new FileReader(classLoader.getResource("cityFile.txt").getFile());
			BufferedReader b = new BufferedReader(f);
			String s = "";
			while ((s = b.readLine()) != null) {
				JSONObject obj = new JSONObject(s);
				cities.put(obj.getLong("i"), obj.getString("n"));
			}
			b.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return cities;
	}
}
