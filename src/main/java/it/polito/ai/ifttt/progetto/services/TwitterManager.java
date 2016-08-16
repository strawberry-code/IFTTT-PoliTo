package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import it.polito.ai.ifttt.progetto.models.TwitterAction;
import it.polito.ai.ifttt.progetto.models.TwitterTrigger;

public interface TwitterManager {

	List<TwitterAction> findAllTwitterAction();
	List<TwitterTrigger> findAllTwitterTrigger();
	TwitterAction findTwitterActionById(Integer id);
	TwitterTrigger findTwitterTriggerById(Integer id);
	void setLastCheck(Long date, Integer tid);
}
