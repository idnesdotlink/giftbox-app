app.controller('StudioAboutCtrl',function($scope,
                                            $state,
                                            $rootScope,
                                            $http,
                                            httpService,
                                            $ionicPlatform,
                                            $ionicHistory){
                                                
    var title = "About";
    var name = "About Compro Studio";
    var img_src = "https://compro.id/wp-content/themes/compro/images/compro/logo_720.png";
    var biography = 
        "<p>Compro Studio is an app to view and test all your created Compro mobile apps.</p>" + 
        "<span style='text-align:left; font-weight:bold;'>Here are the things you can do in Compro Studio:" + 
        "<ul>\n\
            <li>Show people your recently created apps!</li>\n\
            <li>View and test your app before publishing!</li>\n\
            <li>Quickly view changes made in \"Compro Engine\" and \"Compro Admin\"!</li>\n\
        </ul></span><br>" + 
        "Thank you for using our services!<br><br>" +
        "Version: v1.3.1<br>" + 
        "<a href=\"https://compro.id\" class='external-link'>Compro.id</a> @2016";

    $scope.content_data = {
        title: title,
        name: name,
        biography: biography,
        img_src: img_src
    };
    $scope.isLoading = false;
    $scope.isTimeout = false;
});