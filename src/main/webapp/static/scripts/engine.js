/*
 * Created by kazuhira on 22/07/16.
 */


var iftttApp = angular.module('iftttApp', ['ngRoute']);
//Secure controll
var triggerChose = 0;
var actionChose =  0;

var consoleLogs = false;

/*GmailTriggerController  Tn 1*/
var sender_GmailTriggerController = ""; //sender
var subject_GmailTriggerController = ""; //subject

/* GmailActionController  An 1*/
var sender_GmailActionController = "";
var subject_GmailActionController = "";
var receiver_GmailActionController = "";
var body_GmailActionController = "";

/* Trigger1GcalendarController Tn 2  S0 */
var title_Trigger1GcalendarController = "";
var description_Trigger1GcalendarController = "";
var place_Trigger1GcalendarController = "";

/*Trigger2GcalendarController Tn 3  S0*/
var title_Trigger2GcalendarController = "";
var description_Trigger2GcalendarController = "";
var place_Trigger2GcalendarController = "";

/*action1GcalendarController An 2 */ //--> si doveva finire
var title_action1GcalendarController = "";
var subjectReceive_action1GcalendarController = "";
var place_action1GcalendarController = "";
var  yearVector_action1GcalendarController = "";
var monthVector_action1GcalendarController = "";
var dayVector_action1GcalendarController = "";
var durationHour_action1GcalendarController = "";
var durationMinute_action1GcalendarController = "";
var timeZone_action1GcalendarController = "";


/* action1TwitterController An 3 */
var subject_action1TwitterController = "";

/* action2TwitterController An 4 */
var title_action2TwitterController = "";
var subjec_action2TwitterController = "";

/* trigger1TwitterController  Tn 4*/
var username_sender_trigger1TwitterController ="";
var hashtag_text_trigger1TwitterController = "";

/* trigger2TwitterController Tn 5 */
var username_sender_trigger2TwitterController = "";
var  hashtag_text_trigger2TwitterController = "";

/* customWeatherActionControllerTrigger1 Tn 6 */
var idCity_customWeatherActionControllerTrigger1 ="";
var timezone_customWeatherActionControllerTrigger1 = "";
var ora_customWeatherActionControllerTrigger1 = "";

/*  customWeatherActionControllerTrigger2 Tn 7 */
var idCity_customWeatherActionControllerTrigger2 = "";
var pweather_customWeatherActionControllerTrigger2 = "";
var pperiod_customWeatherActionControllerTrigger2 = "";
var pzone_customWeatherActionControllerTrigger2 = "";

/* customWeatherActionControllerTrigger3  Tn 8 */
var  idCity_customWeatherActionControllerTrigger3 = "";
var  timezone_customWeatherActionControllerTrigger3 = "";
var  sunset_customWeatherActionControllerTrigger3 = false;
var  sunrise_customWeatherActionControllerTrigger3 = false;

/* customWeatherActionControllerTrigger4  Tn 9 */

var idCity_customWeatherActionControllerTrigger4 = "";
var ptimezone_customWeatherActionControllerTrigger4 ="";
var pthmax_customWeatherActionControllerTrigger4 = "";
var pthmin_customWeatherActionControllerTrigger4 ="";
var period_customWeatherActionControllerTrigger4 = "";


/* Modulini per json*/
var modulinoj1 = [];
var modulinoj2 = [];

/* NAVIGATION */

//unused? var navPages = [0,0,0,0,0,0]; normal navigation
var count=0;
var url1back = "";
var flagTriggerDone = false;

//Variabile di percorso per la modify parte
var  modifyVar = 0;
var modifyCountVar = 0;
var setChooseAx  = 0;

//Variabile per protegere le pagine da quello che ho visto devono essere globali.
var googleLogin =false;   //-> $scope.googleLogged
var twitterLogin = false; //-> $scope.twitterLogged
var iftttLogin = false; //-> $scope.iftttLogged

var alertVariable = "";


//Esiste già
//var loginDataSend = null;
var sendDataToServer = [];

//Variabile di descriozione
var descriptionRecipeGlobal = "";

//Variabile se è pubblica o no
var  publishRecipeGlobal = false;

//Variabile Id
var idRecipe = "";

//Variabile action and trigger
var actionGlobalVariable = "";
var triggreGlobalVariable = "";
var subTriggerGlobalVariable = "";
var subActionGlobalVariable = "";

//Url action and trigger
var ulrTriggreGlobalVariable = "";
var urlActionGlobalVariable = "";

//Temporary root for login
var rootingAutenticationTriggerAction = "";






iftttApp.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/', {
        templateUrl: './static/innerPages/home.html',
        controller: 'homeController'
    });

    $routeProvider.when('#', {
        templateUrl: './static/innerPages/home.html',
        controller: 'homeController'
    });

    $routeProvider.when('/home', {
        templateUrl: './static/innerPages/home.html',
        controller: 'homeController'
    });


    $routeProvider.when('/index/createIF', {
        templateUrl: './static/innerPages/triggers.html',
        controller: 'ifCreatorController'
    });


    $routeProvider.when('/createDO', {
        templateUrl: './static/innerPages/actions.html',
        controller: 'doCreatorController'
    });

    $routeProvider.when('/createRecipe', {
        templateUrl: './static/innerPages/createRecipe.html',
        controller: 'createRecipeController'
    });

    $routeProvider.when('/chooseChannel', {
        templateUrl: './static/innerPages/choose-channel.html'
        //controller: 'chooseChannelController'
    });

    $routeProvider.when('/loginPage', {
        templateUrl: './static/innerPages/loginPage.html',
        controller: 'loginPageController'
    });

    $routeProvider.when('/index/myRecipes', {
        templateUrl: './static/innerPages/myRecipes.html',
        controller: 'myRecipesController'
    });

    $routeProvider.when('/index/createAccount', {
        templateUrl: './static/innerPages/createAccount.html',
        controller: 'createAccountController'
    });


    $routeProvider.when('/about', {
        templateUrl: './static/innerPages/about.html'
    });

    $routeProvider.when('/index/about', {
        templateUrl: './static/innerPages/about.html'
    });

    $routeProvider.when('/aboutSite', {
        templateUrl: './static/innerPages/about-the-site.html'
    });

    $routeProvider.when('/ourTeam', {
        templateUrl: './static/innerPages/ourTeam.html'
    });

    $routeProvider.when('/gMailTrigger', {
        templateUrl: './static/innerPages/gmailChannel/gMail_Trigger.html',
        controller: 'GmailTriggerController' //o.k.
    });


    $routeProvider.when('/gMailAction', {
        templateUrl: './static/innerPages/gmailChannel/gMail_Action.html',
        controller: 'GmailActionController' //o.k.
    });


    $routeProvider.when('/choseTriggerActionWeather', {
        templateUrl: './static/innerPages/weatherChannel/weatherChooseTriggerAction.html'
    });

    $routeProvider.when('/WeatherTrigger1', {
        templateUrl: './static/innerPages/weatherChannel/WeatherTrigger1.html',
        controller: 'customWeatherActionControllerTrigger1'
    });

    $routeProvider.when('/WeatherTrigger2', {
        templateUrl: './static/innerPages/weatherChannel/WeatherTrigger2.html',
        controller: 'customWeatherActionControllerTrigger2'
    });

    $routeProvider.when('/WeatherTrigger3', {
        templateUrl: './static/innerPages/weatherChannel/WeatherTrigger3.html',
        controller: 'customWeatherActionControllerTrigger3'
    });


    $routeProvider.when('/WeatherTrigger4', {
        templateUrl: './static/innerPages/weatherChannel/WeatherTrigger4.html',
        controller: 'customWeatherActionControllerTrigger4'
    });

    $routeProvider.when('/choseTriggerGcalendar', {
        templateUrl: './static/innerPages/gcalendarChannel/choseTrigger.html'
    });

    $routeProvider.when('/Trigger1Gcalendar', {
        templateUrl: './static/innerPages/gcalendarChannel/gcalendar_Trigger1.html',
        controller: 'Trigger1GcalendarController'
    });

    $routeProvider.when('/Trigger2Gcalendar', {
        templateUrl: './static/innerPages/gcalendarChannel/gcalendar_Trigger2.html',
        controller: 'Trigger2GcalendarController'
    });


    $routeProvider.when('/action1Gcalendar', {
        templateUrl: './static/innerPages/gcalendarChannel/gcalendar_Action1.html',
        controller: 'action1GcalendarController'
    });

    $routeProvider.when('/choseTriggerTwitter', {
        templateUrl: './static/innerPages/twitterChannel/choseTrigger.html'
    });

    $routeProvider.when('/choseActionTwitter', {
        templateUrl: './static/innerPages/twitterChannel/choseAction.html'
    });

    $routeProvider.when('/Action1Twitter', {
        templateUrl: './static/innerPages/twitterChannel/twitter_Action1.html',
        controller: 'action1TwitterController'
    });


    $routeProvider.when('/Action2Twitter', {
        templateUrl: './static/innerPages/twitterChannel/twitter_Action2.html',
        controller: 'action2TwitterController'
    });


    $routeProvider.when('/Trigger1Twitter', {
        templateUrl: './static/innerPages/twitterChannel/twitter_Trigger1.html',
        controller: 'trigger1TwitterController'

    });


   $routeProvider.when('/Trigger2Twitter', {
       templateUrl: './static/innerPages/twitterChannel/twitter_Trigger2.html',
       controller: 'trigger2TwitterController'

   });


   $routeProvider.when('/allTriggers', {
       templateUrl: './static/innerPages/triggers.html',
       controller: 'ifCreatorController'
   });

   $routeProvider.when('/allActions', {
       templateUrl: './static/innerPages/actions.html'
   });

   $routeProvider.when('/createRecipeAction', {
       templateUrl: './static/innerPages/createRecipeAction.html'
   });


    $routeProvider.when('/SuccessRepice', {
        templateUrl: './static/innerPages/success/SuccessRecipe.html',
        controller: 'SuccessController'
    });


    $routeProvider.when('/choseModify', {
        templateUrl: './static/innerPages/choseModify.html',
        controller: 'choseModifyController'
    });


    $routeProvider.when('/publicRecipes', {
        templateUrl: './static/innerPages/publishPage/PublicRecipes.html',
        controller: 'publicRecipesController'
    });
    
    $routeProvider.when('/passwordChange', {
        templateUrl: './static/innerPages/passwordChange.html',
        controller: 'passwordChangeController'
    });


    $routeProvider.otherwise({redirectTo: '/home'});
}]);

iftttApp.controller('indexController',  ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http) {


        if(consoleLogs) console.log("THE CONSOLE LOGS ARE ACTIVE!");
        
    var nextPath;

        /*
         * Queste due variabili indicano lo stato di connessione dell'utente ai servizi
         */
        $scope.iftttLogged = false;
        $scope.googleLogged = false;
        $scope.twitterLogged = false;
        $scope.userRecipes = [];  //X1
        $scope.recipedDescriptionInput = null;

      //METTO UN CONTROLLO PER SAPERE SE L'UTENTE E' AUTENTICATO
        $http({
      	  url: 'http://localhost:8080/progetto/api/prova',
      	  method: "POST",
      	  dataType: 'application/json', //<-- (cristiano): Questo indica il formato della risposta che l'ajax si attende
          contentType: "application/json" //<-- (cristiano): Questo indica il formato dei dati della richiesta che l'ajax invia
        }).then(function success(response) {
      	  if(consoleLogs) console.log(response);
      	  //if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));

            /* (cristiano): Risposta simulata, facendo finta che il server risponda positivamente all'autenticazione a Google
             *
             *  La forma finale dovrà essere del tipo:
             *
             *   $scope.googleLogged = response.data.googleAuthenticated;
             *
             */
            $scope.googleLogged = true; // (cristiano): questa è solo una simulazione!
            googleLogin=true;
            alert("L'autenticazione a Google viene impostata automaticamente di default a causa di una simulazione");



      	  if(response.data.authenticated.localeCompare("true")==0){
      		  $scope.iftttLogged = true;
      		  iftttLogin= true;
      		 
      	  }
      	  //if(consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
      	  $('#loginIFTTTModal').modal('hide');
      	  $("#notificationsWrapper").notify(
      			  "Server error, retry",
      			  {
      				  className: 'error',
      				  position: 'bottom right'
      			  }
      	  );
      	  $scope.iftttLogged = false;
      	  iftttLogin= false;
      	  if(consoleLogs) console.log($scope.iftttLogged);
        });  
          

        /*
         * Funzione che gestisce il click per gestire l'autenticazione a IFTTT Polito
         */
//        $scope.requestIFTTTAuth = function() {
//
//            var iftttCredentials = {
//                serviceRequested: "iftttpolito",
//                email: $('#inputEmailIFTTT').val(),
//                password: $('#inputPasswordIFTTT').val()
//            };
//            if(consoleLogs) console.log(JSON.stringify(iftttCredentials));
//            $('#serverSpinner').spin();
//            $http({
//                url: '/MyServlet',
//                method: "POST",
//                data: JSON.stringify(iftttCredentials),
//                dataType: 'application/json'
//                //headers: {'Content-Type': 'application/json'}
//            }).then(function success(response) {
//                if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));
//                if(response.data.authenticated.localeCompare("true")==0){
//                    $scope.iftttLogged = true;
//                    iftttLogin= true;
//                    //$scope.userRecipes = response.data.userRecipesJSON; //x1
//                    $('#loginIFTTTModal').modal('hide');
//                    $("#notificationsWrapper").notify(
//                        "Logged with IFTTT Polito",
//                        {
//                            className: 'success',
//                            position: 'bottom right'
//                        }
//                    );
//                    url = "#"+nextPath;
//                    window.location.replace(url);
//                } else {
//                    $('#serverSpinner').spin(false);
//                    $("#notificationsWrapper").notify(
//                        "Authentication in IFTTT Polito failed",
//                        {
//                            className: 'error',
//                            position: 'bottom right'
//                        }
//                    );
//                }
//                $('#serverSpinner').spin(false);
//                if(consoleLogs) console.log($scope.iftttLogged);
//            }, function error() {
//                $('#loginIFTTTModal').modal('hide');
//                $('#serverSpinner').spin(false);
//                $("#notificationsWrapper").notify(
//                    "Server error, retry",
//                    {
//                        className: 'error',
//                        position: 'bottom right'
//                    }
//                );
//                $scope.iftttLogged = false;
//                iftttLogin= false;
//                if(consoleLogs) console.log($scope.iftttLogged);
//            });
//
//        };

        /*
         * Funzione che gestisce il click per gestire la disconnessione da IFTTT Polito
         */
        $scope.logoutIFTTT = function () {
            var requestLogout = {
                requestLogout: 'iftttpolito'
            };

            $('#serverSpinner').spin();
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/logout',
                data: requestLogout
            }).then(function success(response) {
                if(consoleLogs) console.log(response.data.disconnected);
            //    if(response.data.disconnected.localeCompare("true")==0){
                    $scope.iftttLogged = false;
                    iftttLogin =  false;
                    $('#serverSpinner').spin(false);
                    $("#notificationsWrapper").notify(
                        "Logged out from IFTTT Polito",
                        {
                            className: 'warning',
                            position: 'bottom right'
                        }
                    );
                    window.location.replace('#');
          /*      } else {
                    $('#serverSpinner').spin(false);
                    $("#notificationsWrapper").notify(
                        "Some problem occurred, please retry",
                        {
                            className: 'error',
                            position: 'bottom right'
                        }
                    );
                }*/

                if(consoleLogs) console.log($scope.iftttLogged);
            }, function error() {
                $('#serverSpinner').spin(false);
                $('#loginIFTTTModal').modal('hide');
                $("#notificationsWrapper").notify(
                    "Disconnect to IFTTT Polito failed",
                    {
                        className: 'error',
                        position: 'bottom right'
                    }
                );
                if(consoleLogs) console.log($scope.iftttLogged);
            });

        };

        /*
         * Funzione che gestisce il click per gestire l'autenticazione a Google
         */
        $scope.requestGoogleAuth = function() {

            var googleCredentials = {
                serviceRequested: "google",
                email: $('#inputEmailGoogle').val(),
                password: $('#inputPasswordGoogle').val()
            };

            if(consoleLogs) console.log(JSON.stringify(googleCredentials));
            $('#serverSpinner').spin();
            $http({
                url: 'http://localhost:8080/progetto/api/connect/requestGoogle',
                method: "POST",
                data: JSON.stringify({"requestGoogleAuth":"true","urlNext":nextPath}),
                contentType: "application/json",
                dataType: 'application/json'
                //headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));
                $('#serverSpinner').spin(false);
                if(response.data.authenticated.localeCompare("true")==0){
                    $scope.googleLogged = true;
                    googleLogin = true;
                    $('#loginGoogleModal').modal('hide');
                    $("#notificationsWrapper").notify(
                        "Logged with Google",
                        {
                            className: 'success',
                            position: 'bottom right'
                        }
                    );
                    //FXR
                  var  url = "#"+nextPath;
                    if (modifyVar == 1)
                    {
                        url = "#" + rootingAutenticationTriggerAction; //<--------------------------------------------------------*
                    }
                    window.location.replace(url);
                    //end
                } else {
                    // Se non è connesso...
                    $('#loginGoogleModal').modal('hide');
                    // @server-side: mettere qui la url a Google O-Auth
                    url = "http://localhost:8080/progetto/api/connect/google.do";
                    window.location.replace(url);
                }
                if(consoleLogs) console.log($scope.googleLogged);
            }, function error() {
                $('#serverSpinner').spin(false);
                $('#loginGoogleModal').modal('hide');
                $("#notificationsWrapper").notify(
                    "Server error, retry",
                    {
                        className: 'error',
                        position: 'bottom right'
                    }
                );
                $scope.googleLogged = false;
                googleLogin=false;
                if(consoleLogs) console.log($scope.googleLogged);
            });

        };

        /*
         * Funzione che gestisce il click per gestire la disconnessione da Google
         */
        $scope.logoutGoogle = function () {
            var requestLogout = {
                requestLogoutGoogle: true
            };

            $('#serverSpinner').spin();
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/api/disconnectGoogle',
                data: requestLogout
            }).then(function success(response) {
                $('#serverSpinner').spin(false);
                if(consoleLogs) console.log("disconnected from Google response: "+response.data.disconnected);
                if(response.data.disconnected){
                    $scope.googleLogged = false;
                    googleLogin=false;
                    $("#notificationsWrapper").notify(
                        "Logged out from Google",
                        {
                            className: 'warning',
                            position: 'bottom right'
                        }
                    );
                } else {
                    $("#notificationsWrapper").notify(
                        "Some problem occurred, please retry",
                        {
                            className: 'error',
                            position: 'bottom right'
                        }
                    );
                }

                if(consoleLogs) console.log($scope.googleLogged);
            }, function error() {
                $('#serverSpinner').spin(false);
                $('#loginGoogleModal').modal('hide');
                $("#notificationsWrapper").notify(
                    "Disconnect to Google failed",
                    {
                        className: 'error',
                        position: 'bottom right'
                    }
                );
                if(consoleLogs) console.log($scope.googleLogged);
            });

        };

        /*
         * Funzione che gestisce il click per gestire l'autenticazione a Twitter
         */
        $scope.requestTwitterAuth = function() {

            var twitterCredentials = {
                serviceRequested: "twitter",
                email: $('#inputEmailTwitter').val(),
                password: $('#inputPasswordTwitter').val()
            };

            if(consoleLogs) console.log(JSON.stringify(twitterCredentials));
            $('#serverSpinner').spin();
            $http({
                url: '/MyServlet',
                method: "POST",
                data: JSON.stringify(twitterCredentials),
                dataType: 'application/json'
                //headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                $('#serverSpinner').spin(false);
                if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));
                if(response.data.authenticated.localeCompare("true")==0){
                    $scope.twitterLogged = true;
                    twitterLogin = true;
                    $('#loginTwitterModal').modal('hide');
                    $("#notificationsWrapper").notify(
                        "Logged with Twitter",
                        {
                            className: 'success',
                            position: 'bottom right'
                        }
                    );
                    //if(consoleLogs) console.log("#"+nextPath);
                    url = "#"+nextPath;
                    window.location.replace(url);
                } else {
                    $("#notificationsWrapper").notify(
                        "Authentication in Twitter failed",
                        {
                            className: 'error',
                            position: 'bottom right'
                        }
                    );
                }
                if(consoleLogs) console.log($scope.twitterLogged);
            }, function error() {
                $('#serverSpinner').spin(false);
                $('#loginTwitterModal').modal('hide');
                $("#notificationsWrapper").notify(
                    "Server error, retry",
                    {
                        className: 'error',
                        position: 'bottom right'
                    }
                );
                $scope.twitterLogged = false;
                twitterLogin = false;
                if(consoleLogs) console.log(""+$scope.twitterLogged);
            });

        };

        /*
         * Funzione che gestisce il click per gestire la disconnessione da Twitter
         */
        $scope.logoutTwitter = function () {
            var requestLogout = {
                requestLogout: 'twitter'
            };
            /*Non so di preciso dove mettere questa variabile che serve per "sicurizzare"
            le pagine di twitter ossia:
             if(twitterLogin == true) tu sei loggatto;
             if(twitterLogin == false) tu non sei loggato;
            */

            $('#serverSpinner').spin();
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/api/disconnectTwitter',
                data: requestLogout
            }).then(function success(response) {
                $('#serverSpinner').spin(false);
                if(consoleLogs) console.log(response.data.disconnected);
                if(response.data.disconnected.localeCompare("true")==0){
                    $scope.twitterLogged = false;
                    twitterLogin=false;
                    $("#notificationsWrapper").notify(
                        "Logged out from Twitter",
                        {
                            className: 'warning',
                            position: 'bottom right'
                        }
                    );
                } else {
                    $("#notificationsWrapper").notify(
                        "Some problem occurred, please retry",
                        {
                            className: 'error',
                            position: 'bottom right'
                        }
                    );
                }

                if(consoleLogs) console.log($scope.twitterLogged);
            }, function error() {
                $('#serverSpinner').spin(false);
                $('#loginTwitterModal').modal('hide');
                $("#notificationsWrapper").notify(
                    "Disconnect to Twitter failed",
                    {
                        className: 'error',
                        position: 'bottom right'
                    }
                );
                if(consoleLogs) console.log($scope.twitterLogged);
            });

        };

        /*
         * Funzione che gestisce il click per gestire il corretto routing delle pagine
         */
        $scope.routeListener = function (nextRoute) {
            nextPath = nextRoute;
            rootingAutenticationTriggerAction=nextRoute;
            //if(consoleLogs) console.log("routeListener(nextRoute): "+nextPath);
        };
        


      /*   Funzione deprecata non più usata */


        //  $scope.RequestRecipes = function ()
        $scope.loadRecipesAndSeeThem = function ()
        {

            //var luna = sendDataToServer;
            //$scope.userRecipes.push(luna);
            //alert("wwww");


           /*
            $http({
                method: 'GET',
                url: 'http://localhost:3000/userRecipes',
                data: JSON.stringify({value:"nothing"}),
                dataType: "application/json;charset=UTF-8"
            }).then(function success(response) {
                // Success code here
                if(consoleLogs) console.log(JSON.stringify(response));
                response.data.forEach(function (x) {
                    if(consoleLogs) console.log(JSON.stringify(x));
                    $scope.userRecipes.push(x);
                });


            }, function error(response) {
                // Error code here
                alert("error");
            });
            */


            //Get the recipes and print them


/*
            $http({
                method: 'GET',
                url: 'http://localhost:3000/userRecipes'
            }).then(
                function success(response)
            {
                // Success code here
                $scope.userRecipes = [];
                if(consoleLogs) console.log(JSON.stringify(response));
                $scope.userRecipes = [];
                //alert(JSON.stringify(response));


                var i = 0;
                response.data.forEach(function (x)
                {

                    //if(consoleLogs) console.log(JSON.stringify(x));
                    //if(consoleLogs) console.log("????"+JSON.stringify($scope.userRecipes));
                    $scope.userRecipes.push(x);
                    //if(consoleLogs) console.log("after"+JSON.stringify($scope.userRecipes));
                    //alert("WTF");
                    //Per ottenere la descrizione:
                    alert("-->" + JSON.stringify($scope.userRecipes));
                    //trigger[triggerType]
                    alert("-->" + JSON.stringify($scope.userRecipes[i]["trigger[triggerType]"]));

                    i++;
                });


            }, function error(response)
            {
                // Error code here
                alert("error");
            });
            */

            url = "#/index/myRecipes";
            window.location.replace(url);


            //Get from server the informations in order to print.

            /*
            $http
            (
                {
                    method: 'GET',
                    url: 'http://localhost:3000/userRecipes'
                }
            )
                .then
                (
                    function success(response)
                    {
                        alert("o.k. :)");
                        $scope.userRecipes=[];
                        // Success code here
                        //For debug
                        //if(consoleLogs) console.log(JSON.stringify(response));
                        //alert(JSON.stringify(response));

                        var i = 0;
                        var demp = [];
                        response.data.forEach
                        (
                            function (x)
                            {
                                //if(consoleLogs) console.log(JSON.stringify(x));
                                //if(consoleLogs) console.log("????"+JSON.stringify($scope.userRecipes));

                                //$scope.userRecipes.push(x);


                                demp.push(x);
                                //alert("--> " + JSON.stringify(userRecipes[i]["trigger[triggerType]"]));
                                var d1 =
                                {
                                    "triggerType" :  demp[i]["trigger[triggerType]"],
                                    "desc" : demp[i].desc
                                };
                                $scope.userRecipes.push(d1);
                                //alert( $scope.userRecipes[0].triggerType);


                                //if(consoleLogs) console.log("after"+JSON.stringify($scope.userRecipes));
                                //alert("WTF");
                                //Per ottenere la descrizione:
                                //alert("-->" + JSON.stringify($scope.userRecipes));
                                //trigger[triggerType]
                                //alert("-->" + JSON.stringify($scope.userRecipes[i]["trigger[triggerType]"]));
                                i++;
                            }
                        );
                        //Cambia pagina
                        url = "#/index/myRecipes";
                        window.location.replace(url);

                    },
                    function error(response)
                    {
                        // Error code here
                        alert("error");
                    }
                );

            //alert("---" + $scope.userRecipes[0].triggerType);


            */

        };


        $scope.saveRecipeDescription = function () {
            //Prende la descrizione della ricetta


            //Variabile per prendere la descrizione dell'user --> recipedDescriptionInput
            if (angular.isDefined($scope.recipedDescriptionInput)) {
                if (angular.isDefined($scope.recipedDescriptionInput)) {
                    descriptionRecipeGlobal = $scope.recipedDescriptionInput;
                }
                else {
                    //Questo task non ha alcuna descrizione
                    descriptionRecipeGlobal = "This task has not a description";
                }
            }
            else {
                descriptionRecipeGlobal = "This task has not a description";
            }
            if ($scope.recipedDescriptionInput == null)  descriptionRecipeGlobal = "This task has not a description";
            else if ($scope.recipedDescriptionInput == "")  descriptionRecipeGlobal = "This task has not a description";


            //Mando i dati al server con i due modulini + la descrizione.
            if(modifyVar == true)
            {
                sendingToServerAllput();
            }
            else
                sendingToServerAll();
        };

            // $('#recipedDescriptionModal').modal('hide');


            /*

            if(consoleLogs) console.log("inserted the following description: "+$scope.recipedDescriptionInput);
            // Salvare la descrizione nella varaibile globale e nella ricetta in questione
            // Invio della descrizione al server con una UPDATE
            $http({
                method: 'UPDATE',
                url: '/Recipes',
                data: JSON.stringify({"desc":$scope.recipedDescriptionInput}),
                dataType: "application/json"
            }).then(function success(response) {
                // Success code here
                alert(JSON.stringify(response));
                response.data.forEach(function (x) {
                    if(consoleLogs) console.log(JSON.stringify(x));
                });


            }, function error(response) {
                // Error code here
                alert("error to update description");
            });
            $('#recipedDescriptionModal').modal('hide');
        };*/

        /*
        $scope.removeRecipe = function(index){
            if(consoleLogs) console.log("REMOVING: "+index);
            alert(JSON.stringify("id",$scope.userRecipes[index].id));


            $http.delete("http://localhost:3000/userRecipes", JSON.stringify("id",$scope.userRecipes[index].id))
                .then(function success(response){
                        $scope.userRecipes.splice(index, 1);
                        if(consoleLogs) console.log("recipe deleted successfully from the server and local machine");
                    },
                    function failure(response){
                        if(consoleLogs) console.log("some problem occurred, recipes was not deleted");
                    }
                );

            // MANCA DA FARE LA DELETE ALLA SERVLET
        };
*/


    }]);
iftttApp.controller('SuccessController',  ['$scope', '$routeParams',
    function () {

        if(modifyVar == 1)
        {


        }
        else
        {
            if (flagTriggerDone == true) {
                //alert("Warning you must compile before the action form");
                alertVariable = "Warning you must compile before the action form";
                alertFunction();
                var url = "#createRecipeAction";
                window.location.replace(url);
            }
            if (count == 7) count = 0;
            else {
                url = "#createDO";
                window.location.replace(url);
            }
        }

    }]);


iftttApp.controller('homeController',  ['$scope', '$routeParams',
    function ($scope) {

        $scope.loadHome = function()
        {
            if(consoleLogs) console.log("homeController: loaded");
        }

    }]);

iftttApp.controller('createRecipeController',  ['$scope', '$routeParams',
    function ($scope) {
        modifyVar=0;
        $scope.loadHome = function()
        {
            if(consoleLogs) console.log("createRecipeController: loaded");
        }

    }]);




iftttApp.controller('ifCreatorController',  ['$scope', '$routeParams', '$window',
    function ($scope, $rootscope, $window)
    {

        $scope.NGgoogleLogged = false;
        $scope.modifyButton =false;

        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }



    // A
        $scope.$watch(
            function () {
                //if(consoleLogs) console.log("angular: "+$window.googleLogged);
                return $window.googleLogged
            }, function(n){
               // if(consoleLogs) console.log("changed ",n);
            },
            true
        );

    // B

    }]);

iftttApp.controller('doCreatorController',  ['$scope',
    function ($scope) {

        $scope.modifyButton =false;

        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }


        $scope.loadHome = function()
        {
            if(consoleLogs) console.log("createRecipeController: loaded");
        }

    }]);

iftttApp.controller('doCreatorController',  ['$scope', '$routeParams',
    function ($scope, $rootscope, $routeParams, $http, $resource) {


    }]);



    iftttApp.controller('myRecipesController',  ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http)
    {
    	
    	//METTO UN CONTROLLO PER SAPERE SE L'UTENTE E' AUTENTICATO
        $http({
      	  url: 'http://localhost:8080/progetto/api/prova',
      	  method: "POST",
      	  dataType: 'application/json'
        }).then(function success(response) {
      	  if(consoleLogs) console.log(response);
      	  if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));
      	  if(response.data.authenticated.localeCompare("true")==0){
      		  $scope.iftttLogged = true;
      		  iftttLogin= true;
      	  } 
      	  if(consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
      	  $scope.iftttLogged = false;
      	  iftttLogin= false;
      	  if(consoleLogs) console.log($scope.iftttLogged);
        });  
    	
        $scope.userRecipes = null;
        modifyVar=0;

        /*
        $scope.elements = [{
            name: 'one',
            isCollapsed: true
        }, {
            name: 'two',
            isCollapsed: true
        }, {
            name: 'three',
            isCollapsed: true
        }];

        */
        $scope.elements = [];

        
        $http
        (
            {
                method: 'GET',
                url: 'http://localhost:8080/progetto/api/userRecipes'
            }
        )
            .then
            (
                function success(response)
                {
                    $scope.userRecipes = response.data;

                    var tmp = 0;
                    $scope.userRecipes.forEach(function (element) {
                        element.index = tmp;
                        tmp++;
                    });

                    /* * * **************/

                    var index = 0;
                    $scope.userRecipes.forEach(function () {

                        descriptionRecipeGlobal = $scope.userRecipes[index].description;
                        idRecipe = $scope.userRecipes[index].id;
                        triggreGlobalVariable = $scope.userRecipes[index].trigger.triggerType;
                        actionGlobalVariable = $scope.userRecipes[index].action.actionType;
                        publishRecipeGlobal = $scope.userRecipes[index].publish;





                    //alert("MODIFY RECIPE:\n\n\n"+descriptionRecipeGlobal+"\n\n"+idRecipe+"\n\n"+triggreGlobalVariable+"\n\n"+actionGlobalVariable+"\n\n"+publishRecipeGlobal+"\n\n"+"\n\n"+"\n\n");

                    /*
                     urlActionGlobalVariable = "";
                     ulrTriggreGlobalVariable = "";

                     */

                    if(triggreGlobalVariable == "gmail")
                    {
                        sender_GmailTriggerController = $scope.userRecipes[index].trigger.sender;
                        subject_GmailTriggerController = $scope.userRecipes[index].trigger.subject;
                        ulrTriggreGlobalVariable= "gMailTrigger";

                        modulinoj1 =
                        {
                            "Action type": "gmail",
                            //Tn 1
                            "Sender": sender_GmailTriggerController,
                            "Subject": subject_GmailTriggerController
                        };

                    }
                    else
                    {

                        if(triggreGlobalVariable == "calendar")
                        {
                            if (0 == $scope.userRecipes[index].trigger.eventAction)
                            {
                                title_Trigger1GcalendarController = $scope.userRecipes[index].trigger.title;
                                description_Trigger1GcalendarController = $scope.userRecipes[index].trigger.description;
                                place_Trigger1GcalendarController = $scope.userRecipes[index].trigger.location;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                                ulrTriggreGlobalVariable = "Trigger1Gcalendar";

                                modulinoj1 =
                                {
                                    "Action type": "calendar",


                                    //Tn 2 S0
                                    "Title": title_Trigger1GcalendarController,
                                    "Description": description_Trigger1GcalendarController,
                                    "Location": place_Trigger1GcalendarController
                                };


                            }
                            else
                            {
                                title_Trigger2GcalendarController = $scope.userRecipes[index].trigger.title;
                                description_Trigger2GcalendarController = $scope.userRecipes[index].trigger.subject;
                                place_Trigger2GcalendarController =$scope.userRecipes[index].trigger.location;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                                ulrTriggreGlobalVariable = "Trigger2Gcalendar";

                                modulinoj1 =
                                {
                                    "Trigger type": "calendar",

                                    //Tn 3
                                    "Title": title_Trigger2GcalendarController,
                                    "Description": description_Trigger2GcalendarController,
                                    "Location": place_Trigger2GcalendarController
                                };


                            }

                        }
                        else
                        {
                            if (triggreGlobalVariable == "weather") {

                                if ($scope.userRecipes[index].trigger.type == 1)
                                {
                                    idCity_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.location;
                                    timezone_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.ora;
                                    ora_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.timezone;
                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                    ulrTriggreGlobalVariable = "WeatherTrigger1";

                                    modulinoj1=
                                    {
                                        "Trigger type" : "weather",

                                        "location" : idCity_customWeatherActionControllerTrigger1,
                                        "ora"  : ora_customWeatherActionControllerTrigger1,
                                        "timezone" : timezone_customWeatherActionControllerTrigger1
                                    };


                                }
                                else {
                                    if ($scope.userRecipes[index].trigger.type == 2)
                                    {

                                        idCity_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.location;
                                        pweather_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.tempo;
                                        pperiod_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.period;
                                        pzone_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.timezone;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "WeatherTrigger2";

                                        modulinoj1=
                                        {
                                            "triggerType" : "weather",
                                            "type" : "2",
                                            "location":   idCity_customWeatherActionControllerTrigger2,
                                            "tempo" : pweather_customWeatherActionControllerTrigger2,
                                            "period" : pperiod_customWeatherActionControllerTrigger2,
                                            "timezone" : pzone_customWeatherActionControllerTrigger2
                                        };


                                    }
                                    else
                                    {
                                        if ($scope.userRecipes[index].trigger.type == 3)
                                        {
                                            idCity_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.location;
                                            timezone_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.timezone;
                                            sunset_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunset;
                                            sunrise_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunrise;
                                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                            ulrTriggreGlobalVariable = "WeatherTrigger3";
                                            modulinoj1 =
                                            {
                                                "triggerType": "weather",
                                                "type": "3",
                                                "location": idCity_customWeatherActionControllerTrigger3,
                                                "timezone": timezone_customWeatherActionControllerTrigger3,
                                                "sunset": sunset_customWeatherActionControllerTrigger3,
                                                "sunrise": sunrise_customWeatherActionControllerTrigger3


                                            };
                                        }
                                        else
                                        {
                                            if ($scope.userRecipes[index].trigger.type == 4)
                                            {
                                                idCity_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.location;
                                                ptimezone_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.timezone;
                                                pthmax_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmax;
                                                pthmin_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmin;
                                                period_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.period;
                                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                                ulrTriggreGlobalVariable = "WeatherTrigger4";
                                                modulinoj1 =
                                                {
                                                    "triggerType": "weather",
                                                    "type": "4",
                                                    "location": idCity_customWeatherActionControllerTrigger4,
                                                    "timezone": ptimezone_customWeatherActionControllerTrigger4,
                                                    "thmax": pthmax_customWeatherActionControllerTrigger4,
                                                    "thmin": pthmin_customWeatherActionControllerTrigger4,
                                                    "period" : period_customWeatherActionControllerTrigger4
                                                };
                                            }
                                        }

                                    }

                                }

                            }
                            else
                            {
                                if (triggreGlobalVariable == "twitter")
                                {

                                    if ($scope.userRecipes[index].trigger.type == 0)
                                    {
                                        hashtag_text_trigger1TwitterController =    $scope.userRecipes[index].trigger.hashtag_text;
                                        username_sender_trigger1TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "Trigger1Twitter";

                                        modulinoj1 =
                                        {
                                            "triggerType" : "twitter",
                                            "type"      :  false,
                                            "hashtag_text"  : hashtag_text_trigger1TwitterController,
                                            "username_sender" : username_sender_trigger1TwitterController
                                        };

                                    }
                                    else
                                    {
                                        hashtag_text_trigger2TwitterController = $scope.userRecipes[index].trigger.hashtag_text;
                                        username_sender_trigger2TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "Trigger2Twitter";

                                        modulinoj1 =
                                        {
                                            "triggerType" : "twitter",
                                            "type"      :  true,
                                            "hashtag_text"  : hashtag_text_trigger2TwitterController,
                                            "username_sender" : username_sender_trigger2TwitterController
                                        };
                                    }

                                }

                            }
                        }
                    }

                    if(actionGlobalVariable == "calendar")
                    {
                        title_action1GcalendarController = $scope.userRecipes[index].trigger.title;
                        subjectReceive_action1GcalendarController =  $scope.userRecipes[index].trigger.description;
                        place_action1GcalendarController =  $scope.userRecipes[index].trigger.place;
                        yearVector_action1GcalendarController =  $scope.userRecipes[index].trigger.dayVector;
                        monthVector_action1GcalendarController =  $scope.userRecipes[index].trigger.monthVector;
                        dayVector_action1GcalendarController = $scope.userRecipes[index].trigger.yearVector;
                        urlActionGlobalVariable = "action1Gcalendar";

                        modulinoj2 =
                        {
                            "actionType": "calendar",
                            //An 2
                            "title": title_action1GcalendarController,
                            "description": subjectReceive_action1GcalendarController,
                            "location": place_action1GcalendarController,
                            "dayVector": yearVector_action1GcalendarController,
                            "monthVector": monthVector_action1GcalendarController,
                            "yearVector": dayVector_action1GcalendarController

                        };

                    }
                    else
                    {
                        if(actionGlobalVariable == "gmail")
                        {
                            body_GmailActionController = $scope.userRecipes[index].trigger.body;
                            receiver_GmailActionController = $scope.userRecipes[index].trigger.receiver;
                            sender_GmailActionController = $scope.userRecipes[index].trigger.sender;
                            subject_GmailActionController =  $scope.userRecipes[index].trigger.subject;
                            urlActionGlobalVariable = "gMailAction";

                            modulinoj2=
                            {
                                "actionType" : "gmail",
                                "body" : body_GmailActionController,
                                "receiver" : receiver_GmailActionController,
                                "sender" : sender_GmailActionController,
                                "subject" : subject_GmailActionController
                            };


                        }
                        else
                        {
                            if(actionGlobalVariable == "twitter")
                            {
                                subject_action1TwitterController = $scope.userRecipes[index].trigger.body;
                                subActionGlobalVariable = false;
                                urlActionGlobalVariable = "Action1Twitter";

                                modulinoj2 =
                                {
                                    "actionType" : "twitter",
                                    "type"      :  false,
                                    "body"      :  subject_action1TwitterController,
                                    "destination" :  null

                                };

                            }
                            else
                            {
                                title_action2TwitterController = $scope.userRecipes[index].trigger.destination;
                                subjec_action2TwitterController = $scope.userRecipes[index].trigger.body;
                                subActionGlobalVariable = true;
                                urlActionGlobalVariable = "Action2Twitter";

                                modulinoj2 =
                                {
                                    "actionType" : "twitter",
                                    "type"      :  true,
                                    "destination"   :  title_action2TwitterController,
                                    "body" :  subjec_action2TwitterController

                                };

                            }


                        }

                    }
                        var dempJson =
                    {
                        "action" :   modulinoj2,
                        "trigger" : modulinoj1,
                        "index" : index,
                        "description" : descriptionRecipeGlobal,
                        "id"  :idRecipe,
                        "publish" : publishRecipeGlobal,
                        isCollapsed: true

                    };
                        $scope.elements.push(dempJson);
                        index++;
                    });

/*  *************/














                },
                function error(response) {
                    // Error code here
                    alert("error");
                }
            );


        $scope.removeRecipe = function(index, id)
        {
            $http
            (
                {
                    method: 'delete',
                    url: 'http://localhost:3000/userRecipes/' + id
                }
            ).error(function () {
                    // Error code here
                    alert("error");
                })
                .success(function () {
                    alert("o.k.");
                    $scope.userRecipes.splice(index, 1)


                });
        };
            $scope.shareRecipe = function(index, id)
            {

                //alert(true);
                var flagDataSend = $scope.userRecipes[index];
                flagDataSend.publish = true;
                //$scope.userRecipes[index].publish = true;
                //alert($scope.userRecipes[index].publish);
                $('#serverSpinner').spin();
                $http
                (
                    {
                        method: "put",
                        url: "http://localhost:3000/userRecipes/" + id,
                        data: flagDataSend,
                        contentType: "application/json"
                    }
                ).error(function()
                    {
                        $('#serverSpinner').spin(false);
                        // Error code here
                        alert("error");
                    })
                    .success(function ()
                    {
                        $('#serverSpinner').spin(false);
                        $scope.userRecipes[index].publish = true;
                        alert("o.k. true");
                    }
                );

            };

            //Rosso don't share
            $scope.DoNotshareRecipe = function(index, id)
            {

                //alert("2");
               var flagDataSend = $scope.userRecipes[index];
                flagDataSend.publish = false;
                //$scope.userRecipes[index].publish = false;
                //alert($scope.userRecipes[index].publish);
                $('#serverSpinner').spin();
                $http
                (
                    {
                        method: "put",
                        url: "http://localhost:3000/userRecipes/" + id,
                        data: flagDataSend,
                        contentType: "application/json"
                    }

                ).error(function()
                {
                    $('#serverSpinner').spin(false);
                    // Error code here
                    alert("error");
                })
                    .success(function ()
                    {
                        $('#serverSpinner').spin(false);
                        $scope.userRecipes[index].publish = false;
                        alert("o.k. false");
                    });

            };

        //Salva i valori del vettore dentro alle variabili globali.
        $scope.modifyRecipe = function(index)
        {
            var data = $scope.userRecipes[index];


            descriptionRecipeGlobal = $scope.userRecipes[index].description;
            idRecipe = $scope.userRecipes[index].id;
            triggreGlobalVariable = $scope.userRecipes[index].trigger.triggerType;
            actionGlobalVariable = $scope.userRecipes[index].action.actionType;
            publishRecipeGlobal = $scope.userRecipes[index].publish;


            //alert("MODIFY RECIPE:\n\n\n"+descriptionRecipeGlobal+"\n\n"+idRecipe+"\n\n"+triggreGlobalVariable+"\n\n"+actionGlobalVariable+"\n\n"+publishRecipeGlobal+"\n\n"+"\n\n"+"\n\n");

            /*
            urlActionGlobalVariable = "";
            ulrTriggreGlobalVariable = "";

             */

            if(triggreGlobalVariable == "gmail")
            {
                sender_GmailTriggerController = $scope.userRecipes[index].trigger.sender;
                subject_GmailTriggerController = $scope.userRecipes[index].trigger.subject;
                ulrTriggreGlobalVariable= "gMailTrigger";

                modulinoj1 =
                {
                    "triggerType": "gmail",
                    //Tn 1
                    "sender": sender_GmailTriggerController,
                    "subject": subject_GmailTriggerController
                };

            }
            else
            {

                if(triggreGlobalVariable == "calendar")
                {
                    if (0 == $scope.userRecipes[index].trigger.eventAction)
                    {
                        title_Trigger1GcalendarController = $scope.userRecipes[index].trigger.title;
                        description_Trigger1GcalendarController = $scope.userRecipes[index].trigger.description;
                        place_Trigger1GcalendarController = $scope.userRecipes[index].trigger.location;
                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                        ulrTriggreGlobalVariable = "Trigger1Gcalendar";

                        modulinoj1 =
                        {
                            "triggerType": "calendar",
                            "eventAction": false,

                            //Tn 2 S0
                            "title": title_Trigger1GcalendarController,
                            "description": description_Trigger1GcalendarController,
                            "location": place_Trigger1GcalendarController
                        };


                    }
                    else
                    {
                        title_Trigger2GcalendarController = $scope.userRecipes[index].trigger.title;
                        description_Trigger2GcalendarController = $scope.userRecipes[index].trigger.subject;
                        place_Trigger2GcalendarController =$scope.userRecipes[index].trigger.location;
                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                        ulrTriggreGlobalVariable = "Trigger2Gcalendar";

                        modulinoj1 =
                        {
                            "triggerType": "calendar",
                            "eventAction": true,
                            //Tn 3
                            "title": title_Trigger2GcalendarController,
                            "description": description_Trigger2GcalendarController,
                            "location": place_Trigger2GcalendarController
                        };


                    }

                }
                else
                {
                    if (triggreGlobalVariable == "weather") {

                        if ($scope.userRecipes[index].trigger.type == 1)
                        {
                            idCity_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.location;
                            timezone_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.ora;
                            ora_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.timezone;
                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                            ulrTriggreGlobalVariable = "WeatherTrigger1";

                            modulinoj1=
                            {
                                "triggerType" : "weather",
                                "type" : true,
                                "location" : idCity_customWeatherActionControllerTrigger1,
                                "ora"  : ora_customWeatherActionControllerTrigger1,
                                "timezone" : timezone_customWeatherActionControllerTrigger1
                            };


                        }
                        else {
                            if ($scope.userRecipes[index].trigger.type == 2)
                            {

                                idCity_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.location;
                                pweather_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.tempo;
                                pperiod_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.period;
                                pzone_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.timezone;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "WeatherTrigger2";

                                modulinoj1=
                                {
                                    "triggerType" : "weather",
                                    "type" : "2",
                                    "location":   idCity_customWeatherActionControllerTrigger2,
                                    "tempo" : pweather_customWeatherActionControllerTrigger2,
                                    "period" : pperiod_customWeatherActionControllerTrigger2,
                                    "timezone" : pzone_customWeatherActionControllerTrigger2
                                };


                            }
                            else
                            {
                                if ($scope.userRecipes[index].trigger.type == 3)
                                {
                                    idCity_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.location;
                                    timezone_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.timezone;
                                    sunset_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunset;
                                    sunrise_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunrise;
                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                    ulrTriggreGlobalVariable = "WeatherTrigger3";
                                    modulinoj1 =
                                    {
                                        "triggerType": "weather",
                                        "type": "3",
                                        "location": idCity_customWeatherActionControllerTrigger3,
                                        "timezone": timezone_customWeatherActionControllerTrigger3,
                                        "sunset": sunset_customWeatherActionControllerTrigger3,
                                        "sunrise": sunrise_customWeatherActionControllerTrigger3


                                    };
                                }
                                else
                                {
                                    if ($scope.userRecipes[index].trigger.type == 4)
                                    {
                                        idCity_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.location;
                                        ptimezone_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.timezone;
                                        pthmax_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmax;
                                        pthmin_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmin;
                                        period_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.period;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "WeatherTrigger4";
                                        modulinoj1 =
                                        {
                                            "triggerType": "weather",
                                            "type": "4",
                                            "location": idCity_customWeatherActionControllerTrigger4,
                                            "timezone": ptimezone_customWeatherActionControllerTrigger4,
                                            "thmax": pthmax_customWeatherActionControllerTrigger4,
                                            "thmin": pthmin_customWeatherActionControllerTrigger4,
                                            "period" : period_customWeatherActionControllerTrigger4
                                        };
                                    }
                                }

                            }

                        }

                    }
                    else
                    {
                        if (triggreGlobalVariable == "twitter")
                        {

                            if ($scope.userRecipes[index].trigger.type == 0)
                            {
                                hashtag_text_trigger1TwitterController =    $scope.userRecipes[index].trigger.hashtag_text;
                                username_sender_trigger1TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "Trigger1Twitter";

                                modulinoj1 =
                                {
                                    "triggerType" : "twitter",
                                    "type"      :  false,
                                    "hashtag_text"  : hashtag_text_trigger1TwitterController,
                                    "username_sender" : username_sender_trigger1TwitterController
                                };

                            }
                            else
                            {
                                hashtag_text_trigger2TwitterController = $scope.userRecipes[index].trigger.hashtag_text;
                                username_sender_trigger2TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "Trigger2Twitter";

                                modulinoj1 =
                                {
                                    "triggerType" : "twitter",
                                    "type"      :  true,
                                    "hashtag_text"  : hashtag_text_trigger2TwitterController,
                                    "username_sender" : username_sender_trigger2TwitterController
                                };
                            }

                        }

                    }
                }
            }

            if(actionGlobalVariable == "calendar")
            {
                title_action1GcalendarController = $scope.userRecipes[index].trigger.title;
                subjectReceive_action1GcalendarController =  $scope.userRecipes[index].trigger.description;
                place_action1GcalendarController =  $scope.userRecipes[index].trigger.place;
                yearVector_action1GcalendarController =  $scope.userRecipes[index].trigger.dayVector;
                monthVector_action1GcalendarController =  $scope.userRecipes[index].trigger.monthVector;
                dayVector_action1GcalendarController = $scope.userRecipes[index].trigger.yearVector;
                urlActionGlobalVariable = "action1Gcalendar";

                modulinoj2 =
                {
                    "actionType": "calendar",
                    //An 2
                    "title": title_action1GcalendarController,
                    "description": subjectReceive_action1GcalendarController,
                    "location": place_action1GcalendarController,
                    "dayVector": yearVector_action1GcalendarController,
                    "monthVector": monthVector_action1GcalendarController,
                    "yearVector": dayVector_action1GcalendarController

                };

            }
            else
            {
                if(actionGlobalVariable == "gmail")
                {
                    body_GmailActionController = $scope.userRecipes[index].trigger.body;
                    receiver_GmailActionController = $scope.userRecipes[index].trigger.receiver;
                    sender_GmailActionController = $scope.userRecipes[index].trigger.sender;
                    subject_GmailActionController =  $scope.userRecipes[index].trigger.subject;
                    urlActionGlobalVariable = "gMailAction";

                    modulinoj2=
                    {
                        "actionType" : "gmail",
                        "body" : body_GmailActionController,
                        "receiver" : receiver_GmailActionController,
                        "sender" : sender_GmailActionController,
                        "subject" : subject_GmailActionController
                    };


                }
                else
                {
                    if(actionGlobalVariable == "twitter")
                    {
                        subject_action1TwitterController = $scope.userRecipes[index].trigger.body;
                        subActionGlobalVariable = false;
                        urlActionGlobalVariable = "Action1Twitter";

                        modulinoj2 =
                        {
                            "actionType" : "twitter",
                            "type"      :  false,
                            "body"      :  subject_action1TwitterController,
                            "destination" :  null

                        };

                    }
                    else
                    {
                        title_action2TwitterController = $scope.userRecipes[index].trigger.destination;
                        subjec_action2TwitterController = $scope.userRecipes[index].trigger.body;
                        subActionGlobalVariable = true;
                        urlActionGlobalVariable = "Action2Twitter";

                        modulinoj2 =
                        {
                            "actionType" : "twitter",
                            "type"      :  true,
                            "destination"   :  title_action2TwitterController,
                            "body" :  subjec_action2TwitterController

                        };

                    }


                }

            }




            modifyVar=1;
            var url = "#choseModify";
            window.location.replace(url);

        };


}]);


iftttApp.controller('publicRecipesController',  ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http)
    {

        //METTO UN CONTROLLO PER SAPERE SE L'UTENTE E' AUTENTICATO
        $http({
            url: 'http://localhost:8080/progetto/api/prova', //[renna] da cambiare la url per il server
            method: "POST",
            dataType: 'application/json'
        }).then(function success(response) {
            if(consoleLogs) console.log(response);
            if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));
            if(response.data.authenticated.localeCompare("true")==0){
                $scope.iftttLogged = true;
                iftttLogin= true;
            }
            if(consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
            $scope.iftttLogged = false;
            iftttLogin= false;
            if(consoleLogs) console.log($scope.iftttLogged);
        });

        $scope.userRecipes = null;
        modifyVar=0;

        /*
         $scope.elements = [{
         name: 'one',
         isCollapsed: true
         }, {
         name: 'two',
         isCollapsed: true
         }, {
         name: 'three',
         isCollapsed: true
         }];

         */
        $scope.elements = [];


        $http
        (
            {
                method: 'GET',
                url: 'http://localhost:8080/progetto/api/userRecipes'
            }
        )
            .then
            (
                function success(response)
                {
                    $scope.userRecipes = response.data;

                    var tmp = 0;
                    $scope.userRecipes.forEach(function (element) {
                        element.index = tmp;
                        tmp++;
                    });

                    /* * * **************/

                    var index = 0;
                    $scope.userRecipes.forEach(function () {

                        descriptionRecipeGlobal = $scope.userRecipes[index].description;
                        idRecipe = $scope.userRecipes[index].id;
                        triggreGlobalVariable = $scope.userRecipes[index].trigger.triggerType;
                        actionGlobalVariable = $scope.userRecipes[index].action.actionType;
                        publishRecipeGlobal = $scope.userRecipes[index].publish;





                        //alert("MODIFY RECIPE:\n\n\n"+descriptionRecipeGlobal+"\n\n"+idRecipe+"\n\n"+triggreGlobalVariable+"\n\n"+actionGlobalVariable+"\n\n"+publishRecipeGlobal+"\n\n"+"\n\n"+"\n\n");

                        /*
                         urlActionGlobalVariable = "";
                         ulrTriggreGlobalVariable = "";

                         */

                        if(triggreGlobalVariable == "gmail")
                        {
                            sender_GmailTriggerController = $scope.userRecipes[index].trigger.sender;
                            subject_GmailTriggerController = $scope.userRecipes[index].trigger.subject;
                            ulrTriggreGlobalVariable= "gMailTrigger";

                            modulinoj1 =
                            {
                                "Action type": "gmail",
                                //Tn 1
                                "Sender": sender_GmailTriggerController,
                                "Subject": subject_GmailTriggerController
                            };

                        }
                        else
                        {

                            if(triggreGlobalVariable == "calendar")
                            {
                                if (0 == $scope.userRecipes[index].trigger.eventAction)
                                {
                                    title_Trigger1GcalendarController = $scope.userRecipes[index].trigger.title;
                                    description_Trigger1GcalendarController = $scope.userRecipes[index].trigger.description;
                                    place_Trigger1GcalendarController = $scope.userRecipes[index].trigger.location;
                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                                    ulrTriggreGlobalVariable = "Trigger1Gcalendar";

                                    modulinoj1 =
                                    {
                                        "Action type": "calendar",


                                        //Tn 2 S0
                                        "Title": title_Trigger1GcalendarController,
                                        "Description": description_Trigger1GcalendarController,
                                        "Location": place_Trigger1GcalendarController
                                    };


                                }
                                else
                                {
                                    title_Trigger2GcalendarController = $scope.userRecipes[index].trigger.title;
                                    description_Trigger2GcalendarController = $scope.userRecipes[index].trigger.subject;
                                    place_Trigger2GcalendarController =$scope.userRecipes[index].trigger.location;
                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                                    ulrTriggreGlobalVariable = "Trigger2Gcalendar";

                                    modulinoj1 =
                                    {
                                        "Trigger type": "calendar",

                                        //Tn 3
                                        "Title": title_Trigger2GcalendarController,
                                        "Description": description_Trigger2GcalendarController,
                                        "Location": place_Trigger2GcalendarController
                                    };


                                }

                            }
                            else
                            {
                                if (triggreGlobalVariable == "weather") {

                                    if ($scope.userRecipes[index].trigger.type == 1)
                                    {
                                        idCity_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.location;
                                        timezone_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.ora;
                                        ora_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.timezone;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "WeatherTrigger1";

                                        modulinoj1=
                                        {
                                            "Trigger type" : "weather",

                                            "location" : idCity_customWeatherActionControllerTrigger1,
                                            "ora"  : ora_customWeatherActionControllerTrigger1,
                                            "timezone" : timezone_customWeatherActionControllerTrigger1
                                        };


                                    }
                                    else {
                                        if ($scope.userRecipes[index].trigger.type == 2)
                                        {

                                            idCity_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.location;
                                            pweather_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.tempo;
                                            pperiod_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.period;
                                            pzone_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.timezone;
                                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                            ulrTriggreGlobalVariable = "WeatherTrigger2";

                                            modulinoj1=
                                            {
                                                "triggerType" : "weather",
                                                "type" : "2",
                                                "location":   idCity_customWeatherActionControllerTrigger2,
                                                "tempo" : pweather_customWeatherActionControllerTrigger2,
                                                "period" : pperiod_customWeatherActionControllerTrigger2,
                                                "timezone" : pzone_customWeatherActionControllerTrigger2
                                            };


                                        }
                                        else
                                        {
                                            if ($scope.userRecipes[index].trigger.type == 3)
                                            {
                                                idCity_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.location;
                                                timezone_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.timezone;
                                                sunset_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunset;
                                                sunrise_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunrise;
                                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                                ulrTriggreGlobalVariable = "WeatherTrigger3";
                                                modulinoj1 =
                                                {
                                                    "triggerType": "weather",
                                                    "type": "3",
                                                    "location": idCity_customWeatherActionControllerTrigger3,
                                                    "timezone": timezone_customWeatherActionControllerTrigger3,
                                                    "sunset": sunset_customWeatherActionControllerTrigger3,
                                                    "sunrise": sunrise_customWeatherActionControllerTrigger3


                                                };
                                            }
                                            else
                                            {
                                                if ($scope.userRecipes[index].trigger.type == 4)
                                                {
                                                    idCity_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.location;
                                                    ptimezone_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.timezone;
                                                    pthmax_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmax;
                                                    pthmin_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmin;
                                                    period_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.period;
                                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                                    ulrTriggreGlobalVariable = "WeatherTrigger4";
                                                    modulinoj1 =
                                                    {
                                                        "triggerType": "weather",
                                                        "type": "4",
                                                        "location": idCity_customWeatherActionControllerTrigger4,
                                                        "timezone": ptimezone_customWeatherActionControllerTrigger4,
                                                        "thmax": pthmax_customWeatherActionControllerTrigger4,
                                                        "thmin": pthmin_customWeatherActionControllerTrigger4,
                                                        "period" : period_customWeatherActionControllerTrigger4
                                                    };
                                                }
                                            }

                                        }

                                    }

                                }
                                else
                                {
                                    if (triggreGlobalVariable == "twitter")
                                    {

                                        if ($scope.userRecipes[index].trigger.type == 0)
                                        {
                                            hashtag_text_trigger1TwitterController =    $scope.userRecipes[index].trigger.hashtag_text;
                                            username_sender_trigger1TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                            ulrTriggreGlobalVariable = "Trigger1Twitter";

                                            modulinoj1 =
                                            {
                                                "triggerType" : "twitter",
                                                "type"      :  false,
                                                "hashtag_text"  : hashtag_text_trigger1TwitterController,
                                                "username_sender" : username_sender_trigger1TwitterController
                                            };

                                        }
                                        else
                                        {
                                            hashtag_text_trigger2TwitterController = $scope.userRecipes[index].trigger.hashtag_text;
                                            username_sender_trigger2TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                            ulrTriggreGlobalVariable = "Trigger2Twitter";

                                            modulinoj1 =
                                            {
                                                "triggerType" : "twitter",
                                                "type"      :  true,
                                                "hashtag_text"  : hashtag_text_trigger2TwitterController,
                                                "username_sender" : username_sender_trigger2TwitterController
                                            };
                                        }

                                    }

                                }
                            }
                        }

                        if(actionGlobalVariable == "calendar")
                        {
                            title_action1GcalendarController = $scope.userRecipes[index].trigger.title;
                            subjectReceive_action1GcalendarController =  $scope.userRecipes[index].trigger.description;
                            place_action1GcalendarController =  $scope.userRecipes[index].trigger.place;
                            yearVector_action1GcalendarController =  $scope.userRecipes[index].trigger.dayVector;
                            monthVector_action1GcalendarController =  $scope.userRecipes[index].trigger.monthVector;
                            dayVector_action1GcalendarController = $scope.userRecipes[index].trigger.yearVector;
                            urlActionGlobalVariable = "action1Gcalendar";

                            modulinoj2 =
                            {
                                "actionType": "calendar",
                                //An 2
                                "title": title_action1GcalendarController,
                                "description": subjectReceive_action1GcalendarController,
                                "location": place_action1GcalendarController,
                                "dayVector": yearVector_action1GcalendarController,
                                "monthVector": monthVector_action1GcalendarController,
                                "yearVector": dayVector_action1GcalendarController

                            };

                        }
                        else
                        {
                            if(actionGlobalVariable == "gmail")
                            {
                                body_GmailActionController = $scope.userRecipes[index].trigger.body;
                                receiver_GmailActionController = $scope.userRecipes[index].trigger.receiver;
                                sender_GmailActionController = $scope.userRecipes[index].trigger.sender;
                                subject_GmailActionController =  $scope.userRecipes[index].trigger.subject;
                                urlActionGlobalVariable = "gMailAction";

                                modulinoj2=
                                {
                                    "actionType" : "gmail",
                                    "body" : body_GmailActionController,
                                    "receiver" : receiver_GmailActionController,
                                    "sender" : sender_GmailActionController,
                                    "subject" : subject_GmailActionController
                                };


                            }
                            else
                            {
                                if(actionGlobalVariable == "twitter")
                                {
                                    subject_action1TwitterController = $scope.userRecipes[index].trigger.body;
                                    subActionGlobalVariable = false;
                                    urlActionGlobalVariable = "Action1Twitter";

                                    modulinoj2 =
                                    {
                                        "actionType" : "twitter",
                                        "type"      :  false,
                                        "body"      :  subject_action1TwitterController,
                                        "destination" :  null

                                    };

                                }
                                else
                                {
                                    title_action2TwitterController = $scope.userRecipes[index].trigger.destination;
                                    subjec_action2TwitterController = $scope.userRecipes[index].trigger.body;
                                    subActionGlobalVariable = true;
                                    urlActionGlobalVariable = "Action2Twitter";

                                    modulinoj2 =
                                    {
                                        "actionType" : "twitter",
                                        "type"      :  true,
                                        "destination"   :  title_action2TwitterController,
                                        "body" :  subjec_action2TwitterController

                                    };

                                }


                            }

                        }
                        var dempJson =
                        {
                            "action" :   modulinoj2,
                            "trigger" : modulinoj1,
                            "index" : index,
                            "description" : descriptionRecipeGlobal,
                            "id"  :idRecipe,
                            "publish" : publishRecipeGlobal,
                            isCollapsed: true

                        };
                        $scope.elements.push(dempJson);
                        index++;
                    });

                    /*  *************/














                },
                function error(response) {
                    // Error code here
                    alert("error");
                }
            );







    }]);




iftttApp.controller('createAccountController',  ['$scope',
    function ($scope) {

        $scope.createAccountFunc = function(user, email, pws1, pws2)
        {

            if (angular.isDefined(email) && angular.isDefined(user) && angular.isDefined(pws1) && angular.isDefined(pws2)){
                if(pws1==pws2)
                {
                    //if(consoleLogs) console.log(user + " " + email + " " + " " + pws1);

                    var loginDataSend =
                    {
                        "username": user,
                        "email": email,
                        "password": pws1
                    };
                    //if(consoleLogs) console.log(loginDataSend.user);
                    $('#serverSpinner').spin();
                    $.ajax
                    ({
                    	headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                    	method: "post",
                    	url: "http://localhost:8080/progetto/api/registration",
                        data: JSON.stringify(loginDataSend),
                        dataType: "json",
                        success: function() {
                            $('#serverSpinner').spin(false);
                            if(consoleLogs) console.log("la post ha avuto successo");
                            window.location.replace('#');
                        },
                        error: function(){
                            $('#serverSpinner').spin(false);
                            //alert("some error occurred");
                            alertVariable="some error occurred";
                            alertFunction();

                        }
                    });

                }

            }


        }


    }]);


iftttApp.controller('passwordChangeController',  ['$scope',
    function ($scope) {

        $scope.passwordChangeFunc = function (pws1, pws2) {

            if (angular.isDefined(pws1) && angular.isDefined(pws2)){
                if(pws1==pws2)
                {
                    //if(consoleLogs) console.log(user + " " + email + " " + " " + pws1);

                    var loginDataSend =
                    {
                        "newpassword": pws1
                    };
                    
                    $('#serverSpinner').spin();
                    $.ajax
                    ({
                        contentType: "application/json",
                        method: "post",
                        url: "http://localhost:8080/progetto/api/changepassword",
                        data: loginDataSend,
                        success: function() {
                            $('#serverSpinner').spin(false);
                            if(consoleLogs) console.log("(passwordRecoveryController): ricevuta correttamente una risposta dal server");
                            alert("La password è stata modificata con successo");
                            window.location.replace('#myRecipes');
                        },
                        error: function(){
                            $('#serverSpinner').spin(false);
                            //alert("some error occurred");
                            alertVariable="some error occurred";
                            alertFunction();

                        }
                    });

                } else {
                    alert("Input password error.");
                }

            }
            
        }

    }]);




//Update
iftttApp.controller('GmailTriggerController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope) {

        //Bug stringa null

        $scope.flagEmail="email is empty";
        $scope.gmailinput = [];
        $scope.triggerGmail = function()
        {
            var sender = "";
            var subject = "";
            var flag = true;
            triggerChose=1;
            //if(consoleLogs) console.log($scope.gmailinput.email + " "  + $scope.gmailinput.subjectReceive);

            sender_GmailTriggerController="";
            subject_GmailTriggerController="";

            if($scope.checkedEmail == true || $scope.checkedSubject == true) {
                //Firt variable
                if ($scope.checkedEmail == true) {
                    if (angular.isDefined($scope.gmailinput)) {
                        if (angular.isDefined($scope.gmailinput.email)) {
                            sender = $scope.gmailinput.email;
                            if (validateEmail(sender));
                            else
                            {
                                $scope.flagEmail="not valid";
                                flag = false;
                            }



                        }
                        else {
                            sender = "";
                            $scope.flagEmail="is empty";
                        }
                    }
                    else {
                        sender = "";
                        $scope.flagEmail="is empty";
                    }

                }
                else {
                    sender = null;
                }

                //Second variable
                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.gmailinput)) {
                        if (angular.isDefined($scope.gmailinput.subjectReceive)) {
                            subject = $scope.gmailinput.subjectReceive;
                        }
                        else {
                            subject = "";
                        }
                    }
                    else {
                        subject = "";
                    }

                }
                else {
                    subject = null;
                }

                if(flag==true)
                {
                    flagTriggerDone = true;
                    sender_GmailTriggerController = sender;
                    subject_GmailTriggerController = subject;

                    modulinoj1 =
                    {
                        "triggerType": "gmail",
                        //Tn 1
                        "sender": sender_GmailTriggerController,
                        "subject": subject_GmailTriggerController

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
            else
            {
                //url = "#gMailTrigger";
                //window.location.replace(url);

            }
            //Test done o.k.
            /*
            var loginDataSend =
            {
                l1:  sender_GmailTriggerController,
                l2: subject_GmailTriggerController
            }
            $.ajax
            ({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                success: if(consoleLogs) console.log("la post ha avuto successo")
            });
            */
        };

        // $scope.checkedtitle = true;
        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }
        $scope.checkedEmail = false;
        $scope.checkedSubject = false;

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }




    }]);

//Update done
iftttApp.controller('GmailActionController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope, $rootscope, $routeParams, $http, $resource, $location) {

        //Bug stringa null

        $scope.test = "void";
        $scope.gmailActionvar = [];

        $scope.actionGmail = function()
        {

            var sender = "";
            var receiver ="";
            var subject = "";
            var body = "";
            var flag = true;
            actionChose=1;
            //sender_GmailActionController = "";


            receiver_GmailActionController = "";
            subject_GmailActionController = "";
            sender_GmailActionController= "";
            body_GmailActionController = "";


            if(googleLogin == true)  {


                    if (angular.isDefined($scope.gmailActionvar))
                    {
                        if (angular.isDefined($scope.gmailActionvar.email))
                        {
                            receiver = $scope.gmailActionvar.email;

                            if (validateEmail(receiver));
                            else
                            {
                                flag = false;
                                //alert("Your e.mail is not right . . .");
                                alertVariable="Your e.mail is not right . . .";
                                alertFunction();

                            }
                        }
                        else {
                            receiver = "";
                            flag = false;
                            //alert("Your e.mail is not right . . .");
                            alertVariable="Your e.mail is not right . . .";
                            alertFunction();

                        }
                    }
                    else {
                        receiver = "";
                        flag = false;
                        //alert("Your e.mail is not right . . .");
                        alertVariable="Your e.mail is not right . . .";
                        alertFunction();
                    }



                if ($scope.checkedSubject == true)
                {
                    if (angular.isDefined($scope.gmailActionvar))
                    {
                        if (angular.isDefined($scope.gmailActionvar.subjectReceive))
                        {
                            subject = $scope.gmailActionvar.subjectReceive;
                        }
                        else
                        {
                            subject = "";
                        }
                    }
                    else
                    {
                        subject  = "";
                    }

                }
                else
                {
                    subject = null;
                }


                if ($scope.checkedBody == true)
                {
                    if (angular.isDefined($scope.gmailActionvar))
                    {
                        if (angular.isDefined($scope.gmailActionvar.checkedBody))
                        {
                            body = $scope.gmailActionvar.checkedBody;
                        }
                        else
                        {
                            body = "";
                        }
                    }
                    else
                    {
                        body  = "";
                    }

                }
                else
                {
                    body = null;
                }

                //radio botton
                if (angular.isDefined($scope.gmailActionvar))
                {
                    if (angular.isDefined($scope.gmailActionvar.sender))
                    {
                        sender = $scope.gmailActionvar.sender;
                    }
                    else
                    {
                        sender = "";
                        flag = false;
                        //alert("You must chose a option between ifttt e.mail or yours");
                        alertVariable="You must chose a option between ifttt e.mail or yours";
                        alertFunction();

                    }
                }
                else
                {
                    sender  = "";
                    flag = false;
                    //alert("You must chose a option between ifttt e.mail or yours");
                    alertVariable="You must chose a option between ifttt e.mail or yours";
                    alertFunction();
                }






                //alert(flag + " " + body + " " + subject + " " + receiver + " " + $scope.gmailActionvar.sender);

                if(flag == true)
                {

                    flagTriggerDone = false;
                    count=7;


                    receiver_GmailActionController = receiver;
                    subject_GmailActionController = subject;
                   sender_GmailActionController= sender;
                    body_GmailActionController = body;

                    modulinoj2=
                    {
                        "actionType" : "gmail",
                        "body" : body_GmailActionController,
                        "receiver" : receiver_GmailActionController,
                        "sender" : sender_GmailActionController,
                        "subject" : subject_GmailActionController
                    };



                    if (modifyVar == 0)
                    {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();
                    //sendingToServerAll();
                    //var url = "#gMailSucces";
                    //window.location.replace(url);
                }
            }
            else
            {
                //alert("You are not logged in google");
                alertVariable="You are not logged in google";
                alertFunction();
                url = "#createDO";
                window.location.replace(url);
            }

            /*
            var loginDataSend =
            {
                l3:  sender_GmailActionController,
                l4: subject_GmailActionController
            }
            $.ajax
            ({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                success: if(consoleLogs) console.log("la post ha avuto successo")
            });
            */

        };
        $scope.checkedEmail = false;
        $scope.checkedSubject = false;
        $scope.checkedbody=false;

        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }



        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }


    }]);



iftttApp.controller('customWeatherActionControllerTrigger1',  ['$scope', '$routeParams',
    function ($scope) {

        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0
        };



        $scope.errorButton = 'cia';
        $scope.checkadvisetimevar = 'NO';
        $scope.checktimeZonevar = 'NO';
        $scope.checkadvisetimefunc = function(/*name*/)
        {
            if($scope.checkadvisetimevar === "YES")
                $scope.checkadvisetimevar = 'NO';
            else
                $scope.checkadvisetimevar = 'YES';
            //if(consoleLogs) console.log(name);
        };

        $scope.checktimeZonefunc = function(/*name*/)
        {
            if($scope.checktimeZonevar === "YES")
                $scope.checktimeZonevar = 'NO';
            else
                $scope.checktimeZonevar = 'YES';
            //if(consoleLogs) console.log(name);
        };

        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }



    }]);

iftttApp.controller('customWeatherActionControllerTrigger2', ['$scope',
    function ($scope)
    {
        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0,
            value4: 0
        };



        $scope.data =
        {
            availableOptions:
                [
                        {id: '200', name: 'thunderstorm with light rain'},
                        {id: '300', name: 'light intensity drizzle'},
                        {id: '500', name: '500	light rain'}
                    ],
                    selectedOption: {id: '200', name: 'thunderstorm with light rain'} //This sets the default value of the select in the ui

        };

        /* Code available --> http://openweathermap.org/weather-conditions

         Weather condition codes

         Group 2xx: Thunderstorm
         ID	Meaning	Icon
         200	thunderstorm with light rain	 11d
         201	thunderstorm with rain	 11d
         202	thunderstorm with heavy rain	 11d
         210	light thunderstorm	 11d
         211	thunderstorm	 11d
         212	heavy thunderstorm	 11d
         221	ragged thunderstorm	 11d
         230	thunderstorm with light drizzle	 11d
         231	thunderstorm with drizzle	 11d
         232	thunderstorm with heavy drizzle	 11d

         Group 3xx: Drizzle
         ID	Meaning	Icon
         300	light intensity drizzle	 09d
         301	drizzle	 09d
         302	heavy intensity drizzle	 09d
         310	light intensity drizzle rain	 09d
         311	drizzle rain	 09d
         312	heavy intensity drizzle rain	 09d
         313	shower rain and drizzle	 09d
         314	heavy shower rain and drizzle	 09d
         321	shower drizzle	 09d

         Group 5xx: Rain
         ID	Meaning	Icon
         500	light rain	 10d
         501	moderate rain	 10d
         502	heavy intensity rain	 10d
         503	very heavy rain	 10d
         504	extreme rain	 10d
         511	freezing rain	 13d
         520	light intensity shower rain	 09d
         521	shower rain	 09d
         522	heavy intensity shower rain	 09d
         531	ragged shower rain	 09d

         Group 6xx: Snow
         ID	Meaning	Icon
         600	light snow	[[file:13d.png]]
         601	snow	[[file:13d.png]]
         602	heavy snow	[[file:13d.png]]
         611	sleet	[[file:13d.png]]
         612	shower sleet	[[file:13d.png]]
         615	light rain and snow	[[file:13d.png]]
         616	rain and snow	[[file:13d.png]]
         620	light shower snow	[[file:13d.png]]
         621	shower snow	[[file:13d.png]]
         622	heavy shower snow	[[file:13d.png]]

         Group 7xx: Atmosphere
         ID	Meaning	Icon
         701	mist	[[file:50d.png]]
         711	smoke	[[file:50d.png]]
         721	haze	[[file:50d.png]]
         731	sand, dust whirls	[[file:50d.png]]
         741	fog	[[file:50d.png]]
         751	sand	[[file:50d.png]]
         761	dust	[[file:50d.png]]
         762	volcanic ash	[[file:50d.png]]
         771	squalls	[[file:50d.png]]
         781	tornado	[[file:50d.png]]

         Group 800: Clear
         ID	Meaning	Icon
         800	clear sky	[[file:01d.png]] [[file:01n.png]]
         Group 80x: Clouds
         ID	Meaning	Icon
         801	few clouds	[[file:02d.png]] [[file:02n.png]]
         802	scattered clouds	[[file:03d.png]] [[file:03d.png]]
         803	broken clouds	[[file:04d.png]] [[file:03d.png]]
         804	overcast clouds	[[file:04d.png]] [[file:04d.png]]

         Group 90x: Extreme
         ID	Meaning
         900	tornado
         901	tropical storm
         902	hurricane
         903	cold
         904	hot
         905	windy
         906	hail

         Group 9xx: Additional
         ID	Meaning
         951	calm
         952	light breeze
         953	gentle breeze
         954	moderate breeze
         955	fresh breeze
         956	strong breeze
         957	high wind, near gale
         958	gale
         959	severe gale
         960	storm
         961	violent storm
         962	hurricane



         */
        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }




    }]);


iftttApp.controller('customWeatherActionControllerTrigger3', ['$scope',
    function ($scope)
    {
        $scope.trigger1input = {
            value3: 0
        };



        $scope.checkadvisesunset = false;
        $scope.checkadvisesunrise = false;

        $scope.checkadvisesunsetvar = false;
        $scope.checkadvisetsunrisevar = false;
        $scope.checktimeZonevar = false;

        $scope.checkadvisesunrisefunc = function(/*name*/)
        {
            if($scope.checkadvisetsunrisevar === true)
                $scope.checkadvisetsunrisevar = false;
            else
                $scope.checkadvisetsunrisevar = false;
            //if(consoleLogs) console.log(name);
        };

        $scope.checkadvisetsunsetfunc = function(/*name*/)
        {
            if($scope.checkadvisesunsetvar === true)
                $scope.checkadvisesunsetvar = false;
            else
                $scope.checkadvisesunsetvar = true;
            //if(consoleLogs) console.log(name);
        };

        $scope.checktimeZonefunc = function(/*name*/)
        {
            if($scope.checktimeZonevar === true)
                $scope.checktimeZonevar = false;
            else
                $scope.checktimeZonevar = true;
            //if(consoleLogs) console.log(name);
        };

        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }



    }]);


iftttApp.controller('customWeatherActionControllerTrigger4', ['$scope',
    function ($scope)
    {
        $scope.checkmodelcheckthmax =false;
        $scope.checkmodelcheckthmin =false;

        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0,
            value4: 0
        };
        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }


    }]);

// loginPageController
iftttApp.controller('loginPageController',  ['$scope',
    function ($scope) {

        $scope.loginfunc = function(pass, email)
        {
            if (angular.isDefined(email) && angular.isDefined(pass))
            {
                var loginDataSend =
                {
                    "password:": pass,
                    "email:": email
                };
                //if(consoleLogs) console.log(loginDataSend.pssword);
                $.ajax({
                    method: "post",
                    url: "/MyServlet",
                    data: loginDataSend,
                    dataType: "json",
                    success: function () {
                        if(consoleLogs) console.log("la post ha avuto successo ");
                        $('#serverSpinner').spin(false);
                    },
                    error: $('#serverSpinner').stop()
                });
            }
        }

    }]);


//Update
iftttApp.controller('Trigger1GcalendarController', ['$scope',
    function ($scope)
    {

        $scope.trigger1GcalendarVar = [];
        $scope.trigger1Gcalendar = function()
        {
            triggerChose = 2;
            var title;
            var subject;
            var place;


            if(googleLogin == true) {

                if ($scope.checkedtitle == true || $scope.checkedSubject == true || $scope.checkedplace == true) {

                    //First variable
                    if ($scope.checkedtitle == true) {
                        if (angular.isDefined($scope.trigger1GcalendarVar)) {
                            if (angular.isDefined($scope.trigger1GcalendarVar.title)) {
                                title = $scope.trigger1GcalendarVar.title;
                            }
                            else {
                                title = "";
                            }
                        }
                        else {
                            title = "";
                        }
                    }
                    else {
                        title = null;
                    }

                    //Second variable
                    if ($scope.checkedSubject == true) {
                        if (angular.isDefined($scope.trigger1GcalendarVar)) {
                            if (angular.isDefined($scope.trigger1GcalendarVar.subjectReceive)) {
                                subject = $scope.trigger1GcalendarVar.subjectReceive;
                            }
                            else {
                                subject = "";
                            }
                        }
                        else {
                            subject = "";
                        }

                    }
                    else {
                        subject = null;
                    }

                    //Third variable
                    if ($scope.checkedplace == true) {
                        if (angular.isDefined($scope.trigger1GcalendarVar)) {
                            if (angular.isDefined($scope.trigger1GcalendarVar.place)) {
                                place = $scope.trigger1GcalendarVar.place;
                            }
                            else {
                                place = "";
                            }
                        }
                        else {
                            place = "";
                        }

                    }
                    else {
                        place = null;
                    }

                    title_Trigger1GcalendarController = title;
                    description_Trigger1GcalendarController = subject;
                    place_Trigger1GcalendarController = place;

                    modulinoj1 =
                    {
                        "triggerType": "calendar",
                        "eventAction": false,

                        //Tn 2 S0
                        "title": title_Trigger1GcalendarController,
                        "description": description_Trigger1GcalendarController,
                        "location": place_Trigger1GcalendarController
                    };


                    flagTriggerDone = true;
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
            else
            {
                //alert("You are sloged from google please relog and redo it");
                alertVariable="You are sloged from google please relog and redo it";
                alertFunction();
                url = "#allTriggers";
                window.location.replace(url);

            }

        };

        $scope.modifyButton = false;
        if(modifyVar == 1)
        {


            $scope.modifyButton = true;
        }
        else
        {
            $scope.modifyButton = false;
        }
        $scope.checkedtitle = false;
        $scope.checkedSubject= false;
        $scope.checkedplace=false;



}]);



iftttApp.controller('Trigger2GcalendarController', ['$scope',
    function ($scope)
    {

        $scope.trigger2GcalendarVar = [];
        $scope.trigger2Gcalendar = function() {
            triggerChose = 3;
            var title;
            var subject;
            var place;

            if(googleLogin == true) {
                if ($scope.checkedtitle == true || $scope.checkedSubject == true || $scope.checkedplace == true) {

                    //first variable
                    if ($scope.checkedtitle == true) {
                        if (angular.isDefined($scope.trigger2GcalendarVar)) {
                            if (angular.isDefined($scope.trigger2GcalendarVar.title)) {
                                title = $scope.trigger2GcalendarVar.title;
                            }
                            else {
                                title = "";
                            }
                        }
                        else {
                            title = "";
                        }

                    }
                    else {
                        title = null;
                    }

                    //second variable
                    if ($scope.checkedSubject == true) {
                        if (angular.isDefined($scope.trigger2GcalendarVar)) {
                            if (angular.isDefined($scope.trigger2GcalendarVar.subject)) {
                                subject = $scope.trigger2GcalendarVar.subject;
                            }
                            else {
                                subject = "";
                            }
                        }
                        else {
                            subject = "";
                        }

                    }
                    else {
                        subject = null;
                    }


                    //third variable
                    if ($scope.checkedplace == true) {
                        if (angular.isDefined($scope.trigger2GcalendarVar)) {
                            if (angular.isDefined($scope.trigger2GcalendarVar.place)) {
                                place = $scope.trigger2GcalendarVar.place;
                            }
                            else {
                                place = "";
                            }
                        }
                        else {
                            place = "";
                        }

                    }
                    else {
                        place = null;
                    }

                    flagTriggerDone = true;
                    title_Trigger2GcalendarController = title;
                    description_Trigger2GcalendarController = subject;
                    place_Trigger2GcalendarController = place;

                    modulinoj1 =
                    {
                        "triggerType": "calendar",
                        "eventAction": true,
                        //Tn 3
                        "title": title_Trigger2GcalendarController,
                        "description": description_Trigger2GcalendarController,
                        "location": place_Trigger2GcalendarController
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
            else
            {
                //alert("You are non logged google please relog it and redo it");
                alertVariable="You are non logged google please relog it and redo it";
                alertFunction();
                url = "#allTriggers";
                window.location.replace(url);
            }
            /*
             var loginDataSend =
             {
             "eventAction": 1,
             "title": title,
             "description": subject,
             "location": place

             };

             $scope.sedingServer(loginDataSend);
             */

            $scope.modifyButton = false;
            if(modifyVar == 1)
            {
                $scope.modifyButton = true;
            }


        };


        $scope.sedingServer = function(loginDataSend)
        {
            $('#serverSpinner').spin();
            $.ajax({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                success: function(){ if(consoleLogs) console.log("la post ha avuto successo n 9");$('#serverSpinner').spin(false);},
                error: $('#serverSpinner').stop()
            });
        };

        $scope.checkedtitle = false;
        $scope.checkedSubject= false;
        $scope.checkedplace=false;



    }]);


iftttApp.controller('action1GcalendarController', ['$scope',
    function ($scope) {


        $scope.gcalendarinput = [];
        //gcalendarinput,  yearVector, monthVector, dayVector
        $scope.actiongcalendar = function() {
            var title = "";
            var subjectReceive = "";
            var place = "";
            var  yearVector = "";
            var monthVector = "";
            var dayVector = "";
            var flag = true;
            var timeZone = "";
            var durationHour = "";
            var durationMinute = "";

            actionChose =  2;

            /*

             if($scope.googleLogged == true){
             alert("E' TRUE!!!!");
             } else {
             alert("E' FALSE!!!!");
             }

             if(!$scope.googleLogged == true){
             alert("E' FALSE!!!!");
             } else {
             alert("E' TRUE!!!!");
             }
             */

            if($scope.googleLogged == true)
            {


                if ($scope.checkedtitle == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        if (angular.isDefined($scope.gcalendarinput.title)) {
                            title = $scope.gcalendarinput.title;
                        }
                        else {
                            title = "";
                        }
                    }
                    else {
                        title = "";
                    }

                }
                else {
                    title = null;
                }

                //Second variable
                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        if (angular.isDefined($scope.gcalendarinput.subjectReceive)) {
                            subjectReceive = $scope.gcalendarinput.subjectReceive;
                        }
                        else {
                            subjectReceive = "";
                        }
                    }
                    else {
                        subjectReceive = "";
                    }

                }
                else {
                    subjectReceive = null;
                }

                //Third variable
                if ($scope.checkedplace == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        if (angular.isDefined($scope.gcalendarinput.place)) {
                            place = $scope.gcalendarinput.place;
                        }
                        else {
                            place = "";
                        }
                    }
                    else {
                        place = "";
                    }

                }
                else {
                    place = null;
                }


                //Fourth variable
                if ($scope.checkdata == true)
                {
                    if (angular.isDefined($scope.gcalendarinput))
                    {
                        dayVector = $('#selectDay').val();
                        yearVector = $('#selectYear').val();
                        monthVector = $('#selectMonth').val();
                    }

                    else
                    {
                        dayVector = null;
                        yearVector = null;
                        monthVector = null;
                        flag=0;
                    }



                }
                else {
                    dayVector = null;
                    yearVector = null;
                    monthVector = null;
                    flag=0;
                }


                //Time zone
                if ($scope.timeZoneCheck == true)
                {
                    if (angular.isDefined($scope.gcalendarinput))
                    {
                        timeZone = $('#selecttimezone').val();

                    }

                    else
                    {
                        timeZone = null;
                    }



                }
                else {
                    timeZone = null;
                }



                if ($scope.durationEventCheck == true)
                {
                    if (angular.isDefined($scope.gcalendarinput))
                    {
                        durationHour = $('#selectHourDuration').val();
                        durationMinute = $('#selectMinuteDuration').val();

                    }

                    else
                    {
                        durationHour = null;
                        durationMinute = null;

                    }



                }
                else {
                    durationHour = null;
                    durationMinute = null;
                }


                //Duration


                title_action1GcalendarController = title;
                subjectReceive_action1GcalendarController = subjectReceive;
                place_action1GcalendarController = place;
                yearVector_action1GcalendarController = dayVector;
                monthVector_action1GcalendarController = monthVector;
                dayVector_action1GcalendarController = yearVector;
                durationHour_action1GcalendarController = durationHour;
                durationMinute_action1GcalendarController = durationMinute;
                timeZone_action1GcalendarController =  timeZone;

                modulinoj2 =
                {
                    "actionType": "calendar",
                    //An 2
                    "title": title_action1GcalendarController,
                    "description": subjectReceive_action1GcalendarController,
                    "place": place_action1GcalendarController,
                    "dayVector": yearVector_action1GcalendarController,
                    "monthVector": monthVector_action1GcalendarController,
                    "yearVector": dayVector_action1GcalendarController

                };




                if (flag == true)
                {
                    if (monthVector === "1" ||
                        monthVector === "3" ||
                        monthVector === "5" ||
                        monthVector === "7" ||
                        monthVector === "8" ||
                        monthVector === "10" ||
                        monthVector === "12") {
                        if (dayVector > "0" && dayVector < "32");
                        else {
                            flag = "3";
                            //if(consoleLogs) console.log("Your date is not right plase verify the day");
                            alertVariable = "Your date is not right plase verify the day";
                            alertFunction ();
                        }
                    }
                    if (monthVector === "2" ||
                        monthVector === "4" ||
                        monthVector === "6" ||
                        monthVector === "9" ||
                        monthVector === "11")
                    {
                        if (dayVector > "0" && dayVector < "31");
                        else
                        {
                            flag = "3";
                            //if(consoleLogs) console.log("Your date is not right plase verify the day");
                            alertVariable = "Your date is not right plase verify the day";
                            alertFunction ();
                        }

                    }
                    //Anni bisestili
                    if (yearVector === "2016" ||
                        yearVector === "2020" ||
                        yearVector === "2024" ||
                        yearVector === "2028" ||
                        yearVector === "2032" ||
                        yearVector === "2036" ||
                        yearVector === "2040" ||
                        yearVector === "2044"
                    ) {
                        if (monthVector === "2")
                            if (dayVector > 28) {
                                flag = "3";
                                //if(consoleLogs) console.log("Thi is a leap year");
                                alertVariable = "Thi is a leap year";
                                alertFunction ();
                            }


                    }

                    if(monthVector == "2" && dayVector >29 && flag != "3")
                    {
                        //if(consoleLogs) console.log("Febrary has not " + dayVector + " days, please check" );
                        alertVariable = "Febrary has not " + dayVector + " days, please check";
                        alertFunction ();
                        flag = "3";
                    }

                }

                if (flag != "3") {
                    flagTriggerDone = false;
                    count=7;

                    if (modifyVar == 0)
                    {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();

                    //sendingToServerAll();
                    //url = "#gMailSucces";
                    //window.location.replace(url);
                }

            }
            else
            {
                //alert("You are not logged in google");
                alertVariable="You are not logged in google";
                alertFunction();
                url = "#createDO";
                window.location.replace(url);
            }



        };





        $scope.yearVector =
        {
            availableOptions:
                [
                    {id: '2016', year: '2016'},
                    {id: '2017', year: '2017'},
                    {id: '2018', year: '2018'},
                    {id: '2019', year: '2019'},
                    {id: '2020', year: '2020'},
                    {id: '2021', year: '2021'},
                    {id: '2022', year: '2022'},
                    {id: '2023', year: '2023'},
                    {id: '2024', year: '2024'},
                    {id: '2025', year: '2025'},
                    {id: '2026', year: '2026'},
                    {id: '2027', year: '2027'},
                    {id: '2028', year: '2028'},
                    {id: '2029', year: '2029'},
                    {id: '2030', year: '2030'},
                    {id: '2031', year: '2031'},
                    {id: '2032', year: '2032'},
                    {id: '2033', year: '2033'},
                    {id: '2034', year: '2034'},
                    {id: '2035', year: '2035'},
                    {id: '2036', year: '2036'},
                    {id: '2037', year: '2037'},
                    {id: '2038', year: '2038'},
                    {id: '2039', year: '2039'},
                    {id: '2040', year: '2040'},
                    {id: '2041', year: '2041'},
                    {id: '2042', year: '2042'},
                    {id: '2043', year: '2043'},
                    {id: '2044', year: '2044'},
                    {id: '2045', year: '2045'}

                ],
            selectedOption: {id: '2016', year: '2016'}

        };





        $scope.monthVector =
        {
            availableOptions:
                [
                    {id: '1', month: 'January'},
                    {id: '2', month: 'February'},
                    {id: '3', month: 'March'},
                    {id: '4', month: 'April'},
                    {id: '5', month: 'May'},
                    {id: '6', month: 'June'},
                    {id: '7', month: 'July'},
                    {id: '8', month: 'August'},
                    {id: '9', month: 'September'},
                    {id: '10', month: 'October'},
                    {id: '11', month: 'November'},
                    {id: '12', month: 'December'}
                ],
            selectedOption: {id: '1', month: 'January'} //This sets the default value of the select in the ui

        };







        $scope.dayVector =
        {
            availableOptions:
                [
                    {id: '1', day: '1'},
                    {id: '2', day: '2'},
                    {id: '3', day: '3'},
                    {id: '4', day: '4'},
                    {id: '5', day: '5'},
                    {id: '6', day: '6'},
                    {id: '7', day: '7'},
                    {id: '8', day: '8'},
                    {id: '9', day: '9'},
                    {id: '10', day: '10'},
                    {id: '11', day: '11'},
                    {id: '12', day: '12'},
                    {id: '13', day: '13'},
                    {id: '14', day: '14'},
                    {id: '15', day: '15'},
                    {id: '16', day: '16'},
                    {id: '17', day: '17'},
                    {id: '18', day: '18'},
                    {id: '19', day: '19'},
                    {id: '20', day: '20'},
                    {id: '21', day: '21'},
                    {id: '22', day: '22'},
                    {id: '23', day: '23'},
                    {id: '24', day: '24'},
                    {id: '25', day: '25'},
                    {id: '26', day: '26'},
                    {id: '27', day: '27'},
                    {id: '28', day: '28'},
                    {id: '29', day: '29'},
                    {id: '30', day: '30'},
                    {id: '31', day: '31'}
                ],
            selectedOption: {id: '1', day: '1'}

        };




        $scope.hourVector =
        {
            availableOptions:
                [
                    {id: '1', hour: '1'},
                    {id: '2', hour: '2'},
                    {id: '3', hour: '3'},
                    {id: '4', hour: '4'},
                    {id: '5', hour: '5'},
                    {id: '6', hour: '6'},
                    {id: '7', hour: '7'},
                    {id: '8', hour: '8'},
                    {id: '9', hour: '9'},
                    {id: '10', hour: '10'},
                    {id: '11', hour: '11'},
                    {id: '12', hour: '12'},
                    {id: '13', hour: '13'},
                    {id: '14', hour: '14'},
                    {id: '15', hour: '15'},
                    {id: '16', hour: '16'},
                    {id: '17', hour: '17'},
                    {id: '18', hour: '18'},
                    {id: '19', hour: '19'},
                    {id: '20', hour: '20'},
                    {id: '21', hour: '21'},
                    {id: '22', hour: '22'},
                    {id: '23', hour: '23'},
                    {id: '24', hour: '24'},
                    {id: '25', hour: '25'},
                    {id: '26', hour: '26'},
                    {id: '27', hour: '27'},
                    {id: '28', hour: '28'},
                    {id: '29', hour: '29'},
                    {id: '30', hour: '30'},
                    {id: '31', hour: '31'}
                ],
            selectedOption: {id: '1', hour: '1'}

        };


        $scope.minuteVector =
        {
            availableOptions:
                [
                    {id: '1', minute: '1'},
                    {id: '2', minute: '2'},
                    {id: '3', minute: '3'},
                    {id: '4', minute: '4'},
                    {id: '5', minute: '5'},
                    {id: '6', minute: '6'},
                    {id: '7', minute: '7'},
                    {id: '8', minute: '8'},
                    {id: '9', minute: '9'},
                    {id: '10', minute: '10'},
                    {id: '11', minute: '11'},
                    {id: '12', minute: '12'},
                    {id: '13', minute: '13'},
                    {id: '14', minute: '14'},
                    {id: '15', minute: '15'},
                    {id: '16', minute: '16'},
                    {id: '17', minute: '17'},
                    {id: '18', minute: '18'},
                    {id: '19', minute: '19'},
                    {id: '20', minute: '20'},
                    {id: '21', minute: '21'},
                    {id: '22', minute: '22'},
                    {id: '23', minute: '23'},
                    {id: '24', minute: '24'},
                    {id: '25', minute: '25'},
                    {id: '26', minute: '26'},
                    {id: '27', minute: '27'},
                    {id: '28', minute: '28'},
                    {id: '29', minute: '29'},
                    {id: '30', minute: '30'},
                    {id: '31', minute: '31'},
                    {id: '32', minute: '32'},
                    {id: '33', minute: '33'},
                    {id: '34', minute: '34'},
                    {id: '35', minute: '35'},
                    {id: '36', minute: '36'},
                    {id: '37', minute: '37'},
                    {id: '38', minute: '38'},
                    {id: '39', minute: '39'},
                    {id: '40', minute: '40'},
                    {id: '41', minute: '41'},
                    {id: '42', minute: '42'},
                    {id: '43', minute: '43'},
                    {id: '44', minute: '44'},
                    {id: '45', minute: '45'},
                    {id: '46', minute: '46'},
                    {id: '47', minute: '47'},
                    {id: '48', minute: '48'},
                    {id: '49', minute: '49'},
                    {id: '50', minute: '50'},
                    {id: '51', minute: '51'},
                    {id: '52', minute: '52'},
                    {id: '53', minute: '53'},
                    {id: '54', minute: '54'},
                    {id: '55', minute: '55'},
                    {id: '56', minute: '56'},
                    {id: '57', minute: '57'},
                    {id: '58', minute: '58'},
                    {id: '59', minute: '59'}
                ],
            selectedOption: {id: '1', minute: '1'}

        };


        $scope.timezoneVector =
        {
            availableOptions:
                [
                    {id: '-1', zone: '-1'},
                    {id: '-2', zone: '-2'},
                    {id: '-3', zone: '-3'},
                    {id: '-4', zone: '-4'},
                    {id: '-5', zone: '-5'},
                    {id: '-6', zone: '-6'},
                    {id: '-7', zone: '-7'},
                    {id: '-8', zone: '-8'},
                    {id: '-9', zone: '-9'},
                    {id: '-10', zone: '-10'},
                    {id: '-11', zone: '-11'},
                    {id: '-12', zone: '-12'},
                    {id: '1', zone: '1'},
                    {id: '2', zone: '2'},
                    {id: '3', zone: '3'},
                    {id: '4', zone: '4'},
                    {id: '5', zone: '5'},
                    {id: '6', zone: '6'},
                    {id: '7', zone: '7'},
                    {id: '8', zone: '8'},
                    {id: '9', zone: '9'},
                    {id: '10', zone: '10'},
                    {id: '11', zone: '11'},
                    {id: '12', zone: '12'}

                ],
            selectedOption: {id: '1', zone: '1'}

        };



        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;
        $scope.checkdata = false;
        $scope.durationEventCheck = false;
        $scope.timeZoneCheck = false;






//action1GcalendarController

    }]);









iftttApp.controller('trigger1TwitterController', ['$scope',
    function ($scope)
    {

        $scope.trigger1TwitterInput = [];
        $scope.iftttLoginP = iftttLogin;

        $scope.trigger1Twitterfunc = function()
        {
            triggerChose=4;
            var title;
            var subject;

            if( ($scope.checkedtitle == true  ||  $scope.checkedSubject == true) && twitterLogin==true)
            {

                //First variable
                if ($scope.checkedtitle == true) {
                    if (angular.isDefined($scope.trigger1TwitterInput)) {
                        if (angular.isDefined($scope.trigger1TwitterInput.title)) {
                            title = $scope.trigger1TwitterInput.title;
                        }
                        else {
                            title = "";
                        }
                    }
                    else {
                        title = "";
                    }

                }
                else {
                    title = null;
                }


                //Second variable
                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.trigger1TwitterInput)) {
                        if (angular.isDefined($scope.trigger1TwitterInput.subjectReceive)) {
                            subject = $scope.trigger1TwitterInput.subjectReceive;
                        }
                        else {
                            subject = "";
                        }
                    }
                    else {
                        subject = "";
                    }

                }
                else {
                    subject = null;
                }

                flagTriggerDone = true;

                username_sender_trigger1TwitterController = title;
                hashtag_text_trigger1TwitterController = subject;

                modulinoj1 =
                {
                  "triggerType" : "twitter",
                    "type"      :  false,
                    "hashtag_text"  : hashtag_text_trigger1TwitterController,
                    "username_sender" : username_sender_trigger1TwitterController
                };


                if(modifyVar == true)
                {
                    sendingToServerAllput();
                }
                else {
                    url = "#createRecipeAction";
                    window.location.replace(url);
                }
            }
            if(twitterLogin == false)
            {
                //alert("You are not logged in twitter");
                alertVariable="You are not logged in twitter";
                alertFunction();
                url = "#allTriggers";
                window.location.replace(url);
            }



        };


        $scope.checkedtitle = false;
        $scope.checkedSubject= false;
        $scope.checkedplace=false;
        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }


    }]);






iftttApp.controller('trigger2TwitterController', ['$scope',
    function ($scope)
    {
        $scope.trigger2TwitterInput = [];

        $scope.trigger2Twitterfunc = function() {
            triggerChose = 5;
            var title;
            var subject;


            if (twitterLogin == true)
            {

                if ($scope.checkedtitle == true) {
                    if (angular.isDefined($scope.trigger2TwitterInput)) {
                        if (angular.isDefined($scope.trigger2TwitterInput.title)) {
                            title = $scope.trigger2TwitterInput.title;
                            flag=1
                        }
                        else {
                            title = "";
                        }
                    }
                    else {
                        title = "";
                    }

                }
                else {
                    title = null;
                }




                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.trigger2TwitterInput)) {
                        if (angular.isDefined($scope.trigger2TwitterInput.subjectReceive)) {
                            subject = $scope.trigger2TwitterInput.subjectReceive;
                        }
                        else {
                            subject = "";
                        }
                    }
                    else {
                        subject = "";
                    }

                }
                else {
                    subject = null;
                }

                flagTriggerDone = true;
                username_sender_trigger2TwitterController = title;
                hashtag_text_trigger2TwitterController = subject;

                modulinoj1 =
                {
                    "triggerType" : "twitter",
                    "type"      :  true,
                    "hashtag_text"  : hashtag_text_trigger2TwitterController,
                    "username_sender" : username_sender_trigger2TwitterController
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

            if(twitterLogin == false)
            {
               //alert("You are not logged in twitter");
                alertVariable="You are not logged in twitter";
                alertFunction();
                url = "#allTriggers";
                window.location.replace(url);
            }




            Trigger1GcalendarController
        };
        $scope.modifyButton = false;
        if(modifyVar == 1)
        {
            $scope.modifyButton = true;
        }

        $scope.checkedtitle = false;
        $scope.checkedSubject= false;
        $scope.checkedplace=false;


    }]);






iftttApp.controller('action1TwitterController', ['$scope',
    function ($scope)
    {

        $scope.action1TwitterInput = [];
        $scope.twitterAction1func = function()
        {
            actionChose = 3;

            var subject;


            if ( $scope.checkedSubject == true  && twitterLogin == true)
            {

                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.action1TwitterInput)) {
                        if (angular.isDefined($scope.action1TwitterInput.subjectReceive)) {
                            subject = $scope.action1TwitterInput.subjectReceive;
                        }
                        else {
                            subject = "";
                        }
                    }
                    else {
                        subject = "";
                    }

                }
                else {
                    subject = null;
                }

                flagTriggerDone = false;
                count=7;

                subject_action1TwitterController = subject;

                modulinoj2 =
                {
                    "actionType" : "twitter",
                    "type"      :  false,
                    "body"      :  subject_action1TwitterController,
                    "destination" :  null

                };

                if (modifyVar == 0)
                {
                    $('#recipedDescriptionModal').modal('show');
                }
                else sendingToServerAllput();
                //sendingToServerAll();
                //href="#SuccessTwitter"
                //var url = "#SuccessTwitter";
                //window.location.replace(url);
            }

            if(twitterLogin == false)
            {
                //alert("You are not logged in twitter");
                alertVariable="You are not logged in twitter";
                alertFunction();
                url = "#createDO";
                window.location.replace(url);
            }




        };

        /*
        $scope.sedingServer = function(loginDataSend)
        {
            $.ajax({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                success: if(consoleLogs) console.log("la post ha avuto successo n 9")
            });
        };
        */

        $scope.checkedtitle = false;
        $scope.checkedSubject= false;
        $scope.checkedplace=false;









    }]);

//action2TwitterController


iftttApp.controller('action2TwitterController', ['$scope',
    function ($scope)
    {

        $scope.action2TwitterInput = [];
        $scope.action2Twitterfunc = function()
        {

            actionChose = 4;
            var destination;
            var subject;
            var flag = 0;

           // if(($scope.checkedtitle == true ||  $scope.checkedSubject== true)  && twitterLogin == true)
            if(twitterLogin == true)
            {



                   // if ($scope.checkedtitle == true)
              //  {
                        if (angular.isDefined($scope.action2TwitterInput))
                        {
                            if (angular.isDefined($scope.action2TwitterInput.title))
                            {
                                destination = $scope.action2TwitterInput.title;
                                flag = 1;
                            }
                            else {
                                destination = "";
                            }
                        }
                        else {
                            destination = "";
                        }

               // }
                /*
                    else {
                        title = null;
                    }
                    */



                    if ($scope.checkedSubject == true) {
                        if (angular.isDefined($scope.action2TwitterInput)) {
                            if (angular.isDefined($scope.action2TwitterInput.subjectReceive))
                            {
                                subject =  $scope.action2TwitterInput.subjectReceive;
                            }
                            else {
                                subject = "";
                            }
                        }
                        else {
                            subject = "";
                        }

                    }
                    else {
                        subject = null;
                    }


                title_action2TwitterController = destination;
                subjec_action2TwitterController = subject;

                modulinoj2 =
                {
                    "actionType" : "twitter",
                    "type"      :  true,
                    "destination"   :  title_action2TwitterController,
                    "body" :  subjec_action2TwitterController
                    
                };
                if(flag == 1) {

                    if (modifyVar == 0)
                    {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();
                    //sendingToServerAll();
                    flagTriggerDone = false;
                    count = 7;
                    // href="#SuccessTwitter"
                    //url = "#SuccessTwitter";
                    //window.location.replace(url);
                }
                else
                {
                    //alert ("You must insert the destination e.mail");
                    alertVariable="You must insert the destination e.mail";
                    alertFunction();
                }


            }
            if(twitterLogin == false)
            {
                //alert("You are not logged in twitter");
                alertVariable="You are not logged in twitter";
                alertFunction();

                url = "#createDO";
                window.location.replace(url);
            }




        };

        /*

        $scope.sedingServer = function(loginDataSend)
        {
            $.ajax({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                success: if(consoleLogs) console.log("la post ha avuto successo n 9")
            });
        };
        */

        $scope.checkedtitle = false;
        $scope.checkedSubject= false;



    }]);




//Update done
iftttApp.controller('choseModifyController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope, $rootscope, $routeParams, $http, $resource, $location) {
        $scope.urlTriggerUser = ulrTriggreGlobalVariable;
        $scope.activeGoogleAutentication = false;
        $scope.activeTwitterAutentication = false;
        $scope.activeWeatherAutentication = false;

        $scope.urlActionUser = urlActionGlobalVariable;
        $scope.activeGoogleAutenticationAction = false;
        $scope.activeTwitterAutenticationAction = false;



        modifyVar = 1;
        if(triggreGlobalVariable == "gmail" ||  triggreGlobalVariable == "calendar" )
        {
            $scope.activeGoogleAutentication = true;
        }
        else
        {
            if(triggreGlobalVariable == "twitter")
            {
                $scope.activeTwitterAutentication = true;
            }
            else
            {
                $scope.activeWeatherAutentication = true;

            }

        }


        if(actionGlobalVariable == "gmail" ||  actionGlobalVariable == "calendar" )
        {
            $scope.activeGoogleAutenticationAction = true;
        }
        else
        {
            if(triggreGlobalVariable == "twitter")
            {
                $scope.activeTwitterAutenticationAction = true;
            }

        }

        $scope.changePage = function (chosePath)
        {
            if(chosePath == 0 )
                rootingAutenticationTriggerAction = ulrTriggreGlobalVariable;
            else
                rootingAutenticationTriggerAction = urlActionGlobalVariable;

            $('#loginGoogleModal').modal('show');
        };


        $scope.setupValueChange =function(chosePath)
        {
            var urlx ="";
            if(chosePath == 0 )
            {
                setChooseAx = 4;
                urlx = "#allTriggers";
            }
            else
            {
                urlx = "#allActions";
                setChooseAx = 5;
            }
            window.location.replace(urlx);
        };


        $scope.descriptionModifyLanch = function()
        {
            $('#recipedDescriptionModal').modal('show');
        }


    }]);


iftttApp.filter('capitalize', function() {
    return function(input) {
        if(consoleLogs) console.log(JSON.stringify(input));
        return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});

iftttApp.filter('reformat', function() {
    return function(x) {

        switch (x) {
            case 'lastChecked': return 'Last checked';
            case 'hashtag_text': return 'Hashtag text';
            case 'username_sender': return 'Username sender';
            case 'eventAction': return 'Event action';
            case 'thmax': return 'Max temperature (C°)';
            case 'thmin': return 'Min temperature (C°)';
        }


        return x;
    };
});



iftttApp.directive('bsTooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).tooltip()
        }
    };
});












































/*
########################################################################################################################
########################################################################################################################
######
######                                                JavaScript functions
######
########################################################################################################################
########################################################################################################################
 */

function sendingToServerAll ()
{
    modulinoj1.lastChecked = null;
    sendDataToServer =
    {
        id: null,
        "description": descriptionRecipeGlobal,
        "trigger" : modulinoj1,
        "action" : modulinoj2,
        "publish": false
    };

    //"desc": "example descrition here, written by the user"/*recipedDesc*/
    sedingServerAllRun(sendDataToServer);




}
//alertVariable
//alertFunction ()

function alertFunction ()
{
    $("#notificationsWrapper").notify(
        alertVariable,
        {
            className: 'warning',
            position: 'bottom center',
            id: null,
            description: null
        }
    );
}
function sedingServerAllRun (loginDataSend)
{
    //var result = "ciao";
    //url: 'http://localhost:3000/userRecipes
    //url: "/MyServlet"
    $('#serverSpinner').spin();
    $.ajax({
        method: "post",
        url: "http://localhost:8080/progetto/api/userRecipes",
        data: JSON.stringify(loginDataSend),
        contentType: 'application/json; charset=UTF-8',
        success: function(response) {

            $('#serverSpinner').spin(false);
            $('#recipedDescriptionModal').modal('hide');

            //if(consoleLogs) console.log("la post ha avuto successo n 9");
            //result = response;

            //sendingToServerAll();
            url = "#SuccessRepice";
            window.location.replace(url);

            //alert(true);

            /*
            $.ajax({
                method: "post",
                url: "/MyServlet",
                data: result,
                dataType: "json",
                success: function(response) {
                    //if(consoleLogs) console.log("la post ha avuto successo n 9");
                    alert("2");

                }
            });
            */
        },
        error: $('#serverSpinner').stop()
    });
}

function sendingToServerAllput ()
{
    modulinoj1.lastChecked = null;
    sendDataToServer =
    {
        id: idRecipe,
        "description": descriptionRecipeGlobal,
        "trigger" : modulinoj1,
        "action" : modulinoj2,
        "publish" : publishRecipeGlobal
    };
    sedingServerAllRunput(sendDataToServer);

}


function sedingServerAllRunput (loginDataSend)
{
    $('#serverSpinner').spin();
    $.ajax({
        method: "put",
        url: "http://localhost:3000/userRecipes/" + idRecipe,
        data: loginDataSend,
        dataType: "json",
        success: function(response) {
            $('#serverSpinner').spin(false);
            if(modifyVar == true)
            {
                $('#recipedDescriptionModal').modal('hide');

            }
            url = "#SuccessRepice";
            window.location.replace(url);

        },
        error: $('#serverSpinner').stop()
    });
}

