$(function() {
	var result;
	var temperature;
	var weather;
	var locality;
	var jsonurl;
	var deg;
	var idCity = 0;

	/* Per i checking */
	var flagWeatherCheck = "1";
	var flagPeriodCheck = "1";
	var flagZoneCheck = "1";

	/**
	 * Description Questa funziona cerca la città più vicina a te e ti da le
	 * informazioni
	 * 
	 * @method getToDate
	 * @param {}
	 *            time
	 * @return BinaryExpression
	 */
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			jsonurl = "http://api.openweathermap.org/data/2.5/weather?lat="
					+ position.coords.latitude + "&lon="
					+ position.coords.longitude
					+ "&appid=444a5c5b0f4846dd7465cb680a94caf1";
			$.ajax({
				method : "GET",
				url : jsonurl,
				/**
				 * Description
				 * 
				 * @method success
				 * @param {}
				 *            presentlocation
				 * @return
				 */
				success : function(presentlocation) {
					result = presentlocation;
					updateView(result);
				}

			});

		});
	} // / end of weather update based on Location...

	/**
	 * Description
	 * 
	 * @method updateView
	 * @param {}
	 *            result
	 * @return
	 */
	function updateView(result) {

		if (result.cod === "404") {
			$('#temper').hide();

		} else {

			weather = result.weather[0].description;
			locality = result.name + ' - ' + result.sys.country;

			/* Le cose da visualizare */
			$("#weather-desc").text(weather);
			$("#main-name").text(result.name);
			$("#sys-id").text(result.id);
			$("#coord-lon").text(result.coord.lon);
			$("#coord-lat").text(result.coord.lat);
			$("#sys-country").text(result.sys.country);
			/* Get Id for server */
			idCity = result.id;
			locationName_ControllerTrigger2 = result.name;

		}

	}
	;

	/**
	 * Description
	 * 
	 * @method searchEnter
	 * @return
	 */
	var searchEnter = function() {
		var city = $("#search-input").val();
		setSpinner(true);

		jsonurl = "http://api.openweathermap.org/data/2.5/weather?q=" + city
				+ "&appid=444a5c5b0f4846dd7465cb680a94caf1", $.ajax({
			method : "GET",
			url : jsonurl,
			/**
			 * Description
			 * 
			 * @method success
			 * @param {}
			 *            presentlocation
			 * @return
			 */
			success : function(presentlocation) {
				setSpinner(false);
				result = presentlocation;
				updateView(result);
			},
			error : function() {
				setSpinner(false);
				alertError("Sorry there has been an error");
			}
		});

		/*
		 * forejsonurl =
		 * "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city +
		 * "&appid=444a5c5b0f4846dd7465cb680a94caf1", $.ajax({ method: "GET",
		 * url: forejsonurl, /!** Description @method success @param {}
		 * forepresentlocation @return !/ success: function
		 * (forepresentlocation) { var foreresult = forepresentlocation;
		 * 
		 *  } });
		 */

	};
	/*
	 * Non lo so se server :) $("#search-input").keyup(function (e) { if
	 * (e.which == 13) { $('#temper').fadeOut("fast");
	 * $('#temper').fadeIn("slow"); $("#deg").animate({"left": "0px"}); deg =
	 * "true"; $("#deg").html("&deg;C"); searchEnter();
	 *  }
	 * 
	 * });
	 */
	$("button").on("click", function() {
		$('#temper').fadeOut("fast");
		$('#temper').fadeIn("slow");
		$("#deg").animate({
			"left" : "0px"
		});
		deg = "true";
		$("#deg").html("&deg;C");
		searchEnter();
	});
	deg = "true";

	/* Controllore */
	$("#deg").on("click", function() {
		if (deg === "true") {
			$("#deg").animate({
				"left" : "26px"
			});
			deg = "false";
			$("#deg").html("&deg;F");
			temperature = result.main.temp - 273.15;

			temperature = temperature.toFixed(1);
			temperature = 1.8 * (temperature) + 32;
			$("#temp").html(temperature + ' &deg;F');
		}

		else if (deg === "false") {
			$("#deg").animate({
				"left" : "0px"
			});
			deg = "true";
			$("#deg").html("&deg;C");
			temperature = result.main.temp - 273.15;
			temperature = temperature.toFixed(1);
			$("#temp").html(temperature + ' &deg;C');
		}
	});
	
	
	$("button").on("click", function() {
		$('#temper').fadeOut("fast");
		$('#temper').fadeIn("slow");
		$("#deg").animate({
			"left" : "0px"
		});
		deg = "true";
		$("#deg").html("&deg;C");
		searchEnter();
	});
	deg = "true";

	$("#deg").on("click", function() {
		if (deg === "true") {
			$("#deg").animate({
				"left" : "26px"
			});
			deg = "false";
			$("#deg").html("&deg;F");
			temperature = result.main.temp - 273.15;

			temperature = temperature.toFixed(1);
			temperature = 1.8 * (temperature) + 32;
			$("#temp").html(temperature + ' &deg;F');
		}

		else if (deg === "false") {
			$("#deg").animate({
				"left" : "0px"
			});
			deg = "true";
			$("#deg").html("&deg;C");
			temperature = result.main.temp - 273.15;
			temperature = temperature.toFixed(1);
			$("#temp").html(temperature + ' &deg;C');
		}
	});

	$("#but")
			.on(
					"click",
					function updateView() {
						// alert(idCity);
						flagWeatherCheck = true;
						flagPeriodCheck = true;
						flagZoneCheck = true;
						triggerChose = 7;
						if (idCity == '0') {
							// $scope.errorButton= "Almost a field must be
							// completed";
							// alert("You have not found you ciry");

							// $("#notificationsWrapper").notify(
							// "You have not found you ciry",
							// {
							// className: 'warning',
							// position: 'bottom center'
							// }
							// );
							alertWarning("We have not found your city.");
						} else {
							// Brute force resolution
							/*
							 * weatheridcheckbox periodidcheckbox
							 * checktimeZonevar DONE 0 0 0 * 0 0 1 * 0 1 0 * 0 1
							 * 1 * 1 0 0 1 0 1 1 1 0 1 1 1
							 */

							// sunset
							// weatheridcheckbox periodidcheckbox
							// checktimeZonevar
							// thmaxidinput thminidinput
							var pweather = "200";
							var pperiod = "0";
							var pzone = "0";

							pweather = null;
//							if ($('#weatheridcheckbox').is(":checked"))// &&
																		// $('#periodidcheckbox').is(":checked")
																		// &&
																		// $('#checktimeZonevar').is(":checked"))
//							{
								pweather = $('#mySelect').val();
//							} else
//								pweather = null;
							if ($('#periodidcheckbox').is(":checked")) {
								pperiod = $('#periodidinput').val();
							} else
								pperiod = null;
							if ($('#checktimeZonevar').is(":checked")) {
								pzone = $('#timezoneid').val();
								var loc = window.location.hash;
								if(pzone.localeCompare("? number:0 ?")==0) {
									 alertWarningTrigger("You have to choose timezone", loc);
								}
							} else
								pzone = null;

							/*
							 * flagWeatherCheck = true; flagPeriodCheck = true;
							 * flagZoneCheck = true;
							 * 
							 */
							// alert( pweather + pperiod + " " + pzone);
							sendingToServer(pweather, pperiod, pzone);

							// if ($('#weatheridcheckbox').is(":checked"))
							// weathercheckfunc();
							if ($('#periodidcheckbox').is(":checked"))
								periodidcheckfunc();
							// if ($('#checktimeZonevar').is(":checked"))
							// timezoneCheck();

							// alert(flagWeatherCheck + "X" + flagPeriodCheck +
							// "X" + flagZoneCheck);
							// idCity_customWeatherActionControllerTrigger2
							// pweather_customWeatherActionControllerTrigger2

							// "location":
							// idCity_customWeatherActionControllerTrigger2,
							// "tempo" :
							// pweather_customWeatherActionControllerTrigger2,
							// "period" :
							// pperiod_customWeatherActionControllerTrigger2,
							// "timezone" :
							// pzone_customWeatherActionControllerTrigger2,
							// "locationName" : locationName_ControllerTrigger2

							if (flagWeatherCheck == false
									|| flagPeriodCheck == false
									|| flagZoneCheck == false) {
								// url = "#WeatherTrigger2";
								// window.location.replace(url);
								// alert("Your input is not right");
								// $("#notificationsWrapper").notify(
								// "Your input is not right",
								// {
								// className: 'warning',
								// position: 'bottom center'
								// }
								// );
								alertWarning("You input is not right");
							} else {
								var outputInMilliseconds = null;
								flagTriggerDone = true;
								if (pperiod != null) {
									outputInMilliseconds = pperiod * 60000;
								}

								modulinoj1 = {
									"ingredientCode" : 15,
									"triggerType" : "weather",
									"type" : "3",
									"location" : idCity_customWeatherActionControllerTrigger2,
									"tempo" : pweather,
									"period" : outputInMilliseconds,
									"timezone" : pzone,
									"locationName" : locationName_ControllerTrigger2
								};

								if (modifyVar == true) {
									sendingToServerAllput();
								} else {
									if (importFlag == true) {
										window.location.replace("#"
												+ actionImportRoute);
									} else {
										url = "#createRecipeAction";
										window.location.replace(url);
									}
								}

							}

						}

						/**
						 * Description
						 * 
						 * @method timezoneCheck
						 * @return
						 */
						function timezoneCheck() {

							if (pzone_customWeatherActionControllerTrigger2
									.localeCompare('0') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('1') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('2') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('3') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('4') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('5') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('6') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('7') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('8') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('9') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('10') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('11') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('12') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-1') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-2') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-3') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-4') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-5') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-6') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-7') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-9') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-10') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-11') == 0
									|| pzone_customWeatherActionControllerTrigger2
											.localeCompare('-12') == 0)
								flagZoneCheck = true;
							else
								flagZoneCheck = false;

						}
						;

						/**
						 * Description
						 * 
						 * @method weathercheckfunc
						 * @return
						 */
						function weathercheckfunc() {

							if (pweather_customWeatherActionControllerTrigger2
									.localeCompare("200") == 0
									|| pweather_customWeatherActionControllerTrigger2
											.localeCompare("300") == 0
									|| pweather_customWeatherActionControllerTrigger2
											.localeCompare("500") == 0)
								flagWeatherCheck = true;
							else
								flagWeatherCheck = false;

						}
						;

						/**
						 * Description
						 * 
						 * @method periodidcheckfunc
						 * @return
						 */
						function periodidcheckfunc() {
							var i = 0;
							flagPeriodCheck = false;
							for (i = 0; i < 701; i++) {
								if (pperiod_customWeatherActionControllerTrigger2 == i
										.toString())
									flagPeriodCheck = true;

							}

						}
						;

						/**
						 * Description
						 * 
						 * @method sendingToServer
						 * @param {}
						 *            pweather
						 * @param {}
						 *            pperiod
						 * @param {}
						 *            pzone
						 * @return
						 */
						function sendingToServer(pweather, pperiod, pzone) {
							idCity_customWeatherActionControllerTrigger2 = idCity;
							pweather_customWeatherActionControllerTrigger2 = pweather;
							pperiod_customWeatherActionControllerTrigger2 = pperiod;
							pzone_customWeatherActionControllerTrigger2 = pzone;

						}

					})

});
// Prova atom

/* Template for checkbox [] ^ $ */
/*
 * 
 * var timezone = $('#timezoneid').val(); var loginDataSend = { "sender:":
 * idCity, "timezone" : timezone, "ora": time
 *  }; //alert(loginDataSend.pssword); $.ajax({ method: "post", url:
 * "/MyServlet", data: loginDataSend, dataType: "json", success: console.log("la
 * post ha avuto successo") });
 * 
 * url = "http://localhost:8080/#/gMailSucces"; window.location.replace(url);
 * //or //window.location(url);
 */
