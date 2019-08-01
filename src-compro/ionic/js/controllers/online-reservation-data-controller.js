app.controller("OnlineReservationDataCtrl", function ($scope, $rootScope, $http, httpService, $stateParams, $window, $ionicPlatform,$ionicLoading,$ionicPopup, $ionicHistory) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = user_id;
    $scope.rsvp = {};
    $scope.master = {};
    $scope.master.fullname = "";
    $scope.master.email = "";
    $scope.master.nohandphone = "";
    $scope.autofill = "";
    $scope.persons = new Array();
    $scope.custom_form_fields = !custom_form_fields ? '[]' : JSON.parse(custom_form_fields);

    if($stateParams.person !== undefined) {
        $scope.rsvp.person = $stateParams.person;
    }

    var id = $stateParams.id;
    console.log($scope.rsvp.person);
    var loadCustomText = function() {
        $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
    };

    loadCustomText();

    $ionicPlatform.ready(function () {
        $scope.scrollPos = 0;
        // check user login
        if (user_id === '') {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        $scope.isLoading = false;
        console.log('OnlineReservationDataCtrl');
        var person_count = 0;
        for(var i=0; i<$scope.rsvp.person; i++) {
            person_count += 1;
            var person = {
        		"index": person_count,
                "fullname": "",
                "email": "",
                "nohandphone": ""
        	}
        	$scope.persons.push(person);
        }
    });

    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    $scope.doRefresh = function() {
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){

    };

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.validateInput = function () {
        console.log($scope.persons);
        console.log($scope.master);
        $scope.show();
        var url = user_create_reservation + user_id + '/' + id;
        var obj = serializeData({
            name: $scope.master.fullname,
            email: $scope.master.email,
            phone_number: $scope.master.nohandphone,
            persons: JSON.stringify($scope.persons)
        });
        
        httpService.post($scope, $http, url, obj, 'create-reservation');
    }

    $scope.$on('httpService:createReservationSuccess', function () {
        $scope.hide();
        if($scope.data.success){
            $scope.showBookingAlert($scope.data.reservation.id);
        }
        else{
            $scope.showNoReservationStockAlert();
        }
    });

    $scope.$on('httpService:createReservationError', function () {
        var url = user_create_reservation + user_id + '/' + id;
        var obj = serializeData({
            name: $scope.master.fullname,
            email: $scope.master.email,
            phone_number: $scope.master.nohandphone,
            persons: JSON.stringify($scope.persons)
        });
        
        httpService.post($scope, $http, url, obj, 'create-reservation');
    });

    $scope.showNoReservationStockAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Reservation',
            css: 'cp-button',
            okType:'cp-button',
            template: '<div style="width:100%;text-align:center">Sorry, Your reservation is not available</div>',
            buttons: [
                {
                    text: 'OK',
                    type: 'cp-button',
                    onTap: function(e) {
                        $scope.$ionicGoBack();
                    }
                }
            ]
        });
    }
    
    $scope.showBookingAlert = function (id) {
        var alertPopup = $ionicPopup.alert({
            title: 'Reservation',
            template: '<div style="width:100%;text-align:center">'+ 'Thank you for your reservation. Please wait until receiving a confirmation from us .' +'</div>',
            buttons:[
                {
                    text: $scope.alert_button_ok,
                    type: 'cp-button',
                    onTap: function(e) {
                        $ionicHistory.removeBackView();
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $ionicHistory.clearHistory();
                        window.location.href = "#/app/reservation-detail/"+id;
                    }
                }
            ]
        });
    };

    $scope.fillForm = function () {
        $scope.autofill = document.getElementById('autofill').checked;
        if($scope.autofill){
            $scope.persons[0].email = $scope.master.email;
            $scope.persons[0].fullname = $scope.master.fullname;
            $scope.persons[0].nohandphone = $scope.master.nohandphone;
        }
        else{
            $scope.persons[0].email = "";
            $scope.persons[0].fullname = "";
            $scope.persons[0].nohandphone = "";
        }
    };

    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = post_content_url + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('CustomFormXOnlineReservationCtrl');

    });
    
    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    $scope.$on('httpService:getRequestSuccess', function () {
        //console.log($scope.data);
        $scope.content_data = {
            id: $stateParams.id,
            title: $scope.data.post.title,
            created_date: $scope.data.post.created_date,
            img_src: $scope.data.post.featured_image_path,
            content: $scope.data.post.content,
            post_meta: $scope.data.post.post_meta
        };

        term_content_type_id = $scope.data.post.term_content_type_id;
        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        for(var i=0; i<$scope.content_data.post_meta.length; i++)
        {
            var postMeta = $scope.content_data.post_meta[i];

            if(postMeta['key'] == "custom_form_fields") {
                $scope.custom_form_fields = JSON.parse(postMeta['value']);
            }
            else if (postMeta['key'] == 'admin_can_reply'){
                admin_can_reply = postMeta['value'];
            }
            else if (postMeta['key'] == 'login_required_on_submit'){
                $scope.login_required_on_submit = postMeta['value'];
            }
        }
        for(var i=0; i<$scope.custom_form_fields.length; i++)
        {
            if($scope.custom_form_fields[i].type == 'checkbox')
            {
                $scope.custom_form_fields[i].passRequirement = false;
            }
        }

        $scope.isLoading = false;
    });

    $scope.$on('httpService:getRequestError',function(){
       $scope.isTimeout = true;
    });

});
