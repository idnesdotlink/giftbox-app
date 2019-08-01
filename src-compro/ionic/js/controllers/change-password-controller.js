/**
 * Created by Audy on 21-Mar-16.
 */
app.controller("ChangePasswordCtrl", function ($scope,
                                               $http,
                                               httpService,
                                               $stateParams,
                                               $ionicPlatform,
                                               $ionicPopup,
                                               $ionicLoading) {

    var loadMenuText = function(){
      $scope.text_change_password_title = getMenuText(ui_texts_settings.text_change_password_title,"Change Password");
      $scope.button_text_change_password = getMenuText(ui_texts_settings.button_text_change_password,"Change Password");
      $scope.alert_text_change_password_success = getMenuText(ui_texts_settings.alert_text_change_password_success,'Successfully changed password.');
      $scope.alert_text_change_password_failed = getMenuText(ui_texts_settings.alert_text_change_password_failed,'Failed to change password. Please check your internet connection and try again.');
      $scope.alert_text_change_password_wrong = getMenuText(ui_texts_settings.alert_text_change_password_wrong,'Old Password did not match with our record.');
      $scope.input_title_old_password = getMenuText(ui_texts_settings.input_title_old_password, "Old Password");
      $scope.input_title_new_password = getMenuText(ui_texts_settings.input_title_new_password, "New Password");
      $scope.input_title_password_confirmation = getMenuText(ui_texts_settings.input_title_password_confirmation, "Password Confirmation");
      $scope.input_error_password_min_char = getMenuText(ui_texts_settings.input_error_password_min_char, 'Must be min. length of');
      $scope.input_error_password_characters = getMenuText(ui_texts_settings.input_error_password_characters, 'characters');
      $scope.input_error_password_match = getMenuText(ui_texts_settings.input_error_password_match, 'New Password and Password Confirmation does not match.');
    };


    loadMenuText();
    $scope.input = {
        old_password: '',
        confirm_password: '',
        new_password: ''
    };

    $scope.changePassword = function()
    {
        // get data
        $scope.show();
        var obj = serializeData({user_id:user_id, old_password: $scope.input.old_password, new_password: $scope.input.new_password, confirm_password: $scope.input.confirm_password});

        httpService.post($scope, $http, change_password_url, obj);
    };

    // get data success
    $scope.$on('httpService:postRequestSuccess', function () {
        $scope.hide();
        //console.log($scope.data);
        if($scope.data.success === true)
        {
            $scope.showChangePasswordSuccessAlert();
        }
        else
        {
            $scope.showWrongOldPasswordFailedAlert();
        }

    });

    // if get token detail data Error, request token again
    $scope.$on('httpService:postTokenError', function () {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'content');

    });

    // if get detail data Error, request token again
    $scope.$on('httpService:postRequestError', function () {
        $scope.showChangePasswordFailedAlert();

    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showChangePasswordSuccessAlert = function (username) {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_change_password_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_text_change_password_success + '</div>'
        });
    };

    $scope.showWrongOldPasswordFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_change_password_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_text_change_password_wrong + '</div>'
        });
        $scope.hide();
    };

    $scope.showChangePasswordFailedAlert = function (username) {
        var alertPopup = $ionicPopup.alert({
            title: $scope.text_change_password_title,
            template: '<div style="width:100%;text-align:center">' + $scope.alert_text_change_password_failed + '</div>'
        });
        $scope.hide();
    };

});

