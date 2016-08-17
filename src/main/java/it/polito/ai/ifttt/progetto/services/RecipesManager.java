package it.polito.ai.ifttt.progetto.services;

import java.util.List;

import it.polito.ai.ifttt.progetto.models.Recipes;
import it.polito.ai.ifttt.progetto.models.recipeJsonClass;

public interface RecipesManager {

	List<Recipes> findAllRecipes();
	Recipes findRecipesById(Integer id);
	
	List<Object[]> findAllActionsByTriggerId(Integer tid, String ttype);
	
	Integer addRecipe(String data);
	Integer modifyRecipe(Integer id, String data);
	
	//List<Recipes> findRecipesByUser(Integer userid);
	
	//extract information from a particular recipe
/*	String extractActionType(Integer id);
	String extractTriggerType(Integer id);	
	Integer extractActionId(Integer id);
	Integer extractTriggerId(Integer id); */
	
}
