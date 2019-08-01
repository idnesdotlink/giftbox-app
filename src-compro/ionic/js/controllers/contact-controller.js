app.controller('ContactCtrl', function ($scope, $state, $ionicLoading, $compile, $http, httpService, $stateParams, $ionicPlatform, $cordovaLaunchNavigator, $ionicPopup, $rootScope) {
    // loading spinner in the beginning

   
    $scope.isLoading = true;
    $scope.isTimeout = false;
    // $scope.loading_map = false;
    angular.extend($scope, {
        center: {
            lat: 0,
            lng: 0,
            zoom: 17
        },
        defaults: {
            dragging: false,
        },
        layers: {
          baselayers: {
            osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
            }
          }
        }
    });

    var contentString = "<div>Company Name</div>";
    var longitude_temp = '';
    var latitude_temp = '';
    var title_temp = '<div>Company Name</div>';

    var loadCustomText = function () {

        $scope.button_text_get_direction = ui_texts_contacts.button_text_get_direction !== undefined && ui_texts_contacts.button_text_get_direction[language] !== undefined ? ui_texts_contacts.button_text_get_direction[language] : "Get Direction";

        $scope.ui_text_location_loading = ui_texts_contacts.ui_text_location_loading !== undefined && ui_texts_contacts.ui_text_location_loading[language] !== undefined ? ui_texts_contacts.ui_text_location_loading[language] : "Getting current location...";

    };

    loadCustomText();

    $ionicPlatform.ready(function () {

        console.log('ContactCtrl');
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);

    });

    // if get token success, request contact data
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        if(loadCompressedImages==false)
        {
            var url = post_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
        else
        {
            var url = post_compressed_content_url + $stateParams.id;
            httpService.get($scope, $http, url, 'content', token);
        }
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    // if get contact success, set contact data
    $scope.$on('httpService:getRequestSuccess', function () {
        latitude_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_lat').value;
        longitude_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_lng').value;
        title_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_title').value;

        // $scope.loading_map = true;
        angular.extend($scope, {
            center: {
                lat: parseFloat(latitude_temp),
                lng: parseFloat(longitude_temp),
                zoom: 17
            },
            markers: {
                map: {
                    lat: parseFloat(latitude_temp),
                    lng: parseFloat(longitude_temp),
                    focus: true,
                    label: {
                        message: title_temp,
                        options: {
                            noHide: true
                        }
                    }
                }
            },
            defaults: {
                dragging: false,
            },
            layers: {
              baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
              }
            }
        });
        console.log(latitude_temp);
        console.log(longitude_temp);
        console.log('floor');
        console.log(Math.floor(latitude_temp));
        console.log('getRequestSuccess');

        $scope.content_data = {
            title: $scope.data.post.title,
            featured_image: $scope.data.post.featured_image_path,
            company_name: getPostMetaValueById($scope.data.post.post_meta, 'company_name').value,
            contacts: getPostMetaValueById($scope.data.post.post_meta, 'contacts').value,
            address: getPostMetaValueById($scope.data.post.post_meta, 'address').value,
            city: getPostMetaValueById($scope.data.post.post_meta, 'city').value,
            postal_code: getPostMetaValueById($scope.data.post.post_meta, 'postal_code').value,
            province: getPostMetaValueById($scope.data.post.post_meta, 'province').value,
            country: getPostMetaValueById($scope.data.post.post_meta, 'country').value,
            email: getPostMetaValueById($scope.data.post.post_meta, 'email').value,
            working_days: getPostMetaValueById($scope.data.post.post_meta, 'working_days').value,
            working_hours: getPostMetaValueById($scope.data.post.post_meta, 'working_hours').value,
            social_media: getPostMetaValueById($scope.data.post.post_meta, 'social_media') == undefined ? "" : getPostMetaValueById($scope.data.post.post_meta, 'social_media').value,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        if($scope.content_data.contacts.indexOf('<br>') != -1)
        {
            $scope.content_data.contacts = getPostMetaValueById($scope.data.post.post_meta, 'contacts').value.split("<br>");
        }
        else if($scope.content_data.contacts.indexOf('</br>') != -1)
        {
            $scope.content_data.contacts = getPostMetaValueById($scope.data.post.post_meta, 'contacts').value.split("</br>");
        }
        else if($scope.content_data.contacts.indexOf('<br/>') != -1)
        {
            $scope.content_data.contacts = getPostMetaValueById($scope.data.post.post_meta, 'contacts').value.split("<br/>");
        }
        else {
            $scope.content_data.contacts = [getPostMetaValueById($scope.data.post.post_meta, 'contacts').value];
        }

        console.log($scope.content_data.contacts);

        if($scope.content_data.social_media != null && $scope.content_data.social_media != "") {
            $scope.content_data.social_media = JSON.parse(getPostMetaValueById($scope.data.post.post_meta, 'social_media').value);
        }
        else $scope.content_data.social_media = "";

        contentString = "<div>" + $scope.content_data.company_name + "</div>";
        // initialize function for google map
        // initializeMap();
        //console.log("masuk initialize");
        //google.maps.visualRefresh = true;

        $scope.isLoading = false;

        // SAVE contact data to SQLite
        if (isPhoneGap()) {
            saveTermJSONToDB($stateParams.id, 'ContactCtrl', $scope.data);
        }

        //request compressed image if set to on
        if(loadCompressedImages)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
        }

    });

    // if get token failed, request token again
    $scope.$on('httpService:postTokenError', function () {

        if ($scope.status === 0) {
            if (isPhoneGap()) {
                loadTermJSONFromDB($stateParams.id, $scope);
            }
        }
        else {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');

        }

    });

    // if get contact detail failed, request token again
    $scope.$on('httpService:getRequestError', function () {
        $scope.isTimeout = true;
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;

        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token);

    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
    });


    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;

        $scope.content_data.featured_image = updated_data.post.featured_image_path;

        //display true resolution image
        console.log('true resolution loaded');

        // save to db first page
        if(isPhoneGap())
        {
            savePostJSONToDB($stateParams.id, updated_data.post.term_id, 'ContactCtrl', updated_data);
        }

    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');

    });

    var initializeMap = function () {
        var latitude = latitude_temp;
        var longitude = longitude_temp;
        //console.log("test:" + latitude + " " + longitude);
        var myLatlng = new google.maps.LatLng(latitude, longitude);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        //var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: title_temp
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: title_temp
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
        // infowindow.open(map, marker);
        $scope.map = map;

        google.maps.event.addListenerOnce(map, "idle", function () {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(myLatlng);
            infowindow.open(map, marker);
        });

    };

    //google.maps.event.addDomListener(window, 'load', initializeMap);

    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: $scope.ui_text_location_loading,
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function (error) {
            console.log('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function () {
        console.log('Example of infowindow with ng-click');
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        latitude_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_lat').value;
        longitude_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_lng').value;
        title_temp = getPostMetaValueById($scope.data.post.post_meta, 'map_title').value;

        $scope.content_data = {
            title: $scope.data.post.title,
            company_name: getPostMetaValueById($scope.data.post.post_meta, 'company_name').value,
            contacts: getPostMetaValueById($scope.data.post.post_meta, 'contacts').value,
            address: getPostMetaValueById($scope.data.post.post_meta, 'address').value,
            city: getPostMetaValueById($scope.data.post.post_meta, 'city').value,
            postal_code: getPostMetaValueById($scope.data.post.post_meta, 'postal_code').value,
            province: getPostMetaValueById($scope.data.post.post_meta, 'province').value,
            country: getPostMetaValueById($scope.data.post.post_meta, 'country').value,
            email: getPostMetaValueById($scope.data.post.post_meta, 'email').value,
            working_days: getPostMetaValueById($scope.data.post.post_meta, 'working_days').value,
            working_hours: getPostMetaValueById($scope.data.post.post_meta, 'working_hours').value,
            post_meta: $scope.data.post.post_meta
        };

        if ($scope.data.post.term_content_type_id == 3) {
          $scope = replaceLanguagePostTitle($scope);
        }

        contentString = "<div>" + $scope.content_data.company_name + "</div>";
        // initialize function for google map
        initializeMap();
        //console.log("masuk initialize");
        // google.maps.visualRefresh = true;
        $scope.isLoading = false;

    });

    $scope.retryLoadContent = function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;
        httpService.post_token($scope, $http, url, obj, 'content');
    };

    $scope.launchNavigator = function () {
        var destination = [latitude_temp, longitude_temp];
        if (isPhoneGap()) {
            var options = {
              appSelection: {
                list:[
                  launchnavigator.APP.USER_SELECT,
                  launchnavigator.APP.GEO,
                  launchnavigator.APP.GOOGLE_MAPS,
                  launchnavigator.APP.WAZE,
                  launchnavigator.APP.CITYMAPPER,
                  // launchnavigator.APP.UBER,
                  launchnavigator.APP.APPLE_MAPS,
                  launchnavigator.APP.NAVIGON,
                  launchnavigator.APP.TRANSIT_APP,
                  launchnavigator.APP.YANDEX,
                  launchnavigator.APP.TOMTOM,
                  launchnavigator.APP.BING_MAPS,
                  launchnavigator.APP.SYGIC,
                  launchnavigator.APP.HERE_MAPS,
                  launchnavigator.APP.MOOVIT,
                  launchnavigator.APP.LYFT,
                  launchnavigator.APP.MAPS_ME,
                  launchnavigator.APP.CABIFY,
                  launchnavigator.APP.BAIDU,
                  launchnavigator.APP.TAXIS_99,
                  launchnavigator.APP.GAODE,
                  'com.gojek.app'
                ]
              }
            };

            function navigateSuccess() {
                console.log('navigateSuccess');
            }

            function navigateError() {
                console.log('navigateError');
            }

            $cordovaLaunchNavigator.navigate(destination, options);
        } else {
            showNotInMobileDeviceError($ionicPopup);
            console.log('Not a mobile device');
        }
    };
});
