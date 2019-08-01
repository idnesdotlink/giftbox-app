app.controller("LanguageCtrl", function ($scope,
                                         $rootScope,
                                         $http,
                                         httpService,
                                         $stateParams,
                                         $ionicPlatform,
                                         $ionicPopup,
                                         $ionicHistory) {

    var loadCustomText = function(){
      $scope.title_select_language = getMenuText(ui_texts_language.title_select_language, "Select Language");
      $scope.confirm_language_title = getMenuText(ui_texts_language.confirm_language_title, "Confirm Language");
      $scope.confirm_language_content = getMenuText(ui_texts_language.confirm_language_content, "Set this language as default");
      $scope.alert_confirm_language_success = getMenuText(ui_texts_language.alert_confirm_language_success,"Successfully set language as");
    };

    loadCustomText();

    $ionicPlatform.ready(function()
    {
        $scope.available_languages = available_languages;
    });

    $scope.confirmLanguage = function(index){
        var selectedLang = $scope.available_languages[index];

        var confirmPopup = $ionicPopup.confirm({
          title: $scope.confirm_language_title,
          css: 'cp-button',
          okType:'cp-button',
          okText: $scope.alert_button_ok,
          cancelText: $scope.alert_button_cancel,
          template: '<div style="width:100%;text-align:center">' + $scope.confirm_language_content + ': <span class="text-capitalize"><b>' + selectedLang + '<b></span>?</div>'
        }).then(function(res) {

          if(res) {
            language = selectedLang;

            var alertSuccess = $ionicPopup.alert({
              title: $scope.confirm_language_title,
              css: 'cp-button',
              okType: 'cp-button',
              okText: $scope.alert_button_ok,
              template: '<div style="width:100%;text-align:center">' + $scope.alert_confirm_language_success + ': <span class="text-capitalize"><b>' + selectedLang + '<b></span></div>'
            }).then(function(res){
              $rootScope.$emit('ReloadDefaultLanguage');
              $ionicHistory.goBack();
            });
          }

        });
    };
});
