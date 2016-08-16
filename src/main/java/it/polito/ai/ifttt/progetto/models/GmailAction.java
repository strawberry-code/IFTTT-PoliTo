package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;

@Entity
public class GmailAction {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer gaid;
	@ColumnDefault("false")
	boolean sender;  //puo' essere ifttt o me
	@Column(nullable=true)
	String receiver;
	@Column(nullable=true)
	String subject;
	@Column(nullable=true)
	String body;
	@Column
	String actionType;
	
	public Integer getGaid() {
		return gaid;
	}
	public void setGaid(Integer gaid) {
		this.gaid = gaid;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public boolean isSender() {
		return sender;
	}
	public void setSender(boolean sender) {
		this.sender = sender;
	}
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}
}
