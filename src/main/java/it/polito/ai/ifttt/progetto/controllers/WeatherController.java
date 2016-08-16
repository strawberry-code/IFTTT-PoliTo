package it.polito.ai.ifttt.progetto.controllers;

import java.io.IOException;

import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import it.polito.ai.ifttt.progetto.models.WeatherTrigger;
import it.polito.ai.ifttt.progetto.services.WeatherManager;

/*import com.github.fedy2.weather.YahooWeatherService;
import com.github.fedy2.weather.data.Channel;
import com.github.fedy2.weather.data.unit.DegreeUnit;*/

import java.net.MalformedURLException;
import net.aksingh.owmjapis.CurrentWeather;
import net.aksingh.owmjapis.DailyForecast;
import net.aksingh.owmjapis.HourlyForecast;
import net.aksingh.owmjapis.OpenWeatherMap;
import org.json.JSONException;

@Controller
@RequestMapping("/weather")
public class WeatherController {

	@Autowired
	WeatherManager weatherManager;
	
	@RequestMapping(value = "/womap.do", method = RequestMethod.GET)
	public String getWeather() {
		// YahooWeatherService service;
		// try {
		// service = new YahooWeatherService();
		// //sostituire il numero con quello passato dal client come parametro
		// Channel channel = service.getForecast("2502265", DegreeUnit.CELSIUS);
		//
		// //dati da passare al client che li useranno per impaginare un report
		// decente
		// System.out.println(channel.getDescription());
		// System.out.println(channel.getAstronomy());
		// System.out.println(channel.getAtmosphere());
		// System.out.println(channel.getItem().getCondition());
		//
		// } catch (JAXBException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// } catch (IOException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
		
	/*	weatherManager.addTuple();
		weatherManager.addTuple1();
		weatherManager.addTuple2();*/
		
		
		
		
		
		//API Key: ho dovuto registrarmi sul loro sito e ricevere questa chiave gratis (spero non scada)
		String apiKey = "7a270c3877b50b233c4873ffc56f3ff7";

		// declaring object of "OpenWeatherMap" class
		//OpenWeatherMap owm = new OpenWeatherMap("");
		OpenWeatherMap owm = new OpenWeatherMap(apiKey);

		
		System.out.println("Current Temperature");
		// getting current weather data for the "London" city
		CurrentWeather cwd;
		CurrentWeather cwd1;
		try {
			
			//dato che arriva dal client: o quello scelto dall'utente o la localita' in cui si trova
			System.out.println("BY CODE: ");
			cwd1 = owm.currentWeatherByCityCode(707860);
			System.out.println(cwd1.getCityName());
			
			
			cwd = owm.currentWeatherByCityName("Torino");
			// checking data retrieval was successful or not
			if (cwd.isValid()) {

				// checking if city name is available
				if (cwd.hasCityName()) {
					// printing city name from the retrieved data
					System.out.println("City: " + cwd.getCityName());
				}
				
				// checking if max. temp. and min. temp. is available
				if (cwd.getMainInstance().hasMaxTemperature() && cwd.getMainInstance().hasMinTemperature()) {
					// printing the max./min. temperature
					System.out.println("Temperature: " + ConverToCelsius(cwd.getMainInstance().getMaxTemperature()) + "/"
							+ ConverToCelsius(cwd.getMainInstance().getMinTemperature()) + " °C");
				}
			}
			System.out.println("---------------------------------------------");
			System.out.println("Tomorrow Temperature");
			
			//daily forecast data
			DailyForecast df = owm.dailyForecastByCityName("Torino", (byte) 2);
			if(df.isValid()) {
				if(df.hasCityInstance()) {
					System.out.println("City: " + df.getCityInstance().getCityName());
				}
				System.out.println("Date: "+df.getForecastInstance(1).getDateTime()+"; Temperature: "
						+ConverToCelsius(df.getForecastInstance(1).getTemperatureInstance().getDayTemperature())+" °C");
			}	
			
			System.out.println("---------------------------------------------");
			System.out.println("Ora per Ora");
			
			HourlyForecast hf = owm.hourlyForecastByCityName("Torino");
			if(hf.isValid()) {
				if(hf.hasCityInstance()) {
					System.out.println("City: "+hf.getCityInstance().getCityName());
				}
				for(int i = 0; i<24; i++) {
					System.out.println("Date: "+hf.getForecastInstance(i).getDateTimeText());
					System.out.println("Temp: "+ConverToCelsius(hf.getForecastInstance(i).getMainInstance().getTemperature())+" °C");
				}	
			}
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "authpage";
	}
	
	
	// per convertire i gradi Fahrenheit ritornati in Celsius
	public float ConverToCelsius(float temp) {
		  return ((temp - 32)*5)/9;
	}

}
