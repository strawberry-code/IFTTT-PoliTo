package it.polito.ai.ifttt.progetto.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;

public class LoadFileImpl implements LoadFile {

	public Map<Long, String> buildMap() {
	//	String file = ServletContext.getRealPath("/WEB-INF/cityFile.txt");
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource("cityFile.txt").getFile());
    	Map<Long, String> cities = new HashMap<Long, String>();
    	FileReader f;
		try {			
			f = new FileReader(file);
			BufferedReader b = new BufferedReader(f);
			String s = "";
			while((s = b.readLine()) != null) {
				JSONObject obj = new JSONObject(s);
				cities.put(obj.getLong("i"), obj.getString("n"));
			}
			b.close();
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return cities;
	}

}
