$(function()
{
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
    var flagTimezoneCheck = true;
    var flagTimeCheck = true;



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


    $("#but").on("click", function updateView()
    {
        //alert(idCity);
        triggerChose = 6;
        flagTimezoneCheck = true;
        flagTimeCheck = true;

        if (idCity == '0')
        {

            $("#notificationsWrapper").notify(
                "You have not found you ciry",
                {
                    className: 'warning',
                    position: 'bottom center'
                }
            );
            //alert("You have not found you ciry");
        }
        else
        {
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
            if ($('#checktimeZonevar').is(":checked"))
            {
                timezoneCheck(timezone);
                timezone_customWeatherActionControllerTrigger1 = timezone;

            }
            else timezone_customWeatherActionControllerTrigger1 = null;
           if($('#checktime').is(":checked"))
           {
               timeCheck(htime, mtime);
               ora_customWeatherActionControllerTrigger1 = time;

           }
           else ora_customWeatherActionControllerTrigger1 = null;

            if(flagTimezoneCheck == true &&  flagTimeCheck == true)
            {
                flagTriggerDone = true;

                modulinoj1=
                {
                    "triggerType" : "weather",
                    "type" : "1",
                    "location" : idCity_customWeatherActionControllerTrigger1,
                    "ora"  : ora_customWeatherActionControllerTrigger1,
                    "timezone" : timezone_customWeatherActionControllerTrigger1
                };

                if(modifyVar == true)
                {
                    sendingToServerAllput();
                }
                else
                {
                    var url = "#/createRecipeAction";
                    window.location.replace(url);
                }
            }
            else
            {
                //var url = "/#/WeatherTrigger1";
                //window.location.replace(url);
                //Alert sull'errore commesso:
                if(flagTimezoneCheck == false && flagTimeCheck == false)
                {

                    $("#notificationsWrapper").notify(
                        "Your inputs are not right",
                        {
                            className: 'warning',
                            position: 'bottom center'
                        }
                    );
                    //alert("Your inputs are not right");
                }
                else
                {
                    if (flagTimeCheck == false)
                    {
                        alert("The time is not right");
                    }
                    else {
                        //alert("The timezone input is not right");
                        $("#notificationsWrapper").notify(
                            "The timezone input is not right",
                            {
                                className: 'warning',
                                position: 'bottom center'
                            }
                        );
                        //window.location.replace('#');
                    }
                }

            }

        }
        //alert(flagTimezoneCheck  + "X" +  flagTimeCheck);


    });



    function  timezoneCheck  (timezone)
    {

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
            flagTimezoneCheck =false;

    };



    function timeCheck (hvar, mvar)
    {
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
                mvar ==  "0" ||
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
            flagTimeCheck =true;
        else
        {
            flagTimeCheck = false;
        }

    }






});