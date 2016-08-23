package it.polito.ai.ifttt.progetto.models;

public class Types {
	
	String triggerType;
	String actionType;
	Integer IngredientCode;
	
	public String getTriggerType() {
		return triggerType;
	}
	public void setTriggerType(String triggerType) {
		this.triggerType = triggerType;
	}
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}	
	public Integer getIngredientCode() {
		return IngredientCode;
	}
	public void setIngredientCode(Integer ingredientCode) {
		IngredientCode = ingredientCode;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((actionType == null) ? 0 : actionType.hashCode());
		result = prime * result + ((triggerType == null) ? 0 : triggerType.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Types other = (Types) obj;
		if (actionType == null) {
			if (other.actionType != null)
				return false;
		} else if (!actionType.equals(other.actionType))
			return false;
		if (triggerType == null) {
			if (other.triggerType != null)
				return false;
		} else if (!triggerType.equals(other.triggerType))
			return false;
		return true;
	} 

}
