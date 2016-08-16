$(function(){
    var result;
    var foreresult;
    var temperature;
    var icon;
    var weather;
    var locality;
    var jsonurl;
    var forejsonurl;
    var deg;
    var idCity=0;

    /* Per i checking  */
    var flagWeatherCheck = "1";
    var flagPeriodCheck = "1";
    var flagZoneCheck = "1";


    var getToDate=function(time){
        var date = new Date(time*1000);
        var day=date.getDate();
        var month=1+date.getMonth();
        var year=date.getFullYear();
        return month+"/"+day+"/"+year;
    };

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            jsonurl="http://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&appid=444a5c5b0f4846dd7465cb680a94caf1"
            $.ajax({method: "GET",
                url: jsonurl,
                success: function(presentlocation){
                    result=presentlocation;
                    updateView(result);



                }

            });
            forejsonurl="http://api.openweathermap.org/data/2.5/forecast/daily?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&appid=444a5c5b0f4846dd7465cb680a94caf1"
            $.ajax({method: "GET",
                url: forejsonurl,
                success: function(forepresentlocation){
                    var foreresult=forepresentlocation;


                    updateBox3(foreresult);
                }

            });


        });
    } /// end of weather update based on Location...



    function updateView(result){



        if(result.cod==="404"){
            $('#temper').hide();
            //alert("No City found Try Again!!....");
        }
        else {

            var k = result.weather[0].icon;
            var back = {
                "01d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/3448F05E20.jpg",
                "01n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7BY01H9BDT.jpg",
                "02d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/AKZRN2XPK8.jpg",
                "02n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/D0080781B6.jpg",
                "03d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/V85UKOJEHQ.jpg",
                "03n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8JP8NFU0I2.jpg",
                "04d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/UV542Y42CW.jpg",
                "04n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/Y9HHFJBM33.jpg",
                "09d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/YPN7LYZR7E.jpg",
                "09n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/LNFMTJGFKD.jpg",
                "10d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/C3E239A4B9.jpg",
                "10n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/C3E239A4B9.jpg",
                "11d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FRVILTXU9R.jpg",
                "11n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/F39CBA21BE.jpg",
                "13d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/P0NXH7XVCS.jpg",
                "13n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DABC9B899F.jpg",
                "50d": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/9XDH29XSFK.jpg",
                "50n": "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/F97C70F16D.jpg"

            };


            temperature = result.main.temp - 273.15;
            temperature = temperature.toFixed(1);
            weather = result.weather[0].description;
            icon = result.weather[0].icon;
            locality = result.name + ' - ' + result.sys.country;


            //temp-board

            $("#temp").html(temperature + ' &deg;C');
            $("#weather-desc").text(weather);
            $("#icon").attr("src", "http://openweathermap.org/img/w/" + icon + ".png");
            $("#locality").text(locality);
            //temp board

            //box1
            $("#wind-speed").text(result.wind.speed);
            $("#wind-deg").text(result.wind.deg.toFixed(1));
            $("#clouds-all").text(result.clouds.all);
            $("#rain-3h").text("0");
            $("#snow-3h").text("0");
            if (result.rain) {

                $("#rain-3h").text(result.rain[Object.keys(result.rain)[0]]);
            }
            if (result.snow) {
                $("#snow-3h").text(result.snow[Object.keys(result.snow)[0]]);
            }
            //box1

            //box-2
            $("#main-temp").html(temperature);
            $("#main-pressure").text(result.main.pressure);
            $("#main-humidity").text(result.main.humidity);
            var temperature_min = result.main.temp_min - 273.15;
            temperature_min = temperature_min.toFixed(1);
            var temperature_max = result.main.temp_max - 273.15;
            temperature_max = temperature_max.toFixed(1);
            $("#main-temp_min").text(temperature_min);
            $("#main-temp_max").text(temperature_max);
            $("#main-sea_level").text("N.A");
            $("#main-grnd_level").text("N.A");
            if (result.main.sea_level) {
                $("#main-sea_level").text(result.main.sea_level);
            }
            if (result.main.grnd_level) {
                $("#main-grnd_level").text(result.main.grnd_level);
            }

            //box-2


            //box4
            $("#main-name").text(result.name);
            $("#sys-id").text(result.id);
            $("#coord-lon").text(result.coord.lon);
            $("#coord-lat").text(result.coord.lat);
            $("#sys-country").text(result.sys.country);
            /*Get Id for server */
            idCity = result.id;

            //alert("Id" + result.id);

            var getTime = function (time) {
                var date = new Date(time * 1000);
                var hours = date.getUTCHours();
                var minutes = "0" + date.getUTCMinutes();
                var seconds = "0" + date.getUTCSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                return formattedTime;
            };

// Will display time in 10:30:23 format

            $("#sys-sunrise").text(getTime(result.sys.sunrise));

            $("#sys-sunset").text(getTime(result.sys.sunset));


            $("#main-date").text(getToDate(result.dt))
            //box4

        }



    };
    var updateBox3=function(foreresult){

        for(var i=1;i<=6;i++){
            $("#forecast").append('<div class="forecast"><span  id="fore-'+i+'">Date</span> : <span><img id="fore-'+i+'-image" src="..." alt="Icon"></span></div> ');
            $("#fore-"+i).html(getToDate(foreresult.list[i-1].dt)) ;

        }

        for(var i=1;i<=6;i++){
            foreIcon=foreresult.list[i-1].weather[0].icon;
            $("#fore-"+i+"-image").attr("src","http://openweathermap.org/img/w/"+foreIcon+".png") ;
        }

    };
    var searchEnter=function(){
        var city=$("#search-input").val();

        jsonurl="http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=444a5c5b0f4846dd7465cb680a94caf1"
        $.ajax({method: "GET",
            url: jsonurl,
            success: function(presentlocation){
                result=presentlocation;

                updateView(result);



            }});
        forejsonurl="http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+"&appid=444a5c5b0f4846dd7465cb680a94caf1"
        $.ajax({method: "GET",
            url: forejsonurl,
            success: function(forepresentlocation){
                var foreresult=forepresentlocation;



              //  updateBox3(foreresult);
            }});


    }
    $("#search-input").keyup(function (e) {
        if ( e.which == 13 ){
            $('#temper').fadeOut("fast");
            $('#temper').fadeIn("slow");
            $("#deg").animate({"left":"0px"});
            deg="true";
            $("#deg").html("&deg;C");
            searchEnter();

        }

    });
    $("button").on("click",function(){
        $('#temper').fadeOut("fast");
        $('#temper').fadeIn("slow");
        $("#deg").animate({"left":"0px"});
        deg="true";
        $("#deg").html("&deg;C");
        searchEnter();
    });
    deg="true";

    $("#deg").on("click",function(){
        if(deg==="true")
        {$("#deg").animate({"left":"26px"});
            deg="false";
            $("#deg").html("&deg;F");
            temperature=result.main.temp - 273.15;

            temperature=temperature.toFixed(1);
            temperature=1.8*(temperature) + 32;
            $("#temp").html(temperature+' &deg;F');
        }

        else if(deg==="false"){
            $("#deg").animate({"left":"0px"});
            deg="true";
            $("#deg").html("&deg;C");
            temperature=result.main.temp - 273.15;
            temperature=temperature.toFixed(1);
            $("#temp").html(temperature+' &deg;C');
        }
    });


    $("#but").on("click", function updateView(){
        //alert(idCity);
        flagWeatherCheck = true;
        flagPeriodCheck = true;
        flagZoneCheck = true;
        triggerChose = 7;
        if (idCity == '0')
        {
            //$scope.errorButton= "Almost a field must be completed";
            //alert("You have not found you ciry");

            $("#notificationsWrapper").notify(
                "You have not found you ciry",
                {
                    className: 'warning',
                    position: 'bottom center'
                }
            );
        }
        else
        {
            //Brute force resolution
            /*weatheridcheckbox    periodidcheckbox   checktimeZonevar        DONE
               0                0               0                   *
               0                0               1                   *
               0                1               0                   *
               0                1               1                   *
               1                0               0
               1                0               1
               1                1               0
               1                1               1
            */

            //  sunset
            // weatheridcheckbox    periodidcheckbox    checktimeZonevar
            //  thmaxidinput      thminidinput

            //          0                                       0                                       0
            if ($('#weatheridcheckbox').is(":checked") &&  $('#periodidcheckbox').is(":checked") &&   $('#checktimeZonevar').is(":checked"))
            {
                //pweather         pperiod,                  pzone
                //mySelect         periodidinput            timezoneid

                var pweather = $('#mySelect').val();
                var pperiod = $('#periodidinput').val();
                var pzone = $('#timezoneid').val();
              
                sendingToServer(pweather, pperiod, pzone );


            }
            else
            {
                //          0                                       0
                if ($('#weatheridcheckbox').is(":checked") &&  $('#periodidcheckbox').is(":checked"))
                {
                    var pweather = $('#mySelect').val();
                    var pperiod = $('#periodidinput').val();
                    //var pzone = $('#timezoneid').val();

                    sendingToServer(pweather, pperiod, null );

                }
                else
                {
                    //          0                                       0
                    if ($('#weatheridcheckbox').is(":checked")  &&   $('#checktimeZonevar').is(":checked"))
                    {
                        var pweather = $('#mySelect').val();
                        //var pperiod = $('#periodidinput').val();
                        var pzone = $('#timezoneid').val();

                        sendingToServer(pweather, null, pzone );

                    }
                    else
                    {
                        //          0
                        if ($('#weatheridcheckbox').is(":checked"))
                        {

                            var pweather = $('#mySelect').val();
                            //var pperiod = $('#periodidinput').val();
                            //var pzone = $('#timezoneid').val();

                            sendingToServer(pweather, null, null );


                        }
                        else
                        {
                            //          1                                       0                                       1
                            if ($('#periodidcheckbox').is(":checked"))
                            {
                               // var pweather = $('#mySelect').val();
                                var pperiod = $('#periodidinput').val();
                               // var pzone = $('#timezoneid').val();

                                sendingToServer(null, pperiod, null );


                            }
                            else
                            {
                                //          1                                       1                                         0
                                if ($('#checktimeZonevar').is(":checked"))
                                {

                                   // var pweather = $('#mySelect').val();
                                   // var pperiod = $('#periodidinput').val();
                                    var pzone = $('#timezoneid').val();

                                    sendingToServer(null, null, pzone );


                                }
                                else
                                {

                                    //var pweather = $('#mySelect').val();
                                    //var pperiod = $('#periodidinput').val();
                                    //var pzone = $('#timezoneid').val();

                                    sendingToServer(null, null, null );


                                }



                            }



                        }


                    }
                }


            }

            /*
             flagWeatherCheck = true;
             flagPeriodCheck = true;
             flagZoneCheck = true;

             */

            if ($('#weatheridcheckbox').is(":checked"))
                weathercheckfunc();
            if($('#periodidcheckbox').is(":checked"))
                periodidcheckfunc();
            if ($('#checktimeZonevar').is(":checked"))
                timezoneCheck();

            //alert(flagWeatherCheck + "X" + flagPeriodCheck );

                if(flagWeatherCheck == 0 ||  flagPeriodCheck == 0 || flagZoneCheck == 0)
                {
                    //url = "#WeatherTrigger2";
                    //window.location.replace(url);
                    //alert("Your input is not right");
                    $("#notificationsWrapper").notify(
                        "Your input is not right",
                        {
                            className: 'warning',
                            position: 'bottom center'
                        }
                    );
                }
                else
                {
                    flagTriggerDone = true;

                    modulinoj1=
                    {
                        "triggerType" : "weather",
                        "type" : "2",
                         "location":   idCity_customWeatherActionControllerTrigger2,
                        "tempo" : pweather_customWeatherActionControllerTrigger2,
                        "period" : pperiod_customWeatherActionControllerTrigger2,
                        "timezone" : pzone_customWeatherActionControllerTrigger2
                    };

                    if(modifyVar == true)
                    {
                        sendingToServerAllput();
                    }
                    else
                    {
                        url = "#createRecipeAction";
                        window.location.replace(url);
                    }

                }


        }



        function  timezoneCheck  ()
        {

            if (pzone_customWeatherActionControllerTrigger2 == "0" ||
                pzone_customWeatherActionControllerTrigger2 == "1" ||
                pzone_customWeatherActionControllerTrigger2 == "2" ||
                pzone_customWeatherActionControllerTrigger2 == "3" ||
                pzone_customWeatherActionControllerTrigger2 == "4" ||
                pzone_customWeatherActionControllerTrigger2 == "5" ||
                pzone_customWeatherActionControllerTrigger2 == "6" ||
                pzone_customWeatherActionControllerTrigger2 == "7" ||
                pzone_customWeatherActionControllerTrigger2 == "8" ||
                pzone_customWeatherActionControllerTrigger2 == "9" ||
                pzone_customWeatherActionControllerTrigger2 == "10" ||
                pzone_customWeatherActionControllerTrigger2 == "11" ||
                pzone_customWeatherActionControllerTrigger2 == "12" ||
                pzone_customWeatherActionControllerTrigger2 == "-1" ||
                pzone_customWeatherActionControllerTrigger2 == "-2" ||
                pzone_customWeatherActionControllerTrigger2 == "-3" ||
                pzone_customWeatherActionControllerTrigger2 == "-4" ||
                pzone_customWeatherActionControllerTrigger2 == "-5" ||
                pzone_customWeatherActionControllerTrigger2 == "-6" ||
                pzone_customWeatherActionControllerTrigger2 == "-7" ||
                pzone_customWeatherActionControllerTrigger2 == "-8" ||
                pzone_customWeatherActionControllerTrigger2 == "-9" ||
                pzone_customWeatherActionControllerTrigger2 == "-10" ||
                pzone_customWeatherActionControllerTrigger2 == "-11" ||
                pzone_customWeatherActionControllerTrigger2 == "-12")
                flagZoneCheck = true;
            else
                flagZoneCheck =false;

        };

        function  weathercheckfunc  ()
        {

            if (pweather_customWeatherActionControllerTrigger2 == "200" ||
                pweather_customWeatherActionControllerTrigger2 == "300" ||
                pweather_customWeatherActionControllerTrigger2 == "500"
            )
                flagWeatherCheck = true;
            else
                flagWeatherCheck =false;

        };


        function  periodidcheckfunc  ()
        {
            var i=0;
            flagPeriodCheck = false;
            for (i=0; i<701; i++)
            {
                if(pperiod_customWeatherActionControllerTrigger2 == i.toString())
                    flagPeriodCheck = true;

            }

        };






        function sendingToServer (pweather, pperiod, pzone )
        {
            idCity_customWeatherActionControllerTrigger2 = idCity;
            pweather_customWeatherActionControllerTrigger2 = pweather;
            pperiod_customWeatherActionControllerTrigger2 = pperiod;
            pzone_customWeatherActionControllerTrigger2 = pzone;


        }



    })





});
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
