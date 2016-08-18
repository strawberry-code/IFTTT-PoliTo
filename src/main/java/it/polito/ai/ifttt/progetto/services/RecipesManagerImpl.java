package it.polito.ai.ifttt.progetto.services;

import java.util.List;

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
		if(recipes.size()==0) {
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
		if(recipe==null) {
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
		if(actionsid.size()==0) {
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

		try {
			// begin transaction
			Transaction tx = session.beginTransaction();
			try {
				
				// TRIGGER
				if (triggerType.compareTo("calendar") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					CalendarTrigger calendartrigger = mapper.readValue(trig, CalendarTrigger.class);
					calendartrigger.setLastCheck(System.currentTimeMillis());
					session.save(calendartrigger);
					session.flush();					
					triggerid = calendartrigger.getCtid();

				} else if (triggerType.compareTo("gmail") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					GmailTrigger gmailtrigger = mapper.readValue(trig, GmailTrigger.class);
					gmailtrigger.setLastCheck(System.currentTimeMillis());
					session.save(gmailtrigger);
					session.flush();
					triggerid = gmailtrigger.getGtid();

				} else if (triggerType.compareTo("weather") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					WeatherTrigger weathertrigger = mapper.readValue(trig, WeatherTrigger.class);
					weathertrigger.setLastCheck(System.currentTimeMillis());
					session.save(weathertrigger);
					session.flush();
					triggerid = weathertrigger.getWtid();

				} else if (triggerType.compareTo("twitter") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					TwitterTrigger twittertrigger = mapper.readValue(trig, TwitterTrigger.class);
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
					session.save(calendaraction);	
					session.flush();					
					actionid = calendaraction.getCaid();

				} else if (actionType.compareTo("gmail") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					GmailAction gmailaction = mapper.readValue(act, GmailAction.class);
					session.save(gmailaction);	
					session.flush();					
					actionid = gmailaction.getGaid();

				} else if (actionType.compareTo("twitter") == 0) {
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					TwitterAction twitteraction = mapper.readValue(act, TwitterAction.class);
					session.save(twitteraction);	
					session.flush();					
					actionid = twitteraction.getTwaid();

				} else {
					// errore: valore non valido!
					recipeid = -1;
				}
				
				// RECIPE
				String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
				Users user = loginManager.findUserByUsername(username);				
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
				System.out.println("Ricetta id: "+recipeid);

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

		//se qualcosa e' andato storto, sara' -1
		return recipeid;
	}
	

/*	@SuppressWarnings("unchecked")
	public List<Recipes> findRecipesByUser(Integer userid) {
		Session session = sessionFactory.openSession();
		List<Recipes> recipesuser = null;
		try {		
			String hql = "from it.polito.ai.ifttt.progetto.models.Recipes r where r.id=:n";
			Query query = session.createQuery(hql);
			query.setInteger("n", userid);
			recipesuser = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(recipesuser.size()==0) {
			return null;
		}
		return recipesuser;
	} 

	public String extractActionType(Integer id) {
		Session session = sessionFactory.openSession();
		String actiontype = null;
		try {		
			String hql = "select actionType from it.polito.ai.ifttt.progetto.models.Recipes r where r.rid=:n";
			Query query = session.createQuery(hql);
			query.setInteger("n", id);
			actiontype = (String) query.uniqueResult();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(actiontype==null) {
			return null;
		}
		return actiontype;
	}

	public String extractTriggerType(Integer id) {
		Session session = sessionFactory.openSession();
		String triggertype = null;
		try {		
			String hql = "select trigerType from it.polito.ai.ifttt.progetto.models.Recipes r where r.rid=:n";
			Query query = session.createQuery(hql);
			query.setInteger("n", id);
			triggertype = (String) query.uniqueResult();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(triggertype==null) {
			return null;
		}
		return triggertype;
	}

	public Integer extractActionId(Integer id) {
		Session session = sessionFactory.openSession();
		Integer actionid = null;
		try {		
			String hql = "select actionid from it.polito.ai.ifttt.progetto.models.Recipes r where r.rid=:n";
			Query query = session.createQuery(hql);
			query.setInteger("n", id);
			actionid = (Integer) query.uniqueResult();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(actionid==null) {
			return null;
		}
		return actionid;
	}

	public Integer extractTriggerId(Integer id) {
		Session session = sessionFactory.openSession();
		Integer triggerid = null;
		try {		
			String hql = "select triggerid from it.polito.ai.ifttt.progetto.models.Recipes r where r.rid=:n";
			Query query = session.createQuery(hql);
			query.setInteger("n", id);
			triggerid = (Integer) query.uniqueResult();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(triggerid==null) {
			return null;
		}
		return triggerid;
	} */

}
