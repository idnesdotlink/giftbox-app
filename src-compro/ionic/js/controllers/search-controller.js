app.controller("SearchCtrl", function ($scope,
                                      $rootScope,
                                      $http,
                                      httpService,
                                      $ionicLoading,
                                      $ionicPopup,
                                      $ionicPlatform,
                                      $state) {

    $scope.isLoading = true;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.notSearching = true;
    $scope.post_length = 0;
    $scope.post_keyword = '';
    $scope.special_case = [
        "no-click"
//        ,
//        "gallery-list-1",
//        "gallery-list-2",
//        "gallery-list-3",
//        "gallery-list-4",
//        "gallery-list-5",
//        "gallery-list-6",
//        "gallery-list-7",
//        "gallery-list-8"
    ];
    var temp_term = [];
    var term_count = 0;
    var isLoadingMoreData = false;

    $ionicPlatform.ready(function () {
        $scope.result = '';

        // initialize user login data, set '' for deployment
        $scope.input = {
            keyword: ''
        };

        $scope.button_text_search = $scope.title_search = getMenuText(default_menu_titles.search,"Search");
        $scope.text_placeholder_keyword = getMenuText(ui_texts_general.text_placeholder_keyword, "Keyword...");

        $scope.isLoading = false;

        $scope.show = function () {
            $ionicLoading.show({
                template: ionicLoadingTemplate
            });
        };

        // function for search
        $scope.search = function () {

            if ($scope.input.keyword !== '') {
                $scope.show();
                temp_term = [];
                term_count = 0;

                var url = token_url;
                var obj = serializeData({email: username, password: password, company_id: company_id});
                httpService.post_token($scope, $http, url, obj);
            } else {
                $scope.showRequirementAlert();
            }

        };

        $scope.showRequirementAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Search',
                css: 'cp-button',
                okType:'cp-button',
                template: '<div style="width:100%;text-align:center">Keyword must be filled</div>'
            });
        };

        if(typeof $rootScope.search_text !== 'undefined' && $rootScope.search_text !== "")
        {
            $scope.input.keyword = $rootScope.search_text;
            $scope.search();
        }
    });



    // if get token for list article success, request list article
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //var url = search_url;
        var url = search_url;
        var input = $scope.input;
        //console.log(input);
        var obj = '&q=' + encodeURIComponent(input.keyword) +
                  '&company_id=' + encodeURIComponent(company_id) +
                  (user_id == '' || user_id == undefined || user_id == false ? '' : '&user=' + user_id);

        httpService.get($scope, $http, url, 'content', token, 0, obj);
        console.log('SearchCtrl');
    });

    // if get token error, request token again
    $scope.$on('httpService:postTokenError', function () {

        if($scope.status === 0)
        {
            if(isPhoneGap())
            {
                loadTermJSONFromDB($stateParams.id,$scope);
            }

        }

        else
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    // if post login data success
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.result = $scope.data;
        console.log('RESULT');
        console.log($scope.result);

        var content_data = {
            title: $scope.title,
            terms : [],
            posts: $scope.data.posts
        };
        for(var i = 0; i< $scope.data.posts.length; i++) {
            var term_id = $scope.data.posts[i].term_id;
            if(typeof temp_term[term_id] === 'undefined') {
                temp_term[term_id] = term_count;
                content_data.terms[temp_term[term_id]] = {
                    id: $scope.data.posts[i].term.id,
                    title: $scope.data.posts[i].term.title,
                    content_type_id: $scope.data.posts[i].term.content_type_id,
                    term_template_name: $scope.data.posts[i].term_template_name,
                    posts: []
                };
                term_count++;
            }
            content_data.terms[temp_term[term_id]].posts.push($scope.data.posts[i]);
        }
        $scope.content_data = content_data;

        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };
        $scope.isLoading = false;

        $scope.hide();

        $scope.post_length = $scope.data.post_count;
        $scope.post_keyword = $scope.input.keyword;
        $scope.notSearching = false;

    });

    $scope.loadMoreData = function()
    {
        if($scope.moreData && isLoadingMoreData === false)
        {
            isLoadingMoreData = true;
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }
        else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    };

    $scope.$on('httpService:postTokenGetMoreDataSuccess', function () {
        token = $scope.data.token;
        //var url = search_url;
        var url = search_url;
        var input = $scope.input;
        //console.log($scope.nextPage);
        var obj = '&q=' + encodeURIComponent(input.keyword) +
                  '&company_id=' + encodeURIComponent(company_id) +
                  (user_id == '' || user_id == undefined || user_id == false ? '' : '&user=' + user_id);

        httpService.get($scope, $http, url, 'more-data-content', token, $scope.nextPage, obj);
    });

    $scope.$on('httpService:postTokenGetMoreDataError', function () {

        if ($scope.status !== 0)
        {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'more-data-content');
        }


    });

    $scope.$on('httpService:getMoreDataSuccess', function () {
        //console.log($scope.data.posts);

        var content_data = $scope.content_data;

        for(var i = 0; i< $scope.data.posts.length; i++) {
            var term_id = $scope.data.posts[i].term_id;
            if(typeof temp_term[term_id] === 'undefined') {
                temp_term[term_id] = term_count;
                content_data.terms[temp_term[term_id]] = {
                    id: $scope.data.posts[i].term.id,
                    title: $scope.data.posts[i].term.title,
                    content_type_id: $scope.data.posts[i].term.content_type_id,
                    term_template_name: $scope.data.posts[i].term_template_name,
                    posts: []
                };
                term_count++;
            }
            content_data.terms[temp_term[term_id]].posts.push($scope.data.posts[i]);
        }
        $scope.content_data = content_data;

        //Array.prototype.push.apply($scope.content_data.posts, $scope.data.posts);


        $scope.moreData = $scope.data.has_next;
        if($scope.moreData)
        {
            $scope.nextPage = $scope.data.next_page;
        }


        isLoadingMoreData = false;

        //console.log(($scope.content_data.posts).length);
        $scope.$broadcast('scroll.infiniteScrollComplete');

    });

    $scope.$on('httpService:postRequestError', function () {
        $scope.hide();
        $scope.showFailedAlert();

    });

    $scope.showAlert = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            css: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + message + '</div>',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
        });
    };
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };


    $scope.showFailedAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.title_search,
            css: 'cp-button',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_search_error_connection + '</div>'
        });
    };

    $scope.showRequirementAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.title_search,
            css: 'cp-button',
            okType:'cp-button',
            okText:$scope.alert_button_ok,
            template: '<div style="width:100%;text-align:center">' + $scope.text_keyword + $scope.input_error_text_must_be_filled + '</div>'
        });
    };
});
