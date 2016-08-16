package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import it.polito.ai.ifttt.progetto.models.WeatherTrigger;

public interface WeatherManager {
		
	/*void addTuple();
	void addTuple1();
	void addTuple2();*/
	
	List<WeatherTrigger> findAllWeatherTrigger();
	WeatherTrigger findWeatherTriggerById(Integer id);
	
	void setLastCheck(Long date, Integer tid);
	void setPeriod(Long val, Integer tid);
}
