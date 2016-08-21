package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;

@Entity
public class WeatherTrigger {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer wtid;
	@Column
	Integer ingredientCode;
	@Column(nullable=true)
	Integer tempo;
	@Column(nullable=true)
	String ora;
	@Column
	Long location;
	@Column
	String locationName;
	@Column(nullable=true)
	Integer thmin;
	@Column(nullable=true)
	Integer thmax;
	@ColumnDefault("false")
	Boolean sunrise;
	@ColumnDefault("false")
	Boolean sunset;
	@Column
	Integer type;
	@Column(nullable=true)
	Long lastCheck;
	@Column
	String timezone;
	@Column(nullable=true)
	Long period;
	@Column
	String triggerType;
	
	public Integer getWtid() {
		return wtid;
	}
	public void setWtid(Integer wtid) {
		this.wtid = wtid;
	}
	public Integer getTempo() {
		return tempo;
	}
	public void setTempo(Integer tempo) {
		this.tempo = tempo;
	}
	public String getOra() {
		return ora;
	}
	public void setOra(String ora) {
		this.ora = ora;
	}
	public Long getLocation() {
		return location;
	}
	public void setLocation(Long location) {
		this.location = location;
	}
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public Integer getThmin() {
		return thmin;
	}
	public void setThmin(Integer thmin) {
		this.thmin = thmin;
	}
	public Integer getThmax() {
		return thmax;
	}
	public void setThmax(Integer thmax) {
		this.thmax = thmax;
	}
	public Boolean getSunrise() {
		return sunrise;
	}
	public void setSunrise(Boolean sunrise) {
		this.sunrise = sunrise;
	}
	public Boolean getSunset() {
		return sunset;
	}
	public void setSunset(Boolean sunset) {
		this.sunset = sunset;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Long getLastCheck() {
		return lastCheck;
	}
	public void setLastCheck(Long lastCheck) {
		this.lastCheck = lastCheck;
	}
	public String getTimezone() {
		return timezone;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public Long getPeriod() {
		return period;
	}
	public void setPeriod(Long period) {
		this.period = period;
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
