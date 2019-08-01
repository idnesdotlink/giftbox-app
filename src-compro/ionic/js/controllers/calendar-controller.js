app.controller("CalendarCtrl", function ($scope, $http, httpService, $stateParams, $window, $ionicPlatform) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;

    $scope.calendar = {};

    $ionicPlatform.ready(function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });

    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        var url = "";
        url = event_calendar_url + $stateParams.id;
        httpService.get($scope, $http, url, 'content', token);
    });

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

    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.content_data = {
            events: $scope.data.events
        };
        $scope.calendar.eventSource = displayEvents();
        $scope.isLoading = false;

        //save to db
        if(isPhoneGap())
        {
            saveTermJSONToDB($stateParams.id, 'CalendarCtrl', $scope.data);
            //console.log($scope.data.term_posts);
            clearPostDataByTermId($stateParams.id);
            for(var i=0; i< $scope.data.events.length; i++)
            {
                //console.log($scope.data.term_posts[i]);
                savePostJSONToDB($scope.data.events[i].post_id, $scope.data.events[i].title, 'CalendarCtrl', $scope.data.events[i]);

            }
        }
    });

    $scope.$on('httpService:getRequestError', function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
    });

    $scope.changeMode = function (mode) {
        $scope.calendar.mode = mode;
    };

    $scope.loadEvents = function () {
        $scope.calendar.eventSource = displayEvents();
    };

    $scope.onEventSelected = function (event) {
        // console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        window.location.href= "#/app/event-detail-1/" + event.post_id;
    };

    $scope.onViewTitleChanged = function (title) {
        $scope.viewTitle = title;
    };

    $scope.today = function () {
        $scope.calendar.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
            currentCalendarDate = new Date($scope.calendar.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.onTimeSelected = function (selectedTime, events) {
        // console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0));
    };

    function displayEvents() {
        var eventSource = [];
        var events = $scope.content_data.events;
        for(var i=0; i<events.length; i++)
        {
            eventSource.push({
                title: events[i].title,
                startTime: new Date(events[i].startTime),
                endTime: new Date(events[i].endTime),
                allDay: false,
                post_id: events[i].post_id
            })
        }
        return eventSource;
    }

    function createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        console.log(events);
    }

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.content_data = {
            events: $scope.data.events
        };

        $scope.isLoading = false;
    });

    $scope.doRefresh = function() {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function(){
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

});
