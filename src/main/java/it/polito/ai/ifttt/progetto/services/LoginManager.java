package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import it.polito.ai.ifttt.progetto.models.Users;

public interface LoginManager {
	
	//to register a new user
	int register(String username, String password, String email);
	
	//to do login for user already registered 
	//NO: we use spring-security
	//int login(String username, String password);
	
	//to check if the user account is still valid
	int activate(Integer id, String url);
	
	Users findUserByUsername(String username);
	
	List<Users> findAllUsers();
	
	void setGoogleCredentials(Users user, String token, Long expire);
	void setTwitterCredentials(Users user, String token, String tokenSecret);
	
	Boolean checkGoogleConnection(String username);
	
}
