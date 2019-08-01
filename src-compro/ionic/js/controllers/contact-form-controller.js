/**
 * Created by Audy on 21-Mar-16.
 */
app.controller("ContactFormCtrl", function ($scope, $http, httpService, $stateParams, $ionicPlatform, $ionicPopup, $ionicLoading) {

    $scope.input = {
        content: '',
        meta: {
            email: email,
            name: username_login
        }
    };

    $scope.isLoading = true;

    var loadCustomText = function() {
        $scope.input_text_email = getMenuText(ui_texts_contact_forms.input_text_email,"Email");
        $scope.input_placeholder_email = getMenuText(ui_texts_contact_forms.input_placeholder_email,"Email");
        $scope.input_required_error_email = getMenuText(ui_texts_contact_forms.input_required_error_email,"Email must be filled");
        $scope.input_format_error_email = getMenuText(ui_texts_contact_forms.input_format_error_email,"Wrong format for email field.");
        $scope.input_text_name = getMenuText(ui_texts_contact_forms.input_text_name,"Name");
        $scope.input_placeholder_name = getMenuText(ui_texts_contact_forms.input_placeholder_name,"Name");
        $scope.input_required_error_name = getMenuText(ui_texts_contact_forms.input_required_error_name,"Name must be filled");
        $scope.input_format_error_name = getMenuText(ui_texts_contact_forms.input_format_error_name, "Wrong format for name field.");
        $scope.input_text_content = getMenuText(ui_texts_contact_forms.input_text_content, "Content");
        $scope.input_placeholder_content = getMenuText(ui_texts_contact_forms.input_placeholder_content,"Content");
        $scope.text_button_submit = getMenuText(ui_texts_contact_forms.text_button_submit,"Submit");
        $scope.alert_contact_form_title = getMenuText(ui_texts_contact_forms.alert_contact_form_title, "Form");
        $scope.alert_submit_form_success = getMenuText(ui_texts_contact_forms.alert_submit_form_success, "Successfully submitted form.");
        $scope.alert_submit_form_failed = getMenuText(ui_texts_contact_forms.alert_submit_form_failed, "Failed to submit form. Please check your internet connection and try again.");
        $scope.alert_submit_form_login_required = getMenuText(ui_texts_contact_forms.alert_submit_form_login_required, "You have to login to submit form.");
    };

    loadCustomText();

    var url = token_url;
    var obj = serializeData({email: username, password: password, company_id: company_id});
    // call angular http service
    httpService.post_token($scope, $http, url, obj);


    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        var url = post_content_url + $stateParams.id;

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('UserFormCtrl');

    });

    $scope.$on('httpService:getRequestSuccess', function () {
        //console.log($scope.data);

        $scope.content_data = {
            id: $stateParams.id,
            title: $scope.data.post.title
        };
        $scope.isLoading = false;

        if(isPhoneGap())
        {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, $scope.data.post.term_id, 'ArticleDetailCtrl', $scope.data);
            //console.log('saved');
        }

    });

    $scope.submitForm = function () {
        //console.log($scope.input.meta);
        $scope.show();
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'user-form');

        //console.log($scope.input);
    };

    // if get token success, request profile data
    $scope.$on('httpService:postTokenUserFormSuccess', function () {
        //console.log($scope.data);
        token = $scope.data.token;
        var tempString = JSON.stringify($scope.input.meta);

        var obj = serializeData({_method: 'POST', content: $scope.input.content, post_id: $stateParams.id, user_id: user_id, company_id: company_id, meta: tempString});

        // post comment
        //console.log(obj);
        httpService.post($scope, $http, user_form_url + '?token=' + token, obj, 'user-form');
    });


    $scope.$on('httpService:postUserFormSuccess', function () {
        $scope.hide();
        if($scope.data.success === true)
        {
            $scope.showSubmitFormSuccessAlert();
        }
        else
        {
            $scope.showSubmitFormFailedAlert();
        }
    });

    $scope.$on('httpService:postTokenUserFormError', function () {
        $scope.hide();
        $scope.showSubmitFormFailedAlert();
    });

    $scope.$on('httpService:postUserFormError', function () {
        $scope.hide();
        $scope.showFailedAlert();
    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showSubmitFormSuccessAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_contact_form_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_submit_form_success + '</div>'
        });
    };

    $scope.showSubmitFormFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_contact_form_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_submit_form_failed + '</div>'
        });
    };

    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_contact_form_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_submit_form_login_required + '</div>'
        });
    };
});
