package it.polito.ai.ifttt.progetto.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import org.hibernate.annotations.ColumnDefault;

@SuppressWarnings("serial")
@Entity
public class Users implements Serializable {	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer id;
	@Column
	String username;
	@Column
	String password;
	@Column
	String email;
	@ColumnDefault("false")
	Boolean enabled = false;
	@Column
	String urlactivate;
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="users_roles", 
	joinColumns = {@JoinColumn(name="username", nullable = true)}, 
	inverseJoinColumns = {@JoinColumn(name="name", nullable = true)})
	List<Roles> roles = new ArrayList<Roles>();
	@Column(nullable=true)
	String googleToken;
	@Column(nullable=true)
	Long googleExpire;
	@Column(nullable=true)
	String twitterToken;
	@Column(nullable=true)
	String twitterTokenSecret;
	@Column
	String timezone;
	@Column(nullable=true)
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "user", targetEntity = Recipes.class)
	List<Recipes> recipes = new ArrayList<Recipes>();
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Boolean getEnabled() {
		return enabled;
	}
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
	public String getUrlactivate() {
		return urlactivate;
	}
	public void setUrlactivate(String urlactivate) {
		this.urlactivate = urlactivate;
	}
	public List<Roles> getRoles() {
		return roles;
	}
	public void setRoles(List<Roles> roles) {
		this.roles = roles;
	}	
	public String getGoogleToken() {
		return googleToken;
	}
	public void setGoogleToken(String googleToken) {
		this.googleToken = googleToken;
	}
	public Long getGoogleExpire() {
		return googleExpire;
	}
	public void setGoogleExpire(Long googleExpire) {
		this.googleExpire = googleExpire;
	}
	public String getTwitterToken() {
		return twitterToken;
	}
	public void setTwitterToken(String twitterToken) {
		this.twitterToken = twitterToken;
	}
	public String getTwitterTokenSecret() {
		return twitterTokenSecret;
	}
	public void setTwitterTokenSecret(String twitterTokenSecret) {
		this.twitterTokenSecret = twitterTokenSecret;
	}
	public String getTimezone() {
		return timezone;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	public List<Recipes> getRecipes() {
		return recipes;
	}
	public void setRecipes(List<Recipes> recipes) {
		this.recipes = recipes;
	}
	@Override
	public String toString() {
		return username;
	}	
}
