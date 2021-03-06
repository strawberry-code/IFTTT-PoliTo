package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;

@Entity
public class CalendarAction {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer caid;
	@Column
	Integer ingredientCode;
	@Column(nullable=true)
	String startDate;
	@ColumnDefault("3600000")
	Long duration;
	@Column(nullable=true)
	String title;
	@Column(nullable=true)
	String description;
	@Column(nullable=true)
	String location;
	@Column
	String timezone;
	@Column
	String actionType;
	
	public Integer getCaid() {
		return caid;
	}
	public void setCaid(Integer caid) {
		this.caid = caid;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public Long getDuration() {
		return duration;
	}
	public void setDuration(Long duration) {
		this.duration = duration;
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
	public String getTimezone() {
		return timezone;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}
	public Integer getIngredientCode() {
		return ingredientCode;
	}
	public void setIngredientCode(Integer ingredientCode) {
		this.ingredientCode = ingredientCode;
	}	
}
