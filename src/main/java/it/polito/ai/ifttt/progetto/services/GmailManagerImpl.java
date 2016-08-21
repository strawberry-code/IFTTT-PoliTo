package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.GmailTrigger;

public class GmailManagerImpl implements GmailManager {

	@Autowired
	SessionFactory sessionFactory;
	
	@SuppressWarnings("unchecked")
	public List<GmailAction> findAllGmailAction() {
		Session session = sessionFactory.openSession();
		List<GmailAction> gmailactions = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.GmailAction";
			Query query = session.createQuery(hql);
			gmailactions = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(gmailactions.size()==0) {
			return null;
		}
		return gmailactions;
	}

	@SuppressWarnings("unchecked")
	public List<GmailTrigger> findAllGmailTrigger() {
		Session session = sessionFactory.openSession();
		List<GmailTrigger> gmailtriggers = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.GmailTrigger";
			Query query = session.createQuery(hql);
			gmailtriggers = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(gmailtriggers.size()==0) {
			return null;
		}
		return gmailtriggers;
	}

	public GmailAction findGmailActionById(Integer id) {
		Session session = sessionFactory.openSession();
		GmailAction gmailaction = null;
		try {
			gmailaction = session.get(GmailAction.class, id);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(gmailaction==null) {
			return null;
		}
		return gmailaction;
	}

	public GmailTrigger findGmailTriggerById(Integer id) {
		Session session = sessionFactory.openSession();
		GmailTrigger gmailtrigger = null;
		try {
			gmailtrigger = session.get(GmailTrigger.class, id);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(gmailtrigger==null) {
			return null;
		}
		return gmailtrigger;
	}
	
	public void setLastCheck(Long date, Integer tid) {
		Session session = sessionFactory.openSession();
		GmailTrigger gmailtrigger = null;
		try {
			gmailtrigger = session.get(GmailTrigger.class, tid);
			gmailtrigger.setLastCheck(date);
			session.flush();
			session.update(gmailtrigger);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
}
