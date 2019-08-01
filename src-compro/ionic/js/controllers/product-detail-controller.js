app.controller("ProductDetailCtrl", function ($scope, $timeout, $rootScope, $http, httpService, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $ionicModal, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaClipboard, $cordovaToast) {
    // loading spinner in the beginning
    $scope.isLoading = true;
    $scope.isTimeout = false;
    $scope.offlineMode = false;
    $scope.inShoppingCarts = false;
    $scope.currency = currency + ' ';
    $scope.shopping_enabled = shopping_enabled ? "YES" : "NO";
    $scope.variants_enabled = 'NO';
    $scope.low_stock = false;
    $scope.variant = [];

    $scope.stock_status_visible = stock_status_visible;

    var loadCustomText = function () {
        $scope.button_text_add_to_cart = getMenuText(ui_texts_products.button_text_add_to_cart, "ADD TO CART");
        $scope.button_text_checkout = getMenuText(ui_texts_products.button_text_checkout, "Check Out");
        $scope.button_shop_more = getMenuText(ui_texts_products.button_shop_more, "Shop More");
        $scope.ui_text_quantity_to_buy = getMenuText(ui_texts_products.ui_text_quantity_to_buy, "Quantity to Buy");
        $scope.ui_text_variants = getMenuText(ui_texts_products.ui_text_variants, "Variants");
        $scope.ui_text_out_of_stock = getMenuText(ui_texts_products.ui_text_out_of_stock, "Out of Stock");
        $scope.ui_text_in_stock = getMenuText(ui_texts_products.ui_text_in_stock, "In Stock");
        $scope.ui_text_stock_is_not_enough = getMenuText(ui_texts_products.ui_text_stock_is_not_enough, "Stock is not enough. Current stock:");
        $scope.ui_text_stock_is_not_enough_variants = getMenuText(ui_texts_products.ui_text_stock_is_not_enough_variants, "Stock unavailable for these variants:");
        $scope.feedback_insert_quantity = getMenuText(ui_texts_products.feedback_insert_quantity, "Please insert quantity of items.");
        $scope.feedback_invalid_quantity = getMenuText(ui_texts_products.feedback_invalid_quantity, "Please input valid quantity. Mininum quantity: 1");
        $scope.feedback_item_added = getMenuText(ui_texts_products.feedback_item_added, "Item Added to Shopping Cart");
        $scope.add_shopping_cart_error = getMenuText(ui_texts_products.add_shopping_cart_error, "Failed to add item. Please check your internet connection.");
        $scope.popup_title_shopping_cart = getMenuText(ui_texts_products.popup_title_shopping_cart, "Shopping Cart");
        $scope.title_shopping_cart = getMenuText(default_menu_titles.cart, "Shopping Cart");
    };

    loadCustomText();

    console.log("MASUK " + $scope.shopping_enabled);
    $scope.basket = 0;

    // check user login
    if (user_id === '') {
        $scope.isLogin = false;
    } else {
        $scope.isLogin = true;
    }
    //console.log($ionicHistory.viewHistory());

    // initialize input text comment
    $scope.input = {
        qty: 0,
        comment: ''
    };

    $scope.liked = false;

    var url = token_url;
    var obj = serializeData({email: username, password: password, company_id: company_id});
    // call angular http service
    httpService.post_token($scope, $http, url, obj);


    // variable for saving new comment data
    $scope.list_comment_temp = '';

    $scope.images = [];
    $scope.modal_index = 0;

    $scope.galleryData = {};

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
        console.log('ProductDetailCtrl');
        //console.log($scope.result);
    });

    var term_content_type_id;
    $rootScope.$on('ReloadDefaultLanguage',reloadTermStaticPageLanguage);


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

        $scope.loadVariants();

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

        $scope.loadVariants();

        //display true resolution image
        console.log('true resolution loaded');

        // save to db first page
        if (isPhoneGap()) {
            //console.log($stateParams.id + " " + $scope.data.post.term_id + " " + 'ArticleDetailCtrl' + " " + $scope.data);
            savePostJSONToDB($stateParams.id, updated_data.post.term_id, 'ArticleDetailCtrl', updated_data);
            //console.log('saved');
        }

    });

    // if get data list article error, set timeout, then tap reload again.
    $scope.$on('httpService:getHighResDataError', function (event, args) {

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        // call angular http service
        httpService.post_token($scope, $http, url, obj, 'high-res-data-content');

    });

    // function submit comment
    $scope.postComment = function () {
        if ($scope.input.comment !== '') {
            $scope.show();
            var url = token_url;
            var obj = serializeData({email: username, password: password, company_id: company_id});

            // get token for posting comment
            httpService.post_token($scope, $http, url, obj, 'post_comment');
        }
    };

    // if token for post comment success
    $scope.$on('httpService:postTokenCommentSuccess', function () {
        token = $scope.data.token;
        //console.log('token post comment = ' + token);
        var obj = serializeData({
            _method: 'POST',
            content: $scope.input.comment,
            post_id: $stateParams.id,
            user_id: user_id,
            company_id: company_id,
            author: username_login
        });

        // post comment
        httpService.post($scope, $http, comments_url + '?token=' + token, obj, 'post_comment');
    });

    // if token for post comment error
    $scope.$on('httpService:postTokenCommentError', function () {
        $scope.hide();
        $scope.showCommentFailedAlert();
    });

    // if post comment success, show notification
    $scope.$on('httpService:postCommentSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hide();
            $scope.showCommentSuccessAlert();
            $scope.content_data.comments.push($scope.data.comment);
            $scope.content_data.total_comments++;

            $scope.input.comment = '';

            //console.log($scope.comments);
        } else {
            $scope.hide();
            $scope.showCommentFailedAlert();
        }

    });

    $scope.$on('httpService:postCommentError', function () {
        $scope.hide();
        $scope.showCommentFailedAlert();
    });

    $scope.likeFunction = function () {
        $scope.show();

        var url = token_url;
        var obj = serializeData({email: username, password: password, company_id: company_id});
        httpService.post_token($scope, $http, url, obj, 'post_like');
    };

    $scope.$on('httpService:postTokenLikeSuccess', function () {
        var new_token = $scope.data.token;
        //console.log('token post Likes = ' + new_token);
        var obj = serializeData({
            _method: 'POST',
            content: '',
            post_id: $stateParams.id,
            user_id: user_id,
            company_id: company_id,
            author: username_login
        });

        // post comment
        httpService.post($scope, $http, likes_url + '?token=' + new_token, obj, 'post_like');
    });

    $scope.$on('httpService:postLikeSuccess', function () {

        if ($scope.data.success === true) {
            $scope.hide();
            $scope.liked = true;
            $scope.content_data.total_likes++;
        } else {
            $scope.hide();
            $scope.liked = false;
        }

    });

    $scope.$on('httpService:postLikeError', function () {

        $scope.hide();

    });

    $scope.$on('httpService:postTokenLikeError', function () {
        $scope.hide();
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

    // alert fragment
    $scope.showSuccessAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.popup_title_shopping_cart,
            template: '<div style="width:100%;text-align:center">' + $scope.feedback_item_added + '</div>',
            buttons: [
                {
                    text: $scope.button_shop_more,
                    type: 'cp-button',
                    onTap: function (e) {
                        $scope.$ionicGoBack();
                    }
                },
                {
                    text: $scope.button_text_checkout,
                    type: 'cp-button',
                    onTap: function (e) {
                        window.location.href = "#/app/shopping-cart-1/-3";
                    }

                }
            ]
        });
    };

    $scope.subTotal = function (command) {
      var stock_value = getPostMetaValueById($scope.content_data.post_meta, 'stock').value;
      if ($scope.variants_enabled == 'YES'){
          if ($scope.chosenVariantItem){
            stock_value = $scope.chosenVariantItem['stock'];
          }
          else
            stock_value = 0;
      }

      if (command == "add") {
          console.log(stock_value);
          if (sku_enabled == 'YES' && stock_value <= $scope.input.qty) {
              // Stock is not enough to satisfy requested quantity
              if (isPhoneGap()) {
                  $cordovaToast.show($scope.ui_text_stock_is_not_enough + stock_value, 'long', 'bottom')
              } else {
                  $scope.low_stock = true;
              }
          } else {
              $scope.input.qty += 1;
              $scope.basket += 1;
              $scope.low_stock = false;
          }
      }

      if (command == "substract") {
          $scope.input.qty = $scope.input.qty <= 0 ? 0 : $scope.input.qty - 1;
          $scope.basket = $scope.basket <= 0 ? 0 : $scope.basket - 1;
          $scope.low_stock = false;
      }
    };

    $scope.addToChart = function (content_data) {
        var id = $scope.variants_enabled == 'YES' ? $scope.chosenVariantItem.variant_post_id  : content_data.id;
        var title = content_data.title;
        var img = content_data.img_src;
        var qty = $scope.input.qty;
        var price = $scope.getPostMeta('price');//getPostMetaValueById(content_data.post_meta, 'price').value;
        var weight = getPostMetaValueById(content_data.post_meta, 'weight') == undefined ? 1 : getPostMetaValueById(content_data.post_meta,'weight').value;
        var width =  getPostMetaValueById(content_data.post_meta, 'width') == undefined ? 1 : getPostMetaValueById(content_data.post_meta,'width').value;
        var height = getPostMetaValueById(content_data.post_meta, 'height') == undefined ? 1 : getPostMetaValueById(content_data.post_meta,'height').value;
        var length = getPostMetaValueById(content_data.post_meta, 'length') == undefined ? 1 : getPostMetaValueById(content_data.post_meta,'length').value;
        var volume = width * height * length;
        var variants = $scope.variant;
        var variantValues = [];

        // CHANGE VARIANT ARRAY OF STRING FORMAT TO OBJECT
        var variant = '{ ';
        for (var key in variants){
          variantValues.push(variants[key]);
          variant += '"' + key + '":"' + variants[key] + '",';
        }
        variant = variant.substr(0,variant.length-1);
        variant += '}';


        if ($scope.input.qty === '' || $scope.input.qty === undefined || $scope.input.qty === null) {
            $scope.showDataRequiredAlert();
        }
        else {
            if ($scope.input.qty <= 0) {
                $scope.showDataMinimumAlert();
            }
            else {
                var item =
                {
                    id: id,
                    title: title,
                    img: img,
                    qty: qty,
                    price: price,
                    weight: weight,
                    width: width,
                    height: height,
                    length: length,
                    volume: volume,
                    variants: JSON.parse(variant),
                    variantValues: variantValues
                };

                var flagAda = false;
                for (var i = 0; i < shoppingCharts.length; i++) {
                    if (shoppingCharts[i].id === item.id) {
                        shoppingCharts[i].qty += item.qty;
                        flagAda = true;
                        break;
                    }
                }
                if (!flagAda) {
                    shoppingCharts.push(item);
                }

                if (isPhoneGap()) {
                    saveCartToDB(item.id, item);
                }
                $rootScope.totalQty += item.qty;
                $scope.showSuccessAlert();
            }
        }

    };


    $scope.showDataRequiredAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.title_shopping_cart,
            css: 'cp-button',
            okType: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + $scope.feedback_insert_quantity + '</div>'
        });
    };

    $scope.showDataMinimumAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.title_shopping_cart,
            css: 'cp-button',
            okType: 'cp-button',
            template: '<div style="width:100%;text-align:center">' + $scope.feedback_invalid_quantity + '</div>'
        });
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

  // alert fragment
    $scope.showSuccessAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.popup_title_shopping_cart,
        template: '<div style="width:100%;text-align:center">' + $scope.feedback_item_added + '</div>',
        buttons: [
          {
            text: $scope.button_shop_more,
            type: 'cp-button',
            onTap: function (e) {
              $scope.$ionicGoBack();
            }
          },
          {
            text: $scope.button_text_checkout,
            type: 'cp-button',
            onTap: function (e) {
              window.location.href = "#/app/shopping-cart-1/-3";
            }

          }
        ]
      });
    };

    $scope.showFailedAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.title_shopping_cart,
        template: '<div style="width:100%;text-align:center">' + $scope.add_shopping_cart_error + '</div>'
      });
    };


  // alert fragment
    $scope.showCommentSuccessAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_comment_title,
        css: 'cp-button',
        okType:'cp-button',
        okText:$scope.alert_button_ok,
        template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_success + '</div>'
      });
    };

    $scope.showCommentFailedAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: $scope.text_comment_title,
        css: 'cp-button',
        okType:'cp-button',
        okText:$scope.alert_button_ok,
        template: '<div style="width:100%;text-align:center">' + $scope.text_comment_alert_error + '</div>'
      });
    };

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

    $scope.limit_per_customer_enabled = limit_per_customer_enabled;

    // =====================================================
    // ===================== VARIANTS ======================
    // =====================================================

    $scope.loadVariants = function(){
      var variantsMaster = $scope.getPostMetaValueById($scope.content_data.post_meta, 'variants_master');

      if (variantsMaster) {
        var variants = JSON.parse(variantsMaster.value);
        $scope.variants_enabled = variants.enabled;
      }

      if ($scope.variants_enabled == 'YES') {
        var variantsDetail = $scope.getPostMetaValueById($scope.content_data.post_meta, 'variants_detail');
        $scope.variantItems = JSON.parse(variantsDetail.value);

        // NO NEED TO INITIATE ANYTHING IF NO VARIANT ITEMS ARE ADDED.
        if ($scope.variantItems.length == 0){
          $scope.variants_enabled = 'NO';
        }
        else { // IF THERE ARE AT LEAST ONE VARIANT AVAILABLE, INITIATE.
          // put variant types data (custom types like warna, ukuran, size)
          $scope.content_data.variantTypes = [];
          $scope.variantTypesByKey = variants.types;

          for (var key in variants.types) {
            var variantType = variants.types[key];
            if (variantType.status == 'active') {
              $scope.content_data.variantTypes.push(variantType);
            }
          }

          // generate variant dropdown data. (values like warna:merah,kuning,hijau, ukuran:L,XL,S)
          $scope.content_data.variantTypeValues = [];
          if (variantsDetail) {
            var variantItems = $scope.variantItems;
            var variantTypes = $scope.content_data.variantTypes;

            for (var a = 0; a < variantTypes.length; a++) {
              var id = variantTypes[a].id;
              var variantTypeValues = [];
              for (var b = 0; b < variantItems.length; b++) {
                var itemVariant = variantItems[b][id];

                // add to dropdown if not available yet.
                if (variantTypeValues.indexOf(itemVariant) < 0)
                  variantTypeValues.push(itemVariant);
              }
              variantTypes[a].values = variantTypeValues;
            }

            $scope.content_data.variantTypes = variantTypes;
          }

          // generate default variant
          for (var a = 0; a < $scope.content_data.variantTypes.length; a++) {
            var vt = $scope.content_data.variantTypes[a];
            if (vt.values.length > 0)
              $scope.variant[vt.id] = vt.values[0];
          }
          $scope.changeVariant();
        }
      }
    };

    $scope.changeVariant = function(){
      // console.log($scope.variant);
      var variantTypes = $scope.content_data.variantTypes;
      var chosenVariantItem = false;

      // iterate saved variant items, find out if stock available.
      for (var i = 0; i < $scope.variantItems.length; i++){
        var item = $scope.variantItems[i];
        var isExist = [];
        var itemExists = true;

        // check if item exists
        for (var a = 0; a < variantTypes.length; a++){
          var variantType = variantTypes[a].id;
          var variantValue = $scope.variant[variantType];
          isExist[a] = variantType ? (item[variantType] == variantValue) : false;
        }

        for (var b = 0; b < isExist.length; b++) {
          if (isExist[b] == false){
            itemExists = false;
            break;
          }
        }

        if (itemExists) {
          chosenVariantItem = item;
          break;
        }
      }

      // do something if item exist / not.
      if (itemExists){
        $scope.chosenVariantItem = chosenVariantItem;
      }
      else if (!itemExists){
        // show alert no stock available.
        $scope.chosenVariantItem = { stock: 0, price: getPostMetaValueById($scope.content_data.post_meta,'price').value };
        $scope.getPostMeta('stock');
        $scope.showAlertUnavailableStockVariants();
      }

      $scope.low_stock = false;
      $scope.input.qty = 0;
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

    $scope.showAlertUnavailableStockVariants = function(){
      // show chosen variants

      var variantText = '';
      var variantCt = 0;
      for (var key in $scope.variant){
        var value = $scope.variant[key];
        var name = $scope.variantTypesByKey[key].name;
        var text = '<br>' + name + ': <span style="font-weight:bold;">' + value + "</span>";
        variantText += text;
        variantCt += 1;
      }

      if (variantCt == $scope.content_data.variantTypes.length) {
        var alertPopup = $ionicPopup.alert({
          title: $scope.content_data.title,
          css: 'cp-button',
          okType: 'cp-button',
          okText: $scope.alert_button_ok,
          template: '<div style="width:100%;text-align:center">' +
          $scope.ui_text_stock_is_not_enough_variants + "<br>" + variantText +
          '</div>'
        });
      }
    };

    // =======================================================================

});
