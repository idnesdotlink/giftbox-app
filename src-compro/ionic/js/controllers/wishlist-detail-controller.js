app.controller("WishlistDetailCtrl", function ($scope, $http, $rootScope, $ionicModal, $ionicPopup,$ionicSlideBoxDelegate, httpService, $stateParams, $window, $ionicPlatform, $ionicHistory, $ionicLoading) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.moreData = false;
    $scope.nextPage = '';
    $scope.user_id = $rootScope.user_id;
    var isLoadingMoreData = false;
    $scope.currency = currency + ' ';
    $scope.minDays = '-';
    $scope.maxDays = '-';
    $scope.trans_id = "";

    var loadCustomText = function() {   
        $scope.input_error_text_must_be_filled = getMenuText(ui_texts_general.input_error_text_must_be_filled, 'must be filled.');
        $scope.ui_text_quantity_to_buy = getMenuText(ui_texts_products.ui_text_quantity_to_buy, "Quantity to Contribute");
        $scope.alert_loading_failed_title = getMenuText(ui_texts_shopping_cart.alert_loading_failed_title, "Loading Failed");
        $scope.alert_loading_failed_content = getMenuText(ui_texts_shopping_cart.alert_loading_failed_content, "Failed to load data, would you like to try again?");
        $scope.alert_checkout_title = getMenuText(ui_texts_shopping_cart.alert_checkout_title, "Checkout");
        $scope.text_success_alert = getMenuText(ui_texts_shopping_cart.text_success_alert, "Your Order Submitted Successfully");
        $scope.alert_button_pay_now = getMenuText(ui_texts_shopping_cart.alert_button_pay_now, "Pay Now");
        $scope.feedback_invalid_quantity = getMenuText(ui_texts_products.feedback_invalid_quantity, "Please input valid quantity. Mininum quantity: 1");
    };

    loadCustomText();
    // initialize input text comment
    $scope.input = {
        name : "",
        email : "",
        phone : "",
        address : "",
        comments : "",
        qty: 0,
        meta : {
            wishlist : false
        }
    };
    $scope.payment={
        selectedPaymentType : ""
    };

    $scope.images = [];
    $scope.modal_index = 0;
    $scope.galleryData = {};

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);

    $ionicPlatform.ready(function () {
        console.log($rootScope.user_id);
        $scope.scrollPos = 0;
        // check user login
        if ($rootScope.user_id == undefined) {
            $scope.isLogin = false;
        } else {
            $scope.isLogin = true;
        }
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj);
    });

    // get token for getting detail data success
    $scope.$on('httpService:postTokenSuccess', function () {
        token = $scope.data.token;
        //console.log(token);
        //request compressed image or high res images
        var url = "";
        if (loadCompressedImages == false) {
            url = post_content_url + $stateParams.id;
        }
        else {
            url = post_compressed_content_url + $stateParams.id;
        }

        // get data
        httpService.get($scope, $http, url, 'content', token);
        console.log('WishlistDetailCtrl');
    });

    // get data success
    $scope.$on('httpService:getRequestSuccess', function () {
        $scope.offlineMode = false;

        $scope.loadImages = function () {
            // var i = 1;
            $scope.images.push({id: 0, src: $scope.data.post.featured_image_path});
            var images_temp = getProductDetailImageFromPostMeta($scope.data.post.post_meta, "image_list");

            for (var i = 0; i < images_temp.length; i++) {
                $scope.images.push({id: i + 1, src: images_temp[i].value});
            }

            $scope.content_data = {
                id: $stateParams.id,
                title: $scope.data.post.title,
                created_date: $scope.data.post.published_date,
                img_src: $scope.data.post.featured_image_path,
                summary: $scope.data.post.summary,
                content: $scope.data.post.content,
                comment_status: $scope.data.post.comment_status,
                total_likes: $scope.data.post.like_count,
                total_comments: $scope.data.post.comment_count,
                comments: $scope.data.post.comment,
                likes: $scope.data.post.like,
                post_meta: $scope.data.post.post_meta
            };

            term_content_type_id = $scope.data.post.term_content_type_id;
            $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

            for (var i = 0; i < shoppingCharts.length; i++) {
                //console.log(shoppingCharts[i]);
                //console.log(shoppingCharts[i]);

                if (shoppingCharts[i].id === $scope.content_data.id) {
                    $scope.inShoppingCarts = true;
                }
            }

            $scope.isLoading = false;
        };

        $scope.loadImages();

        $ionicSlideBoxDelegate.update();

        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status !== '0') {
            if ($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }

        //request compressed image if set to on
        if (loadCompressedImages) {
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            // call angular http service
            httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
        }

    });
    
    // if get token detail data Error, request token again
    $scope.$on('httpService:postTokenError', function () {
        if ($scope.status === 0) {
            $scope.offlineMode = true;
            if (isPhoneGap()) {
                loadPostJSONFromDB($stateParams.id, $scope);

            }
        }
        else {
            $scope.offlineMode = false;
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});
            httpService.post_token($scope, $http, url, obj, 'content');
        }
    });

    // if get detail data Error, request token again
    $scope.$on('httpService:getRequestError', function () {


        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        $scope.isTimeout = true;
        //        httpService.post_token($scope, $http, url, obj, 'content');

    });

    $scope.$on('httpService:postTokenGetHighResDataSuccess', function (event, args) {
        token = $scope.data.token;

        //console.log(token);
        var url = post_content_url + $stateParams.id;
        httpService.get($scope, $http, url, 'high-res-data-content', token);

        //console.log($scope.data);
    });

    $scope.$on('httpService:postTokenGetHighResDataError', function (event, args) {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');
    });

    $scope.$on('httpService:getHighResDataSuccess', function (event, args) {
        var updated_data = args.data;


        $scope.images[0].src = updated_data.post.featured_image_path;
        var images_temp = getProductDetailImageFromPostMeta(updated_data.post.post_meta, "image_list");

        for (var i = 0; i < images_temp.length; i++) {
            $scope.images[i + 1].src = images_temp[i].value;
        }

        $scope.content_data = {
            id: $stateParams.id,
            title: updated_data.post.title,
            created_date: updated_data.post.published_date,
            img_src: updated_data.post.featured_image_path,
            summary: updated_data.post.summary,
            content: updated_data.post.content,
            comment_status: updated_data.post.comment_status,
            total_likes: updated_data.post.like_count,
            total_comments: updated_data.post.comment_count,
            comments: updated_data.post.comment,
            likes: updated_data.post.like,
            post_meta: updated_data.post.post_meta
        };

        $scope = reloadTermStaticPageLanguage($scope,term_content_type_id);

        //display true resolution image
        console.log('true resolution loaded');

        // save to db first page
        if (isPhoneGap()) {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, updated_data.post.term_id, 'WishlistDetailCtrl', updated_data);
            //console.log('saved');
        }

    });

    // if get data list wishlist error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');

    });

    // loading fragment
    $scope.show = function () {
        $ionicLoading.show({
            template: ionicLoadingTemplate
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/product-image-detail-1.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        //success
    }, {
        //error
    });

    // Triggered in the gallery modal to close it
    $scope.closeGallery = function () {
        $scope.modal.hide();
    };

    // Open the gallery modal
    $scope.gallery = function ($idx) {
        $scope.modal_index = $idx;
        //console.log($scope.modal_index);
        $scope.modal.show();
    };

    $scope.$on('SQLite:getOfflineDataSuccess', function () {
        $scope.loadOfflineImages = function () {


            $scope.images.push({id: 0, src: $scope.data.featured_image_path});

            var images_temp = getProductDetailImageFromPostMeta($scope.data.post_meta, "image_list");

            for (var i = 0; i < images_temp.length; i++) {
                $scope.images.push({id: i + 1, src: images_temp[i].value});

            }

            $scope.content_data = {
                id: $stateParams.id,
                title: $scope.data.post.title,
                created_date: $scope.data.post.published_date,
                img_src: $scope.data.post.featured_image_path,
                summary: $scope.data.post.summary,
                content: $scope.data.post.content,
                comment_status: $scope.data.post.comment_status,
                total_likes: $scope.data.post.like_count,
                total_comments: $scope.data.post.comment_count,
                comments: $scope.data.post.comment,
                likes: $scope.data.post.like,
                post_meta: $scope.data.post.post_meta
            };


            for (var i = 0; i < shoppingCharts.length; i++) {
                //console.log(shoppingCharts[i]);
                //console.log(shoppingCharts[i]);

                if (shoppingCharts[i].id === $scope.content_data.id) {
                    $scope.inShoppingCarts = true;
                }
            }

            $scope.isLoading = false;
            $scope.$apply();
        };

        $scope.loadOfflineImages();
        $ionicSlideBoxDelegate.update();


        $scope.getPostMetaValueById = function (arr, value) {
            return getPostMetaValueById(arr, value);
        };

        $scope.comments = $scope.content_data.comments;
        $scope.isLoading = false;
        if ($scope.content_data.comment_status !== '0') {
            if ($scope.content_data.likes !== undefined && $scope.content_data.likes !== null) {
                if (checkPostLikes($scope.content_data.likes, user_id)) {
                    $scope.liked = true;
                } else {
                    $scope.liked = false;
                }
            }
        }
    });

    // alert connection
    $scope.showConnectionAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.title_shopping_cart,
            css: 'cp-button',
            okType: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + $scope.add_shopping_cart_error + '</div>'
        });
    };

    $window.onscroll = function () {
        $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
        $scope.$apply(); //or simply $scope.$digest();
    };


    $scope.doRefresh = function() {
        // var url = token_url;
        // var obj = serializeData({email: username, password: password, company_id: company_id});
        // httpService.post_token($scope, $http, url, obj);
    }

    $scope.retryLoadContent = function () {
        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});

        $scope.isTimeout = false;

        httpService.post_token($scope, $http, url, obj, 'content');
    };

    $scope.socialShare = function () {
        if (isPhoneGap()) {
            if (isAndroid()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, null, playstore_link, 'Read more at');
            }
            else if (isIOS()) {
                socialShare($cordovaClipboard, $cordovaToast, $timeout, $scope.content_data.summary, $scope.content_data.title, null, appstore_link, 'Read more at');
            }
        } else {
            console.log('Social Share: Not a Mobile Device');
            console.log($scope.content_data.summary);
            console.log($scope.content_data.title);
            console.log(playstore_link);
            console.log(appstore_link);
        }
    };

    $scope.isPhoneGap = function () {
        return isPhoneGap();
    };

    $scope.getPostMeta = function(meta){
        if ($scope.chosenVariantItem){
          return $scope.chosenVariantItem[meta];
        }
        else if (getPostMetaValueById($scope.content_data.post_meta, meta)){
          return getPostMetaValueById($scope.content_data.post_meta, meta).value;
        }
        return false;
  
    };

    $scope.subTotal = function (command) {
        if (command == "add") {
            $scope.input.qty += 1;
        }
        if (command == "substract") {
            $scope.input.qty = $scope.input.qty <= 0 ? 0 : $scope.input.qty - 1;
        }
    };

    $scope.goToWishlistTransactionDetail = function (content_data){
        console.log($rootScope.user_id);
        if ($scope.input.qty <= 0) {
            $scope.showDataMinimumAlert();
        }
        else if($rootScope.user_id != undefined && $rootScope != ''){
            var alertPopup = $ionicPopup.alert({
                title: "Wishlist",
                template: '<div style="width:100%;text-align:center">Are you sure want to contribute ?</div>',
                cssClass: 'popup-vertical-buttons',
                buttons: [
                    {
                        text: "See More",
                        type: 'cp-button button-block'
                    },
                    {
                        text: "Buy Here",
                        type: 'cp-button button-block',
                        onTap: function (e) {
                            $scope.show();
                            console.log("Mau masukin ke shopping cart");
                            $rootScope.idbarang = content_data.id;
                            $rootScope.qtybarang = $scope.input.qty;
                            $scope.payment.selectedPaymentType = "manual";
                            $scope.deliveryCourier = "-";
                            $scope.deliveryMethod = "No Service";
                            $scope.deliveryPrice = 0;
                            var url = token_url;
                            var obj = serializeData({
                                email: username,
                                password: password,
                                company_id: company_id
                            });

                            // get token for posting comment
                            httpService.post_token($scope, $http, url, obj, 'submit_order');
                        }
                    },
                    {
                        text: "I Will Buy It Myself",
                        type: 'cp-button button-block',
                        onTap: function (e) {
                            $scope.show();
                            // console.log(content_data);
                            // var id = content_data.id;
                            // var title = content_data.title;
                            // var img = content_data.img_src;
                            // var qty = $scope.input.qty;
                            // var price = $scope.getPostMeta('price');//getPostMetaValueById(content_data.post_meta, 'price').value;
                            // var total_price = qty * price;
                            // var url = wishlist_transaction_url;
                            // var obj = serializeData({
                            //     user_id: user_id, 
                            //     company_id: company_id,
                            //     post_id : id,
                            //     name : title,
                            //     price : price,
                            //     quantity : qty,
                            //     total_price : total_price
                            // });
                            // console.log(obj);
                            // httpService.post($scope, $http, url, obj, 'wishlist-transaction-add');
                            console.log("Mau masukin ke yourself");
                            $rootScope.idbarang = content_data.id;
                            $rootScope.qtybarang = $scope.input.qty;
                            $scope.payment.selectedPaymentType = "cod";
                            $scope.deliveryCourier = 0;
                            $scope.deliveryMethod = "Cash On Delivery (COD)";
                            $scope.deliveryPrice = 0;
                            var url = token_url;
                            var obj = serializeData({
                                email: username,
                                password: password,
                                company_id: company_id
                            });

                            // get token for posting comment
                            httpService.post_token($scope, $http, url, obj, 'submit_order');
                        }
                    }
                ]
            });
        }
        else{
            var alertPopup = $ionicPopup.alert({
                title: "Warning",
                template: '<div style="width:100%;text-align:center">Please Login Before Buy Wishlist</div>',
                buttons:[
                    {
                        text: $scope.alert_button_ok
                    },
                    {
                        text: $scope.button_text_login,
                        type: 'cp-button',
                        onTap: function(e)
                        {
                            $rootScope.login_redirect_location = '#/app/wishlist-detail-1/' + $stateParams.id;
                            window.location.href= "#/app/login/-1" ;
                        }
                    }
                ]
            });
        }
    };

    $scope.$on('httpService:postAddWishlistTransactionSuccess', function () {
        console.log($scope.data);
        $ionicHistory.removeBackView();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearHistory();
        window.location.href = "#/app/wishlist-transaction-detail/" + $scope.data.wishlist_transaction.id;
    });

    $scope.$on('httpService:postAddWishlistTransactionError', function () {
        console.log("Cannot add to wishlist transaction");
    });

    // if token for post comment success
    $scope.$on('httpService:postTokenSubmitOrderSuccess', function() {
        token = $scope.data.token;
        var ids = new Array();
        var qtys = new Array();
        var variants = new Array();
        var input = $scope.input;
        ids.push($rootScope.idbarang);
        qtys.push($rootScope.qtybarang);
        $scope.input.meta.wishlist = true;
        $scope.input.name = $rootScope.username_login;
        $scope.input.email = $rootScope.email;
        $scope.selectedService = "no_service";
        console.log("MASUK META TRANSACTION");
        console.log($scope.input.meta);
        var obj = serializeData({
            _method: 'POST',
            product_ids: ids,
            qtys: qtys,
            variants: JSON.stringify(variants),
            name: $scope.input.name,
            email: $scope.input.email,
            phone: $scope.input.phone,
            address: $scope.input.address,
            comments: $scope.input.comments,
            payment_type: $scope.payment.selectedPaymentType,
            meta: JSON.stringify($scope.input.meta),
            delivery_service: $scope.selectedService,
            delivery_courier: $scope.deliveryCourier,
            delivery_method: $scope.deliveryMethod,
            delivery_price: $scope.deliveryPrice,
            delivery_min_day: $scope.minDays,
            delivery_max_day: $scope.maxDays,
            delivery_shipper_destination_id: ($scope.selectedService == 'domestic' ? "" : ""),
            delivery_shipper_destination_name: ($scope.selectedService == 'domestic' ? "" : ""),
            delivery_shipper_rate_id: $scope.rateId,
            delivery_gosend_lat : ($scope.go_send_enabled == 'YES' ? $scope.destination_gosend_lat : 0),
            delivery_gosend_lng : ($scope.go_send_enabled == 'YES' ? $scope.destination_gosend_lng : 0)
          });

        // submit order
        console.log("******************");
        console.log(obj);
        console.log("******************");
        $scope.result = httpService.post($scope, $http, send_email_url + '?token=' + token, obj, 'submit_order');
    });

    // if post comment success, show notification
    $scope.$on('httpService:postSubmitOrderSuccess', function() {
        //        console.log($scope.result.data.payment_url);
        //        console.log($scope.result.data.unavailable_product);
        console.log($scope.result.data);
        console.log($scope.result.data.cp_user_data);
        console.log(user_meta);
        trans_id = $scope.result.data.return_trans_id;
        order_id = $scope.result.data.return_order_id;
        if ($scope.result.data.success === true) {
            $scope.hide();
            $scope.showSuccessAlert(trans_id, order_id, $scope.result.data);

            shoppingCharts.splice(0, shoppingCharts.length);
            if (isPhoneGap()) {
                clearCart();
            }

            $scope.totalPrice = 0;
            $scope.totalPoints = 0;

            $scope.input = {
                name: '',
                email: '',
                phone: '',
                address: '',
                comments: ''
            };

            if ($scope.result.data.cp_user_data && typeof $scope.result.data.cp_user_data.length === 'undefined') {
                user_meta.cp_first_purchase = $scope.result.data.cp_user_data.cp_first_purchase;
                user_meta.cp_credit_status = $scope.result.data.cp_user_data.cp_credit_status;
                user_meta.cp_credit = $scope.result.data.cp_user_data.cp_credit;

                var updateMeta = [];
                updateMeta.push({
                    key: 'cp_first_purchase',
                    value: user_meta.cp_first_purchase
                });
                updateMeta.push({
                    key: 'cp_credit_status',
                    value: user_meta.cp_credit_status
                });
                updateMeta.push({
                    key: 'cp_credit',
                    value: user_meta.cp_credit
                });

                if (isPhoneGap()) {
                    updateLocalCompanyUserMeta(updateMeta);
                }
            }

            payment_url = $scope.result.data.payment_url;

        } else {
            $scope.hide();

            if ($scope.result.data.unavailable_product == undefined || $scope.result.data.limited_product == undefined) {
                $scope.showFailedAlert();
            } else if ($scope.result.data.unavailable_product.length > 0 || $scope.result.data.limited_product.length > 0) {
                $scope.unavailable_product = $scope.result.data.unavailable_product;
                $scope.limited_product = $scope.result.data.limited_product;
                $scope.showUnavailableAlert($scope.unavailable_product, $scope.limited_product);
            } else {
                $scope.showFailedAlert();
            }
        }

    });

    $scope.$on('httpService:postSubmitOrderError', function() {
        console.log("*****************");
        console.log("$scope.result.data");
        console.log($scope.result.data);
        console.log("*****************");
        $scope.hide();
        $scope.showFailedAlert();
    });

    // alert fragment
    $scope.showSuccessAlert = function(trans_id, order_id, data) {
        console.log(trans_id);
        console.log(vt_payment_service);
        var paymentType = $scope.payment.selectedPaymentType;
        $scope.trans_id = trans_id;
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_checkout_title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: "OK",
            template: '<div style="width:100%;text-align:center">' + $scope.text_success_alert + '</div>',
            buttons: [
                // {
                //     text: $scope.alert_button_pay_later,
                //     onTap: function(e)
                //     {
                //         $rootScope.transaction_count += 1;
                //         $ionicHistory.removeBackView();
                //         $ionicHistory.clearHistory();
                //         window.location.href= "#/app/transaction-list" ;
                //     }
                // },
                {
                    text: $scope.alert_button_pay_now,
                    type: 'cp-button',
                    onTap: function(e) {
                        $rootScope.transaction_count += 1;
                        if (trans_id != -1) {
                            $ionicHistory.removeBackView();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/transaction-detail/" + trans_id;
                        } else {
                            $ionicHistory.removeBackView();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicHistory.clearHistory();
                            window.location.href = "#/app/manual-payment";
                        }
                    }

                }
            ]
        });
    };

    $scope.showFailedAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: $scope.alert_loading_failed_title,
            css: 'cp-button',
            okType: 'cp-button',
            okText: "OK",
            template: '<div style="width:100%;text-align:center">' + $scope.alert_loading_failed_content + '</div>'
        });
    };

    $scope.showUnavailableAlert = function(unavailable_product, limited_product) {
        console.log("UnavailableAlertWishlist");
    };

    $scope.showDataMinimumAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Warning",
            css: 'cp-button',
            okType: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + $scope.feedback_invalid_quantity + '</div>'
        });
    };
    
});
