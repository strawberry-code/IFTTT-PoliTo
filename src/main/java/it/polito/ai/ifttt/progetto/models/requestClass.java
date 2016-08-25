package it.polito.ai.ifttt.progetto.models;

public class requestClass {
	
	String requestGoogleAuth;
	String urlNext;
	String newpassword;
	Object varencr;
	Object trigger;
	
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
}
