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
            locationName_ControllerTrigger3 = result.name;

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


    $("button").on("click", function () {
        $('#temper').fadeOut("fast");
        $('#temper').fadeIn("slow");
        $("#deg").animate({"left": "0px"});
        deg = "true";
        $("#deg").html("&deg;C");
        searchEnter();
    });
    deg = "true";

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
        flagTimezoneCheck = true;
        triggerChose = 8;
        if (idCity == '0') {
            //$scope.errorButton= "Almost a field must be completed";
            //alert("You have not found you ciry");
            // $("#notificationsWrapper").notify(
            //     "You have not found you ciry",
            //     {
            //         className: 'warning',
            //         position: 'bottom center'
            //     }
            // );
            alertWarning("We have not found your city.");
        }
        else {


            if ($('#checksunset').is(":checked") || $('#checksunrise').is(":checked")) {
                //checksunrise

                if ($('#checksunset').is(":checked")) {
                    sunset_customWeatherActionControllerTrigger3 = true;
                }
                else {
                    sunrise_customWeatherActionControllerTrigger3 = false;
                }

                //checksunset
                if ($('#checksunrise').is(":checked")) {
                    sunrise_customWeatherActionControllerTrigger3 = true;
                }
                else {
                    sunrise_customWeatherActionControllerTrigger3 = false;
                }

                //timezone
                if ($('#checktimeZonevar').is(":checked")) {
                    timezone_customWeatherActionControllerTrigger3 = $('#timezoneid').val();
                    //timezoneCheck();
                }
                else {
                    timezone_customWeatherActionControllerTrigger3 = null;
                }

                if (flagTimezoneCheck == 1) {
                    flagTriggerDone = true;
                    idCity_customWeatherActionControllerTrigger3 = idCity;
                    modulinoj1 =
                    {
                        "ingredientCode": 16,
                        "triggerType": "weather",
                        "type": "2",
                        "location": idCity_customWeatherActionControllerTrigger3,
                        "timezone": timezone_customWeatherActionControllerTrigger3,
                        "sunset": sunset_customWeatherActionControllerTrigger3,
                        "sunrise": sunrise_customWeatherActionControllerTrigger3,
                        "locationName": locationName_ControllerTrigger3


                    };

                    if (modifyVar == true) {
                        sendingToServerAllput();
                    }
                    else {
                        if (importFlag == true) {
                            window.location.replace("#" + actionImportRoute);
                        }
                        else {
                            url = "#createRecipeAction";
                            window.location.replace(url);
                        }
                    }
                }
                else {
                    //alert("The input of the time zone is not right");
                    // $("#notificationsWrapper").notify(
                    //     "The input of the time zone is not right",
                    //     {
                    //         className: 'warning',
                    //         position: 'bottom center'
                    //     }
                    // );
                    alertWarning("The timezone code is invalid");
                }
            }
            else {
                // //alert("The input of the time zone is not right");
                // $("#notificationsWrapper").notify(
                //     "At least one between sunrise and sunset must be chosen",
                //     {
                //         className: 'warning',
                //         position: 'bottom center'
                //     }
                // );

                alertWarning("At least one between sunrise and sunset must be chosen.");

            }


        }


        /**
         * Description
         * @method timezoneCheck
         * @return
         */
        function timezoneCheck() {

            if (timezone_customWeatherActionControllerTrigger3 == "0" ||
                timezone_customWeatherActionControllerTrigger3 == "1" ||
                timezone_customWeatherActionControllerTrigger3 == "2" ||
                timezone_customWeatherActionControllerTrigger3 == "3" ||
                timezone_customWeatherActionControllerTrigger3 == "4" ||
                timezone_customWeatherActionControllerTrigger3 == "5" ||
                timezone_customWeatherActionControllerTrigger3 == "6" ||
                timezone_customWeatherActionControllerTrigger3 == "7" ||
                timezone_customWeatherActionControllerTrigger3 == "8" ||
                timezone_customWeatherActionControllerTrigger3 == "9" ||
                timezone_customWeatherActionControllerTrigger3 == "10" ||
                timezone_customWeatherActionControllerTrigger3 == "11" ||
                timezone_customWeatherActionControllerTrigger3 == "12" ||
                timezone_customWeatherActionControllerTrigger3 == "-1" ||
                timezone_customWeatherActionControllerTrigger3 == "-2" ||
                timezone_customWeatherActionControllerTrigger3 == "-3" ||
                timezone_customWeatherActionControllerTrigger3 == "-4" ||
                timezone_customWeatherActionControllerTrigger3 == "-5" ||
                timezone_customWeatherActionControllerTrigger3 == "-6" ||
                timezone_customWeatherActionControllerTrigger3 == "-7" ||
                timezone_customWeatherActionControllerTrigger3 == "-8" ||
                timezone_customWeatherActionControllerTrigger3 == "-9" ||
                timezone_customWeatherActionControllerTrigger3 == "-10" ||
                timezone_customWeatherActionControllerTrigger3 == "-11" ||
                timezone_customWeatherActionControllerTrigger3 == "-12")
                flagTimezoneCheck = true;
            else
                flagTimezoneCheck = false;

        }


        /*
         function sendingToServer (loginDataSend)
         {
         $.ajax({
         method: "post",
         url: "/MyServlet",
         data: loginDataSend,
         dataType: "json",
         success: console.log("la post ha avuto successo")
         });

         }
         */
        /*
         var loginDataSend =
         {
         "sender:":  idCity,
         "timezone": null,
         "sunset":   null,
         "sunrise":  null

         }
         sendingToServer(loginDataSend);
         */


    })


});

/* Template for checkbox [] ^ $ */
/*

 var timezone = $('#timezoneid').val();
 var loginDataSend =
 {
 "sender:": idCity,
 "timezone" : timezone,
 "ora": time

 };
 //alert(loginDataSend.pssword);
 $.ajax({
 method: "post",
 url: "/MyServlet",
 data: loginDataSend,
 dataType: "json",
 success: console.log("la post ha avuto successo")
 });

 url = "http://localhost:8080/#/gMailSucces";
 window.location.replace(url);
 //or
 //window.location(url);
 */