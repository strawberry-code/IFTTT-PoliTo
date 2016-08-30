package it.polito.ai.ifttt.progetto.configurations;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import it.polito.ai.ifttt.progetto.models.Users;
import it.polito.ai.ifttt.progetto.services.LoginManager;

//Classe per customizzare i messaggi di errore in spring security

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider{
 
    @Autowired
    private LoginManager loginManager;
    
    @SuppressWarnings("static-access")
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
          String username = authentication.getName();
          String password = (String) authentication.getCredentials();
               
            Users user = loginManager.findUserByUsername(username);
            String hashpass = this.computeMD5(password);
     
            if (user == null || !user.getUsername().equals(username)) {
                throw new BadCredentialsException("Username not found.");
            }
     
            if(user.getEnabled()==false) {
            	throw new BadCredentialsException("User not activated.");
            }
            
            if (!hashpass.equals(user.getPassword())) {
                throw new BadCredentialsException("Wrong password.");
            }
     
            Collection<? extends GrantedAuthority> authorities = user.getRoles();
     
            return new UsernamePasswordAuthenticationToken(user, hashpass, authorities);
    }
 
    public boolean supports(Class<?> arg0) {
        return true;
    }
    
 // function to compute an MD5 hash of the user password
 	public static String computeMD5(String input) {
 		try {
 			MessageDigest md = MessageDigest.getInstance("MD5");
 			byte[] messageDigest = md.digest(input.getBytes());
 			BigInteger number = new BigInteger(1, messageDigest);
 			String hashtext = number.toString(16);
 			// Now we need to zero pad it if you actually want the full 32
 			// chars.
 			while (hashtext.length() < 32) {
 				hashtext = "0" + hashtext;
 			}
 			return hashtext;
 		} catch (NoSuchAlgorithmException e) {
 			throw new RuntimeException(e);
 		}
 	}
 
}