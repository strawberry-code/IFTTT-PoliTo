package it.polito.ai.ifttt.progetto.models;

public class returnClass {
	
	String iftttLogged;
    String googleLogged;
    String twitterLogged;
    Boolean disconnected;
    Integer deleted;
    
    public String getIftttLogged() {
		return iftttLogged;
	}

	public void setIftttLogged(String iftttLogged) {
		this.iftttLogged = iftttLogged;
	}

	public String getGoogleLogged() {
		return googleLogged;
	}

	public void setGoogleLogged(String googleLogged) {
		this.googleLogged = googleLogged;
	}

	public String getTwitterLogged() {
		return twitterLogged;
	}

	public void setTwitterLogged(String twitterLogged) {
		this.twitterLogged = twitterLogged;
	}

	public Boolean getDisconnected() {
		return disconnected;
	}

	public void setDisconnected(Boolean disconnected) {
		this.disconnected = disconnected;
	}
	public Integer getDeleted() {
		return deleted;
	}

	public void setDeleted(Integer deleted) {
		this.deleted = deleted;
	}
}
