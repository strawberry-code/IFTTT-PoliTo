package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import it.polito.ai.ifttt.progetto.models.TwitterAction;
import it.polito.ai.ifttt.progetto.models.TwitterTrigger;

public class TwitterManagerImpl implements TwitterManager {

	@Autowired
	SessionFactory sessionFactory;
	
	@SuppressWarnings("unchecked")
	public List<TwitterAction> findAllTwitterAction() {
		Session session = sessionFactory.openSession();
		List<TwitterAction> twitteractions = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.TwitterAction";
			Query query = session.createQuery(hql);
			twitteractions = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(twitteractions.size()==0) {
			return null;
		}
		return twitteractions;
	}

	@SuppressWarnings("unchecked")
	public List<TwitterTrigger> findAllTwitterTrigger() {
		Session session = sessionFactory.openSession();
		List<TwitterTrigger> twittertriggers = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.TwitterTrigger";
			Query query = session.createQuery(hql);
			twittertriggers = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(twittertriggers.size()==0) {
			return null;
		}
		return twittertriggers;
	}

	public TwitterAction findTwitterActionById(Integer id) {
		Session session = sessionFactory.openSession();
		TwitterAction twitteraction = null;
		try {
			twitteraction = session.get(TwitterAction.class, id);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(twitteraction==null) {
			return null;
		}
		return twitteraction;
	}

	public TwitterTrigger findTwitterTriggerById(Integer id) {
		Session session = sessionFactory.openSession();
		TwitterTrigger twittertrigger = null;
		try {
			twittertrigger = session.get(TwitterTrigger.class, id);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(twittertrigger==null) {
			return null;
		}
		return twittertrigger;
	}

	public void setLastCheck(Long date, Integer tid) {
		Session session = sessionFactory.openSession();
		TwitterTrigger twittertrigger = null;
		try {
			twittertrigger = session.get(TwitterTrigger.class, tid);
			twittertrigger.setLastCheck(date);
			session.flush();
			session.update(twittertrigger);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}

//	public void saveUpdates(TwitterAction ta) {
//		Session session = sessionFactory.openSession();
//		try {
//			session.flush();
//			session.update(ta);
//		} finally {
//			if (session != null) {
//				// close session in any case
//				session.close();
//			}
//		}
//		return;		
//	}

}
