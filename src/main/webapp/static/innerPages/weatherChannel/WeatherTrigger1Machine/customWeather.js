$(function () {
    var result;
    var temperature;
    var weather;
    var locality;
    var jsonurl;

    var deg;
    var idCity = 0;
    /* Per i checking  */
    var flagTimezoneCheck = true;
    var flagTimeCheck = true;


    /**
     * Description Questa funziona cerca la città più vicina a te e ti da le informazioni
     * @method getToDate
     * @param {} time
     * @return BinaryExpression
     */
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function (position)
        {
            jsonurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=444a5c5b0f4846dd7465cb680a94caf1";
            $.ajax
            ({
                method: "GET",
                url: jsonurl,
                /**
                 * Description
                 * @method success
                 * @param {} presentlocation
                 * @return
                 */
                success: function (presentlocation)
                {
                    result = presentlocation;
                    updateView(result);
                }

            });



        });
    } /// end of weather update based on Location...


    /**
     * Description
     * @method updateView
     * @param {} result
     * @return
     */
    function updateView(result) {


        if (result.cod === "404") {
            $('#temper').hide();

        }
        else
        {



            weather = result.weather[0].description;
            locality = result.name + ' - ' + result.sys.country;


            /*Le cose da visualizare */
            $("#weather-desc").text(weather);
            $("#main-name").text(result.name);
            $("#sys-id").text(result.id);
            $("#coord-lon").text(result.coord.lon);
            $("#coord-lat").text(result.coord.lat);
            $("#sys-country").text(result.sys.country);
            /*Get Id for server */
            idCity = result.id;
            locationName_ControllerTrigger1 = result.name;

        }


    };

    /**
     * Description
     * @method searchEnter
     * @return
     */
    var searchEnter = function () {
        var city = $("#search-input").val();
        setSpinner(true);

        jsonurl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=444a5c5b0f4846dd7465cb680a94caf1",
        $.ajax
        ({
            method: "GET",
            url: jsonurl,
            /**
             * Description
             * @method success
             * @param {} presentlocation
             * @return
             */
            success: function (presentlocation)
            {
                setSpinner(false);
                result = presentlocation;
                updateView(result);
            },
            error: function()
            {
            setSpinner(false);
            alertError("Sorry there has been an error");
            }
        });

      /*  forejsonurl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&appid=444a5c5b0f4846dd7465cb680a94caf1",
        $.ajax({
            method: "GET",
            url: forejsonurl,
            /!**
             * Description
             * @method success
             * @param {} forepresentlocation
             * @return
             *!/
            success: function (forepresentlocation) {
                var foreresult = forepresentlocation;


            }
        });*/


    };
    /* Non lo so se server :)
    $("#search-input").keyup(function (e) {
        if (e.which == 13) {
            $('#temper').fadeOut("fast");
            $('#temper').fadeIn("slow");
            $("#deg").animate({"left": "0px"});
            deg = "true";
            $("#deg").html("&deg;C");
            searchEnter();

        }

    });
    */
    $("button").on("click", function () {
        $('#temper').fadeOut("fast");
        $('#temper').fadeIn("slow");
        $("#deg").animate({"left": "0px"});
        deg = "true";
        $("#deg").html("&deg;C");
        searchEnter();
    });
    deg = "true";

    /* Controllore */
    $("#deg").on("click", function () {
        if (deg === "true") {
            $("#deg").animate({"left": "26px"});
            deg = "false";
            $("#deg").html("&deg;F");
            temperature = result.main.temp - 273.15;

            temperature = temperature.toFixed(1);
            temperature = 1.8 * (temperature) + 32;
            $("#temp").html(temperature + ' &deg;F');
        }

        else if (deg === "false") {
            $("#deg").animate({"left": "0px"});
            deg = "true";
            $("#deg").html("&deg;C");
            temperature = result.main.temp - 273.15;
            temperature = temperature.toFixed(1);
            $("#temp").html(temperature + ' &deg;C');
        }
    });


    $("#but").on("click", function updateView() {
        //alert(idCity);
        triggerChose = 6;
        flagTimezoneCheck = true;
        flagTimeCheck = true;

        //Qui mettere o togliere i controlli:
        if (idCity===undefined || idCity==0)
        {

            alertWarning("We have not found your  city.");
        }
        else {
            /*
             sender_customWeatherActionControllerTrigger1 =idCity;
             timezone_customWeatherActionControllerTrigger1 = null;
             ora_customWeatherActionControllerTrigger1 = null;
             */
            idCity_customWeatherActionControllerTrigger1 = idCity;
            var timezone = $('#timezoneid').val();
            var htime = $('#timehourid').val();
            var mtime = $('#timeminuteid').val();
            //var time = $('#timehourid').val() + ":" +  $('#timeminuteid').val();
            var time = htime + ":" + mtime;


            /*Check value*/
            if ($('#checktimeZonevar').is(":checked")) {
                //timezoneCheck(timezone);
                timezone_customWeatherActionControllerTrigger1 = timezone;
				var loc = window.location.hash;
				if(timezone.localeCompare("? number:0 ?")==0) {
					 alertWarningTrigger("You have to choose timezone", loc);
				}
            }
            else timezone_customWeatherActionControllerTrigger1 = null;
            
            ora_customWeatherActionControllerTrigger1 = null
//            if ($('#checktime').is(":checked")) {
                timeCheck(htime, mtime);
                ora_customWeatherActionControllerTrigger1 = time;

  //          }
  //          else ora_customWeatherActionControllerTrigger1 = null;

            if (flagTimezoneCheck == true && flagTimeCheck == true) {
                flagTriggerDone = true;

                modulinoj1 =
                {
                    "ingredientCode": 14,
                    "triggerType": "weather",
                    "type": "1",
                    "location": idCity_customWeatherActionControllerTrigger1,
                    "ora": ora_customWeatherActionControllerTrigger1,
                    "timezone": timezone_customWeatherActionControllerTrigger1,
                    "locationName": locationName_ControllerTrigger1
                };

                if (modifyVar == true) {
                    sendingToServerAllput();
                }
                else {
                    if (importFlag == true) {
                        if (iftttLogin == false) {
                            url = "#home";
                            window.location.replace(url);
                        }
                        else {
                            window.location.replace("#" + actionImportRoute);
                        }

                    }
                    else {
                        var url = "#/createRecipeAction";
                        window.location.replace(url);
                    }
                }
            }
            else {
                //var url = "/#/WeatherTrigger1";
                //window.location.replace(url);
                //Alert sull'errore commesso:
                //if(flagTimezoneCheck == false && flagTimeCheck == false)
                if (lagTimeCheck == false) {
                    //
                    // $("#notificationsWrapper").notify(
                    //     "Your inputs are not right",
                    //     {
                    //         className: 'warning',
                    //         position: 'bottom center'
                    //     }
                    // );
                    alertWarning("You input is not right.");
                    //alert("Your inputs are not right");
                }
                /*
                 else
                 {
                 if (flagTimeCheck == false)
                 {
                 alert("The time is not right");
                 }
                 else {
                 //alert("The timezone input is not right");
                 // $("#notificationsWrapper").notify(
                 //     "The timezone input is not right",
                 //     {
                 //         className: 'warning',
                 //         position: 'bottom center'
                 //     }
                 // );
                 alertWarning("The timezone code is invalid.");
                 //window.location.replace('#');
                 }
                 }
                 */

            }

        }
        //alert(flagTimezoneCheck  + "X" +  flagTimeCheck);


    });


    /**
     * Description
     * @method timezoneCheck
     * @param {} timezone
     * @return
     */
    function timezoneCheck(timezone) {

        if (timezone == "0" ||
            timezone == "1" ||
            timezone == "2" ||
            timezone == "3" ||
            timezone == "4" ||
            timezone == "5" ||
            timezone == "6" ||
            timezone == "7" ||
            timezone == "8" ||
            timezone == "9" ||
            timezone == "10" ||
            timezone == "11" ||
            timezone == "12" ||
            timezone == "-1" ||
            timezone == "-2" ||
            timezone == "-3" ||
            timezone == "-4" ||
            timezone == "-5" ||
            timezone == "-6" ||
            timezone == "-7" ||
            timezone == "-8" ||
            timezone == "-9" ||
            timezone == "-10" ||
            timezone == "-11" ||
            timezone == "-12")
            flagTimezoneCheck = true;
        else
            flagTimezoneCheck = false;

    };


    /**
     * Description
     * @method timeCheck
     * @param {} hvar
     * @param {} mvar
     * @return
     */
    function timeCheck(hvar, mvar) {
        //alert(hvar + "SXS" + mvar);


        if ((hvar == "0" ||
            hvar == "1" ||
            hvar == "2" ||
            hvar == "3" ||
            hvar == "4" ||
            hvar == "5" ||
            hvar == "6" ||
            hvar == "7" ||
            hvar == "8" ||
            hvar == "9" ||
            hvar == "10" ||
            hvar == "11" ||
            hvar == "12" ||
            hvar == "13" ||
            hvar == "14" ||
            hvar == "15" ||
            hvar == "16" ||
            hvar == "17" ||
            hvar == "18" ||
            hvar == "19" ||
            hvar == "20" ||
            hvar == "21" ||
            hvar == "22" ||
            hvar == "23" ) &&
            (
            mvar == "0" ||
            mvar == "1" ||
            mvar == "2" ||
            mvar == "3" ||
            mvar == "4" ||
            mvar == "5" ||
            mvar == "6" ||
            mvar == "7" ||
            mvar == "8" ||
            mvar == "9" ||
            mvar == "10" ||
            mvar == "11" ||
            mvar == "12" ||
            mvar == "13" ||
            mvar == "14" ||
            mvar == "15" ||
            mvar == "16" ||
            mvar == "17" ||
            mvar == "18" ||
            mvar == "19" ||
            mvar == "20" ||
            mvar == "21" ||
            mvar == "22" ||
            mvar == "23" ||
            mvar == "24" ||
            mvar == "25" ||
            mvar == "26" ||
            mvar == "27" ||
            mvar == "28" ||
            mvar == "29" ||
            mvar == "30" ||
            mvar == "31" ||
            mvar == "32" ||
            mvar == "33" ||
            mvar == "34" ||
            mvar == "35" ||
            mvar == "36" ||
            mvar == "37" ||
            mvar == "38" ||
            mvar == "39" ||
            mvar == "40" ||
            mvar == "41" ||
            mvar == "42" ||
            mvar == "43" ||
            mvar == "44" ||
            mvar == "45" ||
            mvar == "46" ||
            mvar == "47" ||
            mvar == "48" ||
            mvar == "49" ||
            mvar == "50" ||
            mvar == "51" ||
            mvar == "52" ||
            mvar == "53" ||
            mvar == "54" ||
            mvar == "55" ||
            mvar == "56" ||
            mvar == "57" ||
            mvar == "58" ||
            mvar == "59" )
        )
            flagTimeCheck = true;
        else {
            flagTimeCheck = false;
        }

    }


});