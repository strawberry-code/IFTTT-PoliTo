package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.WeatherTrigger;

public class WeatherManagerImpl implements WeatherManager {

	@Autowired
	SessionFactory sessionFactory;

	@SuppressWarnings("unchecked")
	public List<WeatherTrigger> findAllWeatherTrigger() {
		Session session = sessionFactory.openSession();
		List<WeatherTrigger> weathertrigger = null;
		try {
			String hql = "from it.polito.ai.ifttt.progetto.models.WeatherTrigger";
			Query query = session.createQuery(hql);
			weathertrigger = query.list();
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(weathertrigger.size()==0) {
			return null;
		}
		return weathertrigger;
	}

	public WeatherTrigger findWeatherTriggerById(Integer id) {
		Session session = sessionFactory.openSession();
		WeatherTrigger weathertrigger = null;
		try {
			weathertrigger = session.get(WeatherTrigger.class, id);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		if(weathertrigger==null) {
			return null;
		}
		return weathertrigger;
	}
	
	public void setLastCheck(Long date, Integer tid) {
		Session session = sessionFactory.openSession();
		WeatherTrigger weathertrigger = null;
		try {
			weathertrigger = session.get(WeatherTrigger.class, tid);
			weathertrigger.setLastCheck(date);
			session.flush();
			session.update(weathertrigger);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
	public void setPeriod(Long val, Integer tid) {
		Session session = sessionFactory.openSession();
		WeatherTrigger weathertrigger = null;
		try {
			weathertrigger = session.get(WeatherTrigger.class, tid);
			weathertrigger.setPeriod(val);
			session.flush();
			session.update(weathertrigger);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
/*	public void addTuple() {
		Session session = sessionFactory.openSession();
		WeatherTrigger wt = new WeatherTrigger();
		wt.setLocation((long) 3165525);
		wt.setSunrise(true);
		wt.setType(2);
		try {
			session.flush();
			session.save(wt);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
	public void addTuple1() {
		Session session = sessionFactory.openSession();
		WeatherTrigger wt = new WeatherTrigger();
		wt.setLocation((long) 3165525);
		wt.setSunset(true);
		wt.setType(2);
		try {
			session.flush();
			session.save(wt);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	}
	
	public void addTuple2() {
		Session session = sessionFactory.openSession();
		WeatherTrigger wt = new WeatherTrigger();
		wt.setLocation((long) 3165525);
		wt.setSunrise(true);
		wt.setSunset(true);
		wt.setType(2);
		try {
			session.flush();
			session.save(wt);
		} finally {
			if (session != null) {
				// close session in any case
				session.close();
			}
		}
		return;
	} */

}
