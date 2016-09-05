package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import it.polito.ai.ifttt.progetto.models.CalendarAction;
import it.polito.ai.ifttt.progetto.models.CalendarTrigger;

public class CalendarManagerImpl implements CalendarManager {

	@Autowired
	SessionFactory sessionFactory;
	
	@SuppressWarnings("unchecked")
	public List<CalendarAction> findAllCalendarAction() {
		Session session = sessionFactory.openSession();
		List<CalendarAction> calendaractions = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.CalendarAction";
			Query query = session.createQuery(hql);
			calendaractions = query.list();
		} catch(Exception e){
			return null;
		}finally{
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(calendaractions.size()==0) {
			return null;
		}
		return calendaractions;
	}

	@SuppressWarnings("unchecked")
	public List<CalendarTrigger> findAllCalendarTrigger() {
		Session session = sessionFactory.openSession();
		List<CalendarTrigger> calendartriggers = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.CalendarTrigger";
			Query query = session.createQuery(hql);
			calendartriggers = query.list();
		} catch(Exception e){
			return null;
		}finally{
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(calendartriggers.size()==0) {
			return null;
		}
		return calendartriggers;
	}

	public CalendarAction findCalendarActionById(Integer id) {
		Session session = sessionFactory.openSession();
		CalendarAction calendaraction = null;
		try {
			calendaraction = session.get(CalendarAction.class, id);
		} catch(Exception e){
			return null;
		}finally{
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(calendaraction==null) {
			return null;
		}
		return calendaraction;
	}

	public CalendarTrigger findCalendarTriggerById(Integer id) {
		Session session = sessionFactory.openSession();
		CalendarTrigger calendartrigger = null;
		try {
			calendartrigger = session.get(CalendarTrigger.class, id);
		} catch(Exception e){
			return null;
		}finally{
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(calendartrigger==null) {
			return null;
		}
		return calendartrigger;
	}
	
	public void setLastCheck(Long date, Integer tid) {
		Session session = sessionFactory.openSession();
		CalendarTrigger calendartrigger = null;
		try {
			calendartrigger = session.get(CalendarTrigger.class, tid);
			calendartrigger.setLastCheck(date);
			session.flush();
			session.update(calendartrigger);
		} catch(Exception e){
			return;
		}finally{
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
}
