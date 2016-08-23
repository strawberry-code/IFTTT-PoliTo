package it.polito.ai.ifttt.progetto.models;

public class Types {
	
	Integer triggerIngredientCode;
	Integer actionIngredientCode;
	public Integer getTriggerIngredientCode() {
		return triggerIngredientCode;
	}
	public void setTriggerIngredientCode(Integer triggerIngredientCode) {
		this.triggerIngredientCode = triggerIngredientCode;
	}
	public Integer getActionIngredientCode() {
		return actionIngredientCode;
	}
	public void setActionIngredientCode(Integer actionIngredientCode) {
		this.actionIngredientCode = actionIngredientCode;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((actionIngredientCode == null) ? 0 : actionIngredientCode.hashCode());
		result = prime * result + ((triggerIngredientCode == null) ? 0 : triggerIngredientCode.hashCode());
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
		if (actionIngredientCode == null) {
			if (other.actionIngredientCode != null)
				return false;
		} else if (!actionIngredientCode.equals(other.actionIngredientCode))
			return false;
		if (triggerIngredientCode == null) {
			if (other.triggerIngredientCode != null)
				return false;
		} else if (!triggerIngredientCode.equals(other.triggerIngredientCode))
			return false;
		return true;
	}	

}
