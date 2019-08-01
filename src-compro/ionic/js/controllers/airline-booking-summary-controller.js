app.controller("AirlineBookingSummaryCtrl", function ($scope,
                                     $rootScope,
                                     $http,
                                     httpService,
                                     $stateParams,
                                     $ionicModal,
                                     $ionicHistory,
                                     $ionicPlatform,
                                     $cordovaClipboard,
                                     $cordovaToast,
                                     $ionicGesture,
                                     $ionicPopup,
                                     $ionicLoading,
                                     $filter,
                                     //adMobService,
                                     $timeout) {

    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.airline = {};
    $scope.airline.booking_id1 = "-999";
    $scope.airline.booking_id2 = "-999";
    $scope.airline.search_origin = $rootScope.airline_search_origin;
    $scope.airline.search_destination = $rootScope.airline_search_destination;
    $scope.airline_search_result = $rootScope.airline_search_result;
    $scope.airline_search_return_result = $rootScope.airline_search_return_result;
    $scope.airline_search_request = $rootScope.airline_search_request;
    $scope.airline_search_return_request = $rootScope.airline_search_return_request;
    $scope.currency = currency + ' ';
    $scope.airline.contact = {
        Email: "s4lcombi@gmail.com",
    	Title: "MR.",
    	FirstName: "First Name",
    	LastName: "Last Name",
    	HomePhone: "082112565427",
    	MobilePhone: "082112565427"
    };
    $scope.airline.passengers = new Array();
    $scope.airline.segments = new Array();
    $scope.isLogin = false;
    $scope.airline.reservation_id = "-999";
    $scope.airline.reservation_data = [];
    $scope.airline.total_price = 0;
    $scope.airline.grand_total_price = 0;
    $scope.airline.adult = $rootScope.airline_search_request.adult;
    $scope.airline.child = $rootScope.airline_search_request.child;
    $scope.airline.infant = $rootScope.airline_search_request.infant;
    
    console.log($stateParams);
    console.log($rootScope.airline_search_request);

    if($stateParams.airline_booking_id1 !== undefined) {
        $scope.airline.booking_id1 = $stateParams.airline_booking_id1;
    }
    if($stateParams.airline_booking_id2 !== undefined) {
        $scope.airline.booking_id2 = $stateParams.airline_booking_id2;
    }

    console.log("search result");
    example_search_result = '{"Id":"9fb5242a-9982-4778-a54f-706136ce8f70","Airline":2,"AirlineImageUrl":"http://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png","AirlineName":"Lion","Number":"JT 34","Origin":"CGK","Destination":"DPS","Fare":895000,"IsMultiClass":false,"IsConnecting":false,"IsAvailable":true,"FlightType":"NonGds","DepartDate":"2018-07-28","DepartTime":"04:30","ArriveDate":"2018-07-28","ArriveTime":"07:20","TotalTransit":0,"ClassObjects":[{"Id":"53505407-f476-4f5e-b31b-29c077a7cd00","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"L","Category":"Economy","Seat":5,"Fare":750000,"Tax":145000,"FareBasisCode":null},{"Id":"7cfa32f4-dcca-4aff-8a46-7e69e0628e2a","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"K","Category":"Economy","Seat":7,"Fare":820000,"Tax":152000,"FareBasisCode":null},{"Id":"7e0a6680-55e8-4206-a056-95b4a95078b5","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"H","Category":"Economy","Seat":7,"Fare":890000,"Tax":159000,"FareBasisCode":null},{"Id":"8aa0fa0f-36ba-4585-a093-2f9fe130dfa5","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"B","Category":"Economy","Seat":7,"Fare":960000,"Tax":166000,"FareBasisCode":null},{"Id":"da90c527-a0be-407b-9d50-918f448e2175","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"S","Category":"Economy","Seat":7,"Fare":1040000,"Tax":174000,"FareBasisCode":null},{"Id":"27b44b2b-1a1f-46cc-a3e5-dcb680618bf2","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"W","Category":"Economy","Seat":7,"Fare":1130000,"Tax":183000,"FareBasisCode":null},{"Id":"f5d10ea1-ecc8-4050-bbec-f79dd3478372","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"G","Category":"Economy","Seat":7,"Fare":1210000,"Tax":191000,"FareBasisCode":null},{"Id":"81f15547-6977-4e2b-9597-ae43ccf43968","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"A","Category":"Economy","Seat":7,"Fare":1310000,"Tax":201000,"FareBasisCode":null},{"Id":"622cc70c-b35f-474f-8996-2dcfe2842b1f","FlightId":"9fb5242a-9982-4778-a54f-706136ce8f70","Code":"Y","Category":"Economy","Seat":7,"Fare":1403000,"Tax":210300,"FareBasisCode":null}],"ConnectingFlights":[],"FareBreakdowns":null,"GroupingId":null}';
    example_reservation_id = "6bc28bea-d061-4e7e-b292-23b41dc81eba";
    example_pnr_meta = '{"Id":"6bc28bea-d061-4e7e-b292-23b41dc81eba","Airline":2,"BookingCode":"OIGNIZ","TimeLimit":"2018-07-01 23:49","Created":"2018-06-25 16:52","Reserved":"2018-06-25 16:53","Ticketed":null,"Status":"Reserved","BosInvoiceNo":"-","Contact":{"Title":"MR","FirstName":"WIRENDY","LastName":"WIRENDY","Email":"s4lcombi@gmail.com","MobilePhone":"082112565427","HomePhone":"082112565427"},"Passengers":[{"Index":1,"Type":"Adult","Title":"MR","FirstName":"WIRENDY","LastName":"SETIAWAN","BirthDate":"1993-07-24 00:00","Gender":"Unknown","HomePhone":"082112565427","MobilePhone":"082112565427","OtherPhone":null,"Nationality":null,"IdNumber":null,"Passport":{"Number":null,"OriginCountry":null,"FirstName":null,"LastName":null,"Expire":null},"TicketNumber":null}],"Payments":[{"Code":"PUBLISH_FARE","Title":"Published Fare","Amount":750000.00,"Currency":"IDR","ForeignAmount":750000.00,"ForeignCurrency":"IDR"},{"Code":"TAX","Title":"Tax","Amount":145000.00,"Currency":"IDR","ForeignAmount":145000.00,"ForeignCurrency":"IDR"},{"Code":"TOTAL","Title":"Total Fare","Amount":895000.00,"Currency":"IDR","ForeignAmount":895000.00,"ForeignCurrency":"IDR"},{"Code":"NTS","Title":"NTS","Amount":873000.00,"Currency":"IDR","ForeignAmount":873000.00,"ForeignCurrency":"IDR"},{"Code":"SF","Title":"Service Fee","Amount":0.0,"Currency":"IDR","ForeignAmount":0.0,"ForeignCurrency":"IDR"}],"FlightDetails":[{"Airline":2,"FlightNumber":"JT 34","CarrierCode":"JT","Origin":"CGK","Destination":"DPS","DepartDate":"2018-07-28","DepartTime":"04:30","ArriveDate":"2018-07-28","ArriveTime":"07:20","Num":0,"Seq":0,"Class":"L"}],"DiscountInfo":null,"PaymentTransactionInfo":null,"SqlDiscountInfo":null,"SqlPaymentInfo":null,"Histories":null,"Remarks":null}';

    $ionicPlatform.ready(function () {
        console.log('Airline Booking Summary Controller');
        calculateFlightTotalPrice();
        if(user_id != '') {   
	        $scope.isLogin = true;
	        $scope.airline.contact = {
	            name: username_login,
	            email: email,
	            phone: phone,
	            address: address,
	            comments:'',
	            meta: user_meta
	        };
	    }
	    else {
	        $scope.isLogin = false;
	        $scope.airline.contact = {
	        	"Email": "s4lcombi@gmail.com",
	        	"Title": "MR",
	        	"FirstName": "Wirendy",
	        	"LastName": "Wirendy",
	        	"HomePhone": "082112565427",
	        	"MobilePhone": "082112565427"
	        };
	    }

        $scope.content_data = {
            flights: $rootScope.airline_search_result,
            return_flights: $rootScope.airline_search_return_result
        };
        console.log($scope.content_data);

        var passenger_count = 0;
        for(var i=0; i<(parseFloat($rootScope.airline_search_request.adult)); i++) {
            passenger_count+=1;
        	var passenger = {
        		"Index": passenger_count,
                "Type": 1,
                "Title": "",
                "FirstName": "",
                "LastName": "",
                "BirthDate": "",
                "Email": "",
                "HomePhone": "",
                "MobilePhone": "",
                "OtherPhone": null,
                "IdNumber": null,
                "Nationality": null,
                "AdultAssoc": null,
                "PassportExpire": null,
                "PassportNumber": null,
                "PassportOrigin": null
        	}
            console.log('push 1 adult');
        	$scope.airline.passengers.push(passenger);
        }

        for(var i=0; i<parseFloat($rootScope.airline_search_request.child); i++) {
            passenger_count+=1
            var passenger = {
                "Index": passenger_count,
                "Type": 2,
                "Title": "",
                "FirstName": "",
                "LastName": "",
                "BirthDate": "",
                "Email": null,
                "HomePhone": null,
                "MobilePhone": $scope.airline.contact.MobilePhone,
                "OtherPhone": null,
                "IdNumber": null,
                "Nationality": null,
                "AdultAssoc": null,
                "PassportExpire": null,
                "PassportNumber": null,
                "PassportOrigin": null
            }
            console.log('push 1 child');
            $scope.airline.passengers.push(passenger);   
        }

        for(i=0; i<parseFloat($rootScope.airline_search_request.infant); i++) {
            passenger_count+=1
            var passenger = {
                "Index": passenger_count,
                "Type": 3,
                "Title": "",
                "FirstName": "",
                "LastName": "",
                "BirthDate": "",
                "Email": null,
                "HomePhone": null,
                "MobilePhone": $scope.airline.contact.MobilePhone,
                "OtherPhone": null,
                "IdNumber": null,
                "Nationality": null,
                "AdultAssoc": null,
                "PassportExpire": null,
                "PassportNumber": null,
                "PassportOrigin": null
            }
            console.log('push 1 infant');
            $scope.airline.passengers.push(passenger);   
        }

        //EXAMPLE PLEASE DELETE LATER
        // var passenger = {
        //         "Index": i+1,
        //         "Type": "Adult",
        //         "Title": "MR",
        //         "FirstName": "Wirendy",
        //         "LastName": "Setiawan",
        //         "BirthDate": "1993-07-24",
        //         "Email": "s4lcombi@gmail.com",
        //         "HomePhone": "082112565427",
        //         "MobilePhone": "082112565427",
        //         "OtherPhone": null,
        //         "IdNumber": null,
        //         "Nationality": null,
        //         "AdultAssoc": null,
        //         "PassportExpire": null,
        //         "PassportNumber": null,
        //         "PassportOrigin": null
        //     }
        // $scope.airline.passengers.push(passenger);
        //EXAMPLE

        console.log($scope.airline.passengers);
        reserveFlight();
    });

    $scope.$on('httpService:postRequestSuccess', function () {
        console.log($scope.data);

    });

    function reserveFlight() {
        console.log('reserveFlight - Fill Information Only');
        $scope.airline.segments = [];
        var airline1 = $rootScope.airline_search_result[$scope.airline.booking_id1];
        var airline2 = $scope.airline.booking_id2 !== "-999" ? $rootScope.airline_search_return_result[$scope.airline.booking_id2] : null;
        if(airline1 && airline1.IsConnecting) {
            if(airline1.IsMultiClass) {
                for (var i = 0; i<airline1.ConnectingFlights.length; i++) {
                    var connectingFlights = airline1.ConnectingFlights[i];
                    var _segments = {
                        "ClassId": connectingFlights.ClassObjects[0].Id,
                        "Airline": connectingFlights.Airline,
                        "FlightNumber": connectingFlights.Number,
                        "Origin": connectingFlights.Origin,
                        "DepartDate": connectingFlights.DepartDate,
                        "DepartTime": connectingFlights.DepartTime,
                        "Destination": connectingFlights.Destination,
                        "ArriveDate": connectingFlights.ArriveDate,
                        "ArriveTime": connectingFlights.ArriveTime,
                        "ClassCode": connectingFlights.ClassObjects[0].Code,
                        "FlightId": connectingFlights.ClassObjects[0].FlightId,
                        "Num": 0,
                        "Seq": i
                    }
                    $scope.airline.segments.push(_segments);
                }
            }
            if(!airline1.IsMultiClass) {
                for (var i = 0; i<airline1.ConnectingFlights.length; i++) {
                    var connectingFlights = airline1.ConnectingFlights[i];
                    var _segments = {
                        "ClassId": connectingFlights.ClassObjects[0].Id,
                        "Airline": connectingFlights.Airline,
                        "FlightNumber": connectingFlights.Number,
                        "Origin": connectingFlights.Origin,
                        "DepartDate": connectingFlights.DepartDate,
                        "DepartTime": connectingFlights.DepartTime,
                        "Destination": connectingFlights.Destination,
                        "ArriveDate": connectingFlights.ArriveDate,
                        "ArriveTime": connectingFlights.ArriveTime,
                        "ClassCode": connectingFlights.ClassObjects[0].Code,
                        "FlightId": connectingFlights.ClassObjects[0].FlightId,
                        "Num": 0,
                        "Seq": i
                    }
                    $scope.airline.segments.push(_segments);
                }
            }
        }
        else if(airline1 && !airline1.IsConnecting) {
            var _segments = {
                "ClassId": airline1.ClassObjects[0].Id,
                "Airline": airline1.Airline,
                "FlightNumber": airline1.Number,
                "Origin": airline1.Origin,
                "DepartDate": airline1.DepartDate,
                "DepartTime": airline1.DepartTime,
                "Destination": airline1.Destination,
                "ArriveDate": airline1.ArriveDate,
                "ArriveTime": airline1.ArriveTime,
                "ClassCode": airline1.ClassObjects[0].Code,
                "FlightId": airline1.ClassObjects[0].FlightId,
                "Num": 0,
                "Seq": 0
            }
            $scope.airline.segments.push(_segments);
        }

        if(airline2 && airline2.IsConnecting) {
            if(airline2.IsMultiClass) {
                for (var i = 0; i<airline2.ConnectingFlights.length; i++) {
                    var connectingFlights = airline2.ConnectingFlights[i];
                    var _segments = {
                        "ClassId": connectingFlights.ClassObjects[0].Id,
                        "Airline": connectingFlights.Airline,
                        "FlightNumber": connectingFlights.Number,
                        "Origin": connectingFlights.Origin,
                        "DepartDate": connectingFlights.DepartDate,
                        "DepartTime": connectingFlights.DepartTime,
                        "Destination": connectingFlights.Destination,
                        "ArriveDate": connectingFlights.ArriveDate,
                        "ArriveTime": connectingFlights.ArriveTime,
                        "ClassCode": connectingFlights.ClassObjects[0].Code,
                        "FlightId": connectingFlights.ClassObjects[0].FlightId,
                        "Num": 1,
                        "Seq": i
                    }
                    $scope.airline.segments.push(_segments);
                }
            }
            if(!airline2.IsMultiClass) {
                for (var i = 0; i<airline2.ConnectingFlights.length; i++) {
                    var connectingFlights = airline2.ConnectingFlights[i];
                    var _segments = {
                        "ClassId": connectingFlights.ClassObjects[0].Id,
                        "Airline": connectingFlights.Airline,
                        "FlightNumber": connectingFlights.Number,
                        "Origin": connectingFlights.Origin,
                        "DepartDate": connectingFlights.DepartDate,
                        "DepartTime": connectingFlights.DepartTime,
                        "Destination": connectingFlights.Destination,
                        "ArriveDate": connectingFlights.ArriveDate,
                        "ArriveTime": connectingFlights.ArriveTime,
                        "ClassCode": connectingFlights.ClassObjects[0].Code,
                        "FlightId": connectingFlights.ClassObjects[0].FlightId,
                        "Num": 1,
                        "Seq": i
                    }
                    $scope.airline.segments.push(_segments);
                }
            }
        }
        else if(airline2 && !airline2.IsConnecting) {
            var _segments = {
                "ClassId": airline2.ClassObjects[0].Id,
                "Airline": airline2.Airline,
                "FlightNumber": airline2.Number,
                "Origin": airline2.Origin,
                "DepartDate": airline2.DepartDate,
                "DepartTime": airline2.DepartTime,
                "Destination": airline2.Destination,
                "ArriveDate": airline2.ArriveDate,
                "ArriveTime": airline2.ArriveTime,
                "ClassCode": airline2.ClassObjects[0].Code,
                "FlightId": airline2.ClassObjects[0].FlightId,
                "Num": 1,
                "Seq": 0
            }
            $scope.airline.segments.push(_segments);
        }

        console.log($scope.airline.segments);

        // $scope.airline.contact = {
        //     "Email" : "support@opsigo.com",
        //     "Title" : "MR",
        //     "FirstName" : "Anggara",
        //     "LastName" : "Suwartana",
        //     "HomePhone" : "0213917007",
        //     "MobilePhone" : "0213917007"
        // };

        // $scope.airline.passengers = [ {
        //     "Index" : 1,
        //     "Type" : 1,
        //     "Title" : "MR",
        //     "FirstName" : "Anggara",
        //     "LastName" : "Suwartana",
        //     "BirthDate" : "1979-09-30",
        //     "Email" : "support@opsigo.com",
        //     "HomePhone" : "0213917007",
        //     "MobilePhone" : "0213917007",
        //     "OtherPhone" : null,
        //     "IdNumber" : null,
        //     "Nationality" : null,
        //     "AdultAssoc" : null,
        //     "PassportExpire" : null,
        //     "PassportNumber" : null,
        //     "PassporOrigin" : null 
        // }];

        // $scope.airline.segments = [
        //     {
        //         "ClassId" : "2~0~~00~PRFR~~1~X",
        //         "Airline" : 4,
        //         "FlightNumber" : "QG 815",
        //         "Origin" : "CGK",
        //         "DepartDate" : "2016-11-11",
        //         "DepartTime" : "04:10",
        //         "Destination" : "SUB",
        //         "ArriveDate" : "2016-11-11",
        //         "ArriveTime" : "05:40",
        //         "ClassCode" : "O",
        //         "FlightId" : "QG~ 815~ ~~CGK~11/11/2016 04:10~SUB~11/11/2016 05:40~^QG~ 642~ ~~SUB~11/11/2016 08:00~DPS~11/11/2016 09:50~",
        //         "Num" : 0,
        //         "Seq" : 0
        //     },{
        //         "ClassId" : "1~D~~DD~PRFR~~1~",
        //         "Airline" : 4,
        //         "FlightNumber" : "QG 642",
        //         "Origin" : "SUB",
        //         "DepartDate" : "2016-11-11",
        //         "DepartTime" : "08:00",
        //         "Destination" : "DPS",
        //         "ArriveDate" : "2016-11-11",
        //         "ArriveTime" : "09:50",
        //         "ClassCode" : "O",
        //         "FlightId" : "QG~ 815~ ~~CGK~11/11/2016 04:10~SUB~11/11/2016 05:40~^QG~ 642~ ~~SUB~11/11/2016 08:00~DPS~11/11/2016 09:50~",
        //         "Num" : 0,
        //         "Seq" : 1
        //     }
        // ];

        var obj = serializeData({
           contact: JSON.stringify($scope.airline.contact),
           passengers: JSON.stringify($scope.airline.passengers),
           segments: JSON.stringify($scope.airline.segments)
        });

        console.log(obj);
    }

    function saveFlightToDB() {
        console.log("saveFlightToDB");
        var flight_meta = {};
        var fake_user_id = 274;
        var example_booking_code = "OIGNIZ";
        var pnr_id = $scope.reservation_id;
        var pnr_meta = $scope.airline.reservation_data;
        // var pnr_meta = example_pnr_meta;
        var pnr_status = $scope.airline.reservation_data.Status;
        var example_pnr_status = 'Reserved';
        var booking_code = $scope.airline.reservation_data.BookingCode;

        if($scope.airline.booking_id2 != "-999") {
            flight_meta = {
                "search_result": $scope.airline_search_result[$scope.airline.booking_id1],
                // "search_result": example_search_result,
                "search_return_result": $scope.airline_search_return_result[$scope.airline.booking_id2],
                "index_search_result" : $scope.airline.booking_id1,
                "index_search_return_result" : $scope.airline.booking_id2
            };
        }
        else {
            flight_meta = {
                "search_result": $scope.airline_search_result[$scope.airline.booking_id1],
                // "search_result": example_search_result
                "index_search_result" : $scope.airline.booking_id1
            }
        }
        console.log(flight_meta);
        var url = opsigo_save_flight + company_id;
        var obj = serializeData({
            //user_id: fake_user_id,
            user_id: user_id,
            pnr_id: pnr_id,
            // booking_code: example_booking_code,
            booking_code: booking_code,
            flight_meta: JSON.stringify(flight_meta),
            pnr_meta: JSON.stringify(pnr_meta),
            // pnr_status: example_pnr_status,
            pnr_status: pnr_status,
            payment_type: '-'
        });
        console.log(obj);
        httpService.post($scope, $http, url, obj, 'opsigo-save-flight');
    }

    $scope.$on('httpService:postOpsigoSaveFlightSuccess', function () {
        $scope.save_flight_data = $scope.data;
        console.log($scope.save_flight_data);
        console.log('will be redirected');
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearHistory();
        window.location.href= "#/app/airline-transaction-detail/" + $scope.save_flight_data.return_trans_id ;
    });
    
    $scope.$on('httpService:postOpsigoReserveFlightV3Success', function () {
        $scope.reservation_id = $scope.data.PnrId;
        // $scope.reservation_id = example_reservation_id;
        getReservationById($scope.reservation_id);
    });

    $scope.showFlightConfirmationAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Are your booking details correct?',
            template: '<div style="width:100%;text-align:center">'+ 'You will not be able to change your booking details once you proceed to payment. Do you want to proceed?' +'</div>',
            buttons:[
                {
                    text: 'Check Again'
                },
                {
                    text: 'Yes, Continue',
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        var passengers = $scope.airline.passengers;

                        for(var i=0; i<passengers.length; i++) {
                            if(passengers.Type == 2 || passengers.Type == 3) {
                                passengers[i].BirthDate = formatDate(passengers[i].BirthDate);
                            }
                        }
                        console.log('passengers');
                        console.log(passengers);

                        
                        var contact = {
                            Email:$scope.airline.contact.Email,
                            FirstName: $scope.airline.contact.FirstName,
                            HomePhone: $scope.airline.contact.MobilePhone,
                            LastName: $scope.airline.contact.LastName,
                            MobilePhone: $scope.airline.contact.MobilePhone,
                            Title: $scope.airline.contact.Title
                        };
                        console.log('contact');
                        console.log(contact);
                        var url = opsigo_reserve_flight_v3;
                        var obj = serializeData({
                           contact: JSON.stringify(contact),
                           passengers: JSON.stringify(passengers),
                           segments: JSON.stringify($scope.airline.segments)
                        });
                        httpService.post($scope, $http, url, obj, 'opsigo-reserve-flight-v3');
                        showLoadingDialog('We are contacting the airlines. Please wait...');
                        // $rootScope.login_redirect_location = '#/app/shopping-cart-1/-3';
                        // window.location.href= "#/app/login/-1" ;
                    }
                }
            ]
        });
    };

    $scope.showFlightPriceAlert = function (new_ticket_price) {
        var alertPopup = $ionicPopup.alert({
            title: 'Your total price has changed to',
            template: '<div class="cp-post-title text-center" style="width:100%">'+ $filter('currency')(new_ticket_price, currency) +'</div><br><div class="text-center">Do you want to continue?</div>',
            buttons:[
                {
                    text: 'No, I Select Another Flight'
                },
                {
                    text: 'Yes, Continue',
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        var url = opsigo_reserve_flight_v3;
                        var obj = serializeData({
                            _method: 'POST',
                            reservation_data: JSON.stringify($scope.airline.reservation_data)
                        });
                        //save reservation data into meta and create new pending transaction with time-limit
                        console.log(JSON.stringify($scope.airline.reservation_data));
                    }
                }
            ]
        });
    };

    $scope.showExpiredAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Expired',
            template: '<div class="text-center" style="width:100%">This booking summary is expired. Please book another flight.</div>',
            buttons:[
                {
                    text: 'Book Another Flight',
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        //redirect to home
                        console.log('expired');
                    }
                }
            ]
        });
    };

    $scope.showUnavailableAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Flight is not available',
            template: '<div class="text-center" style="width:100%">The selected flight is not available anymore. Please book another flight.</div>',
            buttons:[
                {
                    text: 'Book Another Flight',
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        //redirect to home
                        console.log('unavailable');
                    }
                }
            ]
        });
    };

    $scope.showErrorAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Something wrong with the airline',
            template: '<div class="text-center" style="width:100%">There is something wrong with the airlines. Please rebooking the flight or try again.</div>',
            buttons:[
                {
                    text: 'Booking Another Flight',
                    onTap: function(e)
                    {
                        //redirect to home
                    }
                },
                {
                    text: 'Try Again',
                    type: 'cp-button',
                    onTap: function(e)
                    {
                        getReservationById($scope.reservation_id);
                    }
                }
            ]
        });
    };

    function calculateFlightTotalPrice() {
        var airline1_price = 0;
        var airline2_price = 0;
        var airline1 = $rootScope.airline_search_result[$scope.airline.booking_id1];
        var airline2 = $scope.airline.booking_id2 !== "-999" ? $rootScope.airline_search_return_result[$scope.airline.booking_id2] : null;
        if(airline1 && airline1.IsConnecting) {
            if(airline1.IsMultiClass) {
                airline1_price = airline1.Fare;
            }
            if(!airline1.IsMultiClass) {
                airline1_price = airline1.ClassObjects[0].Fare;   
            }
        }
        else if(airline1 && !airline1.IsConnecting) {
            airline1_price = airline1.ClassObjects[0].Fare;
        }

        if(airline2 && airline2.IsConnecting) {
            if(airline2.IsMultiClass) {
                airline2_price = airline2.Fare;
            }
            if(!airline2.IsMultiClass) {
                airline2_price = airline2.ClassObjects[0].Fare;
            }
        }
        else if(airline2 && !airline2.IsConnecting) {
            airline2_price = airline2.ClassObjects[0].Fare;
        }
        $scope.airline.total_price = airline1_price + airline2_price;
        $scope.airline.grand_total_price = (parseFloat($rootScope.airline_search_request.adult)+parseFloat($rootScope.airline_search_request.child)) * $scope.airline.total_price;
    }

    function getReservationById(reservation_id) {
        console.log('getReservationById');
        var url = opsigo_get_reservation_by_id;
        var obj = serializeData({
           id: reservation_id
        });
        httpService.post($scope, $http, url, obj, 'opsigo-get-reservation-by-id-v3');
    }

    function showLoadingDialog(text) {
        if($ionicLoading) $ionicLoading.hide();
        $ionicLoading.show({
            template: getLoadingTemplate(text)
        });
    }

    $scope.$on('httpService:postOpsigoGetReservationByIdV3Success', function () {
        var status = $scope.data.Status;
        $scope.airline.reservation_data = $scope.data;
        saveFlightToDB();

        // if(!$scope.data) {
        //     $ionicLoading.hide();
        //     $scope.showErrorAlert();
        // }
        // if(status == 'Saved') {
        //     //save to DB, redirect to new page with id

        //     //getReservationById($scope.reservation_id);      
        // }
        // else if(status == 'Reserved') {
        //     var payments = $scope.data.Payments;
        //     var new_ticket_price = 0;
        //     for (var i = 0; i < payments.length; i++) {
        //         console.log(payments[i]);
        //         if(payments[i]['Code']  == 'TOTAL') {
        //             new_ticket_price = payments[i]['Amount'];
        //             break;
        //         }
        //     }
        //     $ionicLoading.hide();
            

        //     // alert berubah dipindah kan ke dalam tr detail
        //     //$scope.showFlightPriceAlert(new_ticket_price);
        // }
        // else if(status == 'FlightUnavailable') {
        //     $ionicLoading.hide();
        //     $scope.showUnavailableAlert();
        // }
        // else if(status == 'Expired') {
        //     $ionicLoading.hide();
        //     $scope.showExpiredAlert();
        // }
        // else if(status == 'BookingError' || status == 'TicketingError') {
        //     $ionicLoading.hide();
        //     $scope.showErrorAlert();
        // }
        // else {
        //     $ionicLoading.hide();
        //     $scope.showErrorAlert();
        // }
    });

    $scope.$on('httpService:postOpsigoGetReservationByIdV3Error', function () {
        showLoadingDialog('We are contacting the airlines. Please wait...');
        getReservationById($scope.reservation_id);
    });
});

