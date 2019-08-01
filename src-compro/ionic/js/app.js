// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
        'starter.controllers',
        'ionic-audio',
        'ngCordova',
        'ngRoute',
        'ngSanitize',
        'ionic.wheel',
        'ui.rCalendar',
        'ionic.rating',
        'leaflet-directive',
        'ionic-native-transitions'// TODO: Comment this on iOS
])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function ($scope, $http, httpService) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }
            // Remove Badge on iOS
            if (window.plugin) {
                window.plugin.notification.local.cancelAll();
            }

        });

        $ionicPlatform.on("pause", function () {
            stopVideo();
        });
    })
    .service('$cordovaLaunchNavigator', ['$q', function ($q) {
      "use strict";

      var $cordovaLaunchNavigator = {};
      $cordovaLaunchNavigator.navigate = function (destination, options) {
        var q = $q.defer(),
          isRealDevice = ionic.Platform.isWebView();

        if (!isRealDevice) {
          q.reject("launchnavigator will only work on a real mobile device! It is a NATIVE app launcher.");
        } else {
          try {

            var successFn = options.successCallBack || function () {
              },
              errorFn = options.errorCallback || function () {
              },
              _successFn = function () {
                successFn();
                q.resolve();
              },
              _errorFn = function (err) {
                errorFn(err);
                q.reject(err);
              };

            options.successCallBack = _successFn;
            options.errorCallback = _errorFn;

            launchnavigator.navigate(destination, options);
          } catch (e) {
            q.reject("Exception: " + e.message);
          }
        }
        return q.promise;
      };

      return $cordovaLaunchNavigator;
    }])

    .config(function ($stateProvider, $urlRouterProvider
        , $ionicNativeTransitionsProvider // TODO: Comment This on iOS
    ) {
        // TODO: Comment This on iOS
        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 300, // in milliseconds (ms), default 400,
            slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
            iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
            androiddelay: -1, // same as above but for Android, default -1
            winphonedelay: -1, // same as above but for Windows Phone, default -1,
            fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
            backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
        });

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/' + menu_template,
                controller: 'AppCtrl',
                onExit: function ($state) {
                    stopVideo();
                },
                onEnter: function ($ionicPlatform, $state) {
                    $ionicPlatform.ready(function () {
                        console.log('* OnEnter: COMPRO APP TRIGGERED *');
                        if (login_required == true && user_id == '') {
                            if (isPhoneGap()) {
                                // check if any user login data stored in database
                                if (db === '') {
                                    db = window.sqlitePlugin.openDatabase({ name: sqlitedb, location: 'default' });
                                    console.log("HOME db sqlite");
                                }
                                db.transaction(function (tx) {
                                    //tx.executeSql('DROP TABLE IF EXISTS contents'); // for DEBUG purposes only
                                    //tx.executeSql('DROP TABLE IF EXISTS ' + user_table); // remove old users table
                                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + user_table + ' (id INTEGER PRIMARY KEY, user TEXT)');
                                    tx.executeSql("SELECT id, user FROM " + user_table, [],
                                        function (tx, res) {
                                            // console.log("=====RES LENGTH======");
                                            // console.log(res.rows.length);
                                            // console.log("=====RES LENGTH END======");
                                            if (res.rows.length >= 1) {
                                                user_id = res.rows.item(0).id;
                                                var data = JSON.parse(res.rows.item(0).user);

                                                username_login = data.username;
                                                email = data.email;
                                                login_menu = 'User';

                                                // if (getPostMetaValueById(data.company_user_meta, 'address') != null && getPostMetaValueById(data.company_user_meta, 'address') != undefined) {
                                                //     address = getPostMetaValueById(data.company_user_meta, 'address').value;
                                                // }
                                                //
                                                // if (getPostMetaValueById(data.company_user_meta, 'phone') != null && getPostMetaValueById(data.company_user_meta, 'phone') != undefined) {
                                                //     phone = getPostMetaValueById(data.company_user_meta, 'phone').value;
                                                // }
                                                is_membership_enabled = getPostMetaValueById($scope.data.options, "is_membership_enabled") !== undefined ? getPostMetaValueById($scope.data.options, "is_membership_enabled").value : 'NO';
                                                if (is_membership_enabled == 'YES') {
                                                    if (getPostMetaValueById(data.company_user_meta, 'expired_date') != null && getPostMetaValueById(data.company_user_meta, 'expired_date') != undefined) {
                                                        var d1 = new Date();
                                                        var d2 = new Date(value);
                                                        console.log(d1);
                                                        console.log(d2);
                                                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

                                                        var diffDays = Math.round(Math.abs((d2.getTime() - d1.getTime()) / (oneDay)));
                                                        if (d1 <= d2) {
                                                            console.log("active");
                                                            is_expired = false;
                                                        }
                                                        else {
                                                            console.log("expired");
                                                            $state.go('login');
                                                            // window.location.href = '#/login';
                                                        }
                                                    }
                                                    else {
                                                        login_menu = 'Login';
                                                        console.log('USER LOGGED OUT');
                                                        $state.go('login');
                                                        // window.location.href = '#/login';
                                                    }
                                                }
                                                console.log('USER LOGGED IN');
                                                console.log(user_id + ' ' + username_login);
                                            }
                                            else {
                                                login_menu = 'Login';
                                                console.log('USER LOGGED OUT');
                                                $state.go('login');
                                                // window.location.href = '#/login';
                                            }
                                        },
                                        function (e) {
                                            console.log('USER LOGGED OUT ERROR');
                                            console.log(e);
                                            login_menu = 'Login';
                                            console.log('USER LOGGED OUT');
                                            $state.go('login');
                                            // window.location.href = '#/login';
                                        }
                                    );
                                });
                            }
                            else {
                                login_menu = 'Login';
                                console.log('USER LOGGED OUT');
                                $state.go('login');
                                // window.location.href = '#/login';
                            }
                        }
                    });
                }
            })


            .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/browse.html'
                    }
                }
            })

            .state('app.playlistDetail', {
                url: '/audio/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/audio-detail-1.html',
                        controller: 'PlaylistDetailCtrl'
                    }
                }
            })

            .state('app.books', {
                url: '/books',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/book-list-1.html',
                        controller: 'BookCtrl'
                    }
                }
            })

            .state('app.book', {
                url: '/book/:bookId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/book-detail-1.html',
                        controller: 'BookDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.purchase', {
                url: '/purchase/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/inapppurchase.html',
                        controller: 'InAppPurchaseCtrl'
                    }
                }
            })

            .state('app.games-001', {
                url: '/games-001/:size/:maxNum',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/_games001.html',
                        controller: 'Games001Ctrl'
                    }
                }
            })

            .state('app.games-001-settings', {
                url: '/games-001-setting/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/_games001-settings.html',
                        controller: 'Games001SettingsCtrl'
                    }
                }
            })

            //===============================================
            //templates
            //===============================================
            .state('app.rss-reader-1', {
                url: '/rss-reader-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rss-reader.html',
                        controller: 'RssReaderCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.rss-reader-summary-1', {
                url: '/rss-reader-summary-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/rss-reader-summary.html',
                        controller: 'RssReaderCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.fb-rss', {
                url: '/fb-rss/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'FBRssCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.wp-posts', {
                url: '/wp-posts/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-list-1.html',
                        controller: 'WPPostsCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.notif-list', {
                url: '/notif-list/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification-list.html',
                        controller: 'NotificationListCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.profile-list-1', {
                url: '/profile-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile-list-1.html',
                        controller: 'ProfileListCtrl'
                    }
                }
            })

            .state('app.profile', {
                url: '/profile/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('app.contact-list', {
                url: '/contact-list/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-list.html',
                        controller: 'ContactListCtrl'
                    }
                }
            })

            .state('app.contact-list-2', {
                url: '/contact-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-list-2.html',
                        controller: 'ContactListCtrl'
                    }
                }
            })

            .state('app.contact', {
                url: '/contact/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact.html',
                        controller: 'ContactCtrl'
                    }
                }
            })

            .state('app.contact-2-1', {
                url: '/contact-2-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-2-1.html',
                        controller: 'ContactCtrl'
                    }
                }
            })

            .state('app.contact-2-2', {
                url: '/contact-2-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-2-2.html',
                        controller: 'ContactCtrl'
                    }
                }
            })

            .state('app.contact-2-3', {
                url: '/contact-2-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-2-3.html',
                        controller: 'ContactCtrl'
                    }
                }
            })

            .state('app.home-1', {
                url: '/home-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-1.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-1-2', {
                url: '/home-1-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-1-2.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-13', {
                url: '/home-13/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-13.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-2', {
                url: '/home-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-2.html', //home-2.html
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-3', {
                url: '/home-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-3.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-3-2', {
                url: '/home-3-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-3-2.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-4', {
                url: '/home-4/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-4.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-5', {
                url: '/home-5/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-5.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-6', {
                url: '/home-6/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-6.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-7', {
                url: '/home-7/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-7.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-8', {
                url: '/home-8/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-8.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-8-2', {
                url: '/home-8-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-8-2.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-9', {
                url: '/home-9/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-9.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-10', {
                url: '/home-10/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-10.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-11', {
                url: '/home-11/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-11.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-12', {
                url: '/home-12/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-12-po1toolbox.html',  // default: home-12
                        controller: 'HomeCtrl12'
                    }
                }
            })

            .state('app.home-14', {
                url: '/home-14/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-14.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-14-2', {
                url: '/home-14-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-14-2.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-15', {
                url: '/home-15/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-15.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-16', {
                url: '/home-16/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-16.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-17', {
                url: '/home-17/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-17.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-17-2', {
                url: '/home-17-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-17-2.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home-carousel-1', {
                url: '/home-carousel-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-carousel-1.html',
                        controller: 'HomeCarouselCtrl'
                    }
                }
            })

            .state('app.home-custom-1', {
                url: '/home-custom-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home-custom-1.html',
                        controller: 'HomeCustomCtrl'
                    }
                }
            })

            .state('app.book-list-1', {
                url: '/book-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/book-list-1.html',
                        controller: 'BookCtrl'
                    }
                }
            })
            .state('app.book-list-2', {
                url: '/book-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/book-list-2.html',
                        controller: 'BookCtrl'
                    }
                }
            })

            .state('app.book-detail-1', {
                url: '/book-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/book-detail-1.html',
                        controller: 'BookDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.audio-list-1', {
                url: '/audio-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/audio-list-1.html',
                        controller: 'AudioCtrl'
                    }
                }
            })

            .state('app.audio-detail-1', {
                url: '/audio-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/audio-detail-1.html',
                        controller: 'AudioDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.check-audio', {
                url: '/check-audio/:template_name/:filename/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/loading-screen.html',
                        controller: 'CheckAudioFileCtrl'
                    }
                }
            })

            .state('app.article-list-1', {
                url: '/article-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-list-1.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })

            .state('app.article-list-2', {
                url: '/article-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-list-2.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })

            .state('app.article-list-3', {
                url: '/article-list-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-list-1.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })

            .state('app.article-list-2-2', {
                url: '/article-list-2-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-list-2-2.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })

            .state('app.article-detail-1', {
                url: '/article-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-detail-1.html',
                        controller: 'ArticleDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.article-detail-3', {
                url: '/article-detail-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-detail-1.html',
                        controller: 'ArticleDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.article-detail-4', {
                url: '/article-detail-4/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-detail-4.html',
                        controller: 'ArticleDetail4Ctrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.event-list-1', {
                url: '/event-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-list-1.html',
                        controller: 'EventCtrl'
                    }
                }
            })

            .state('app.event-list-2', {
                url: '/event-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-list-2.html',
                        controller: 'EventCtrl'
                    }
                }
            })

            .state('app.event-detail-1', {
                url: '/event-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-detail-1.html',
                        controller: 'EventDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.booking-list-1', {
                url: '/booking-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/booking-list-1.html',
                        controller: 'BookingCtrl'
                    }
                }
            })

            .state('app.booking-detail-1', {
                url: '/booking-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/booking-detail-1.html',
                        controller: 'BookingDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.qrcode-scanner', {
                url: '/qrcode-scanner',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/qrcode-scanner.html',
                        controller: 'QRCodeScannerCtrl'
                    }
                }
            })

            .state('app.reservation-admin-list', {
                url: '/reservation-admin-list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservation-admin-list.html',
                        controller: 'ReservationAdminCtrl'
                    }
                }
            })

            .state('app.reservation-admin-detail', {
                url: '/reservation-admin-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservation-admin-detail.html',
                        controller: 'ReservationAdminDetailCtrl'
                    }
                }
            })

            .state('app.reservation-list', {
                url: '/reservation-list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservation-list.html',
                        controller: 'ReservationCtrl'
                    }
                }
            })

            .state('app.reservation-detail', {
                url: '/reservation-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reservation-detail.html',
                        controller: 'ReservationDetailCtrl'
                    }
                }
            })

            .state('app.airline-booking', {
                url: '/airline-booking?origin&destination&origin_code&destination_code',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking.html',
                        controller: 'AirlineBookingCtrl'
                    }
                }
            })

            .state('app.airline-booking-origin-destination', {
                url: '/airline-booking-origin-destination/:od',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking-origin-destination.html',
                        controller: 'AirlineBookingOriginDestinationCtrl'
                    }
                }
            })

            .state('app.airline-booking-search', {
                url: '/airline-booking-search?round_trip&origin&destination&origin_code&destination_code&departure_date&return_date&adult&child&infant&faretype&preferredairlines',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking-search.html',
                        controller: 'AirlineBookingSearchCtrl'
                    }
                }
            })

            .state('app.airline-booking-search-return', {
                url: '/airline-booking-search-return?round_trip&origin&destination&origin_code&destination_code&departure_date&return_date&adult&child&infant&faretype&preferredairlines&airline_booking_id1&prefered_airline_id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking-search-return.html',
                        controller: 'AirlineBookingSearchReturnCtrl'
                    }
                }
            })

            .state('app.airline-booking-detail', {
                url: '/airline-booking-detail?airline_booking_id&return&menu',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking-detail.html',
                        controller: 'AirlineBookingDetailCtrl'
                    }
                }
            })

            .state('app.airline-booking-summary', {
                url: '/airline-booking-summary?airline_booking_id1&airline_booking_id2',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-booking-summary.html',
                        controller: 'AirlineBookingSummaryCtrl'
                    }
                }
            })

            .state('app.airline-transaction-detail', {
                url: '/airline-transaction-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/airline-transaction-detail.html',
                        controller: 'AirlineTransactionDetailCtrl'
                    }
                }
            })

            .state('app.gallery-list-1', {
                url: '/gallery-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-1.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.login', {
                url: '/login/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.search', {
                url: '/search/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })

            .state('app.gallery-list-2', {
                url: '/gallery-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-2.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-3', {
                url: '/gallery-list-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-3.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-4', {
                url: '/gallery-list-4/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-4.html',
                        controller: 'EventCtrl'
                    }
                }
            })

            .state('app.gallery-list-5', {
                url: '/gallery-list-5/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-5.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-6', {
                url: '/gallery-list-6/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-6.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-7', {
                url: '/gallery-list-7/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-7.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-8', {
                url: '/gallery-list-8/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-8.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-9', {
                url: '/gallery-list-9/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-9.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-10', {
                url: '/gallery-list-10/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-10.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-11', {
                url: '/gallery-list-11/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-11.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-list-12', {
                url: '/gallery-list-12/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-list-12.html',
                        controller: 'GalleryCtrl'
                    }
                }
            })

            .state('app.gallery-detail-1', {
                url: '/gallery-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-detail-search-1.html',
                        controller: 'GalleryDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.article-detail-2', {
                url: '/article-detail-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/article-detail-2.html',
                        controller: 'ArticleDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.vision-mission-1', {
                url: '/vision-mission-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/vision-mission-1.html',
                        controller: 'VisionMissionCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.default', {
                url: '/default/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/default.html',
                        controller: 'DefaultCtrl'
                    }
                }
            })

            .state('app.image-only', {
                url: '/image-only/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/image-only.html',
                        controller: 'ImageOnlyCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })
            .state('app.landing-1', {
                url: '/landing-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/landing-1.html',
                        controller: 'LandingCtrl'
                    }
                }
            })

            .state('app.landing-2', {
                url: '/landing-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/landing-2.html',
                        controller: 'LandingCtrl'
                    }
                }
            })

            .state('app.landing-3', {
                url: '/landing-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/landing-3.html',
                        controller: 'LandingCtrl'
                    }
                }
            })

            .state('app.list-title-post-1', {
                url: '/list-title-post-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/list-title-post-1.html',
                        controller: 'ListTitlePostCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.content-only', {
                url: '/content-only/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content-only.html',
                        controller: 'ContentOnlyCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.no-click', {
                url: '/no-click/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/no-click.html',
                        controller: 'NoClickCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.video-detail-1', {
                url: '/video-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/video-detail-1.html',
                        controller: 'VideoDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })
            .state('app.video-list-1', {
                url: '/video-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/video-list-1.html',
                        controller: 'VideoCtrl'
                    }
                }
            })

            .state('app.product-list-1', {
                url: '/product-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-1.html',
                        controller: 'ProductCtrl'
                    }
                }
            })

            .state('app.product-list-2', {
                url: '/product-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-2.html',
                        controller: 'ProductCtrl2'
                    }
                }
            })

            .state('app.product-list-2-2', {
                url: '/product-list-2-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-2-2.html',
                        controller: 'ProductCtrl2'
                    }
                }
            })

            .state('app.product-list-3', {
                url: '/product-list-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-3.html',
                        controller: 'ProductCtrl2'
                    }
                }
            })

            .state('app.product-list-4', {
                url: '/product-list-4/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-4.html',
                        controller: 'ProductCtrl4'
                    }
                }
            })

            .state('app.product-list-5', {
                url: '/product-list-5/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-list-5.html',
                        controller: 'ProductCtrl2'
                    }
                }
            })

            .state('app.product-detail-1', {
                url: '/product-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-detail-1.html',
                        controller: 'ProductDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.product-detail-2', {
                url: '/product-detail-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-detail-2.html',
                        controller: 'ProductDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.product-detail-2-2', {
                url: '/product-detail-2-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-detail-2-2.html',
                        controller: 'ProductDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.product-detail-3', {
                url: '/product-detail-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-detail-3.html',
                        controller: 'ProductDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.product-detail-4', {
                url: '/product-detail-4/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/product-detail-4.html',
                        controller: 'ProductDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.wishlist-1', {
                url: '/wishlist-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wishlist-1.html',
                        controller: 'WishlistCtrl'
                    }
                }
            })

            .state('app.wishlist-detail', {
                url: '/wishlist-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wishlist-detail-1.html',
                        controller: 'WishlistDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.online-reservation-list-1', {
                url: '/online-reservation-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/online-reservation-list-1.html',
                        controller: 'OnlineReservationListCtrl'
                    }
                }
            })

            .state('app.online-reservation-1', {
                url: '/online-reservation-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/online-reservation-1.html',
                        controller: 'OnlineReservationCtrl'
                    }
                }
            })

            .state('app.online-reservation-data', {
                url: '/online-reservation-data/:id?person',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/online-reservation-data.html',
                        controller: 'OnlineReservationDataCtrl'
                    }
                }
            })

            .state('app.shopping-cart-1', {
                url: '/shopping-cart-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shopping-cart-1.html',
                        controller: 'ShoppingCartCtrl'
                    }
                }
            })

            .state('app.shopping-cart-2', {
                url: '/shopping-cart-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shopping-cart-2.html',
                        controller: 'ShoppingCartCtrl'
                    }
                }
            })

            .state('app.contact-form-1', {
                url: '/contact-form-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact-form-1.html',
                        controller: 'ContactFormCtrl'
                    }
                }
            })

            .state('app.profile-slider-1', {
                url: '/profile-slider-1',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile-slider-1.html',
                        controller: 'ProfileSliderCtrl'
                    }
                }
            })

            .state('app.file-list-1', {
                url: '/file-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/file-list-1.html',
                        controller: 'FileCtrl'
                    }
                }
            })

            .state('app.file-list-2', {
                url: '/file-list-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/file-list-2.html',
                        controller: 'FileCtrl'
                    }
                }
            })

            .state('app.file-list-3', {
                url: '/file-list-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/file-list-3.html',
                        controller: 'FileCtrl'
                    }
                }
            })

            .state('app.file-detail-1', {
                url: '/file-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/file-detail-1.html',
                        controller: 'FileDetailCtrl'
                    }
                }
            })

            .state('app.file-detail-2', {
                url: '/file-detail-2/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/file-detail-2.html',
                        controller: 'FileDetailCtrl'
                    }
                }
            })

            .state('app.webview-list-1', {
                url: '/webview-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/webview-list-1.html',
                        controller: 'WebviewCtrl'
                    }
                }
            })

            .state('app.webview-detail-1', {
                url: '/webview-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/webview-detail-1.html',
                        controller: 'WebviewDetailCtrl'
                    }
                }
            })

            .state('app.bg-showcase', {
                url: '/bg-showcase/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/aa-gallery-bg-list.html',
                        controller: 'EventCtrl'
                    }
                }
            })

            .state('app.components', {
                url: '/components',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/components_template.html'
                    }
                }
            })

            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })

            .state('app.custom-register', {
                url: '/custom-register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-register-form-1.html',
                        controller: 'CustomRegisterCtrl'
                    }
                }
            })

            .state('app.form-list-1', {
                url: '/form-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-form-list-1.html',
                        controller: 'CustomFormListCtrl'
                    }
                }
            })

            .state('app.form-1', {
                url: '/form-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-form-1.html',
                        controller: 'CustomFormCtrl'
                    }
                }
            })

            .state('app.custom-form-reply', {
                url: '/custom-form-reply/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-form-reply.html',
                        controller: 'CustomFormCtrl'
                    }
                }
            })

            .state('app.edit-profile', {
                url: '/edit-profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-profile.html',
                        controller: 'EditProfileCtrl'
                    }
                }
            })

            .state('app.login-loyalty', {
                url: '/login-loyalty',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login-loyalty.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.custom-edit-profile', {
                url: '/custom-edit-profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-edit-profile.html',
                        controller: 'CustomEditProfileCtrl'
                    }
                }
            })

            .state('app.custom-edit-profile-2', {
                url: '/custom-edit-profile-2',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-edit-profile-2.html',
                        controller: 'CustomEditProfileCtrl'
                    }
                }
            })

            .state('app.change-password', {
                url: '/change-password',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/change-password.html',
                        controller: 'ChangePasswordCtrl'
                    }
                }
            })

            .state('app.reset-password', {
                url: '/reset-password',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/reset-password.html',
                        controller: 'ResetPasswordCtrl'
                    }
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login-required-2.html',
                controller: 'LoginRequiredCtrl'
            })

            .state('maintenance', {
                url: '/maintenance',
                templateUrl: 'templates/maintenance.html',
                controller: 'MaintenanceCtrl'
            })

            .state('front-top-up', {
                url: '/front-top-up/:id',
                templateUrl: 'templates/top-up-required-po1toolbox.html',  // default: top-up-required.html
                controller: 'TopUpRequiredCtrl'
            })

            .state('app.top-up', {
                url: '/top-up/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/top-up-po1toolbox.html', // default: top-up.html
                        controller: 'TopUpCtrl'
                    }
                }
            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/register-required.html',
                controller: 'RegisterRequiredCtrl'
            })

            .state('custom-register', {
                url: '/custom-register',
                templateUrl: 'templates/custom-register-form-1.html',
                controller: 'CustomRegisterCtrl'
            })

            .state('reset-password', {
                url: '/reset-password',
                templateUrl: 'templates/reset-password-required.html',
                controller: 'ResetPasswordRequiredCtrl'
            })

            .state('app.career-list-1', {
                url: '/career-list-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/career-list-1.html',
                        controller: 'CareerCtrl'
                    }
                }
            })

            .state('app.career-detail-1', {
                url: '/career-detail-1/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/career-detail-1.html',
                        controller: 'CareerDetailCtrl'
                    }
                },
                onExit: function ($state) {
                    stopVideo();
                }
            })

            .state('app.transaction-list', {
                url: '/transaction-list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/transaction-list.html',
                        controller: 'TransactionListCtrl'
                    }
                }
            })

            .state('app.transaction-detail', {
                url: '/transaction-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/transaction-detail.html',
                        controller: 'TransactionDetailCtrl'
                    }
                }
            })

            .state('app.wishlist-transaction', {
                url: '/wishlist-transaction',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wishlist-transaction.html',
                        controller: 'WishlistTransactionCtrl'
                    }
                }
            })

            .state('app.wishlist-transaction-detail', {
                url: '/wishlist-transaction-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/wishlist-transaction-detail.html',
                        controller: 'WishlistTransactionDetailCtrl'
                    }
                }
            })

            .state('app.opsigo-transaction-list', {
                url: '/opsigo-transaction-list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/opsigo-transaction-list.html',
                        controller: 'OpsigoTransactionListCtrl'
                    }
                }
            })

            .state('app.opsigo-transaction-detail', {
                url: '/opsigo-transaction-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/opsigo-transaction-detail.html',
                        controller: 'OpsigoTransactionDetailCtrl'
                    }
                }
            })

            .state('app.booking-history', {
                url: '/booking-history',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/booking-history.html',
                        controller: 'BookingHistoryCtrl'
                    }
                }
            })

            .state('app.manual-payment', {
                url: '/manual-payment',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/manual-payment.html',
                        controller: 'ManualPaymentCtrl'
                    }
                }
            })

            .state('app.how-to-contribute', {
                url: '/how-to-contribute',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/how-to-contribute.html',
                        controller: 'HowToContributeCtrl'
                    }
                }
            })

            .state('app.register-loyalty', {
                url: '/register-loyalty',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register-loyalty.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.shopping-tnc', {
                url: '/shopping-tnc',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shopping-tnc.html',
                        controller: 'ShoppingTncCtrl'
                    }
                }
            })

            .state('app.testimonial-1', {
                url: '/testimonial-1/:post_id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/testimonial-1.html',
                        controller: 'TestimonialCtrl'
                    }
                }
            })

            .state('app.add-testimonial', {
                url: '/add-testimonial/:post_id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/add-testimonial.html',
                        controller: 'TestimonialCtrl'
                    }
                }
            })

            .state('app.edit-testimonial', {
                url: '/edit-testimonial/:post_id/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-testimonial.html',
                        controller: 'TestimonialCtrl'
                    }
                }
            })

            .state('app.comment-list', {
                url: '/comment-list/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/comment-list.html',
                        controller: 'CommentListCtrl'
                    }
                }
            })
            .state('app.event-list-3', {
                url: '/event-list-3/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-list-3.html',
                        controller: 'CalendarCtrl'
                    }
                }
            })

            .state('app.membership-products', {
                url: '/membership-products',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-products.html',
                        controller: 'MembershipProductsCtrl'
                    }
                }
            })

            .state('app.membership-product-detail', {
                url: '/membership-product-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-product-detail.html',
                        controller: 'MembershipProductDetailCtrl'
                    }
                }
            })

            .state('app.membership-member-items', {
                url: '/membership-member-items',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-member-items.html',
                        controller: 'MembershipMemberItemsCtrl'
                    }
                }
            })

            .state('app.membership-member-item-detail', {
                url: '/membership-member-item-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-member-item-detail.html',
                        controller: 'MembershipMemberItemDetailCtrl'
                    }
                }
            })

            .state('app.membership-history', {
                url: '/membership-history',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-history.html',
                        controller: 'MembershipHistoryCtrl'
                    }
                }
            })

            .state('app.membership-history-detail', {
                url: '/membership-history-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/membership/membership-history-detail.html',
                        controller: 'MembershipHistoryDetailCtrl'
                    }
                }
            })

            .state('app.custom-form-reply-history', {
                url: '/custom-form-reply-history',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-form/custom-form-reply-history.html',
                        controller: 'CustomFormReplyHistoryCtrl'
                    }
                }
            })

            .state('app.custom-form-reply-history-detail', {
                url: '/custom-form-reply-history-detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/custom-form/custom-form-reply-history-detail.html',
                        controller: 'CustomFormReplyHistoryDetailCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings/settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gosend-map.html',
                        controller: 'GosendMapCtrl'
                    }
                }
            })

            .state('app.setting-language', {
                url: '/setting-language',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings/language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })

            //            ;
            //            $urlRouterProvider.otherwise('/app/' + home_template + '/' + home_id);
            // ============================================================
            // STUDIO APP MODE
            // ============================================================

            .state('studio', {
                url: '/studio',
                abstract: true,
                templateUrl: 'templates/' + st_menu_template,
                controller: 'StudioCtrl',
                onExit: function ($state) {
                    stopVideo();
                },
                onEnter: function ($state, $ionicPlatform) {
                    $ionicPlatform.ready(function () {
                        if (!st_preview_app && $state.transition) {
                            // $state.transition.finally(() => {
                            //     $state.go('studio.app-list', {})
                            // });
                            $state.transition.finally(function () {
                                $state.go('studio.app-list', {});
                            });
                        }
                        else if (app_type === 'studio') {
                            console.log('STUDIO: INIT MODE');
                            if (st_user_id == '') {
                                if (!isPhoneGap())
                                    $state.go('studio-login');
                            }
                        }
                    });

                }
            })

            .state('studio-login', {
                url: '/studio-login',
                templateUrl: 'templates/studio/studio-login.html',
                controller: 'StudioLoginCtrl'
            })

            .state('studio.app-list', {
                url: '/studio-app-list',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/studio/studio-app-list.html',
                        controller: 'StudioAppListCtrl'
                    }
                }
            })

            .state('studio.about', {
                url: '/studio-about',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'StudioAboutCtrl'
                    }
                }
            })

            .state('studio.app-initialize', {
                url: '/studio-app-initialize',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/studio/studio-app-initialize.html',
                        controller: 'StudioAppInitializeCtrl'
                    }
                }
            })

            .state('studio.app-published', {
                url: '/studio-app-published',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/studio/studio-app-published.html',
                        controller: 'StudioAppPublishedCtrl'
                    }
                }
            })
            ;

        switch (app_type) {
            case 'studio':
                $urlRouterProvider.otherwise('/studio-login');
                break;
            default: //case 'app':
                $urlRouterProvider.otherwise('/app/' + home_template + '/' + home_id);
                break;
        }
    });
