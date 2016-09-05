$(function () {
    var result;
    var temperature;
    var weather;
    var locality;
    var jsonurl;
    var deg;
    var idCity = 0;
    /* Per i checking  */
    var flagThmaxCheck = true;
    var flagThminCheck = true;
    var flagPeriodCheck = true;
    var flagTimeZoneCheck = true;


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
            locationName_ControllerTrigger4 = result.name;

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
        flagThmaxCheck = true;
        flagThminCheck = true;
        flagPeriodCheck = true;
        flagTimeZoneCheck = true;
        var timezone = "";
        var thmax = "";
        var thmin = "";
        var period = "";


        if (idCity == '0') {
            //$scope.errorButton= "Almost a field must be completed";
            // alert("You have not found you ciry");
            //  $("#notificationsWrapper").notify(
            //      "You have not found you ciry",
            //      {
            //          className: 'warning',
            //          position: 'bottom center'
            //      }
            //  );
            alertWarning("We have not found your city");

        }
        else {
            triggerChose = 9;

            if ($('#thmaxidcheckbox').is(":checked") || $('#thminidcheckbox').is(":checked")) {
                if ($('#thmaxidcheckbox').is(":checked")) {
                    thmax = $('#thmaxidinput').val();

                }
                else {
                    thmax = null;
                }
                if ($('#thminidcheckbox').is(":checked")) {
                    thmin = $('#thminidinput').val();
                }
                else {
                    thmin = null;
                }
                if ($('#checktimeZonevar').is(":checked")) {
                    timezone = $('#timezoneid').val();
    				var loc = window.location.hash;
    				if(timezone.localeCompare("? number:0 ?")==0) {
    					 alertWarningTrigger("You have to choose timezone", loc);
    				}
                }
                else {
                    timezone = null;
                }

                if ($('#periodidcheckbox').is(":checked")) {
                    period = $('#periodidinput').val();
                }
                else {
                    period = null;
                }

                idCity_customWeatherActionControllerTrigger4 = idCity;
                ptimezone_customWeatherActionControllerTrigger4 = timezone;
                pthmax_customWeatherActionControllerTrigger4 = thmax;
                pthmin_customWeatherActionControllerTrigger4 = thmin;
                period_customWeatherActionControllerTrigger4 = period;
                /*
                 var flagThmaxCheck = true;
                 var flagThminCheck = true;
                 var flagPeriodCheck = true;
                 var flagTimeZoneCheck = true;
                 */

                if ($('#thmaxidcheckbox').is(":checked"))
                    flagThmaxCheckfunc();
                if ($('#thminidcheckbox').is(":checked"))
                    flagThminCheckfunc();
                if ($('#checktimeZonevar').is(":checked"))
                // flagTimeZoneCheckfunc();
                    if ($('#periodidcheckbox').is(":checked"))
                        flagPeriodCheckfunc();


                if (flagThmaxCheck == false || flagThminCheck == false || flagPeriodCheck == false || flagTimeZoneCheck == false) {
                    // alert("Please check your input because is/are not right");
                }
                else {

                    var outputInMilliseconds = null;
                    if (period_customWeatherActionControllerTrigger4 != null) {
                        outputInMilliseconds = period_customWeatherActionControllerTrigger4 * 60000;
                    }


                    modulinoj1 =
                    {
                        "ingredientCode": 17,
                        "triggerType": "weather",
                        "type": "4",
                        "location": idCity_customWeatherActionControllerTrigger4,
                        "timezone": ptimezone_customWeatherActionControllerTrigger4,
                        "thmax": pthmax_customWeatherActionControllerTrigger4,
                        "thmin": pthmin_customWeatherActionControllerTrigger4,
                        "period": outputInMilliseconds,
                        "locationName": locationName_ControllerTrigger4
                    };


                    flagTriggerDone = true;
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
            }
            else {
                //alert("Please chose tmax or/and tmin");
                // $("#notificationsWrapper").notify(
                //     "Please chose tmax or/and tmin",
                //     {
                //         className: 'warning',
                //         position: 'bottom center'
                //     }
                // );
                alertWarning("Please, choose max temperature and / or min temperature.");

            }


        }

        /**
         * Description
         * @method flagThmaxCheckfunc
         * @return
         */
        function flagThmaxCheckfunc() {
            var i = 0;
            flagThmaxCheck = false;
            for (i = -70; i < 71; i++) {
                if (pthmax_customWeatherActionControllerTrigger4 == i.toString())
                    flagThmaxCheck = true;

            }
            if (flagThmaxCheck == false)
            //alert("The range of the max temperature is -70/70");
            // $("#notificationsWrapper").notify(
            //     "The range of the max temperature is -70/70",
            //     {
            //         className: 'warning',
            //         position: 'bottom center'
            //     }
            // );
                alertWarning("The range of the max temperature is -70/70");


        }

        /**
         * Description
         * @method flagThminCheckfunc
         * @return
         */
        function flagThminCheckfunc() {

            var i = 0;
            flagThminCheck = false;
            for (i = -70; i < 71; i++) {
                if (pthmin_customWeatherActionControllerTrigger4 == i.toString())
                    flagThminCheck = true;

            }
            if (flagThminCheck == false)
            //alert("The range of the min temperature is -70/70");
            // $("#notificationsWrapper").notify(
            //     "The range of the min temperature is -70/70",
            //     {
            //         className: 'warning',
            //         position: 'bottom center'
            //     }
            // );
                alertWarning("The range of the min temperature is -70/70");


        }

        /**
         * Description
         * @method flagPeriodCheckfunc
         * @return
         */
        function flagPeriodCheckfunc() {
            var i = 0;
            flagPeriodCheck = false;
            for (i = 0; i < 701; i++) {
                if (period_customWeatherActionControllerTrigger4 == i.toString())
                    flagPeriodCheck = true;

            }
            if (flagPeriodCheck == false)
            //alert("The range of the min temperature is 0/700");
            // $("#notificationsWrapper").notify(
            //     "The range of the min temperature is 0/700",
            //     {
            //         className: 'warning',
            //         position: 'bottom center'
            //     }
            // );
                alertWarning("The range of the min temperature is 0/700");


        }

        /**
         * Description
         * @method flagTimeZoneCheckfunc
         * @return
         */
        function flagTimeZoneCheckfunc() {

            var i = 0;
            flagTimeZoneCheck = false;
            for (i = -12; i < 13; i++) {
                if (ptimezone_customWeatherActionControllerTrigger4 == i.toString())
                    flagTimeZoneCheck = true;

            }
            if (flagTimeZoneCheck == false)
            //alert("The range of the time zone is -12/12");

            // $("#notificationsWrapper").notify(
            //     "The range of the time zone is -12/12",
            //     {
            //         className: 'warning',
            //         position: 'bottom center'
            //     }
            // );
                alertWarning("The range of the time zone is -12/12");


        }


        /**
         * Description
         * @method sendingToServer
         * @param {} ptimezone
         * @param {} pthmax
         * @param {} pthmin
         * @param {} pperiod
         * @return
         */
        function sendingToServer(ptimezone, pthmax, pthmin, pperiod) {
            var loginDataSend =
            {
                "sender:": idCity,
                "timezone": ptimezone,
                "thmax": pthmax,
                "thmin": pthmin,
                "period": pperiod

            };
            idCity_customWeatherActionControllerTrigger4 = idCity;
            ptimezone_customWeatherActionControllerTrigger4 = ptimezone;
            pthmax_customWeatherActionControllerTrigger4 = pthmax;
            pthmin_customWeatherActionControllerTrigger4 = pthmin;
            period_customWeatherActionControllerTrigger4 = pperiod;

            /*
             $.ajax({
             method: "post",
             url: "/MyServlet",
             data: loginDataSend,
             dataType: "json",
             success: console.log("la post ha avuto successo")
             });
             */

        }

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


})
//Prova atom

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
