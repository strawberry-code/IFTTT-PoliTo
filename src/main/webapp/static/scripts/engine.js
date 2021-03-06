/*
 * Created by kazuhira on 22/07/16.
 */


var iftttApp = angular.module('iftttApp', ['ngRoute', 'hSweetAlert']);
//Secure controll
var triggerChose = 0;
var actionChose = 0;

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
var yearVector_action1GcalendarController = "";
var monthVector_action1GcalendarController = "";
var dayVector_action1GcalendarController = "";

var hourStart_action1GcalendarController = "";
var minuteStart_action1GcalendarController = "";

var durationHour_action1GcalendarController = "";
var durationMinute_action1GcalendarController = "";
var timeZone_action1GcalendarController = "";


var startDate__action1GcalendarController = "";
var dur_action1GcalendarController = "";

/* action1TwitterController An 3 */
var subject_action1TwitterController = "";

/* action2TwitterController An 4 */
var title_action2TwitterController = "";
var subjec_action2TwitterController = "";

/* trigger1TwitterController  Tn 4*/
var username_sender_trigger1TwitterController = "";
var hashtag_text_trigger1TwitterController = "";

/* trigger2TwitterController Tn 5 */
var username_sender_trigger2TwitterController = "";
var hashtag_text_trigger2TwitterController = "";

/* customWeatherActionControllerTrigger1 Tn 6 */
var idCity_customWeatherActionControllerTrigger1 = "";
var timezone_customWeatherActionControllerTrigger1 = "";
var ora_customWeatherActionControllerTrigger1 = "";
var locationName_ControllerTrigger1 = "";

/*  customWeatherActionControllerTrigger2 Tn 7 */
var idCity_customWeatherActionControllerTrigger2 = "";
var pweather_customWeatherActionControllerTrigger2 = "";
var pperiod_customWeatherActionControllerTrigger2 = "";
var pzone_customWeatherActionControllerTrigger2 = "";
var locationName_ControllerTrigger2 = "";


/* customWeatherActionControllerTrigger3  Tn 8 */
var idCity_customWeatherActionControllerTrigger3 = "";
var timezone_customWeatherActionControllerTrigger3 = "";
var sunset_customWeatherActionControllerTrigger3 = false;
var sunrise_customWeatherActionControllerTrigger3 = false;
var locationName_ControllerTrigger3 = "";


/* customWeatherActionControllerTrigger4  Tn 9 */

var idCity_customWeatherActionControllerTrigger4 = "";
var ptimezone_customWeatherActionControllerTrigger4 = "";
var pthmax_customWeatherActionControllerTrigger4 = "";
var pthmin_customWeatherActionControllerTrigger4 = "";
var period_customWeatherActionControllerTrigger4 = "";
var locationName_ControllerTrigger4 = "";


/* Modulini per json*/
var modulinoj1 = [];
var modulinoj2 = [];

/* NAVIGATION */

//unused? var navPages = [0,0,0,0,0,0]; normal navigation
var count = 0;
var url1back = "";
var flagTriggerDone = false;

//Variabile di percorso per la modify parte
var modifyVar = 0;
var modifyCountVar = 0;
var setChooseAx = 0;

//Variabile per protegere le pagine da quello che ho visto devono essere globali.
var googleLogin = false;   //-> $scope.googleLogged
var twitterLogin = false; //-> $scope.twitterLogged
var iftttLogin = false; //-> $scope.iftttLogged

var alertVariable = "";


//Esiste già
//var loginDataSend = null;
var sendDataToServer = [];

//Variabile di descriozione
var descriptionRecipeGlobal = "";

//Variabile se è pubblica o no
var publishRecipeGlobal = false;

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

//Flag se un utente si sta registrando o no
var flag_registration_success = false;


/* import recipe */
var importFlag = false;
var triggerImportRoute = "";
var actionImportRoute = "";

/* Variabile per far tornare indietro createRecipeAction sul giusto trigger*/
var backPageVariabile = "";


iftttApp.config(['$routeProvider', function ($routeProvider) {

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
        templateUrl: './static/innerPages/actions.html',
        controller: 'ifCreatorActionController'
    });

    $routeProvider.when('/createRecipeAction', {
        templateUrl: './static/innerPages/createRecipeAction.html',
        controller: 'createRecipeActionController'
    });


    $routeProvider.when('/SuccessRepice', {
        templateUrl: './static/innerPages/success/SuccessRecipe.html',
        controller: 'SuccessController'
    });

    $routeProvider.when('/SuccessRegistration', {
        templateUrl: './static/innerPages/success/SuccessRegistration.html',
        controller: 'SuccessControllerRegistration'
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

    $routeProvider.when('/index/forgotPassword', {
        templateUrl: './static/innerPages/forgotPassword.html',
        controller: 'forgotPasswordController'
    });

    $routeProvider.when('/hiddenPageConfirmation', {
        templateUrl: './static/innerPages/hidden.html',
        controller: 'hiddenPageConfirmationController'
    });


    $routeProvider.otherwise({redirectTo: '/home'});
}]);

iftttApp.controller('indexController', ['$scope', '$location', '$routeParams', '$window', '$http', '$rootScope', 'sweet',
    function ($scope, $location, $routeParams, $window, $http, $rootScope, sweet) {

        importFlag = false;

        /*
         $window.addEventListener('message', function (e) {
         $rootScope.$apply(function () {

         if($location.path().localeCompare("/hiddenPageConfirmation") == 0){
         alert("registration success");
         $location.path('#/home')
         } else {
         console.log($location.path());
         }
         });
         });
         */


        /**

         LEGGERE QUESTO COMMENTO!!!

         Le stringhe del tipo:

         '/urlerroreServeNumero1'
         '/urlerroreServeNumero2'
         '/urlerroreServeNumero3'
         ...

         possono essere cambiate a piacere, purché corrispondano con quelle provenienti dal server.




         Invece le funzioni del tipo:

         alertNumero1();
         alertNumero2();
         alertNumero3();
         ...

         si deve fare così:

         1. Andare in fondo a questo file
         2. Cercare la funzione 'function successAlert(redirect)'
         3. Copiarla, incollarla e cambiarle il nome (con alertNumer1() per esempio...)

         Nota: La funzione alert può ricevere un parametro che può essere una nuova url di redirezione che si attiva quando l'utente preme il bottone.


         (cristiano): Se mi spiegate bene i vari casi, posso farlo subito.

         */

        $scope.parallax = true;

        $scope.$location = {};
        $scope.$location.path = function () {
            var result = $location.path();
            if ($scope.parallax) {
                var casoServer = (angular.isObject(result) ? angular.toJson(result) : result);
                switch (casoServer) {
                    case '/hiddenPageConfirmation':
                        registrationSuccess('#/home');
                        /* Qui si potrebbe implementare il codice che permette
                         di bypassare il form del login, mettendo proprio qui una ajax al server
                         che avvisa che l'utente è attualemtne collegato
                         e aggiornare le varibaili di connessione proprio da qui

                         il problema è spring security: se si bypassa il form, sul server risulta non connesso
                         */
                        $scope.parallax = false;
                        break;
                    case '/someErrorOccurred':
                        someErrorOccurred();
                        break;
                    case '/userAlreadyActivated':
                    	userAlreadyActivated();
                        break;
                    case '/loginWrongPassword':
                        loginWrongPassword();
                        break;
                    case '/loginUnknownUsername':
                        loginUnknownUsername();
                        break;
                    case '/loginInactiveUser':
                        loginInactiveUser();
                        break;
                    default:
                    //console.log("url loading failure");
                }
            }
            return angular.isObject(result) ? angular.toJson(result) : result;
        };


        if (consoleLogs) console.log("THE CONSOLE LOGS ARE ACTIVE!");

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
            if (consoleLogs) console.log(response);
            //if(consoleLogs) console.log(JSON.stringify(response.data.authenticated) + "locale" + response.data.authenticated.localeCompare("true"));

            /* (cristiano): Risposta simulata, facendo finta che il server risponda positivamente all'autenticazione a Google
             *
             *  La forma finale dovrà essere del tipo:
             *
             *   $scope.googleLogged = response.data.googleAuthenticated;
             *
             */
            //      $scope.googleLogged = true; // (cristiano): questa è solo una simulazione!
            //      googleLogin = true;
            //     alert("L'autenticazione a Google viene impostata automaticamente di default a causa di una simulazione");


            if (response.data.iftttLogged.localeCompare("true") == 0) {
                $scope.iftttLogged = true;
                iftttLogin = true;
            }
            if (response.data.googleLogged.localeCompare("true") == 0) {
                $scope.googleLogged = true;
                googleLogin = true;
            }
            if (response.data.twitterLogged.localeCompare("true") == 0) {
                $scope.twitterLogged = true;
                twitterLogin = true;
            }


            //if(consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
            $('#loginIFTTTModal').modal('hide');
            alertError("Some server error occurred. (code 987)");

            $scope.iftttLogged = false;
            iftttLogin = false;
            if (consoleLogs) console.log($scope.iftttLogged);
        });


        /**
         * Funzione che gestisce il click per gestire la disconnessione da IFTTT Polito
         * @method logoutIFTTT
         * @return
         */
        $scope.logoutIFTTT = function () {
            var requestLogout = {
                requestLogout: 'iftttpolito'
            };

            setSpinner(true);
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/logout',
                data: requestLogout
            }).then(function success(response) {
                if (consoleLogs) console.log(response.data.disconnected);
                //    if(response.data.disconnected.localeCompare("true")==0){
                $scope.iftttLogged = false;
                iftttLogin = false;
                $scope.googleLogged = false;
                googleLogin = false;
                $scope.twitterLogged = false;
                twitterLogin = false;
                setSpinner(false);
                alertSuccess("You are disconnected from IFTTT Polito.\n Hope to see you soon, goodbye!");
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

                if (consoleLogs) console.log($scope.iftttLogged);
            }, function error() {
                setSpinner(false);
                $('#loginIFTTTModal').modal('hide');
                alertError("Some problem occurred. (code 757)");
                if (consoleLogs) console.log($scope.iftttLogged);
            });

        };

        /**
         * Funzione che gestisce il click per gestire l'autenticazione a Google
         * @method requestGoogleAuth
         * @return
         */
        $scope.requestGoogleAuth = function () {
            if (iftttLogin == false && googleLogin == false) {
                $('#loginGoogleModal').modal('hide');
                $('#loginIFTTTModal').modal('show');

            }

//            var googleCredentials = {
//                serviceRequested: "google",
//                email: $('#inputEmailGoogle').val(),
//                password: $('#inputPasswordGoogle').val()
//            };
//
//            if (consoleLogs) console.log(JSON.stringify(googleCredentials));

            //handle global variables
            var varencr = {
                "count": count,
                "setChooseAx": setChooseAx,
                "modifyVar": modifyVar,
                "modifyCountVar": modifyCountVar,
                "flagTriggerDone": flagTriggerDone,
                "importFlag": importFlag,
                "descriptionRecipeGlobal": descriptionRecipeGlobal,
                "idRecipe": idRecipe,
                "iftttLogin": iftttLogin
            };
            varencr = CryptoJS.AES.encrypt(JSON.stringify(varencr), "Secret Passphrase");

            //handle trigger and action
            var triggerencrypted = "";
            var actionencrypted = "";
            var tocheck = false;
            if (modulinoj2.length === undefined) {
                actionencrypted = CryptoJS.AES.encrypt(JSON.stringify(modulinoj2), "Secret Passphrase");
            }
            else {
                tocheck = true;
            }

            if (modulinoj1.length === undefined) {
                triggerencrypted = CryptoJS.AES.encrypt(JSON.stringify(modulinoj1), "Secret Passphrase");
            }
            else {
                tocheck = true;
            }

            if (tocheck == true) {
                var uri = decodeURIComponent(window.location.hash);
                var param = (uri).split("?");
                var trig;
                if (param[1] != null) {
                    var tokens = param[1].split("&");
                    varencr = tokens[0].split("=")[1];
                    if (tokens[1] != null && CryptoJS.AES.decrypt(tokens[1].split("trigger=")[1], "Secret Passphrase").toString(CryptoJS.enc.Utf8).localeCompare("") != 0) {
                        triggerencrypted = tokens[1].split("trigger=")[1];
                    }
                    if (tokens[2] != null && CryptoJS.AES.decrypt(tokens[2].split("action=")[1], "Secret Passphrase").toString(CryptoJS.enc.Utf8).localeCompare("") != 0) {
                        actionencrypted = tokens[2].split("action=")[1];
                    }
                }
            }

//            var prova = "";
//            var provadec = CryptoJS.AES.encrypt(prova, "Secret Passphrase");
//            console.log(provadec);
//            alert(CryptoJS.AES.decrypt(provadec, "Secret Passphrase"))

//            console.log("encrypted: "+encrypted.toString());
//            console.log(CryptoJS.AES.decrypt(encrypted.toString(), "Secret Passphrase").toString(CryptoJS.enc.Utf8));
//            alert(encrypted);

            setSpinner(true);
            $http({
                url: 'http://localhost:8080/progetto/api/connect/requestGoogle',
                method: "POST",
                data: JSON.stringify({
                    "requestGoogleAuth": "true", "urlNext": nextPath,
                    "varencr": encodeURIComponent(varencr.toString()),
                    "trigger": encodeURIComponent(triggerencrypted.toString()),
                    "action": encodeURIComponent(actionencrypted.toString())
                }),
                contentType: "application/json",
                dataType: 'application/json'
                //headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                if (consoleLogs) console.log(JSON.stringify(response.data.googleLogged) + "locale" + response.data.googleLogged.localeCompare("true"));
                setSpinner(false);
                if (response.data.googleLogged.localeCompare("true") == 0) {
                    $scope.googleLogged = true;
                    googleLogin = true;
                    $('#loginGoogleModal').modal('hide');
                    alertSuccess("Now you are connected with Google!");

                    //FXR
                    var url = "#" + nextPath;
                    if (modifyVar == 1) {
                        url = "#" + rootingAutenticationTriggerAction; //<--------------------------------------------------------*
                    }
                    //   window.location.replace(url+"?count="+count);
                    //end
                } else {
                    // Se non è connesso...
                    $('#loginGoogleModal').modal('hide');
                    // @server-side: mettere qui la url a Google O-Auth
                    url = "http://localhost:8080/progetto/api/connect/google.do";
                    window.location.replace(url);
                }
                if (consoleLogs) console.log($scope.googleLogged);
            }, function error() {
                setSpinner(false);
                $('#loginGoogleModal').modal('hide');
                alertError("Some server problem occurred. (code 889)")

                $scope.googleLogged = false;
                googleLogin = false;
                if (consoleLogs) console.log($scope.googleLogged);
            });

        };

        /**
         * Funzione che gestisce il click per gestire la disconnessione da Google
         * @method logoutGoogle
         * @return
         */
        $scope.logoutGoogle = function () {
            var requestLogout = {
                requestLogoutGoogle: true
            };

            setSpinner(true);
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/api/disconnectGoogle',
                data: requestLogout
            }).then(function success(response) {
                setSpinner(false);
                if (consoleLogs) console.log("disconnected from Google response: " + response.data.disconnected);
                if (response.data.disconnected) {
                    $scope.googleLogged = false;
                    googleLogin = false;


                    alertSuccess("You are disconnected from Google now");

                    // Se mi trovo nella pagina '/myRecipes' faccio il reload
                    if ($location.path().toString().localeCompare('/myRecipes') == 0) {
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }

                    if ($location.path().toString().localeCompare('/index/myRecipes') == 0) {
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }


                    /*
                     $("#notificationsWrapper").notify(
                     "Logged out from Google",
                     {
                     className: 'warning',
                     position: 'bottom right'
                     }
                     );*/
                } else {
                    alertError("An unknown problem occurred. (code: 192)");
                    /*
                     $("#notificationsWrapper").notify(
                     "Some problem occurred, please retry",
                     {
                     className: 'error',
                     position: 'bottom right'
                     }
                     );
                     */
                }

                if (consoleLogs) console.log($scope.googleLogged);
            }, function error() {
                setSpinner(false);
                $('#loginGoogleModal').modal('hide');
                alertError("Can't disccent from Google, an unknown problem occurred. (code: 192)");

                /*$("#notificationsWrapper").notify(
                 "Disconnect to Google failed",
                 {
                 className: 'error',
                 position: 'bottom right'
                 }
                 );*/

                if (consoleLogs) console.log($scope.googleLogged);
            });

        };

        /**
         * Funzione che gestisce il click per gestire l'autenticazione a Twitter
         * @method requestTwitterAuth
         * @return
         */
        $scope.requestTwitterAuth = function () {

            if (iftttLogin == false && twitterLogin == false) {
                $('#loginTwitterModal').modal('hide');
                $('#loginIFTTTModal').modal('show');

            }

            //handle global variables
            var varencr = {
                "count": count,
                "setChooseAx": setChooseAx,
                "modifyVar": modifyVar,
                "modifyCountVar": modifyCountVar,
                "flagTriggerDone": flagTriggerDone,
                "importFlag": importFlag,
                "descriptionRecipeGlobal": descriptionRecipeGlobal,
                "idRecipe": idRecipe,
                "iftttLogin": iftttLogin
            };
            varencr = CryptoJS.AES.encrypt(JSON.stringify(varencr), "Secret Passphrase");

            //handle trigger
            var triggerencrypted = "";
            var actionencrypted = "";
            var tocheck = false;
            if (modulinoj2.length === undefined) {
                actionencrypted = CryptoJS.AES.encrypt(JSON.stringify(modulinoj2), "Secret Passphrase");
            }
            else {
                tocheck = true;
            }

            if (modulinoj1.length === undefined) {
                triggerencrypted = CryptoJS.AES.encrypt(JSON.stringify(modulinoj1), "Secret Passphrase");
            }
            else {
                tocheck = true;
            }

            if (tocheck == true) {
                var uri = decodeURIComponent(window.location.hash);
                var param = (uri).split("?");
                var trig;
                if (param[1] != null) {
                    var tokens = param[1].split("&");
                    varencr = tokens[0].split("=")[1];
                    if (tokens[1] != null && CryptoJS.AES.decrypt(tokens[1].split("trigger=")[1], "Secret Passphrase").toString(CryptoJS.enc.Utf8).localeCompare("") != 0) {
                        triggerencrypted = tokens[1].split("trigger=")[1];
                    }
                    if (tokens[2] != null && CryptoJS.AES.decrypt(tokens[2].split("action=")[1], "Secret Passphrase").toString(CryptoJS.enc.Utf8).localeCompare("") != 0) {
                        actionencrypted = tokens[2].split("action=")[1];
                    }
                }
            }

            setSpinner(true);
            $http({
                url: 'http://localhost:8080/progetto/api/twitter/requestTwitter',
                method: "POST",
                data: JSON.stringify({
                    "requestGoogleAuth": "true", "urlNext": nextPath,
                    "varencr": encodeURIComponent(varencr.toString()),
                    "trigger": encodeURIComponent(triggerencrypted.toString()),
                    "action": encodeURIComponent(actionencrypted.toString())
                }),
                contentType: "application/json",
                dataType: 'application/json'
                //headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                if (consoleLogs) console.log(JSON.stringify(response.data.twitterLogged) + "locale" + response.data.twitterLogged.localeCompare("true"));
                setSpinner(false);
                if (response.data.twitterLogged.localeCompare("true") == 0) {
                    $scope.twitterLogged = true;
                    twitterLogin = true;
                    $('#loginTwitterModal').modal('hide');
                    alertSuccess("Logged with Google.")

                    //FXR
                    var url = "#" + nextPath;
                    if (modifyVar == 1) {
                        url = "#" + rootingAutenticationTriggerAction; //<--------------------------------------------------------*
                    }
                    //   window.location.replace(url);
                    //end
                } else {
                    // Se non è connesso...
                    $('#loginTwitterModal').modal('hide');
                    // @server-side: mettere qui la url a Google O-Auth
                    url = "http://localhost:8080/progetto/api/twitter/tw.do";
                    window.location.replace(url);
                }
                if (consoleLogs) console.log($scope.googleLogged);
            }, function error() {
                setSpinner(false);
                $('#loginTwitterModal').modal('hide');
                alertError("Some problems with server occurred. (code: 233)");
                $scope.twitterLogged = false;
                twitterLogin = false;
                if (consoleLogs) console.log($scope.twitterLogged);
            });

        };

        /**
         * Funzione che gestisce il click per gestire la disconnessione da Twitter
         * @method logoutTwitter
         * @return
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

            setSpinner(true);
            $http({
                method: 'POST',
                url: 'http://localhost:8080/progetto/api/disconnectTwitter',
                data: requestLogout
            }).then(function success(response) {
                setSpinner(false);
                if (consoleLogs) console.log(response.data.disconnected);
                if (response.data.disconnected) {
                    $scope.twitterLogged = false;
                    twitterLogin = false;
                    alertSuccess("You are disconnected from Twitter!");
                    if ($location.path().toString().localeCompare('/myRecipes') == 0) {
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }
                    if ($location.path().toString().localeCompare('/index/myRecipes') == 0) {
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }

                } else {
                    alertError("Some problem occurred, please retry");
                }

                if (consoleLogs) console.log($scope.twitterLogged);
            }, function error() {
                setSpinner(false);
                $('#loginTwitterModal').modal('hide');
                alertError("Failed to disconnet from Twitter. (code 234)");

                if (consoleLogs) console.log($scope.twitterLogged);
            });

        };

        /**
         * Funzione che gestisce il click per gestire il corretto routing delle pagine
         * @method routeListener
         * @param {} nextRoute
         * @return
         */
        $scope.routeListener = function (nextRoute) {
            //cc>
            //alert(nextRoute + " X");
            if (nextRoute == 0) {
                nextPath = ulrTriggreGlobalVariable;
                //  alert(nextPath);
            }
            else {
                if (nextRoute == 1) {
                    nextPath = urlActionGlobalVariable;

                }
                else {
                    if (nextRoute.localeCompare('currentUrl') == 0) {
                        console.log('next url: ' + $location.url());
                        nextPath = $location.url();
                        rootingAutenticationTriggerAction = $location.url();
                    } else {
                        nextPath = nextRoute;
                        rootingAutenticationTriggerAction = nextRoute;
                    }
                }
            }

            //<cc
            //if(consoleLogs) console.log("routeListener(nextRoute): "+nextPath);
        };

        /*   Funzione deprecata non più usata */


        //  $scope.RequestRecipes = function ()
        /**
         * Description
         * @method loadRecipesAndSeeThem
         * @return
         */
        $scope.loadRecipesAndSeeThem = function () {


            url = "#/index/myRecipes";
            window.location.replace(url);


        };


        /**
         * Description
         * @method saveRecipeDescription
         * @return
         */
        $scope.saveRecipeDescription = function () {
            //Prende la descrizione della ricetta

            importFlag = false;


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


            $scope.recipedDescriptionInput = "";
            flagTriggerDone = false;
            //Mando i dati al server con i due modulini + la descrizione.
            if (modifyVar == true) {
                sendingToServerAllput();
            }
            else
                sendingToServerAll();
        };


        $scope.closeModal = function () {
            $('#loginIFTTTModal').modal('hide');
        };


        $scope.deleteAccount = function () {


            sweet.show({
                title: 'Confirm',
                text: 'Delete your account?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: false
            }, function () {

                sweet.show({
                    title: 'Please ',
                    text: 'insert your password:',
                    type: 'input',
                    inputType: "password",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: 'slide-from-top',
                    inputPlaceholder: 'you password here',
                    showLoaderOnConfirm: true
                }, function (inputValue) {
                    if (inputValue === false) {
                        return false;
                    }

                    setSpinner(true);
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/progetto/api/deleteAccount',
                        contentType: "application/json",
                        data: {
                            //deleteAccount: true,
                            //password: inputValue
                            "newpassword": inputValue
                        }
                    }).then(function success(response) {
                        setSpinner(false);
                        switch (response.data) {
                            // Se == 0 allora l'account è rimosso con successo
                            case 0:
                            {
                                if (response) {
                                    $scope.iftttLogged = false;
                                    iftttLogin = false;
                                    $scope.googleLogged = false;
                                    googleLogin = false;
                                    $scope.twitterLogged = false;
                                    twitterLogin = false;
                                    console.log("Your account has been removed.\n Hope to see you soon, goodbye!");
                                    sweet.show('Nice!', 'Your account has been removed.\n Hope to see you soon, goodbye!', 'success');
                                    window.location.replace('#');
                                } else {
                                    console.log("Due to server problems your account can't be delete now.\n Please retry.");
                                    sweet.show('Sorry', "Due to server problems your account can't be delete now.\n Please retry.", 'error');
                                }
                                //    if(response.data.disconnected.localeCompare("true")==0){
                                return false;
                            }

                                console.log("0");
                            // Se == -1 allora c'è un errore sconosciuto
                            case -1:
                            {
                                console.log("-1");
                                alertWarning("There has been a error...");
                                return false;
                            }

                            // Se == -2 allora l'utente ha inserito la password sbagliata
                            case -2:
                            {
                                console.log("You password is not right");
                                console.log("-2");
                                alertWarning("Your password is not right.");
                                return false;
                            }

                        }
                        alertWarning("Non è entrato dentro un case.");


                    }, function error() {
                        console.log("sssssswww");
                        setSpinner(false);
                        alertError("Some problem occurred. (code 751)");
                    });
                });

            });
        };


        $scope.removeAllRecipes = function () {


            sweet.show({
                title: 'Confirm',
                text: 'Delete all recipes?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, delete them all!',
                closeOnConfirm: false
            }, function () {

                setSpinner(true);

                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/progetto/api/deleteAllRecipes',
                    contentType: "application/json",
                    data: {deleteAllRecipes: true}
                }).then(function success(response) {
                    //console.log(JSON.stringify(response.data));
                    console.log(JSON.stringify(response.data.deleted));
                    setSpinner(false);

                    // Se == 0 oopure se == true allora le ricette sono rimosse con successo
                    if (response.data.deleted == 0) {
                        console.log("All recipes are deleted.");
                        sweet.show('Nice!', 'Your recipes are been removed.', 'success');
                        window.location.replace('#index/myRecipes');

                        // Se == -2 allora non ci sono ricette da rimuover
                    } else if (response.data.deleted == -2) {
                        console.log("There are not recipes.");
                        sweet.show('Sorry', "There are any recipes to remove.", 'info');

                        // Se == -1 e in tutti gli altri casi è un errore inatteso
                    } else {
                        console.log("Due to server problems your recipes can't be deleted.\n Please retry.");
                        sweet.show('Sorry', "Due to server problems your recipes can't be deleted.\n Please retry.", 'error');
                    }

                }, function error() {
                    setSpinner(false);
                    alertError("Some problem occurred. (code 121)");
                });

            });
        };


    }]);


iftttApp.controller('SuccessControllerRegistration', ['$scope', '$routeParams',
    function () {


    }]);


iftttApp.controller('SuccessController', ['$scope', '$routeParams',
    function () {


        if (modifyVar == 1) {

            if (flagTriggerDone == true) {
                //alert("Warning you must compile before the action form");
                //alertVariable = "Warning you must compile before the action form";
                //alertFunction();
                alertWarning("you must compile before the action form");
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


iftttApp.controller('homeController', ['$scope', '$routeParams',
    function ($scope) {

        /**
         * Description
         * @method loadHome
         * @return
         */
        $scope.loadHome = function () {
            if (consoleLogs) console.log("homeController: loaded");
        }

    }]);

iftttApp.controller('createRecipeController', ['$scope', '$routeParams',
    function ($scope) {
        modifyVar = 0;
        /**
         * Description
         * @method loadHome
         * @return
         */
        $scope.loadHome = function () {
            if (consoleLogs) console.log("createRecipeController: loaded");
        }

    }]);


iftttApp.controller('ifCreatorActionController', ['$scope', '$routeParams', '$window',
    function ($scope, $rootscope, $window) {

        $scope.NGgoogleLogged = false;
        $scope.modifyButton = false;

        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


    }]);


iftttApp.controller('ifCreatorController', ['$scope', '$routeParams', '$window',
    function ($scope, $rootscope, $window) {

        $scope.NGgoogleLogged = false;
        $scope.modifyButton = false;

        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


        // A
        $scope.$watch(
            function () {
                //if(consoleLogs) console.log("angular: "+$window.googleLogged);
                return $window.googleLogged
            }, function (n) {
                // if(consoleLogs) console.log("changed ",n);
            },
            true
        );

        // B

    }]);

iftttApp.controller('doCreatorController', ['$scope',
    function ($scope) {

        $scope.modifyButton = false;

        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


        /**
         * Description
         * @method loadHome
         * @return
         */
        $scope.loadHome = function () {
            if (consoleLogs) console.log("createRecipeController: loaded");
        }

    }]);

iftttApp.controller('doCreatorController', ['$scope', '$routeParams',
    function ($scope, $rootscope, $routeParams, $http, $resource) {


    }]);


//fxr>
iftttApp.controller('myRecipesController', ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http) {

        //METTO UN CONTROLLO PER SAPERE SE L'UTENTE E' AUTENTICATO
        $http({
            url: 'http://localhost:8080/progetto/api/prova',
            method: "POST",
            dataType: 'application/json'
        }).then(function success(response) {
            //if (consoleLogs) console.log(response);
            //if (consoleLogs) console.log(JSON.stringify(response.data.iftttLogged) + "locale" + response.data.iftttLogged.localeCompare("true"));
            if (response.data.iftttLogged.localeCompare("true") == 0) {
                $scope.iftttLogged = true;
                iftttLogin = true;
            }
            if (response.data.googleLogged.localeCompare("true") == 0) {
                $scope.googleLogged = true;
                googleLogin = true;
            }
            if (response.data.twitterLogged.localeCompare("true") == 0) {
                $scope.twitterLogged = true;
                twitterLogin = true;
            }


            if (iftttLogin == true) {
                $scope.userRecipes = [];
                modifyVar = 0;

                $scope.elements = [];


                /**
                 * Per la RICEZIONE DELLE RICETTE (get), vi ritorno la lista delle ricette (list), altrimenti null.
                 */

                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/progetto/api/userRecipes'
                }).then(function success(response) {
                        if (response == null) {
                            //alertVariable = "Error: there is a error!!!";
                            //alertFunction();
                            alertError("An unknown error occurred. (code: 142");

                        }
                        else {
                            $scope.userRecipes = response.data;

                            var tmp = 0;
                            if( $scope.userRecipes != null) {
                                $scope.userRecipes.forEach(function (element) {
                                    element.index = tmp;
                                    tmp++;
                                });
                            }



                            /*  *************/
                        }

                    },
                    function error(response) {
                        //alertVariable = "Error: there is a error!!!";
                        //alertFunction();
                        alertError("An unknown error occurred. (code: 136");

                    });
            }


            //if (consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
            $scope.iftttLogged = false;
            iftttLogin = false;
            //if (consoleLogs) console.log($scope.iftttLogged);

            //Print a error
            //alertVariable = "Error: there is a error!!!";
            //alertFunction();
            alertError("An unknown error occurred. (code: 121");

        });


        /**
         * Description
         * @method removeRecipe
         * @param {} index
         * @param {} id
         * @return
         */

        //fxr<

        //fxr>

        /*
         0 se è andato a buon fine
         -1 se qualcosa è andato storto.
         */
        $scope.removeRecipe = function (index, id) {
            $http
            (
                {
                    method: 'delete',
                    url: 'http://localhost:8080/progetto/api/userRecipes/' + id
                }
            ).error(function () {
                    //alertVariable = "Warning: there are been some errors";
                    //alertFunction();
                    alertError("An unknown error occurred. (code: 338)");
                    //alert("error");
                })
                .success(function (response) {
                    if (response == 0) {
                        //alertVariable = "SUCCESS!!!";
                        //alertFunction();
                        alertSuccess("The recipe was removed");

                        $scope.userRecipes.splice(index, 1);
                    }
                    else {
                        //alertVariable = "Warning: there are been some errors";
                        //alertFunction();
                        alertError("An unknown error occurred. (code: 632)");
                    }


                });
        };

        //fxr<
        /**
         * Description
         * @method shareRecipe
         * @param {} index
         * @param {} id
         * @return
         */
        $scope.shareRecipe = function (index, id) {

            //alert(true);
            var flagDataSend = $scope.userRecipes[index];
            flagDataSend.publish = true;
            //$scope.userRecipes[index].publish = true;
            //alert($scope.userRecipes[index].publish);
            setSpinner(true);
            $http
            (
                {
                    method: "put",
                    url: "http://localhost:8080/progetto/api/publish/userRecipes/" + id,
                    data: flagDataSend.publish,
                    contentType: "application/json"
                }
            ).error(function () {
                    setSpinner(false);
                    // Error code here
                    //alertVariable = "Warning: there are been some errors";
                    //alertFunction();
                    alertError("An unknown error occurred. (code: 114");
                    //alert("error");
                })
                .success(function () {
                        setSpinner(false);
                        $scope.userRecipes[index].publish = true;
                        //alertVariable = "Success: now your repice is public";
                        //alertFunction();
                        alertSuccess("You recipe was successfully published!");
                        //alert("o.k. true");
                    }
                );

        };


        //Rosso don't share
        /**
         * Description
         * @method DoNotshareRecipe
         * @param {} index
         * @param {} id
         * @return
         */
        $scope.DoNotshareRecipe = function (index, id) {

            //alert("2");
            var flagDataSend = $scope.userRecipes[index];
            flagDataSend.publish = false;
            //$scope.userRecipes[index].publish = false;
            //alert($scope.userRecipes[index].publish);
            setSpinner(true);
            $http
            (
                {
                    method: "put",
                    url: "http://localhost:8080/progetto/api/publish/userRecipes/" + id,
                    data: flagDataSend.publish,
                    contentType: "application/json"
                }
            ).error(function () {
                    setSpinner(false);
                    // Error code here
                    //alertVariable = "Warning: sorry there have been some mistake!";
                    //alertFunction();
                    alertError("An unknown error occurred. (code: 837)");
                    //alert("error");
                })
                .success(function () {
                    setSpinner(false);
                    $scope.userRecipes[index].publish = false;
                    //alert("o.k. false");
                    //alertVariable = "Success: your recpice is now private";
                    //alertFunction();
                    alertSuccess("You recipe is now private.");
                });

        };

        //Salva i valori del vettore dentro alle variabili globali.
        /**
         * Description
         * @method modifyRecipe
         * @param {} index
         * @return
         */
        $scope.modifyRecipe = function (index) {


            descriptionRecipeGlobal = $scope.userRecipes[index].description;
            idRecipe = $scope.userRecipes[index].id;
            triggreGlobalVariable = $scope.userRecipes[index].trigger.triggerType;
            actionGlobalVariable = $scope.userRecipes[index].action.actionType;
            publishRecipeGlobal = $scope.userRecipes[index].publish;


            //[Bisognerebbe forse usare ingredient code visto che è stato introdotto]


            if (triggreGlobalVariable == "gmail") {
                sender_GmailTriggerController = $scope.userRecipes[index].trigger.sender;
                subject_GmailTriggerController = $scope.userRecipes[index].trigger.subject;
                ulrTriggreGlobalVariable = "gMailTrigger";

                modulinoj1 =
                {
                    "ingredientCode": 13,
                    "triggerType": "gmail",
                    "sender": sender_GmailTriggerController,
                    "subject": subject_GmailTriggerController
                };

            }
            else {

                if (triggreGlobalVariable == "calendar") {
                    if (0 == $scope.userRecipes[index].trigger.eventAction) {
                        title_Trigger1GcalendarController = $scope.userRecipes[index].trigger.title;
                        description_Trigger1GcalendarController = $scope.userRecipes[index].trigger.description;
                        place_Trigger1GcalendarController = $scope.userRecipes[index].trigger.location;
                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                        ulrTriggreGlobalVariable = "Trigger1Gcalendar";

                        modulinoj1 =
                        {
                            "ingredientCode": 11,
                            "triggerType": "calendar",
                            "eventAction": false,


                            "title": title_Trigger1GcalendarController,
                            "description": description_Trigger1GcalendarController,
                            "location": place_Trigger1GcalendarController
                        };


                    }
                    else {
                        title_Trigger2GcalendarController = $scope.userRecipes[index].trigger.title;
                        description_Trigger2GcalendarController = $scope.userRecipes[index].trigger.subject;
                        place_Trigger2GcalendarController = $scope.userRecipes[index].trigger.location;
                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.eventAction;
                        ulrTriggreGlobalVariable = "Trigger2Gcalendar";

                        modulinoj1 =
                        {
                            "ingredientCode": 12,
                            "triggerType": "calendar",
                            "eventAction": true,

                            "title": title_Trigger2GcalendarController,
                            "description": description_Trigger2GcalendarController,
                            "location": place_Trigger2GcalendarController
                        };


                    }

                }
                else {
                    if (triggreGlobalVariable == "weather") {

                        if ($scope.userRecipes[index].trigger.type == 1) {
                            idCity_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.location;
                            locationName_ControllerTrigger1 = $scope.userRecipes[index].trigger.locationName;
                            timezone_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.timezone;
                            ora_customWeatherActionControllerTrigger1 = $scope.userRecipes[index].trigger.ora;
                            subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                            ulrTriggreGlobalVariable = "WeatherTrigger1";

                            modulinoj1 =
                            {
                                "ingredientCode": 14,
                                "triggerType": "weather",
                                "type": "1",
                                "location": idCity_customWeatherActionControllerTrigger1,
                                "locationName": locationName_ControllerTrigger1,
                                "ora": ora_customWeatherActionControllerTrigger1,
                                "timezone": timezone_customWeatherActionControllerTrigger1
                            };


                        }
                        else {
                            if ($scope.userRecipes[index].trigger.type == 3) {

                                idCity_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.location;
                                locationName_ControllerTrigger2 = $scope.userRecipes[index].trigger.locationName;
                                pweather_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.tempo;
                                pperiod_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.period;
                                pzone_customWeatherActionControllerTrigger2 = $scope.userRecipes[index].trigger.timezone;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "WeatherTrigger2";

                                modulinoj1 =
                                {
                                    "ingredientCode": 15,
                                    "triggerType": "weather",
                                    "type": "3",
                                    "location": idCity_customWeatherActionControllerTrigger2,
                                    "locationName": locationName_ControllerTrigger2,
                                    "tempo": pweather_customWeatherActionControllerTrigger2,
                                    "period": pperiod_customWeatherActionControllerTrigger2,
                                    "timezone": pzone_customWeatherActionControllerTrigger2
                                };


                            }
                            else {
                                if ($scope.userRecipes[index].trigger.type == 2) {
                                    idCity_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.location;
                                    locationName_ControllerTrigger3 = $scope.userRecipes[index].trigger.locationName;
                                    timezone_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.timezone;
                                    sunset_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunset;
                                    sunrise_customWeatherActionControllerTrigger3 = $scope.userRecipes[index].trigger.sunrise;
                                    subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                    ulrTriggreGlobalVariable = "WeatherTrigger3";
                                    modulinoj1 =
                                    {
                                        "ingredientCode": 16,
                                        "triggerType": "weather",
                                        "type": "2",
                                        "location": idCity_customWeatherActionControllerTrigger3,
                                        "locationName": locationName_ControllerTrigger3,
                                        "timezone": timezone_customWeatherActionControllerTrigger3,
                                        "sunset": sunset_customWeatherActionControllerTrigger3,
                                        "sunrise": sunrise_customWeatherActionControllerTrigger3


                                    };
                                }
                                else {
                                    if ($scope.userRecipes[index].trigger.type == 4) {
                                        idCity_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.location;
                                        locationName_ControllerTrigger4 = $scope.userRecipes[index].trigger.locationName;
                                        ptimezone_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.timezone;
                                        pthmax_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmax;
                                        pthmin_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.thmin;
                                        period_customWeatherActionControllerTrigger4 = $scope.userRecipes[index].trigger.period;
                                        subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                        ulrTriggreGlobalVariable = "WeatherTrigger4";
                                        modulinoj1 =
                                        {
                                            "ingredientCode": 17,
                                            "triggerType": "weather",
                                            "type": "4",
                                            "location": idCity_customWeatherActionControllerTrigger4,
                                            "locationName": locationName_ControllerTrigger4,
                                            "timezone": ptimezone_customWeatherActionControllerTrigger4,
                                            "thmax": pthmax_customWeatherActionControllerTrigger4,
                                            "thmin": pthmin_customWeatherActionControllerTrigger4,
                                            "period": period_customWeatherActionControllerTrigger4
                                        };
                                    }
                                }

                            }

                        }

                    }
                    else {
                        if (triggreGlobalVariable == "twitter") {

                            if ($scope.userRecipes[index].trigger.type == 0) {
                                hashtag_text_trigger1TwitterController = $scope.userRecipes[index].trigger.hashtag_text;
                                username_sender_trigger1TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "Trigger1Twitter";

                                modulinoj1 =
                                {
                                    "ingredientCode": 18,
                                    "triggerType": "twitter",
                                    "type": false,
                                    "hashtag_text": hashtag_text_trigger1TwitterController,
                                    "username_sender": username_sender_trigger1TwitterController
                                };

                            }
                            else {
                                hashtag_text_trigger2TwitterController = $scope.userRecipes[index].trigger.hashtag_text;
                                username_sender_trigger2TwitterController = $scope.userRecipes[index].trigger.username_sender;
                                subTriggerGlobalVariable = $scope.userRecipes[index].trigger.type;
                                ulrTriggreGlobalVariable = "Trigger2Twitter";

                                modulinoj1 =
                                {
                                    "ingredientCode": 19,
                                    "triggerType": "twitter",
                                    "type": true,
                                    "hashtag_text": hashtag_text_trigger2TwitterController,
                                    "username_sender": username_sender_trigger2TwitterController
                                };
                            }

                        }

                    }
                }
            }


            if (actionGlobalVariable == "calendar") {
                title_action1GcalendarController = $scope.userRecipes[index].action.title;
                subjectReceive_action1GcalendarController = $scope.userRecipes[index].action.description;
                place_action1GcalendarController = $scope.userRecipes[index].action.location;
                //yearVector_action1GcalendarController = $scope.userRecipes[index].action.yearVector;
                //monthVector_action1GcalendarController = $scope.userRecipes[index].action.monthVector;
                //dayVector_action1GcalendarController = $scope.userRecipes[index].action.dayVector;
                //hourStart_action1GcalendarController = $scope.userRecipes[index].action.hourStart;
                //minuteStart_action1GcalendarController = $scope.userRecipes[index].action.minuteStart;
                startDate__action1GcalendarController = $scope.userRecipes[index].action.startDate;
                dur_action1GcalendarController = $scope.userRecipes[index].action.duration;
                urlActionGlobalVariable = "action1Gcalendar";

                /*
                 var startDate = null;
                 if(yearVector_action1GcalendarController!=null && monthVector_action1GcalendarController!=null &&
                 dayVector_action1GcalendarController!=null && hourStart_action1GcalendarController!=null && minuteStart_action1GcalendarController!=null) {
                 startDate = yearVector_action1GcalendarController + "-" + monthVector_action1GcalendarController
                 + "-" + dayVector_action1GcalendarController + "T" + hourStart_action1GcalendarController
                 + ":" + minuteStart_action1GcalendarController + ":00";
                 }

                 var dur = null;
                 if(durationHour_action1GcalendarController!=null && durationMinute_action1GcalendarController!=null) {
                 dur = (durationHour_action1GcalendarController * 60 * 60 * 1000) + (durationMinute_action1GcalendarController * 60 * 1000);
                 }

                 */


                modulinoj2 =
                {
                    "ingredientCode": 21,
                    "actionType": "calendar",
                    //An 2
                    "title": title_action1GcalendarController,
                    "description": subjectReceive_action1GcalendarController,
                    "location": place_action1GcalendarController,
//                    "yearVector": yearVector_action1GcalendarController,
//                    "monthVector": monthVector_action1GcalendarController,
//                    "dayVector": dayVector_action1GcalendarController,
//                    "hourStart": hourStart_action1GcalendarController,
//                    "minuteStart":  minuteStart_action1GcalendarController
                    "startDate": startDate__action1GcalendarController,
                    "duration": dur_action1GcalendarController

                };

            }
            else {
                if (actionGlobalVariable == "gmail") {
                    body_GmailActionController = $scope.userRecipes[index].action.body;
                    receiver_GmailActionController = $scope.userRecipes[index].action.receiver;
                    sender_GmailActionController = $scope.userRecipes[index].action.sender;
                    subject_GmailActionController = $scope.userRecipes[index].action.subject;
                    urlActionGlobalVariable = "gMailAction";

                    modulinoj2 =
                    {
                        "ingredientCode": 22,
                        "actionType": "gmail",
                        "body": body_GmailActionController,
                        "receiver": receiver_GmailActionController,
                        "sender": sender_GmailActionController,
                        "subject": subject_GmailActionController
                    };


                }
                else {
                    if ($scope.userRecipes[index].action.ingredientCode == 23) {
                        subject_action1TwitterController = $scope.userRecipes[index].action.body;
                        subActionGlobalVariable = false;
                        urlActionGlobalVariable = "Action1Twitter";

                        modulinoj2 =
                        {
                            "ingredientCode": 23,
                            "actionType": "twitter",
                            "type": false,
                            "body": subject_action1TwitterController,
                            "destination": null

                        };

                    }
                    else {
                        title_action2TwitterController = $scope.userRecipes[index].action.destination;
                        subjec_action2TwitterController = $scope.userRecipes[index].action.body;
                        subActionGlobalVariable = true;
                        urlActionGlobalVariable = "Action2Twitter";

                        modulinoj2 =
                        {
                            "ingredientCode": 24,
                            "actionType": "twitter",
                            "type": true,
                            "destination": title_action2TwitterController,
                            "body": subjec_action2TwitterController

                        };

                    }


                }

            }


            modifyVar = 1;
            var url = "#choseModify";
            window.location.replace(url);

        };


    }]);


iftttApp.controller('createRecipeActionController', ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http) {
        $scope.backPersonalTrigger = function () {

            window.location.replace(backPageVariabile);

        }


    }]);


iftttApp.controller('publicRecipesController', ['$scope', '$routeParams', '$window', '$http',
    function ($scope, $routeParams, $window, $http) {

        $scope.ngImportRecipeAlert = function (triggerCode, actionCode) {
            swal({
                title: "Do you like this recipe?",
                text: "Good! You have to customize it to continue.",
                type: "info",
                showCancelButton: true,
                confirmButtonText: "Yes, import this recipe and let me customize it!",
                cancelButtonText: "No, I don't like it anymore"
            }, function (isConfirm) {
                if (isConfirm) {

                    // LE TRE VARIABILI *GLOBALI* PER FXR!!
                    importFlag = true;
                    triggerImportRoute = getRoute(triggerCode); //Se triggerCode è "14" allora ti ritorna "/WeatherTrigger1" cmq puoi fare degli alert per testare
                    actionImportRoute = getRoute(actionCode);

                    window.location.replace('#' + triggerImportRoute);

                    /*
                     alert("implementare qui le funzioni che permettono di continuare l'importazione della ricetta (engine.js riga 1864 xxx)");
                     alert("devo andare nel trigger form :" + triggerCode);
                     alert("e POI devo andare nell'action form :" + actionCode);
                     */

                } else {
                    window.location.replace('#publicRecipes');
                }
            });

        };

        //METTO UN CONTROLLO PER SAPERE SE L'UTENTE E' AUTENTICATO

        $scope.iftttLogged = false;
        iftttLogin = false;

        $scope.googleLogged = false;
        googleLogin = false;

        $scope.twitterLogged = false;
        twitterLogin = false;

        $http({
            url: 'http://localhost:8080/progetto/api/prova',
            method: "POST",
            dataType: 'application/json',
            contentType: "application/json"
        }).then(function success(response) {
            if (consoleLogs) console.log(response);

            if (response.data.iftttLogged.localeCompare("true") == 0) {
                $scope.iftttLogged = true;
                iftttLogin = true;
            }
            if (response.data.googleLogged.localeCompare("true") == 0) {
                $scope.googleLogged = true;
                googleLogin = true;
            }
            if (response.data.twitterLogged.localeCompare("true") == 0) {
                $scope.twitterLogged = true;
                twitterLogin = true;
            }


            //if(consoleLogs) console.log($scope.iftttLogged);
        }, function error() {
            $('#loginIFTTTModal').modal('hide');
            alertError("Some server error occurred. (code 567)");

            $scope.iftttLogged = false;
            iftttLogin = false;
            if (consoleLogs) console.log($scope.iftttLogged);
        });


        $scope.userRecipes = null;
        modifyVar = 0;
        $scope.elements = [];


        $http
        (
            {
                url: 'http://localhost:8080/progetto/api/publish/userRecipes',
                method: "GET",
                dataType: 'application/json',
            }
        )
            .then
            (
                function success(response) {
                    console.log(response.data);
                    $scope.userRecipes = response.data;

                    var tmp = 0;
                    if( $scope.userRecipes != null) {
                        $scope.userRecipes.forEach(function (element) {
                            element.index = tmp;
                            tmp++;
                        });
                    }

                },
                function error(response) {
                    alertInfo("Sorry, in this moment there is not public recipes.");
                }
            );


    }]);


iftttApp.controller('createAccountController', ['$scope',
    function ($scope) {

        $scope.registrationTimezone = "Europe/Rome";

        /**
         * Description
         * @method createAccountFunc
         * @param {} user
         * @param {} email
         * @param {} pws1
         * @param {} pws2
         * @return
         */
        $scope.createAccountFunc = function (user, email, pws1, pws2, timezone) {

            $scope.parallax = true;

            if (angular.isDefined(email) && angular.isDefined(user) && angular.isDefined(pws1) && angular.isDefined(pws2)) {
                if (pws1.localeCompare(pws2) == 0 && pws1.length > 7) {
                    var loginDataSend =
                    {
                        "username": user,
                        "email": email,
                        "password": pws1,
                        "timezone": $scope.registrationTimezone
                    };

                    //if(consoleLogs) console.log(loginDataSend.user);
                    setSpinner(true);
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
                        /**
                         * Description
                         * @method success
                         * @return
                         */
                        /**
                         Per la REGISTRAZIONE vi ritorno una variabile i che può avere i seguenti casi:
                         i=0 : You have successfully signed. To complete the registration, please check your email
                         i=1 : user already exist
                         i=2 : email already exist
                         i=3 : email not valid
                         i=4 : password too short
                         i=5 : username too short
                         i=6 : some errors
                         **/
                        success: function (response) {
                            setSpinner(false);
                            //if (consoleLogs) console.log("la post ha avuto successo");
                            //window.location.replace('#');

                            // i=0 : You have successfully signed. To complete the registration, please check your email
                            if (response == 0) {
                                flag_registration_success = true;
                                registrationSent('#/home');

                                //alert("Success"); //Da metterci qualche cosa è solo una prova
                                /*
                                 var i = 0;
                                 [lbl] start:
                                 console.log("Hello, world!");
                                 i++;
                                 if(i < 538) goto start;
                                 */

                            }
                            // i=1 : user already exist
                            if (response == 1) {
                                //alertVariable = "Warning: user already exist";
                                //alertFunction();
                                alertWarning("This username already exists.");

                            }
                            // i=2 : email already exist
                            if (response == 2) {
                                //alertVariable = "Warning: email already exist";
                                //alertFunction();
                                alertWarning("This email already exists.");


                            }
                            // i=3 : email not valid
                            if (response == 3) {
                                //alertVariable = "Warning: email is not valid";
                                //alertFunction();
                                alertInfo("Sorry, this email is not valid.");


                            }
                            // i=4 : password too short
                            if (response == 4) {
                                //alertVariable = "Warning: the password is too short";
                                //alertFunction();
                                alertWarning("This password is too short. Please write a longer one: it must be at least 8 characters lenght.");

                            }
                            // i=5 : username too short
                            if (response == 5) {
                                //alertVariable = "Warning: username too short";
                                //alertFunction();
                                alertWarning("This password is too short. Please write a longer one: it must be at least 4 characters lenght.");

                            }
                            // i=6 : some errors
                            if (response == 6) {
                                //alertVariable = "Sorry there is a error, " +
                                "try again mybe with some parameters or waiting some mitues and reload the site";
                                //alertFunction();
                                alertError("Sorry, some error occurred. Please, wait a minute and try again.");

                            }

                        },
                        /**
                         * Description
                         * @method error
                         * @return
                         */
                        error: function () {
                            setSpinner(false);
                            //alert("some error occurred");
                            //alertVariable = "some error occurred";
                            //alertFunction();
                            alertError("Sorry, some error occurred. (code 634)");

                        }
                    });

                }
                else {
                    if (pws1.localeCompare(pws2) != 0) {
                        //alertVariable = "Warning: the two password is not egual";
                        //alertFunction();
                        alertWarning("The two passwords must be equals");

                    }
                    else {
                        if (pws1.length < 8) {
                            //alertVariable = "Warning: the password  is too short!";
                            //alertFunction();
                            alertWarning("The password is too short, 8 lenght is the minimum accepted.");

                        }
                        else if (pws2.length < 8) {
                            //alertVariable = "Warning: the password  is too short!";
                            //alertFunction();
                            alertWarning("The password is too short, 8 lenght is the minimum accepted.");
                        }

                    }
                }
            }


        };


    }]);


iftttApp.controller('forgotPasswordController', ['$scope',
    function ($scope) {


        /**
         * Description
         * @method forgotPasswordFunc
         * @param {} user
         * @param {} email
         * @return
         */
        $scope.forgotPasswordFunc = function (user, email) {

            $scope.parallax = true;

            if (angular.isDefined(email) && angular.isDefined(user)) {

                var loginDataSend =
                {
                    "username": user,
                    "email": email
                };

                if (consoleLogs) console.log(loginDataSend);
                setSpinner(true);
                $.ajax
                ({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "post",
                    url: "http://localhost:8080/progetto/api/forgotPassword",
                    data: JSON.stringify(loginDataSend),
                    dataType: "json",
                    /**
                     * Description
                     * @method success
                     * @return
                     */
                    /**
                     code:
                     0 success
                     -1 error
                     -2 invalid username
                     -3 invalid email
                     **/
                    success: function (response) {
                        setSpinner(false);
                        //if (consoleLogs) console.log("la post ha avuto successo");
                        //window.location.replace('#');

                        console.log(response);
                        switch (response) {
                            case 0:
                            {
                                swal({
                                    title: "Success!",
                                    text: "Your new credentials has been sent by email.",
                                    type: "success"
                                    //confirmButtonColor: "#DD6B55",
                                    //confirmButtonText: "Yes, delete it!",
                                    //closeOnConfirm: true
                                }, function () {
                                    window.location.replace('#home');
                                });
                                break;
                            }
                            case -1:
                            {
                                alertWarning("Some unknown error occurred. (code 2805).");
                                break;
                            }
                            case -2:
                            {
                                alertWarning("The username is not valid.");
                                break;
                            }
                            case -3:
                            {
                                alertWarning("The e-mail address is not valid");
                                break;
                            }
                        }


                    },
                    /**
                     * Description
                     * @method error
                     * @return
                     */
                    error: function () {
                        setSpinner(false);
                        //alert("some error occurred");
                        //alertVariable = "some error occurred";
                        //alertFunction();
                        alertError("Sorry, some error occurred. (code 634)");

                    }
                });

            }


        };


    }]);


//fxr>
iftttApp.controller('passwordChangeController', ['$scope', '$http',
    function ($scope, $http) {

	  $http({
          url: 'http://localhost:8080/progetto/api/infoProfile',
          method: "GET",
          dataType: 'application/json', 
          contentType: "application/json" 
      }).then(function success(response) {
          if (consoleLogs) console.log(response);
          
          if(response!=null && response.data!=null) {
        	  $scope.infoProfile = response.data;
        	  console.log( $scope.infoProfile);
          }
         

      }, function error() {
          $('#loginIFTTTModal').modal('hide');
          alertError("Some server error occurred. (code 987)");

      });

	
	
        /**
         * Description
         * @method passwordChangeFunc
         * @param {} pws1
         * @param {} pws2
         * @return
         */
        $scope.vettore = [];
        
        $scope.vettore.registrationTimezone = "Pacific/Midway";

        /*
         0 se è andato a buon fine,
         -1 se qualcosa è andato storto,
         -2 se la nuova password è troppo corta
         */
        $scope.passwordChangeFunc = function () {
            var flagPassword = 0;
            var flagtimezone = 0;
            var flagSend = true;

            if (angular.isDefined($scope.vettore.pwsold)) {
                if ($scope.vettore.pwsold.length < 8) {
                    flagSend = false;
                    alertWarning("The old password is too short");
                }

            }
            else {
                flagSend = false;
                alertWarning("The old password is required");
            }
            if (flagSend == false);
            else {
                if ($scope.checkPaswssord == true || $scope.newTimeZone == true) {
                    if (angular.isDefined($scope.vettore.pws1) && angular.isDefined($scope.vettore.pws2) && $scope.checkPaswssord == true) {
                        if ($scope.vettore.pws1.localeCompare($scope.vettore.pws2) == 0) {
                            if ($scope.vettore.pws1.length < 8 || $scope.vettore.pws2.length < 8) {
                                alertWarning("The password is too short, 8 lenght is the minimum accepted.");
                                flagPassword = 3;
                                $scope.vettore.pws1 = null;
                            }
                            else {
                                flagPassword = 1;
                            }
                        }
                        else {
                            alertWarning("The two passord are not equals.");
                            flagPassword = 3;
                            $scope.vettore.pws1 = null;
                        }

                    }
                    else {
                        if ($scope.checkPaswssord == true) {

                            alertWarning("The password field is empty.");
                            flagPassword = 3;
                        }

                    }
                    if ($scope.checkPaswssord == false) {
                        flagPassword = 0;
                        $scope.vettore.pws1 = null;
                    }

                    //Controllo time zone
                    if ($scope.newTimeZone == false) {
                        flagtimezone = 0;
                        $scope.vettore.registrationTimezone = null;
                    }
                    else {
                        flagtimezone = 1;
                        if (angular.isDefined($scope.vettore.registrationTimezone));
                        else {
                            flagtimezone = 3;
                            alertWarning("Your timeZone is not defined...");
                        }

                    }

                    // alert("1");
                    if (flagtimezone == 1 || flagPassword == 1 && (flagtimezone != 3 && flagPassword != 3)) {

                        if (flagtimezone == 1)flagtimezone = true;
                        else flagtimezone = false;

                        if (flagPassword == 1)flagPassword = true;
                        else flagPassword = false;
                        console.log("flagtimezone " + flagtimezone + "  timezone " + $scope.vettore.registrationTimezone + " flagPassword " + flagPassword + " oldpassword " + $scope.vettore.pwsold + "  newpassword " + $scope.vettore.pws1);

                        //   alert("2");
                        var loginDataSend =
                        {
                            "flagTimezone": flagtimezone,
                            "timezone": $scope.vettore.registrationTimezone,
                            "flagPassword": flagPassword,
                            "oldpassword": $scope.vettore.pwsold,
                            "newpassword": $scope.vettore.pws1

                        };
                        // alert("here1");


                        setSpinner(true);
                        $.ajax
                        ({
                            contentType: "application/json",
                            method: "post",
                            url: "http://localhost:8080/progetto/api/changepassword",
                            data: JSON.stringify(loginDataSend),

                            success: function (response) {
                                setSpinner(false);
                                //if (consoleLogs) console.log("(passwordRecoveryController): ricevuta correttamente una risposta dal server");
                                //alert("La password è stata modificata con successo");


                                switch (response) {
                                    case 0:
                                    {
                                        alertPasswordChangedSuccess();
                                        break;
                                    }
                                    case 1:
                                    {
                                        swal({
                                            title: "Success!",
                                            text: "Your passowrd has been changed.",
                                            type: "success"
                                            //confirmButtonColor: "#DD6B55",
                                            //confirmButtonText: "Yes, delete it!",
                                            //closeOnConfirm: true
                                        }, function () {
                                            window.location.replace('#myRecipes');
                                        });
                                        break;
                                    }
                                    case 2:
                                    {
                                        swal({
                                            title: "Success!",
                                            text: "Your timezone  has been changed.",
                                            type: "success"
                                            //confirmButtonColor: "#DD6B55",
                                            //confirmButtonText: "Yes, delete it!",
                                            //closeOnConfirm: true
                                        }, function () {
                                            window.location.replace('#myRecipes');
                                        });
                                        break;
                                    }
                                    case -1:
                                    {
                                        alertWarning("Some unknown error occurred. (code 2805).");
                                        break;
                                    }

                                    case -2:
                                    {
                                        alertWarning("The old password is not valid.");
                                        break;
                                    }
                                    case -3:
                                    {
                                        alertWarning("The new password is not valid");
                                        break;
                                    }
                                }


                            },


                            error: function () {
                                setSpinner(false);
                                //alertVariable = "some error occurred";
                                //alertFunction();
                                alertError("Some error occurred.");

                            }
                        });
                    }

                }
                else {
                    alertWarning("You have to chose somethings");
                }
            }
        };

        $scope.checkPaswssord = false;
        $scope.newTimeZone = false;

        /*
         0  timezone and password ok
         1  password ok
         2  timezone ok
         -1 some errors
         -2 old password not valid
         -3 new password not valid
         */

    }]);

//<fxr

//Update
iftttApp.controller('GmailTriggerController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope) {

        backPageVariabile = "#gMailTrigger";
        //Bug stringa null

        $scope.flagEmail = "email is empty";
        $scope.gmailinput = [];
        /**
         * Description
         * @method triggerGmail
         * @return
         */
        $scope.triggerGmail = function () {
            var sender = "";
            var subject = "";
            var flag = true;
            triggerChose = 1;
            //if(consoleLogs) console.log($scope.gmailinput.email + " "  + $scope.gmailinput.subjectReceive);

            sender_GmailTriggerController = "";
            subject_GmailTriggerController = "";

            //Firt variable
            if ($scope.checkedEmail == true) {
                if (angular.isDefined($scope.gmailinput)) {
                    if (angular.isDefined($scope.gmailinput.email)) {
                        sender = $scope.gmailinput.email;
                        if (validateEmail(sender));
                        else {
                            $scope.flagEmail = "not valid";
                            flag = false;
                        }


                    }
                    else {
                        sender = "";
                        $scope.flagEmail = "is empty";
                    }
                }
                else {
                    sender = "";
                    $scope.flagEmail = "is empty";
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

            if (flag == true) {
                flagTriggerDone = true;
                sender_GmailTriggerController = sender;
                subject_GmailTriggerController = subject;

                modulinoj1 =
                {
                    "ingredientCode": 13,
                    "triggerType": "gmail",
                    //Tn 1
                    "sender": sender_GmailTriggerController,
                    "subject": subject_GmailTriggerController

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
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }
        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }
        $scope.checkedEmail = false;
        $scope.checkedSubject = false;

        /**
         * Description
         * @method validateEmail
         * @param {} email
         * @return CallExpression
         */
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

        /**
         * Description
         * @method actionGmail
         * @return
         */
        $scope.actionGmail = function () {

            var sender = "";
            var receiver = "";
            var subject = "";
            var body = "";
            var flag = true;
            actionChose = 1;
            //sender_GmailActionController = "";


            receiver_GmailActionController = "";
            subject_GmailActionController = "";
            sender_GmailActionController = "";
            body_GmailActionController = "";


            if (googleLogin == true) {


                if (angular.isDefined($scope.gmailActionvar)) {
                    if (angular.isDefined($scope.gmailActionvar.email)) {
                        receiver = $scope.gmailActionvar.email;

                        if (validateEmail(receiver));
                        else {
                            flag = false;
                            //alert("Your e.mail is not right . . .");
                            //alertVariable = "Your e.mail is not right . . .";
                            //alertFunction();
                            alertWarning("Your email is invalid.");

                        }
                    }
                    else {
                        receiver = "";
                        flag = false;
                        //alert("Your e.mail is not right . . .");
                        //alertVariable = "Your e.mail is not right . . .";
                        //alertFunction();
                        alertWarning("Your email is invalid.");

                    }
                }
                else {
                    receiver = "";
                    flag = false;
                    //alert("Your e.mail is not right . . .");
                    //alertVariable = "Your e.mail is not right . . .";
                    //alertFunction();
                    alertWarning("Your email is invalid.");
                }


                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.gmailActionvar)) {
                        if (angular.isDefined($scope.gmailActionvar.subjectReceive)) {
                            subject = $scope.gmailActionvar.subjectReceive;
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


                if ($scope.checkedBody == true) {
                    if (angular.isDefined($scope.gmailActionvar)) {
                        if (angular.isDefined($scope.gmailActionvar.checkedBody)) {
                            body = $scope.gmailActionvar.checkedBody;
                        }
                        else {
                            body = "";
                        }
                    }
                    else {
                        body = "";
                    }

                }
                else {
                    body = null;
                }

                //radio botton
                if (angular.isDefined($scope.gmailActionvar)) {
                    if (angular.isDefined($scope.gmailActionvar.sender)) {
                        sender = $scope.gmailActionvar.sender;
                    }
                    else {
                        sender = "";
                        flag = false;
                        //alert("You must chose a option between ifttt e.mail or yours");
                        alertVariable = "You must chose a option between ifttt e.mail or yours";
                        alertFunction();

                    }
                }
                else {
                    sender = "";
                    flag = false;
                    //alert("You must chose a option between ifttt e.mail or yours");
                    alertVariable = "You must chose a option between ifttt e.mail or yours";
                    alertFunction();
                }


                //alert(flag + " " + body + " " + subject + " " + receiver + " " + $scope.gmailActionvar.sender);

                if (flag == true) {

                    //flagTriggerDone = false;
                    count = 7;


                    receiver_GmailActionController = receiver;
                    subject_GmailActionController = subject;
                    sender_GmailActionController = sender;
                    body_GmailActionController = body;

                    modulinoj2 =
                    {
                        "ingredientCode": 22,
                        "actionType": "gmail",
                        "body": body_GmailActionController,
                        "receiver": receiver_GmailActionController,
                        "sender": sender_GmailActionController,
                        "subject": subject_GmailActionController
                    };


                    if (modifyVar == 0) {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();
                    //sendingToServerAll();
                    //var url = "#gMailSucces";
                    //window.location.replace(url);
                }
            }
            else {
                //alert("You are not logged in google");
                //alertVariable = "You are not logged in google";
                //alertFunction();
                alertWarning("You are not logged in Google.");
                url = "#createDO";
                window.location.replace(url);
            }


        };
        $scope.checkedEmail = false;
        $scope.checkedSubject = false;
        $scope.checkedbody = false;

        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


        $scope.backfunctionActionPuclicRecipe = function () {
            url = "#" + triggerImportRoute;
            window.location.replace(url);


        };


        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


        /**
         * Description
         * @method validateEmail
         * @param {} email
         * @return CallExpression
         */
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }


    }]);


iftttApp.controller('customWeatherActionControllerTrigger1', ['$scope', '$routeParams',
    function ($scope) {

        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0
        };

        backPageVariabile = "#WeatherTrigger1";

        $scope.errorButton = 'cia';
        $scope.checkadvisetimevar = 'YES';
        $scope.checktimeZonevar = 'NO';
        /**
         * Description
         * @method checkadvisetimefunc
         * @return
         */
        $scope.checkadvisetimefunc = function (/*name*/) {
            if ($scope.checkadvisetimevar === "YES")
                $scope.checkadvisetimevar = 'YES';
            else
                $scope.checkadvisetimevar = 'YES';
            //if(consoleLogs) console.log(name);
        };

        /**
         * Description
         * @method checktimeZonefunc
         * @return
         */
        $scope.checktimeZonefunc = function (/*name*/) {
            if ($scope.checktimeZonevar === "YES")
                $scope.checktimeZonevar = 'NO';
            else
                $scope.checktimeZonevar = 'YES';
            //if(consoleLogs) console.log(name);
        };

        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }

    }]);

iftttApp.controller('customWeatherActionControllerTrigger2', ['$scope',
    function ($scope) {

        backPageVariabile = "#WeatherTrigger2";

        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0,
            value4: 0
        };


        $scope.data =
        {
            availableOptions: [
                {id: '200', name: 'thunderstorm with light rain'},
                {id: '210', name: 'light thunderstorm'},
                {id: '211', name: 'thunderstorm'},
                {id: '212', name: 'heavy thunderstorm'},
                {id: '310', name: 'light intensity drizzle rain'},
                {id: '311', name: 'drizzle rain'},
                {id: '312', name: 'heavy intensity drizzle rain'},
                {id: '500', name: 'light rain'},
                {id: '501', name: 'moderate rain'},
                {id: '502', name: 'heavy intensity rain'},
                {id: '503', name: 'very heavy rain'},
                {id: '600', name: 'light snow'},
                {id: '601', name: 'snow'},
                {id: '602', name: 'heavy snow'},
                {id: '741', name: 'fog'},
                {id: '751', name: 'sand'},
                {id: '761', name: 'dust'},
                {id: '762', name: 'volcanic ash'},
                {id: '800', name: 'clear sky'},
                {id: '801', name: 'few clouds'},
                {id: '804', name: 'overcast clouds'},
                {id: '900', name: 'tornado'},
                {id: '901', name: 'tropical storm'},
                {id: '902', name: 'hurricane'},
                {id: '903', name: 'cold'},
                {id: '904', name: 'hot'},
                {id: '905', name: 'windy'},
                {id: '906', name: 'hail'},
                {id: '962', name: 'hurricane'}
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
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


    }]);


iftttApp.controller('customWeatherActionControllerTrigger3', ['$scope',
    function ($scope) {


        backPageVariabile = "#WeatherTrigger3";
        $scope.trigger1input = {
            value3: 0
        };


        $scope.checkadvisesunset = false;
        $scope.checkadvisesunrise = false;

        $scope.checkadvisesunsetvar = false;
        $scope.checkadvisetsunrisevar = false;
        $scope.checktimeZonevar = false;

        /**
         * Description
         * @method checkadvisesunrisefunc
         * @return
         */
        $scope.checkadvisesunrisefunc = function (/*name*/) {
            if ($scope.checkadvisetsunrisevar === true)
                $scope.checkadvisetsunrisevar = false;
            else
                $scope.checkadvisetsunrisevar = false;
            //if(consoleLogs) console.log(name);
        };

        /**
         * Description
         * @method checkadvisetsunsetfunc
         * @return
         */
        $scope.checkadvisetsunsetfunc = function (/*name*/) {
            if ($scope.checkadvisesunsetvar === true)
                $scope.checkadvisesunsetvar = false;
            else
                $scope.checkadvisesunsetvar = true;
            //if(consoleLogs) console.log(name);
        };

        /**
         * Description
         * @method checktimeZonefunc
         * @return
         */
        $scope.checktimeZonefunc = function (/*name*/) {
            if ($scope.checktimeZonevar === true)
                $scope.checktimeZonevar = false;
            else
                $scope.checktimeZonevar = true;
            //if(consoleLogs) console.log(name);
        };

        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


    }]);


iftttApp.controller('customWeatherActionControllerTrigger4', ['$scope',
    function ($scope) {

        backPageVariabile = "#WeatherTrigger4";
        $scope.checkmodelcheckthmax = false;
        $scope.checkmodelcheckthmin = false;

        $scope.trigger1input = {
            value1: 0,
            value2: 0,
            value3: 0,
            value4: 0
        };
        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }


    }]);

// loginPageController
iftttApp.controller('loginPageController', ['$scope',
    function ($scope) {

        /**
         * Description
         * @method loginfunc
         * @param {} pass
         * @param {} email
         * @return
         */
        $scope.loginfunc = function (pass, email) {
            if (angular.isDefined(email) && angular.isDefined(pass)) {
                var loginDataSend =
                {
                    "password:": pass,
                    "email:": email
                };
                //if(consoleLogs) console.log(loginDataSend.pssword);
                setSpinner(true);
                $.ajax({
                    method: "post",
                    url: "/MyServlet",
                    data: loginDataSend,
                    dataType: "json",
                    /**
                     * Description
                     * @method success
                     * @return
                     */
                    success: function () {
                        if (consoleLogs) console.log("la post ha avuto successo ");
                        setSpinner(false);
                    },
                    error: function () {
                        setSpinner(false);
                    }
                });
            }
        };


        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


    }]);


//Update
iftttApp.controller('Trigger1GcalendarController', ['$scope',
    function ($scope) {

        backPageVariabile = "#Trigger1Gcalendar";

        $scope.trigger1GcalendarVar = [];
        /**
         * Description
         * @method trigger1Gcalendar
         * @return
         */
        $scope.trigger1Gcalendar = function () {
            triggerChose = 2;
            var title;
            var subject;
            var place;


            if (googleLogin == true) {

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
                        "ingredientCode": 11,
                        "triggerType": "calendar",
                        "eventAction": false,

                        //Tn 2 S0
                        "title": title_Trigger1GcalendarController,
                        "description": description_Trigger1GcalendarController,
                        "location": place_Trigger1GcalendarController
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
                //alert("You are sloged from google please relog and redo it");
                //alertVariable = "You are sloged from google please relog and redo it";
                //alertFunction();
                alertWarning("You are not logged in Google.");
                url = "#allTriggers";
                window.location.replace(url);

            }

        };

        $scope.modifyButton = false;
        if (modifyVar == 1) {


            $scope.modifyButton = true;
        }
        else {
            $scope.modifyButton = false;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;


    }]);


iftttApp.controller('Trigger2GcalendarController', ['$scope',
    function ($scope) {

        backPageVariabile = "#Trigger2Gcalendar";
        $scope.trigger2GcalendarVar = [];
        /**
         * Description
         * @method trigger2Gcalendar
         * @return
         */
        $scope.trigger2Gcalendar = function () {
            triggerChose = 3;
            var title;
            var subject;
            var place;

            if (googleLogin == true) {
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
                            if (angular.isDefined($scope.trigger2GcalendarVar.subjectReceive)) {
                                subject = $scope.trigger2GcalendarVar.subjectReceive;
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
                        "ingredientCode": 12,
                        "triggerType": "calendar",
                        "eventAction": true,
                        //Tn 3
                        "title": title_Trigger2GcalendarController,
                        "description": description_Trigger2GcalendarController,
                        "location": place_Trigger2GcalendarController
                    };

                    if (modifyVar == true) {
                        sendingToServerAllput();
                    }
                    else {
                        if (importFlag == true) {
                            url = "#" + actionImportRoute;
                            //alert("1x1" + url);
                            window.location.replace(url);
                        }
                        else {
                            url = "#createRecipeAction";
                            window.location.replace(url);
                        }
                    }

                }
            }
            else {
                //alert("You are non logged google please relog it and redo it");
                //alertVariable = "You are non logged google please relog it and redo it";
                //alertFunction();
                alertWarning("You are not logged in Google.");
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


        };


        /**
         * Description
         * @method sedingServer
         * @param {} loginDataSend
         * @return
         */
        $scope.sedingServer = function (loginDataSend) {
            setSpinner(true);
            $.ajax({
                method: "post",
                url: "/MyServlet",
                data: loginDataSend,
                dataType: "json",
                /**
                 * Description
                 * @method success
                 * @return
                 */
                success: function () {
                    if (consoleLogs) console.log("la post ha avuto successo n 9");
                    setSpinner(false);
                },
                error: function () {
                    setSpinner(false);
                }
            });
        };


        $scope.modifyButton = false;
        if (modifyVar == 1) {


            $scope.modifyButton = true;
        }
        else {
            $scope.modifyButton = false;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;


    }]);


iftttApp.controller('action1GcalendarController', ['$scope',
    function ($scope) {

        $scope.gcalendarinput = [];
        //gcalendarinput,  yearVector, monthVector, dayVector
        /**
         * Description
         * @method actiongcalendar
         * @return
         */
        $scope.actiongcalendar = function () {
            var title = "";
            var subjectReceive = "";
            var place = "";
            var yearVector = "";
            var monthVector = "";
            var dayVector = "";
            var hourStart = "";
            var minuteStart = "";
            var flag = 1;
            var timeZone = "";
            var durationHour = "";
            var durationMinute = "";

            actionChose = 2;

            if ($scope.googleLogged == true) {


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
                if ($scope.checkdata == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        dayVector = $('#selectDay').val();
                        yearVector = $('#selectYear').val();
                        monthVector = $('#selectMonth').val();
                        hourStart = $('#selectHourStart').val();
                        minuteStart = $('#selectMinuteStart').val();
                        flag = 1;

                    }

                    else {
                        dayVector = null;
                        yearVector = null;
                        monthVector = null;
                        hourStart = null;
                        minuteStart = null;
                        flag = 0;
                    }


                }
                else {
                    dayVector = null;
                    yearVector = null;
                    monthVector = null;
                    hourStart = null;
                    minuteStart = null;
                    flag = 0;
                }


                //Time zone
                if ($scope.timeZoneCheck == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        timeZone = $('#selecttimezone').val();

                    }

                    else {
                        timeZone = null;
                    }


                }
                else {
                    timeZone = null;
                }


                if ($scope.durationEventCheck == true) {
                    if (angular.isDefined($scope.gcalendarinput)) {
                        durationHour = $('#selectHourDuration').val();
                        durationMinute = $('#selectMinuteDuration').val();

                    }

                    else {
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
                yearVector_action1GcalendarController = yearVector;
                monthVector_action1GcalendarController = monthVector;
                dayVector_action1GcalendarController = dayVector;
                hourStart_action1GcalendarController = hourStart;
                minuteStart_action1GcalendarController = minuteStart;
                durationHour_action1GcalendarController = durationHour;
                durationMinute_action1GcalendarController = durationMinute;
                timeZone_action1GcalendarController = timeZone;

                var startDate = null;
                if (yearVector_action1GcalendarController != null && monthVector_action1GcalendarController != null &&
                    dayVector_action1GcalendarController != null && hourStart_action1GcalendarController != null && minuteStart_action1GcalendarController != null) {
                    startDate = yearVector_action1GcalendarController + "-" + monthVector_action1GcalendarController
                        + "-" + dayVector_action1GcalendarController + " " + hourStart_action1GcalendarController
                        + ":" + minuteStart_action1GcalendarController + ":00";
                }

                var dur = null;
                if (durationHour_action1GcalendarController != null && durationMinute_action1GcalendarController != null) {
                    dur = (durationHour_action1GcalendarController * 60 * 60 * 1000) + (durationMinute_action1GcalendarController * 60 * 1000);
                }


                modulinoj2 =
                {
                    "ingredientCode": 21,
                    "actionType": "calendar",
                    //An 2
                    "timezone": timeZone_action1GcalendarController,
                    "title": title_action1GcalendarController,
                    "description": subjectReceive_action1GcalendarController,
                    "location": place_action1GcalendarController,
//                  "yearVector": yearVector_action1GcalendarController,
//                  "monthVector": monthVector_action1GcalendarController,
//                  "dayVector": dayVector_action1GcalendarController,
//                  "hourStart": hourStart_action1GcalendarController,
//                  "minuteStart":  minuteStart_action1GcalendarController
                    "startDate": startDate,
                    "duration": dur

                };


                if (flag == 1) {

                    var m = moment(startDate);
                    if (m.isValid());

                    else {
                        alertError("Your Date is not right!!!");
                        flag = 3;
                    }

                    /* Controllo data più preciso ma non si usa momentjs */
                    /*

                     var monthNumber = 0;
                     var daynumber = 0;
                     if(monthVector.localeCompare("01")==0) monthNumber = 1;
                     else if(monthVector.localeCompare("02")==0) monthNumber = 2;
                     else if(monthVector.localeCompare("03")==0) monthNumber = 3;
                     else if(monthVector.localeCompare("04")==0) monthNumber = 4;
                     else if(monthVector.localeCompare("05")==0) monthNumber = 5;
                     else if(monthVector.localeCompare("06")==0) monthNumber = 6;
                     else if(monthVector.localeCompare("07")==0) monthNumber = 7;
                     else if(monthVector.localeCompare("08")==0) monthNumber = 8;
                     else if(monthVector.localeCompare("09")==0) monthNumber = 9;
                     else if(monthVector.localeCompare("10")==0) monthNumber = 10;
                     else if(monthVector.localeCompare("11")==0) monthNumber = 11;
                     else if(monthVector.localeCompare("12")==0) monthNumber = 12;

                     if(dayVector.localeCompare("01")==0) daynumber = 1;
                     else  if(dayVector.localeCompare("02")==0) daynumber = 2;
                     else  if(dayVector.localeCompare("03")==0) daynumber = 3;
                     else  if(dayVector.localeCompare("04")==0) daynumber = 4;
                     else  if(dayVector.localeCompare("05")==0) daynumber = 5;
                     else  if(dayVector.localeCompare("06")==0) daynumber = 6;
                     else  if(dayVector.localeCompare("07")==0) daynumber = 7;
                     else  if(dayVector.localeCompare("08")==0) daynumber = 8;
                     else  if(dayVector.localeCompare("09")==0) daynumber = 9;
                     else  if(dayVector.localeCompare("10")==0) daynumber = 10;
                     else  if(dayVector.localeCompare("11")==0) daynumber = 11;
                     else  if(dayVector.localeCompare("12")==0) daynumber = 12;
                     else  if(dayVector.localeCompare("13")==0) daynumber = 13;
                     else  if(dayVector.localeCompare("14")==0) daynumber = 14;
                     else  if(dayVector.localeCompare("15")==0) daynumber = 15;
                     else  if(dayVector.localeCompare("16")==0) daynumber = 16;
                     else  if(dayVector.localeCompare("17")==0) daynumber = 17;
                     else  if(dayVector.localeCompare("18")==0) daynumber = 18;
                     else  if(dayVector.localeCompare("19")==0) daynumber = 19;
                     else  if(dayVector.localeCompare("20")==0) daynumber = 20;
                     else  if(dayVector.localeCompare("21")==0) daynumber = 21;
                     else  if(dayVector.localeCompare("22")==0) daynumber = 22;
                     else  if(dayVector.localeCompare("23")==0) daynumber = 23;
                     else  if(dayVector.localeCompare("24")==0) daynumber = 24;
                     else  if(dayVector.localeCompare("25")==0) daynumber = 25;
                     else  if(dayVector.localeCompare("26")==0) daynumber = 26;
                     else  if(dayVector.localeCompare("27")==0) daynumber = 27;
                     else  if(dayVector.localeCompare("28")==0) daynumber = 28;
                     else  if(dayVector.localeCompare("29")==0) daynumber = 29;
                     else  if(dayVector.localeCompare("30")==0) daynumber = 30;
                     else  if(dayVector.localeCompare("31")==0) daynumber = 31;


                     //alert(" day " + daynumber + "  month  " + monthNumber );



                     if ( monthNumber == 1||
                     monthNumber == 3  ||
                     monthNumber ==  5 ||
                     monthNumber == 7  ||
                     monthNumber == 8  ||
                     monthNumber == 10  ||
                     monthNumber == 12 ) {
                     if (daynumber > 0 && daynumber < 32);
                     else {
                     flag = 3;
                     //if(consoleLogs) console.log("Your date is not right plase verify the day");
                     alertVariable = "Your date is not right plase verify the day";
                     alertFunction();
                     }
                     }
                     if (monthNumber == 2 ||
                     monthNumber == 4 ||
                     monthNumber == 6 ||
                     monthNumber == 9 ||
                     monthNumber == 11) {
                     if (daynumber > 0 && daynumber < 31);
                     else {
                     flag = 3;
                     //if(consoleLogs) console.log("Your date is not right plase verify the day");
                     alertVariable = "Your date is not right plase verify the day";
                     alertFunction();
                     }

                     }
                     //Anni bisestili
                     if (yearVector.localeCompare("2016") == 0 ||
                     yearVector.localeCompare("2020") == 0 ||
                     yearVector.localeCompare("2024") == 0 ||
                     yearVector.localeCompare("2028") == 0 ||
                     yearVector.localeCompare("2032") == 0 ||
                     yearVector.localeCompare("2036") == 0 ||
                     yearVector.localeCompare("2040") == 0 ||
                     yearVector.localeCompare("2044") == 0
                     ) {
                     if (monthNumber === 2)
                     if (daynumber > 28) {
                     flag = 3;
                     //if(consoleLogs) console.log("Thi is a leap year");
                     alertVariable = "Thi is a leap year";
                     alertFunction();
                     }


                     }

                     if (monthNumber == 2 && daynumber > 29 && flag != 3) {
                     //if(consoleLogs) console.log("Febrary has not " + dayVector + " days, please check" );
                     alertVariable = "Febrary has not " + dayVector + " days, please check";
                     alertFunction();
                     flag = 3;
                     }
                     */

                }
                if (flag != 3) {
                    //flagTriggerDone = false;
                    count = 7;

                    if (modifyVar == 0) {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();

                    //sendingToServerAll();
                    //url = "#gMailSucces";
                    //window.location.replace(url);
                }

            }
            else {
                //alert("You are not logged in google");
                // alertVariable = "You are not logged in google";
                // alertFunction();
                alertWarning("You are not logged in Google.");
                url = "#createDO";
                window.location.replace(url);
            }


        };


        $scope.yearVector =
        {
            availableOptions: [
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
            availableOptions: [
                {id: '01', month: 'January'},
                {id: '02', month: 'February'},
                {id: '03', month: 'March'},
                {id: '04', month: 'April'},
                {id: '05', month: 'May'},
                {id: '06', month: 'June'},
                {id: '07', month: 'July'},
                {id: '08', month: 'August'},
                {id: '09', month: 'September'},
                {id: '10', month: 'October'},
                {id: '11', month: 'November'},
                {id: '12', month: 'December'}
            ],
            selectedOption: {id: '01', month: 'January'} //This sets the default value of the select in the ui

        };


        $scope.dayVector =
        {
            availableOptions: [
                {id: '01', day: '01'},
                {id: '02', day: '02'},
                {id: '03', day: '03'},
                {id: '04', day: '04'},
                {id: '05', day: '05'},
                {id: '06', day: '06'},
                {id: '07', day: '07'},
                {id: '08', day: '08'},
                {id: '09', day: '09'},
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
            selectedOption: {id: '01', day: '01'}

        };

        $scope.hourVector =
        {
            availableOptions: [
                {id: '00', hour: '0'},
                {id: '01', hour: '1'},
                {id: '02', hour: '2'},
                {id: '03', hour: '3'},
                {id: '04', hour: '4'},
                {id: '05', hour: '5'},
                {id: '06', hour: '6'},
                {id: '07', hour: '7'},
                {id: '08', hour: '8'},
                {id: '09', hour: '9'},
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
            ],
            selectedOption: {id: '00', hour: '00'},
            selectedOptionDuration: {id: '00', hour: '00'}

        };


        $scope.minuteVector =
        {
            availableOptions: [
                {id: '00', minute: '00'},
                {id: '01', minute: '01'},
                {id: '02', minute: '02'},
                {id: '03', minute: '03'},
                {id: '04', minute: '04'},
                {id: '05', minute: '05'},
                {id: '06', minute: '06'},
                {id: '07', minute: '07'},
                {id: '08', minute: '08'},
                {id: '09', minute: '09'},
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
            selectedOption: {id: '00', minute: '00'},
            selectedOptionDuration: {id: '00', minute: '00'}
        };


        $scope.timezoneVector =
        {
            availableOptions: [
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


        $scope.backfunctionActionPuclicRecipe = function () {
            url = "#" + triggerImportRoute;
            window.location.replace(url);

        };

        $scope.modifyButton = false;
        if (modifyVar == 1) {


            $scope.modifyButton = true;
        }
        else {
            $scope.modifyButton = false;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


//action1GcalendarController

    }]);


iftttApp.controller('trigger1TwitterController', ['$scope',
    function ($scope) {

        backPageVariabile = "#Trigger1Twitter";

        $scope.trigger1TwitterInput = [];
        $scope.iftttLoginP = iftttLogin;

        /**
         * Description
         * @method trigger1Twitterfunc
         * @return
         */
        $scope.trigger1Twitterfunc = function () {
            triggerChose = 4;
            var title;
            var subject;

            if (($scope.checkedtitle == true || $scope.checkedSubject == true) && twitterLogin == true) {

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
                    "ingredientCode": 18,
                    "triggerType": "twitter",
                    "type": false,
                    "hashtag_text": hashtag_text_trigger1TwitterController,
                    "username_sender": username_sender_trigger1TwitterController
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
            if (twitterLogin == false) {
                //alert("You are not logged in twitter");
                //alertVariable = "You are not logged in twitter";
                //alertFunction();
                alertWarning("You are not logged in Twitter.");
                url = "#allTriggers";
                window.location.replace(url);
            }


        };


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;
        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


    }]);


iftttApp.controller('trigger2TwitterController', ['$scope',
    function ($scope) {
        $scope.trigger2TwitterInput = [];

        backPageVariabile = "#Trigger2Twitter";

        /**
         * Description
         * @method trigger2Twitterfunc
         * @return
         */
        $scope.trigger2Twitterfunc = function () {
            triggerChose = 5;
            var title;
            var subject;


            if (twitterLogin == true) {
            	 if (($scope.checkedtitle == true || $scope.checkedSubject == true) && twitterLogin == true) {

	                if ($scope.checkedtitle == true) {
	                    if (angular.isDefined($scope.trigger2TwitterInput)) {
	                        if (angular.isDefined($scope.trigger2TwitterInput.title)) {
	                            title = $scope.trigger2TwitterInput.title;
	                            flag = 1
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
	                    "ingredientCode": 19,
	                    "triggerType": "twitter",
	                    "type": true,
	                    "hashtag_text": hashtag_text_trigger2TwitterController,
	                    "username_sender": username_sender_trigger2TwitterController
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
            }

            if (twitterLogin == false) {
                //alert("You are not logged in twitter");
                //alertVariable = "You are not logged in twitter";
                //alertFunction();
                alertWarning("You are not logged on Twitter.");
                url = "#allTriggers";
                window.location.replace(url);
            }


        };
        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;


    }]);


iftttApp.controller('action1TwitterController', ['$scope',
    function ($scope) {

        $scope.action1TwitterInput = [];
        /**
         * Description
         * @method twitterAction1func
         * @return
         */
        $scope.twitterAction1func = function () {
            actionChose = 3;

            var subject;


            if (twitterLogin == true) {

                if (true) {
                    if (angular.isDefined($scope.action1TwitterInput)) {
                        if (angular.isDefined($scope.action1TwitterInput.subjectReceive)) {
                            subject = $scope.action1TwitterInput.subjectReceive;
                        }
                        else {
                            subject = null;
                        }
                    }
                    else {
                        subject = null;
                    }

                }
                else {
                    subject = null;
                }

                //flagTriggerDone = false;
                count = 7;

                subject_action1TwitterController = subject;

                modulinoj2 =
                {
                    "ingredientCode": 23,
                    "actionType": "twitter",
                    "type": false,
                    "body": subject_action1TwitterController,
                    "destination": null

                };

                if (modifyVar == 0) {
                    $('#recipedDescriptionModal').modal('show');
                }
                else sendingToServerAllput();
                //sendingToServerAll();
                //href="#SuccessTwitter"
                //var url = "#SuccessTwitter";
                //window.location.replace(url);
            }

            if (twitterLogin == false) {
                //alert("You are not logged in twitter");
                //alertVariable = "You are not logged in twitter";
                //alertFunction();
                alertWarning("You are not logged on Twitter.");
                url = "#createDO";
                window.location.replace(url);
            }


        };


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;
        $scope.checkedplace = false;


        $scope.backfunctionActionPuclicRecipe = function () {
            url = "#" + triggerImportRoute;
            window.location.replace(url);

        }


        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


    }]);

//action2TwitterController


iftttApp.controller('action2TwitterController', ['$scope',
    function ($scope) {

        $scope.action2TwitterInput = [];
        /**
         * Description
         * @method action2Twitterfunc
         * @return
         */
        $scope.action2Twitterfunc = function () {

            actionChose = 4;
            var destination;
            var subject;
            var flag = 0;

            // if(($scope.checkedtitle == true ||  $scope.checkedSubject== true)  && twitterLogin == true)
            if (twitterLogin == true) {



                // if ($scope.checkedtitle == true)
                //  {
                if (angular.isDefined($scope.action2TwitterInput)) {
                    if (angular.isDefined($scope.action2TwitterInput.title)) {
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


                if ($scope.checkedSubject == true) {
                    if (angular.isDefined($scope.action2TwitterInput)) {
                        if (angular.isDefined($scope.action2TwitterInput.subjectReceive)) {
                            subject = $scope.action2TwitterInput.subjectReceive;
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
                    "ingredientCode": 24,
                    "actionType": "twitter",
                    "type": true,
                    "destination": title_action2TwitterController,
                    "body": subjec_action2TwitterController

                };
                if (flag == 1) {

                    if (modifyVar == 0) {
                        $('#recipedDescriptionModal').modal('show');
                    }
                    else sendingToServerAllput();
                    //sendingToServerAll();
                    //flagTriggerDone = false;
                    count = 7;
                    // href="#SuccessTwitter"
                    //url = "#SuccessTwitter";
                    //window.location.replace(url);
                }
                else {
                    //alert ("You must insert the destination e.mail");
                    //alertVariable = "You must insert the destination e.mail";
                    //alertFunction();
                    alertInfo("The email of the receiver must be specified.");
                }


            }
            if (twitterLogin == false) {
                //alert("You are not logged in twitter");
                //alertVariable = "You are not logged in twitter";
                //alertFunction();
                alertWarning("You are not logged on Twitter.");

                url = "#createDO";
                window.location.replace(url);
            }


        };


        $scope.backfunctionActionPuclicRecipe = function () {
            url = "#" + triggerImportRoute;
            window.location.replace(url);

        };

        $scope.modifyButton = false;
        if (modifyVar == 1) {
            $scope.modifyButton = true;
        }

        $scope.importRecipe = false;
        if (importFlag == 1) {
            $scope.importRecipe = true;
        }


        $scope.checkedtitle = false;
        $scope.checkedSubject = false;


    }]);


//Update done
iftttApp.controller('choseModifyController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope, $rootscope, $routeParams, $http, $resource, $location) {
        var ingredientTriggerCode = modulinoj1.ingredientCode;
        var ingredientActionCode = modulinoj2.ingredientCode;

        $scope.urlTriggerUser = getRoute(ingredientTriggerCode);

        $scope.urlActionUser = getRoute(ingredientActionCode);
        console.log(ingredientActionCode + " url--> " + $scope.urlActionUser);


        //$scope.urlTriggerUser = ulrTriggreGlobalVariable;
        $scope.activeGoogleAutentication = false;
        $scope.activeTwitterAutentication = false;
        $scope.activeWeatherAutentication = false;

        //$scope.urlActionUser = urlActionGlobalVariable;

        $scope.activeGoogleAutenticationAction = false;
        $scope.activeTwitterAutenticationAction = false;
        $scope.googleLoggedHtml = false;
        $scope.twitterLoggedHtml = false;


        if (ingredientTriggerCode == 11 ||
            ingredientTriggerCode == 12 ||
            ingredientTriggerCode == 13)
            $scope.activeGoogleAutentication = true;

        if (ingredientTriggerCode == 14 ||
            ingredientTriggerCode == 15 ||
            ingredientTriggerCode == 16 ||
            ingredientTriggerCode == 17
        )
            $scope.activeWeatherAutentication = true;

        if (ingredientTriggerCode == 18 ||
            ingredientTriggerCode == 19
        )
            $scope.activeTwitterAutentication = true;


        if (ingredientActionCode == 21 ||
            ingredientActionCode == 22)
            $scope.activeGoogleAutenticationAction = true;


        if (ingredientActionCode == 23 ||
            ingredientActionCode == 24)
            $scope.activeTwitterAutenticationAction = true;


        /*


         switch (ingredientTriggerCode)
         {
         case 11: $scope.activeGoogleAutentication = true;

         case 12: $scope.activeGoogleAutentication = true;

         case 13: $scope.activeGoogleAutentication = true;

         case 14:   $scope.activeWeatherAutentication = true;

         case 15:  $scope.activeWeatherAutentication = true;

         case 16:  $scope.activeWeatherAutentication = true;

         case 17:  $scope.activeWeatherAutentication = true;

         case 18: $scope.activeTwitterAutentication = true;

         case 19: $scope.activeTwitterAutentication = true;



         }







         switch (ingredientActionCode)
         {
         case 21:   $scope.activeGoogleAutenticationAction = true;

         case 22:  $scope.activeGoogleAutenticationAction = true;

         case 23:   $scope.activeTwitterAutenticationAction = true;

         case 24:   $scope.activeTwitterAutenticationAction = true;

         }

         */


        if (twitterLogin == true) {
            $scope.twitterLoggedHtml = true;

        }
        if (googleLogin == true) {
            $scope.googleLoggedHtml = true;
        }


        modifyVar = 1;

        console.log("Goolge ingredient  " + $scope.activeGoogleAutentication + " loggato a google   " + $scope.googleLoggedHtml);
        console.log("twitter ingredient  " + $scope.activeTwitterAutentication + " loggato a twitter   " + $scope.twitterLoggedHtml);

        console.log("Goolge ingredient  " + $scope.activeGoogleAutenticationAction + " loggato a google   " + $scope.googleLoggedHtml);
        console.log("twitter ingredient  " + $scope.activeTwitterAutenticationAction + " loggato a twitter   " + $scope.twitterLoggedHtml);


        console.log("Weather ingredient  " + $scope.activeWeatherAutentication + " loggato a meteo   ");

        console.log("Problema numero numer 8" + ingredientTriggerCode); //XXX


        //var googleLogin = false;   //-> $scope.googleLogged
        //var twitterLogin = false; //-> $scope.twitterLogged


        /*
         if ((triggreGlobalVariable.localeCompare("gmail")==0) || (triggreGlobalVariable.localeCompare("calendar")==0))
         {
         $scope.activeGoogleAutentication = true;
         }
         else
         {
         if (triggreGlobalVariable.localeCompare("twitter")==0)
         {
         $scope.activeTwitterAutentication = true;
         }
         else
         {
         $scope.activeWeatherAutentication = true;

         }

         }


         if ((actionGlobalVariable.localeCompare("gmail")==0)  ||  actionGlobalVariable.localeCompare("calendar")==0)
         {
         $scope.activeGoogleAutenticationAction = true;
         }
         else
         {
         if (actionGlobalVariable.localeCompare("twitter")==0)
         {
         $scope.activeTwitterAutenticationAction = true;
         }

         }
         alert("twitter" +  "Azione   " +  $scope.activeTwitterAutenticationAction + "loggato?   " +  $scope.twitterLoggedHtml );

         */
        /**
         * Description
         * @method changePage
         * @param {} chosePath
         * @return
         */
        $scope.changePage = function (chosePath) {
            if (chosePath == 1) {
                rootingAutenticationTriggerAction = ulrTriggreGlobalVariable;
                $('#loginGoogleModal').modal('show');
            }
            else {
                rootingAutenticationTriggerAction = urlActionGlobalVariable;
                $('#loginTwitterModal').modal('show');
            }


            /*

             var googleLogin = false;   //-> $scope.googleLogged
             var twitterLogin = false; //-> $scope.twitterLogged

             */


            //$('#loginGoogleModal').modal('show');
        };


        /**
         * Description
         * @method setupValueChange
         * @param {} chosePath
         * @return
         */
        $scope.setupValueChange = function (chosePath) {
            var urlx = "";
            if (chosePath == 0) {
                setChooseAx = 4;
                urlx = "#allTriggers";
            }
            else {
                urlx = "#allActions";
                setChooseAx = 5;
            }
            window.location.replace(urlx);
        };


        /**
         * Description
         * @method descriptionModifyLanch
         * @return
         */
        $scope.descriptionModifyLanch = function () {
            $('#recipedDescriptionModal').modal('show');
        }


    }]);


iftttApp.filter('capitalize', function () {
    return function (input) {
        if (consoleLogs) console.log(JSON.stringify(input));
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

iftttApp.filter('reformat', function () {
    return function (x) {

        switch (x) {
            case 'lastChecked':
                return 'Last checked';
            case 'hashtag_text':
                return 'Hashtag text';
            case 'username_sender':
                return 'Username sender';
            case 'eventAction':
                return 'Event action';
            case 'thmax':
                return 'Max temperature';
            case 'thmin':
                return 'Min temperature';
            case 'locationName':
                return 'Name of the city';
            case 'ingredientCode':
                return 'Ingredient description';
            case 'startDate':
                return 'Start date';
            case 'period':
                return 'Periodic checking';
        }


        return x;
    };
});

iftttApp.filter('skeumorphize', function () {
    return function (input, watchKey, ingredient) {

        //console.log('input: '+input+"\nwatchKey: "+watchKey);

        /*

         gcalendarTrigger1	11
         gcalendarTrigger2	12
         gmailTrigger1	    13
         weatherTrigger1	14
         weatherTrigger2	15
         weatherTrigger3	16
         weatherTrigger4	17
         twitterTrigger1	18
         twitterTrigger2	19
         gcalendarAction1	21
         gmailAction1	    22
         twitterAction1	    23
         twitterAction2 	24

         */

        console.log("BEGIN > watchkey: " + watchKey + " input: " + input);

        switch (watchKey) {

            case 'thmax':
                return input + " °C";

            case 'thmin':
                return input + " °C";

            case 'timezone':
                return timezoneLiteral(input);
                
            case 'tempo':
            	return weatherLiteral(input);

            case 'duration':
            {
                var d = moment.duration(parseInt(input), 'milliseconds');
                var hours = Math.floor(d.asHours());
                var mins = Math.floor(d.asMinutes()) - hours * 60;
                console.log("hours:" + hours + " mins:" + mins);
                return hours + " h and " + mins + " m";
            }

            case 'startDate':
            {
                return moment(input).format("dddd, MMMM Do YYYY HH:mm");
            }

            case 'sender':
            {
                console.log(">>>>>> watchkey: " + watchKey + " input: " + input + " typeIngredient:" + ingredient);
                if (ingredient > 10 && ingredient < 20) {
                    return input
                } else {
                    switch (input) {
                        case false:
                            return 'This e-mail will be sent by IFTTT-polito e-mail address.';
                        case true:
                            return 'This e-mail will be sent by your registration e-mail address.';
                    }
                }

                break;
            }

            case 'period':
            	if(input == -1) 
            		return "Once";
                console.log("NaN: " + (input / 60000));
                return "every " + (input / 60000) + " minutes";


            default:
                return input;
        }


    }
});


iftttApp.filter('describe', function () {
    return function (input) {
        switch (input) {
            case 11:
                return 'IF a calendar event is starting...';
            case 12:
                return 'IF a new calendar event is created...';
            case 13:
                return 'IF an email comes...';
            case 14:
                return 'IF tomorrow...';
            case 15:
                return 'IF the weather condition...';
            case 16:
                return 'IF sunrise or sunset...';
            case 17:
                return 'IF the temperature changes...';
            case 18:
                return 'IF a new tweet comes...';
            case 19:
                return 'IF a new Twitter direct message comes...';
            case 21:
                return '...THEN create a new calendar event.';
            case 22:
                return '...THEN send an email.';
            case 23:
                return '...THEN post a new tweet.';
            case 24:
                return '...THEN send a new Twitter direct message.';

        }
    }
});


iftttApp.directive('bsTooltip', function () {
    return {
        restrict: 'A',
        /**
         * Description
         * @method link
         * @param {} scope
         * @param {} element
         * @param {} attrs
         * @return
         */
        link: function (scope, element, attrs) {
            $(element).tooltip()
        }
    };
});


iftttApp.controller('hiddenPageConfirmationController', ['$scope', '$rootScope', '$routeParams', '$http', '$location',
    function ($scope, $rootscope, $routeParams, $http, $resource, $location) {

        // Im very useful! :P

    }]);


/**
 * ########################################################################################################################
 * ########################################################################################################################
 * ######
 * ######                                                JavaScript functions zzz
 * ######
 * ########################################################################################################################
 * ########################################################################################################################
 * @method sendingToServerAll
 * @return
 */
function sendingToServerAll() {
    modulinoj1.lastChecked = null;
    sendDataToServer =
    {
        id: null,
        "description": descriptionRecipeGlobal,
        "trigger": modulinoj1,
        "action": modulinoj2,
        "publish": false
    };

    //"desc": "example descrition here, written by the user"/*recipedDesc*/
    sedingServerAllRun(sendDataToServer);


}
//alertVariable
//alertFunction ()

/**
 * Description
 * @method alertFunction
 * @return
 */
function alertFunction() {
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
/**
 * Description
 * @method sedingServerAllRun
 * @param {} loginDataSend
 * @return
 */
/*
 code=-1 vuol dire che c'è stato qualche problema e la ricetta non è stata inserita.


 */
//fxr>
function sedingServerAllRun(loginDataSend) {

    setSpinner(true);
    $.ajax({
        method: "post",
        url: "http://localhost:8080/progetto/api/userRecipes",
        data: JSON.stringify(loginDataSend),
        contentType: 'application/json; charset=UTF-8',
        /**
         * Description
         * @method success
         * @param {} response
         * @return
         */
        success: function (response) {
            setSpinner(false);
            if (response == -1) {
                //alertVariable="Warning: the recipe is not memorised by server try again or go home";
                //alertFunction ();
                alertWarning("The recipe is not stored on our server. Please, try again.");
                $('#recipedDescriptionModal').modal('hide');
            }
            else if (response == -2) {
                alertWarning("I'm sorry, but your sender/destination doesn't exist in Twitter.");
                $('#recipedDescriptionModal').modal('hide');
            }
            else if(response == -3) {
            	  alertWarning("Selected field can't be blank! Please, fill them.");
                  $('#recipedDescriptionModal').modal('hide');
            }
            else if(response == -4) {
          	  alertWarning("Recipe's description is too long.");
                $('#recipedDescriptionModal').modal('hide');
            }
            else {

                $('#recipedDescriptionModal').modal('hide');
                //sendingToServerAll();
                successAlert('#/index/myRecipes');
                //url = "#SuccessRepice";
                //window.location.replace(url);
            }

        },
        error: function (response) {
            setSpinner(false);
            //alertVariable="Warning: the recipe is not memorised by server try again or go home";
            //alertFunction ();
            alertWarning("The recipe is not stored on our server. Please, try again.");

        }
    });

}

/**
 * Description
 * @method sendingToServerAllput
 * @return
 */
function sendingToServerAllput() {
    modulinoj1.lastChecked = null;
    sendDataToServer =
    {
        id: idRecipe,
        "description": descriptionRecipeGlobal,
        "trigger": modulinoj1,
        "action": modulinoj2,
        "publish": publishRecipeGlobal,
        regTimezione: jstz.determine().toString() //cc
    };
    sedingServerAllRunput(sendDataToServer);

}


/**
 * Description
 * @method sedingServerAllRunput
 * @param {} loginDataSend
 * @return
 */


/*

 0 se è andato a buon fine
 -1se qualcosa è andato storto.

 */
function sedingServerAllRunput(loginDataSend) {
    setSpinner(true);
    $.ajax({
        method: "put",
        url: "http://localhost:8080/progetto/api/userRecipes/" + idRecipe,
        data: JSON.stringify(loginDataSend),
        dataType: "json",
        /**
         * Description
         * @method success
         * @param {} response
         * @return
         */
        success: function (response) {
            setSpinner(false);
            if (response == 0) {

                if (modifyVar == true) {
                    $('#recipedDescriptionModal').modal('hide');

                }
                successAlert('#/index/myRecipes');
                //url = "#SuccessRepice";
                //window.location.replace(url);
            }
            else if (response == -2) {
                alertWarning("I'm sorry, but your sender/destination doesn't exist in Twitter.");
                $('#recipedDescriptionModal').modal('hide');
            }
            else if(response == -3) {
          	  alertWarning("Selected field can't be blank! Please, fill them.");
                $('#recipedDescriptionModal').modal('hide');
            }
            else if(response == -4) {
            	  alertWarning("Recipe's description is too long.");
                  $('#recipedDescriptionModal').modal('hide');
            }
            else {
                //alertVariable="Warning: the recipe is not update try again or go home";
                //alertFunction ();
                alertWarning("The recipe is not update try again.");
                $('#recipedDescriptionModal').modal('hide');

            }

        },
        error: function () {
            setSpinner(false);
            //alertVariable="Warning: the recipe is not update try again or go home";
            //alertFunction ();
            alertWarning("The recipe is not update try again.");

        }
    });
}

//fxr<


function setSpinner(spinflag) {
    if (spinflag) {
        // Accendi lo spinner
        $('#spinnerModal').modal('show');
        $('#serverSpinner').spin(true);
        console.log('spin on');
    } else {
        // Spegni lo spinner
        $('#spinnerModal').modal('hide');
        $('#serverSpinner').spin(false);
        console.log('spin off');
    }
}

function successAlert(redirect) {
    swal({
        title: "Success!",
        text: "Your recipe is saved!",
        type: "success"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
        modulinoj1 = [];
        modulinoj2 = [];
        window.location.replace(redirect);
    });
}

function registrationSent(redirect) {
    swal({
        title: "Registration requested!",
        text: "Please check your email inbox and confirm registration!",
        type: "success"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
        window.location.replace(redirect);
    });
}

function registrationSuccess(redirect) {
    swal({
        title: "Registration success!",
        text: "Welcome to our site!",
        type: "success"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
        window.location.replace(redirect);
    });
}

function someErrorOccurred() {
    swal({
        title: "Error!",
        text: "Some error occurred.",
        type: "error"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function userAlreadyActivated() {
    swal({
        title: "Hey!",
        text: "This user is already activated.",
        type: "warning"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function loginWrongPassword() {
    swal({
        title: "Hey!",
        text: "Your password is not correct.",
        type: "warning"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function loginUnknownUsername() {
    swal({
        title: "Hey!",
        text: "Your username is not correct.",
        type: "warning"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function loginInactiveUser() {
    swal({
        title: "Hey!",
        text: "This user is not active yet.",
        type: "warning"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function alertWarning(message) {
    swal({
        title: "Hey!",
        text: message,
        type: "warning"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function alertError(message) {
    swal({
        title: "Sorry...",
        text: message,
        type: "error"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function alertSuccess(message) {
    swal({
        title: "Success!",
        text: message,
        type: "success"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function alertInfo(message) {
    swal({
        title: "Mmmm...",
        text: message,
        type: "info"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
    });
}

function alertPasswordChangedSuccess() {
    swal({
        title: "Success!",
        text: "Your passowrd and timezone has been changed.",
        type: "success"
        //confirmButtonColor: "#DD6B55",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: true
    }, function () {
        window.location.replace('#myRecipes');
    });
}

function alertWarningTrigger(message, loc) {
	swal({
	    title: "Hey!",
	    text: message,
	    type: "warning"
	    //confirmButtonColor: "#DD6B55",
	    //confirmButtonText: "Yes, delete it!",
	    //closeOnConfirm: true
	}, function () {
		 window.location.replace(loc);
	});
}

function weatherLiteral(tempoCode) {

    var weatherConditions = {
    		 '200': 'thunderstorm with light rain',
             '210': 'light thunderstorm',
             '211': 'thunderstorm',
             '212': 'heavy thunderstorm',
             '310': 'light intensity drizzle rain',
             '311': 'drizzle rain',
             '312': 'heavy intensity drizzle rain',
             '500': 'light rain',
             '501': 'moderate rain',
             '502': 'heavy intensity rain',
             '503': 'very heavy rain',
             '600': 'light snow',
             '601': 'snow',
             '602': 'heavy snow',
             '741': 'fog',
             '751': 'sand',
             '761': 'dust',
             '762': 'volcanic ash',
             '800': 'clear sky',
             '801': 'few clouds',
             '804': 'overcast clouds',
             '900': 'tornado',
             '901': 'tropical storm',
             '902': 'hurricane',
             '903': 'cold',
             '904': 'hot',
             '905': 'windy',
             '906': 'hail',
             '962': 'hurricane'
    };

    return (weatherConditions[tempoCode]);
}

function timezoneLiteral(timezoneBad) {

    var timezoneDictionary = {
        'Pacific/Midway': '(UTC-11:00) Midway Island',
        'Pacific/Samoa': '(UTC-11:00) Samoa',
        'Pacific/Honolulu': '(UTC-10:00) Hawaii',
        'US/Alaska': '(UTC-09:00) Alaska',
        'America/Los_Angeles': '(UTC-08:00) Pacific Time (US &amp; Canada)',
        'America/Tijuana': '(UTC-08:00) Tijuana',
        'US/Arizona': '(UTC-07:00) Arizona',
        'America/Chihuahua': '(UTC-07:00) Chihuahua',
        'America/Mazatlan': '(UTC-07:00) Mazatlan',
        'US/Mountain': '(UTC-07:00) Mountain Time (US &amp; Canada)',
        'America/Managua': '(UTC-06:00) Central America',
        'US/Central': '(UTC-06:00) Central Time (US &amp; Canada)',
        'America/Mexico_City': '(UTC-06:00) Mexico City',
        'America/Monterrey': '(UTC-06:00) Monterrey',
        'Canada/Saskatchewan': '(UTC-06:00) Saskatchewan',
        'America/Bogota': '(UTC-05:00) Bogota',
        'US/Eastern': '(UTC-05:00) Eastern Time (US &amp; Canada)',
        'US/East-Indiana': '(UTC-05:00) Indiana (East)',
        'America/Lima': '(UTC-05:00) Lima',
        'Canada/Atlantic': '(UTC-04:00) Atlantic Time (Canada)',
        'America/Caracas': '(UTC-04:30) Caracas',
        'America/La_Paz': '(UTC-04:00) La Paz',
        'America/Santiago': '(UTC-04:00) Santiago',
        'Canada/Newfoundland': '(UTC-03:30) Newfoundland',
        'America/Sao_Paulo': '(UTC-03:00) Brasilia',
        'America/Argentina/Buenos_Aires': '(UTC-03:00) Buenos Aires',
        'America/Godthab': '(UTC-03:00) Greenland',
        'America/Noronha': '(UTC-02:00) Mid-Atlantic',
        'Atlantic/Azores': '(UTC-01:00) Azores',
        'Atlantic/Cape_Verde': '(UTC-01:00) Cape Verde Is.',
        'Africa/Casablanca': '(UTC+00:00) Casablanca',
        'Etc/Greenwich': '(UTC+00:00) Greenwich Mean Time : Dublin',
        'Europe/Lisbon': '(UTC+00:00) Lisbon',
        'Europe/London': '(UTC+00:00) London',
        'Africa/Monrovia': '(UTC+00:00) Monrovia',
        'UTC': '(UTC+00:00) UTC',
        'Europe/Amsterdam': '(UTC+01:00) Amsterdam',
        'Europe/Belgrade': '(UTC+01:00) Belgrade',
        'Europe/Berlin': '(UTC+01:00) Berlin',
        'Europe/Bratislava': '(UTC+01:00) Bratislava',
        'Europe/Brussels': '(UTC+01:00) Brussels',
        'Europe/Budapest': '(UTC+01:00) Budapest',
        'Europe/Copenhagen': '(UTC+01:00) Copenhagen',
        'Europe/Ljubljana': '(UTC+01:00) Ljubljana',
        'Europe/Madrid': '(UTC+01:00) Madrid',
        'Europe/Paris': '(UTC+01:00) Paris',
        'Europe/Prague': '(UTC+01:00) Prague',
        'Europe/Rome': '(UTC+01:00) Rome',
        'Europe/Sarajevo': '(UTC+01:00) Sarajevo',
        'Europe/Skopje': '(UTC+01:00) Skopje',
        'Europe/Stockholm': '(UTC+01:00) Stockholm',
        'Europe/Vienna': '(UTC+01:00) Vienna',
        'Europe/Warsaw': '(UTC+01:00) Warsaw',
        'Africa/Lagos': '(UTC+01:00) West Central Africa',
        'Europe/Zagreb': '(UTC+01:00) Zagreb',
        'Europe/Athens': '(UTC+02:00) Athens',
        'Europe/Bucharest': '(UTC+02:00) Bucharest',
        'Africa/Cairo': '(UTC+02:00) Cairo',
        'Africa/Harare': '(UTC+02:00) Harare',
        'Europe/Helsinki': '(UTC+02:00) Helsinki',
        'Europe/Istanbul': '(UTC+02:00) Istanbul',
        'Asia/Jerusalem': '(UTC+02:00) Jerusalem',
        'Africa/Johannesburg': '(UTC+02:00) Pretoria',
        'Europe/Riga': '(UTC+02:00) Riga',
        'Europe/Sofia': '(UTC+02:00) Sofia',
        'Europe/Tallinn': '(UTC+02:00) Tallinn',
        'Europe/Vilnius': '(UTC+02:00) Vilnius',
        'Asia/Baghdad': '(UTC+03:00) Baghdad',
        'Asia/Kuwait': '(UTC+03:00) Kuwait',
        'Europe/Minsk': '(UTC+03:00) Minsk',
        'Africa/Nairobi': '(UTC+03:00) Nairobi',
        'Asia/Riyadh': '(UTC+03:00) Riyadh',
        'Europe/Volgograd': '(UTC+03:00) Volgograd',
        'Asia/Tehran': '(UTC+03:30) Tehran',
        'Asia/Baku': '(UTC+04:00) Baku',
        'Europe/Moscow': '(UTC+04:00) Moscow',
        'Asia/Muscat': '(UTC+04:00) Muscat',
        'Asia/Tbilisi': '(UTC+04:00) Tbilisi',
        'Asia/Yerevan': '(UTC+04:00) Yerevan',
        'Asia/Kabul': '(UTC+04:30) Kabul',
        'Asia/Karachi': '(UTC+05:00) Karachi',
        'Asia/Tashkent': '(UTC+05:00) Tashkent',
        'Asia/Kolkata': '(UTC+05:30) Kolkata',
        'Asia/Calcutta': '(UTC+05:30) New Delhi',
        'Asia/Katmandu': '(UTC+05:45) Kathmandu',
        'Asia/Almaty': '(UTC+06:00) Almaty',
        'Asia/Dhaka': '(UTC+06:00) Dhaka',
        'Asia/Yekaterinburg': '(UTC+06:00) Ekaterinburg',
        'Asia/Rangoon': '(UTC+06:30) Rangoon',
        'Asia/Bangkok': '(UTC+07:00) Bangkok',
        'Asia/Jakarta': '(UTC+07:00) Jakarta',
        'Asia/Novosibirsk': '(UTC+07:00) Novosibirsk',
        'Asia/Chongqing': '(UTC+08:00) Chongqing',
        'Asia/Hong_Kong': '(UTC+08:00) Hong Kong',
        'Asia/Krasnoyarsk': '(UTC+08:00) Krasnoyarsk',
        'Asia/Kuala_Lumpur': '(UTC+08:00) Kuala Lumpur',
        'Australia/Perth': '(UTC+08:00) Perth',
        'Asia/Singapore': '(UTC+08:00) Singapore',
        'Asia/Taipei': '(UTC+08:00) Taipei',
        'Asia/Ulan_Bator': '(UTC+08:00) Ulaan Bataar',
        'Asia/Urumqi': '(UTC+08:00) Urumqi',
        'Asia/Irkutsk': '(UTC+09:00) Irkutsk',
        'Asia/Seoul': '(UTC+09:00) Seoul',
        'Asia/Tokyo': '(UTC+09:00) Tokyo',
        'Australia/Adelaide': '(UTC+09:30) Adelaide',
        'Australia/Darwin': '(UTC+09:30) Darwin',
        'Australia/Brisbane': '(UTC+10:00) Brisbane',
        'Australia/Canberra': '(UTC+10:00) Canberra',
        'Pacific/Guam': '(UTC+10:00) Guam',
        'Australia/Hobart': '(UTC+10:00) Hobart',
        'Australia/Melbourne': '(UTC+10:00) Melbourne',
        'Pacific/Port_Moresby': '(UTC+10:00) Port Moresby',
        'Australia/Sydney': '(UTC+10:00) Sydney',
        'Asia/Yakutsk': '(UTC+10:00) Yakutsk',
        'Asia/Vladivostok': '(UTC+11:00) Vladivostok',
        'Pacific/Auckland': '(UTC+12:00) Auckland',
        'Pacific/Fiji': '(UTC+12:00) Fiji',
        'Pacific/Kwajalein': '(UTC+12:00) International Date Line West',
        'Asia/Kamchatka': '(UTC+12:00) Kamchatka',
        'Asia/Magadan': '(UTC+12:00) Magadan',
        'Pacific/Tongatapu': '(UTC+13:00) Nuku'

    };

    return (timezoneDictionary[timezoneBad]);
}

function getRoute(ingredientCodeInput) {
    switch (ingredientCodeInput) {
        case 11:
            return '/Trigger1Gcalendar';
        case 12:
            return '/Trigger2Gcalendar';
        case 13:
            return '/gMailTrigger';
        case 14:
            return '/WeatherTrigger1';
        case 15:
            return '/WeatherTrigger2';
        case 16:
            return '/WeatherTrigger3';
        case 17:
            return '/WeatherTrigger4';
        case 18:
            return '/Trigger1Twitter';
        case 19:
            return '/Trigger2Twitter';
        case 21:
            return '/action1Gcalendar';
        case 22:
            return '/gMailAction';
        case 23:
            return '/Action1Twitter';
        case 24:
            return '/Action2Twitter';
    }
}


