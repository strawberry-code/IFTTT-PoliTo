package it.polito.ai.ifttt.progetto.models;

public class requestClass {
	
	String requestGoogleAuth;
	String urlNext;
	String newpassword;
	Integer count;
	
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
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
}
