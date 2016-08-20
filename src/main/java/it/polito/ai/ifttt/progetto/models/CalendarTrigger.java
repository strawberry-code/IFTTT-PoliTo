package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class CalendarTrigger {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer ctid;
	@Column
	Boolean eventAction; //0 for started, 1 for added
	@Column(nullable=true)
	String title;
	@Column(nullable=true)
	String description;
	@Column(nullable=true)
	String location;
	@Column
	Long lastCheck;
	@Column
	String triggerType;
	@Column
	Integer ingredientCode;
	
	public Integer getCtid() {
		return ctid;
	}
	public void setCtid(Integer ctid) {
		this.ctid = ctid;
	}
	public Boolean getEventAction() {
		return eventAction;
	}
	public void setEventAction(Boolean eventAction) {
		this.eventAction = eventAction;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public Long getLastCheck() {
		return lastCheck;
	}
	public void setLastCheck(Long lastCheck) {
		this.lastCheck = lastCheck;
	}
	public String getTriggerType() {
		return triggerType;
	}
	public void setTriggerType(String triggerType) {
		this.triggerType = triggerType;
	}
	public Integer getIngredientCode() {
		return ingredientCode;
	}
	public void setIngredientCode(Integer ingredientCode) {
		this.ingredientCode = ingredientCode;
	}
}
