package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import org.hibernate.Session;

import it.polito.ai.ifttt.progetto.models.CalendarAction;
import it.polito.ai.ifttt.progetto.models.CalendarTrigger;


public interface CalendarManager {

	List<CalendarAction> findAllCalendarAction();
	List<CalendarTrigger> findAllCalendarTrigger();
	CalendarAction findCalendarActionById(Integer id);
	CalendarTrigger findCalendarTriggerById(Integer id);	
	void setLastCheck(Long date, Integer tid);
}
