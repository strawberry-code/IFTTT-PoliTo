package it.polito.ai.ifttt.progetto.services;

import java.util.Map;

public interface LoadFile {

	//return null if some errors occured
	Map<Long, String> buildMap();
}
