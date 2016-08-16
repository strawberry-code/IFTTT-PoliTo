package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class GmailTrigger {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer gtid;
	@Column(nullable=true)
	String sender;
	@Column(nullable=true)
	String subject;
	@Column
	Long lastCheck;
	
	public Integer getGtid() {
		return gtid;
	}
	public void setGtid(Integer gtid) {
		this.gtid = gtid;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public Long getLastCheck() {
		return lastCheck;
	}
	public void setLastCheck(Long lastCheck) {
		this.lastCheck = lastCheck;
	}
}
