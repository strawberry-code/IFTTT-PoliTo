package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TwitterAction {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer twaid;
	@Column
	Integer ingredientCode;
	@Column(nullable=true) //if null, e' quello che gli passiamo 
	String body;		   //noi (ad esempio weather report)
	@Column(nullable=true)
	String destination;   //if null, vuol dire che non e' interessato
	  					  //a questo tipo di trigger -> dunque obbligatorio
						  //se si sceglie l'azione di tipo 2
	@Column
	String actionType;
	
	public Integer getTwaid() {
		return twaid;
	}
	public void setTwaid(Integer twaid) {
		this.twaid = twaid;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String destination) {
		this.destination = destination;
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
