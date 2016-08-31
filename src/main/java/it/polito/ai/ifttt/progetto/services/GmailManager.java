package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import it.polito.ai.ifttt.progetto.models.GmailAction;
import it.polito.ai.ifttt.progetto.models.GmailTrigger;

public interface GmailManager {
	
	List<GmailAction> findAllGmailAction();
	List<GmailTrigger> findAllGmailTrigger();
	GmailAction findGmailActionById(Integer id);
	GmailTrigger findGmailTriggerById(Integer id);
	void setLastCheck(Long date, Integer tid);
//	void saveUpdates(GmailAction ga);
}
