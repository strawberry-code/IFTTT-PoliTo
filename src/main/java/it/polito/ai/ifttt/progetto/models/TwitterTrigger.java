package it.polito.ai.ifttt.progetto.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TwitterTrigger {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	Integer twtid;
	@Column(nullable=true)
	String username_sender;
	@Column(nullable=true)
	String hashtag_text;
	@Column
	Long lastCheck;
	@Column
	Integer type; //0: check tweets, 1: check directMessages
	@Column
	String triggerType;
	
	public String getUsername_sender() {
		return username_sender;
	}
	public void setUsername_sender(String username_sender) {
		this.username_sender = username_sender;
	}
	public String getHashtag_text() {
		return hashtag_text;
	}
	public void setHashtag_text(String hashtag_text) {
		this.hashtag_text = hashtag_text;
	}
	public void setTwtid(Integer twtid) {
		this.twtid = twtid;
	}
	public Long getLastCheck() {
		return lastCheck;
	}
	public void setLastCheck(Long lastCheck) {
		this.lastCheck = lastCheck;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getTwtid() {
		return twtid;
	}
	public String getTriggerType() {
		return triggerType;
	}
	public void setTriggerType(String triggerType) {
		this.triggerType = triggerType;
	}
}
