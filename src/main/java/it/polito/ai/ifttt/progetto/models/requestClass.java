package it.polito.ai.ifttt.progetto.models;

public class requestClass {
	
	String requestGoogleAuth;
	String urlNext;
	Object varencr;
	Object trigger;
	Object action;
	String oldpassword;
	String newpassword;
	String timezone;
	Boolean flagTimezone;
	Boolean flagPassword;
	String username;
	String email;
	
	public String getRequestGoogleAuth() {
		return requestGoogleAuth;
	}
	public void setRequestGoogleAuth(String requestGoogleAuth) {
		this.requestGoogleAuth = requestGoogleAuth;
	}
	public String getUrlNext() {
		return urlNext;
	}
	public void setUrlNext(String urlNext) {
		this.urlNext = urlNext;
	}
	public String getNewpassword() {
		return newpassword;
	}
	public void setNewpassword(String newpassword) {
		this.newpassword = newpassword;
	}
	public Object getVarencr() {
		return varencr;
	}
	public void setVarencr(Object varencr) {
		this.varencr = varencr;
	}
	public Object getTrigger() {
		return trigger;
	}
	public void setTrigger(Object trigger) {
		this.trigger = trigger;
	}
	public Object getAction() {
		return action;
	}
	public void setAction(Object action) {
		this.action = action;
	}
	public String getOldpassword() {
		return oldpassword;
	}
	public void setOldpassword(String oldpassword) {
		this.oldpassword = oldpassword;
	}
	public String getTimezone() {
		return timezone;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public Boolean getFlagTimezone() {
		return flagTimezone;
	}
	public void setFlagTimezone(Boolean flagTimezone) {
		this.flagTimezone = flagTimezone;
	}
	public Boolean getFlagPassword() {
		return flagPassword;
	}
	public void setFlagPassword(Boolean flagPassword) {
		this.flagPassword = flagPassword;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
}
