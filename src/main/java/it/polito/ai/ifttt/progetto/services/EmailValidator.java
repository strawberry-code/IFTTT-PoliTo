package it.polito.ai.ifttt.progetto.services;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailValidator {
	
	private static String EMAIL_PATTERN = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
	Pattern pattern;
	Matcher matcher;
	String email;
	
	public EmailValidator(String email) {
		this.email = email;
		pattern = Pattern.compile(EMAIL_PATTERN);
	}
	
	public boolean validate() {	
		if(this.email!=null) {
			Matcher matcher = pattern.matcher(email);
			return matcher.matches();
		}
		else {
			return true;
		}
				
	}	
}
