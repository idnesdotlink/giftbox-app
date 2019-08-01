app.controller("ResetPasswordRequiredCtrl", function ($scope,
                                               $http,
                                               httpService,
                                               $stateParams,
                                               $ionicPlatform,
                                               $ionicPopup,
                                               $ionicLoading) {

    $scope.input = {
        user_email: ''
    };
    $scope.login_mode = login_mode;
    $scope.default_register_fields = JSON.parse(default_register_fields)[0];


    var loadCustomText = function(){
      $scope.title_reset_password = getMenuText(ui_texts_reset_password.title_reset_password, "Reset Password");
      $scope.alert_reset_password_success = getMenuText(ui_texts_reset_password.alert_reset_password_success, "An email on how to reset your password has been sent. Please check your email.");
      $scope.alert_reset_password_failed_connection = getMenuText(ui_texts_reset_password.alert_reset_password_failed_connection, "Failed to reset password. Please check your internet connection and try again.");
      $scope.alert_reset_password_failed_wrong_cred = getMenuText(ui_texts_reset_password.alert_reset_password_failed_wrong_cred, "Failed to reset password. Please check your email and try again.");
      $scope.button_reset_password = getMenuText(ui_texts_reset_password.button_reset_password, "Reset Password");
    };

    loadCustomText();

    $scope.resetPassword = function()
    {
        // get data
        $scope.show();

        var obj = serializeData({
            user_username: $scope.input.user_username,
            user_email: $scope.input.user_email,
            company_id: company_id
        });

        httpService.post($scope, $http, reset_password_url, obj);
    };

    // get data success
    $scope.$on('httpService:postRequestSuccess', function () {
        $scope.hide();
        //console.log($scope.data);
        if($scope.data.success === true)
        {
            $scope.showResetPasswordSuccessAlert();
        }
        else if ($scope.data.success == false && $scope.data.user == null){
            $scope.showResetPasswordWrongCredentialAlert();
        }
        else
        {
            $scope.showResetPasswordFailedAlert();
        }

    });

    // if get detail data Error, request token again
    $scope.$on('httpService:postRequestError', function () {
        $scope.hide();
        $scope.showResetPasswordFailedAlert();
    });

    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.showResetPasswordSuccessAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_reset_password,
        template: '<div style="width:100%;text-align:center">' + $scope.alert_reset_password_success + '</div>'
      });
    };

    $scope.showResetPasswordFailedAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_reset_password,
        template: '<div style="width:100%;text-align:center">' + $scope.alert_reset_password_failed_connection + '</div>'
      });
    };

    $scope.showResetPasswordWrongCredentialAlert = function () {
      var id = login_mode == 'username' ? 'username' : 'email';
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_reset_password,
        template: '<div style="width:100%;text-align:center">' + $scope.alert_reset_password_failed_wrong_cred + '</div>'
      });
    };


});

