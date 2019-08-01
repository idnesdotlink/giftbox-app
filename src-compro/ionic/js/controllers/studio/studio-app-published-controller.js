app.controller('StudioAppPublishedCtrl',function($scope,
                                            $state,
                                            $rootScope,
                                            $ionicPopup,
                                            $http,
                                            httpService,
                                            $ionicPlatform,
                                            $ionicHistory){
	
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.isExist = false;
    $scope.studioThemes = ".cp-header{font-family: openSansBold !important;font-weight: 400 !important;background-color:#a51d34 !important;color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-header-button{font-family: openSansLight !important;color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-tabs{background-color:#a51d34 !important;color:#ededed !important;border-color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-tabs .tab-item{font-family: openSansLight !important;color:#ededed !important;border-color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-modal-menu-bg{    background-color:#a51d34 !important;    color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-modal-menu-item-container{    border-bottom: 1px solid #ededed;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-modal-menu-item{    color:#ededed !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-page{background:#ffffff!important;background-size: cover;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-page-content{background:rgba(255,255,255,0) !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-list, ion-list.cp-list .list{background: rgba(255,255,255,0) !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}ion-list.cp-swippable-list .list .item-content{background: #ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-list .item{background:rgba(255,255,255,0) !important;border-color: #ffdedb;color: #000000;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-list .item.item-divider, .cp-list .item.item-divider .input-label, .cp-list .item.item-divider select{background: #ffdedb !important;color:#a51d34;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-list.card{background: #ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-list.card .item{background:#ffffff !important;border-color: #ffdedb;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-post-title{color:#a51d34 !important;font-size:18px !important;font-family: roboto !important;font-weight: 400 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-post-subtitle{color:#808080 !important;font-size:14px !important;font-family: openSansLight !important;font-weight: 400 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-post-content{color:#808080 !important;font-size:14px !important;font-family: openSansLight !important;font-weight: 400 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-post-old-price{color:#808080 !important;font-size:14px !important;font-family: roboto !important;font-weight: 400 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-post-price{color:#a51d34 !important;font-size:18px !important;font-family: roboto !important;font-weight: 400 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-tab{background:rgba(255,255,255,0) !important;border-color: #a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-tab .tab-item{color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-list{background:transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-list .item{background:rgba(255,255,255,0) !important;border-color: rgba(0,0,0,0.1) !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-text{color:#212121!important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-comment-author{color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu{font-family: openSansLight !important;color:#ffffff!important;background-color:#a51d34 !important;    background-image:none !important;    background-size: 100% 100%;    background-repeat: no-repeat;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu ion-content, .cp-side-menu ion-header-bar{font-family: openSansLight !important;    color:lightgray !important;    background:rgba(0,0,0,0); !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu-button{font-family: openSansLight !important;color:#ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu-item{font-family: openSansLight !important;color:#ffffff !important;background:transparent !important;border-color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu-item a{font-family: openSansLight !important;color:#ffffff !important;background:transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-side-menu-item-devider{border-color:#ffffff!important;opacity: 0.2;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-button{font-family: openSansLight !important;background-color:#a51d34 !important;border-color:#a51d34 !important;color:#ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-button-outline{font-family: openSansLight !important;background-color:transparent!important;border-color:#a51d34 !important;color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-button-clear{font-family: openSansLight !important;background-color:transparent!important;border-color:transparent!important;color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-button-icon{font-family: openSansLight !important;background-color:transparent!important;border-color:transparent!important;color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input-inset{}.cp-item-input-inset .item-input-wrapper{font-family: openSansLight !important;background: #a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input-inset .item-input-wrapper input{font-family: openSansLight !important;color: #ffffff !important;width: 100% !important-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input{font-family: openSansLight !important;background: transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input .input-label{font-family: openSansLight !important;color:#000000 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input input{font-family: openSansLight !important;color:#000000 !important;background:transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input textarea{font-family: openSansLight !important;color:#000000 !important;background: transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input .item-input-wrapper{font-family: openSansLight !important;background: transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input .item-input-wrapper input{font-family: openSansLight !important;color: #000000 !important;background: transparent !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input .item-input-wrapper .placeholder-icon{font-family: openSansLight !important;color: #000000 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-item-input-inset .item-input-wrapper input::-webkit-input-placeholder {font-family: openSansLight !important;color:    #ffffff;opacity:  0.75;}.cp-item-input-inset .item-input-wrapper input:-moz-placeholder {font-family: openSansLight !important;color:    #ffffff;opacity:  0.75;}.cp-item-input-inset .item-input-wrapper input::-moz-placeholder {font-family: openSansLight !important;color:    #ffffff;opacity:  0.75;}.cp-item-input-inset .item-input-wrapper input:-ms-input-placeholder {font-family: openSansLight !important;color:    #ffffff;opacity:  0.75;}.cp-item-input-inset .item-input-wrapper input:placeholder-shown {font-family: openSansLight !important;color:    #ffffffopacity:  0.75;}.cp-item-input-inset .item-input-wrapper input:placeholder {font-family: openSansLight !important;color:    #ffffff;opacity:  0.75;}input::-webkit-input-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}input:-moz-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}input::-moz-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}input:-ms-input-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}input:placeholder-shown {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}input:placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea::-webkit-input-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea:-moz-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea::-moz-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea:-ms-input-placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea:placeholder-shown {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}textarea:placeholder {font-family: openSansLight !important;color:    #000000;opacity:  0.75;}.cp-toggle .handle{background-color: #ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-toggle .track{background-color: #ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-toggle input:checked + .track{border-color: #a51d34 !important;background-color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-col-text{font-family: openSansLight !important;color:#000000 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-background{background:#ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-full-slider-background, .cp-full-slider-background ion-slide{background:#ffffff !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-title{font-family: roboto !important;color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-buttons{font-family: openSansLight !important;color:#a51d34 !important;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-desc-container{background:#a51d34 !important;   -webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-desc-title{font-family: roboto !important;color:#ffffff !important;   -webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-gallery-desc-subtitle{font-family: openSansLight !important;color:#ffffff!important;opacity:0.75;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-hr{border:0px;border-top:1px solid #ffdedb;-webkit-transition-timing-function: ease-in-out;transition-timing-function: ease-in-out;-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: background-color, border, color;transition-property: background-color, border, color;}.cp-home-grid-menu{    border-color: #a51d34 !important;}.cp-home-grid-menu div{    background: #a51d34 !important;}.cp-home-grid-menu div a{    color:#ededed !important;}.cp-menu-image-overlay{    background:rgba(0, 0, 0, 0.5) !important;    border-color:#ffffff!important;}.cp-menu-image-text{    color:#ffffff !important;    font-family: openSansBold !important;}";
    $scope.titleFailedLoadApps = "Load App Failed";
    $scope.txtFailedLoadApps = "Failed to load your apps. Please check your internet connection and try again.";
    
    
    $ionicPlatform.ready(function () {
        $scope.result = '';

        $scope.st_username_login = st_username_login;
        $scope.st_email = st_email;

        if (st_user_id === '') {
            $scope.isStudioLogin = false;
        } else {
            $scope.isStudioLogin = true;
        }

        var obj = serializeData({email: st_email});
        console.log(obj);
        
        console.log("***USERNAME LOGIN: ***" + $scope.st_username_login);
        
        var url = studio_app_published_url;
        httpService.post($scope, $http, url, obj);
        
    });
    
    $scope.$on('httpService:postRequestSuccess', function () {
        console.log("STUDIO: POST APP LIST SUCCESS");

        var message = $scope.data.message.message;
        var apps = $scope.data.message.apps;

        $scope.message = message;

        var appList = [];
        for (var a = 0; a < apps.length; a++){
            var app = apps[a];
            var appLogo = app.logo + '';
            var txtHTMLName = 'No Icon';//app.name.replace(' ','+');
            appLogo = appLogo == 'undefined' || appLogo === '' ? 'http://placehold.it/192x192?text='+txtHTMLName : appLogo;

            var item = {
                id: app.id,
                name: app.name,
                icon: appLogo,
                playstore_link: app.playstore_link
            };
            appList.push(item);
        }

        $scope.st_username_login = st_username_login;
        $scope.appList = appList;
        console.log("**** APP LIST: ****");
        console.log($scope.appList);
        $scope.isLoading = false;
        $scope.isTimeout = false;
        $scope.isExist = apps.length > 0;
        $scope.st_username_login = st_username_login;
        
        for (var a = 0; a < $scope.appList.length; a++){
            $scope.appList[a].icLoadOK = false;
        }
        
        var themes = angular.element(document).find('style');
        themes.html($scope.studioThemes);
    });
    
    $scope.$on('httpService:postRequestError', function () {
        console.log("STUDIO: POST APP LIST ERROR");
        console.log($scope.data);     
        $scope.showFailedLoadAlert();
    });
    
    $scope.retry = function(){
        var obj = serializeData({email: st_email});
        var url = studio_app_published_url;
        httpService.post($scope, $http, url, obj);
    };
    
    $scope.showFailedLoadAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.titleFailedLoadApps,
            css: 'cp-button',
            okType:'cp-button', 
            okText:'Retry',
            template: '<div style="width:100%;text-align:center">'+$scope.txtFailedLoadApps+'</div>'
        });
        alertPopup.then(function(res) {
            $scope.isTimeout = false; $scope.isExist = false;
            $scope.isLoading = true;
            
            var obj = serializeData({email: st_email});
            var url = studio_app_published_url;
            httpService.post($scope, $http, url, obj);
        });
    };

    $scope.viewApp = function(id){
        console.log("ID: " + id);
        $scope.st_app_id = st_app_id = id;
        $st_preview_app = true;
        window.location.href = '#/studio/studio-app-initialize';
//        $state.go('studio.app-initialize');
    };
    
    $scope.loadImageComplete = function(idx){
        // flag to disable image loading...
        $scope.appList[idx].icLoadOK = true;
    };
    
    document.onclick = function (e) {
        e = e || window.event;
        var element = e.target || e.srcElement;

        if (element.tagName == 'A' && element.classList.contains('external-link')) {
            //window.open(element.href, "_blank", "location=yes");
            showExitConfirmation($ionicPopup, element.href);
            return false; // prevent default action and stop event propagation
        }

        if (element.tagName == 'IMG' && element.classList.contains('image-zoomable')) {
            console.log('Zoom Image');
            //console.log(element.src);
            $scope.zoomable_image = element.src;
            $scope.openZoombleImage("templates/zoomable-image-modal-1.html");
            return;
        }
    };
});