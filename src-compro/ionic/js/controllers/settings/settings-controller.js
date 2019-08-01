app.controller("SettingsCtrl", function ($scope,
                                         $rootScope,
                                         $http,
                                         httpService,
                                         $state,
                                         $stateParams,
                                         $ionicPlatform) {



    var loadCustomText = function(){
      $scope.title_settings = getMenuText(ui_texts_settings.title_settings, "Settings");
      $scope.title_select_language = getMenuText(ui_texts_language.title_select_language, "Select Language");
    };


    var loadSettingsList = function(){
      $scope.settingsList = [
        {id:"language", name:$scope.title_select_language, link:"app.setting-language"}
      ];
    };

    $ionicPlatform.ready(function()
    {
      loadCustomText();
      loadSettingsList();
    });

    $scope.gotoSettingsMenu = function(idx){
      $state.go($scope.settingsList[idx].link);
    };

    $rootScope.$on("ReloadDefaultLanguage",function(){
      loadCustomText();
      loadSettingsList();
    })

});
