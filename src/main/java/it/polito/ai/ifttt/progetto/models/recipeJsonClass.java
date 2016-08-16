package it.polito.ai.ifttt.progetto.models;

public class recipeJsonClass {
	
	Integer id;
	String description;
	Object trigger;
	Object action;
	Boolean publish;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Object getTrigger() {
		return trigger;
	}
	public void setTrigger(Object trigger) {
		this.trigger = trigger;
	}
	public Object getAction() {
		return action;
	}
	public void setAction(Object action) {
		this.action = action;
	}
	public Boolean getPublish() {
		return publish;
	}
	public void setPublish(Boolean publish) {
		this.publish = publish;
	}

}
