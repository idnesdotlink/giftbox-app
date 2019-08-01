var serializeData = function (data) {
    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {
        return( ((data === null)||(data === undefined)) ? "" : data.toString());
    }

    var buffer = [];

    // Serialize each key in the object.
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue;
        }

        var value = data[ name ];

        buffer.push(
                encodeURIComponent(name) + "=" + encodeURIComponent( ((value === null)||(value === undefined)) ? "" : value)
                );
    }

    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join("&").replace(/%20/g, "+");
    return(source);
};

// untuk dapetin id dari objek post_meta yang didapat pada json
var getPostMetaValueById = function (arr, value) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].key === value) {
            return arr[d];
        }
    }
    return undefined;
};

var getMetaValueById = function (arr,value){
    for (var d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d].key === value) {
        return arr[d];
      }
    }
}



// for checking "likes" from user
var checkPostLikes = function (arr, user_id) {
    console.log('check post likes');
    for (var d = 0, len = arr.length; d < len; d += 1) {

        console.log(arr[d].user_id + ' ' + user_id);
        if (arr[d].user_id == user_id) { // klo dibuat === gk jalan
            return true;
        }
    }
    return false;
};

// for checking if the application run in web or in mobile
var isPhoneGap = function () {
    return (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
};

var isAndroid = function() {
    return (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /android/i.test(navigator.userAgent);
};

var isIOS = function() {
    return (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad/i.test(navigator.userAgent);
};

var postData = function ($scope, $http, token, method, content, post_id, user_id, company_id, httpService) {
    var url = comments_url;
    var obj = serializeData({_method: method, content: content, post_id: post_id, user_id: user_id, company_id: company_id});
    // call angular http service
    httpService.post($scope, $http, url + '?token=' + token, obj);
};

// untuk dapetin id dari objek post_meta yang didapat pada json
var getProductDetailImageFromPostMeta = function (arr, value) {
    var images = new Array();
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].key === value) {
            images.push(arr[d]);
        }
    }
    console.log(images);
    return images;
};

var clearPostDataByTermId = function (term_id)
{
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS posts_contents (id integer, term_id integer, controller_name text, content text)");
        tx.executeSql("DELETE FROM posts_contents WHERE term_id = ?", [term_id]);

    });

};

var savePostJSONToDB = function(id, term_id, controllerName, data) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS posts_contents (id integer, term_id integer, controller_name text, content text)");
        tx.executeSql("DELETE FROM posts_contents WHERE id = ?", [id]);
        tx.executeSql("INSERT INTO posts_contents (id, term_id, controller_name, content) VALUES (?,?,?,?)",
            [id, term_id, controllerName, JSON.stringify(data)],
            function (tx, res) {
                console.log("INSERT SQLITE CONTENT SUCCESS: " + res.insertId);
                //$scope.$broadcast('SQLite:setOfflineDataSuccess');
            },
            function (e) {
                console.log("INSERT SQLITE CONTENT ERROR: " + e.message);
                //$scope.$broadcast('SQLite:setOfflineDataError');
            }
        );

    });
};

var loadPostJSONFromDB = function (id, $scope) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {
        console.log("id: " + id);

        tx.executeSql("SELECT id, content FROM posts_contents WHERE id = ?", [id],
            function (tx, res) {
                if (res.rows.length >= 1) {
                    //var stringJson = res.rows.item(0).content;
                    $scope.data = JSON.parse(res.rows.item(0).content);
                    //$scope.isLoading = false;

                    if (id >= 1) {
                        console.log("LOAD SQLITE CONTENT SUCCESS");
                        console.log($scope.data);
                        $scope.$broadcast('SQLite:getOfflineDataSuccess');
                    } else {
                        console.log("LOAD SQLITE MENU SUCCESS");
                        console.log($scope.data);
                        $scope.$broadcast('SQLite:getOfflineMenuSuccess');
                    }
                } else {
                    if (id >= 1) {
                        console.log('LOAD SQLITE CONTENT ERROR: Content Not Found!');
                        $scope.$broadcast('SQLite:getOfflineDataError');
                    } else {
                        console.log('LOAD SQLITE MENU ERROR: Menu Not Found!');
                        $scope.$broadcast('SQLite:getOfflineMenuError');
                    }
                }
            },
            function (e) {
                console.log('LOAD SQLITE CONTENT ERROR: ' + e.message);
                $scope.$broadcast('SQLite:getOfflineDataError');
            }
        );
    });
};


var saveTermJSONToDB = function(id, controllerName, data) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS terms_contents (id integer, controller_name text, content text)");
        tx.executeSql("DELETE FROM terms_contents WHERE id = ?", [id]);
        tx.executeSql("INSERT INTO terms_contents (id, controller_name, content) VALUES (?,?,?)",
            [id, controllerName, JSON.stringify(data)],
            function (tx, res) {
                console.log("INSERT SQLITE CONTENT SUCCESS: " + res.insertId);
                //$scope.$broadcast('SQLite:setOfflineDataSuccess');
            },
            function (e) {
                console.log("INSERT SQLITE CONTENT ERROR: " + e.message);
                //$scope.$broadcast('SQLite:setOfflineDataError');
            }
        );

    });
};


var loadTermJSONFromDB = function (id, $scope) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("SELECT id, content FROM terms_contents WHERE id = ?", [id],
            function (tx, res) {
                if (res.rows.length >= 1) {
                    //var stringJson = res.rows.item(0).content;
                    $scope.data = JSON.parse(res.rows.item(0).content);
                    //$scope.isLoading = false;

                    if (id >= 1) {
                        console.log("LOAD SQLITE CONTENT SUCCESS");
                        console.log($scope.data);
                        $scope.$broadcast('SQLite:getOfflineDataSuccess');
                    } else if(id == -1) {
                        console.log("LOAD SQLITE MENU SUCCESS");
                        console.log($scope.data);
                        $scope.$broadcast('SQLite:getOfflineMenuSuccess');
                    } else {
                        console.log("LOAD SQLITE OPTIONS SUCCESS");
                        console.log($scope.data);
                        $scope.$broadcast('SQLite:getOfflineOptionsSuccess');
                    }
                } else {
                    if (id >= 1) {
                        console.log('LOAD SQLITE CONTENT ERROR: Content Not Found!');
                        $scope.$broadcast('SQLite:getOfflineDataError');
                    } else if(id == -1) {
                        console.log('LOAD SQLITE MENU ERROR: Menu Not Found!');
                        $scope.$broadcast('SQLite:getOfflineMenuError');
                    } else {
                        console.log('LOAD SQLITE OPTIONS ERROR: Options Not Found!');
                        $scope.$broadcast('SQLite:getOfflineOptionsError');
                    }
                }
            },
            function (e) {
                console.log('LOAD SQLITE CONTENT ERROR: ' + e.message);
                $scope.$broadcast('SQLite:getOfflineDataError');
            }
        );
    });
};



var saveSpecialVarsToDB = function(id, controllerName, data) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});

    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS special_vars (id integer, controller_name text, content text)");
        tx.executeSql("DELETE FROM special_vars WHERE id = ?", [id]);
        tx.executeSql("INSERT INTO special_vars (id, controller_name, content) VALUES (?,?,?)",
            [id, controllerName, JSON.stringify(data)],
            function (tx, res) {
                console.log("INSERT SQLITE CONTENT SUCCESS: " + res.insertId + " " + id);
                //$scope.$broadcast('SQLite:setOfflineDataSuccess');
            },
            function (e) {
                console.log("INSERT SQLITE CONTENT ERROR: " + e.message);

                //$scope.$broadcast('SQLite:setOfflineDataError');
            }
        );

    });
};

var deleteSpecialVarsFromDB = function(id) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS special_vars (id integer, controller_name text, content text)");
        tx.executeSql("DELETE FROM special_vars WHERE id = ?", [id],function(tx,res){
          console.log("DELETE SQLITE CONTENT SUCCESS: " + id);
        },function(e){
          console.log("DELETE SQLITE CONTENT ERROR: " + id);
        });

    });
};


var loadSpecialVarsFromDB = function (id, $scope) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {
        tx.executeSql("SELECT id, content FROM special_vars WHERE id = ?", [id],
            function (tx, res) {
                if (res.rows.length >= 1) {
                    //var stringJson = res.rows.item(0).content;
                    $scope.special_vars = JSON.parse(res.rows.item(0).content);
                    //$scope.isLoading = false;
                    $scope.$broadcast('SQLite:getSpecialVarsSuccess:' + id);
                } else {
                    console.log('LOAD SQLITE CONTENT ERROR: Content Not Found!');
                    $scope.$broadcast('SQLite:getSpecialVarsError:' + id);
                }
            },
            function (e) {
                console.log('LOAD SQLITE CONTENT ERROR: ' + e.message);
                $scope.$broadcast('SQLite:getSpecialVarsError:' + id);
            }
        );
    });
};

var clearCart = function()
{
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS shopping_cart (id integer, content text)");
        tx.executeSql("DELETE FROM shopping_cart", []);
        console.log('SQLITE: All cart data deleted');
    });
}

var clearCartById = function (id)
{
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS shopping_cart (id integer, content text)");
        tx.executeSql("DELETE FROM shopping_cart WHERE id = ?", [id]);
        console.log('SQLITE: Cart data deleted');
    });
};

var saveCartToDB = function(id, data) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS shopping_cart (id integer, content text)");
        tx.executeSql("DELETE FROM shopping_cart WHERE id = ?", [id]);
        tx.executeSql("INSERT INTO shopping_cart (id, content) VALUES (?,?)",
            [id, JSON.stringify(data)],
            function (tx, res) {
                console.log("INSERT SQLITE CART SUCCESS: " + res.insertId);
                //$scope.$broadcast('SQLite:setOfflineDataSuccess');
            },
            function (e) {
                console.log("INSERT SQLITE CART ERROR: " + e.message);
                //$scope.$broadcast('SQLite:setOfflineDataError');
            }
        );

    });
};

var loadCartFromDB = function ($scope, $rootScope) {
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
    db.transaction(function (tx) {

        tx.executeSql("SELECT id, content FROM shopping_cart", [],
            function (tx, res) {
                if (res.rows.length >= 1) {
                    //var stringJson = res.rows.item(0).content;
                    // shoppingCharts.push($scope.data);
                    for(var i=0; i<res.rows.length; i++) {
                        shoppingCharts.push(JSON.parse(res.rows.item(i).content));
                    }

                    for (var i = 0; i < shoppingCharts.length; i++) {
                        $rootScope.totalQty += shoppingCharts[i].qty;
                    }
                    console.log("LOAD SQLITE CART SUCCESS");

                }
                else
                {
                    console.log('LOAD SQLITE CART ERROR: Menu Not Found!');
                }

            },
            function (e) {
                console.log('LOAD SQLITE CONTENT ERROR: ' + e.message);
                $scope.$broadcast('SQLite:getOfflineDataError');
            }
        );
    });
};

var strip = function (html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

var socialShare = function($cordovaClipboard, $cordovaToast, $timeout, message, subject, image, link, desc) {
    var summary = '';
    if(message != null) {
        message = strip(message);
        message = message.replace(/&nbsp;/gi,"");
        message = message.replace(/[<]br[^>]*[>]/gi,"");
        message = message.replace(/\u00A0/g, "");

        var regex = /(<([^>]+)>)/ig
            ,   body = message
            ,   content_temp = body.replace(regex, "");

        //console.log(content_temp);
        if(content_temp.length > 100) {
            summary = content_temp.substring(0, 100);
            summary += '...';
        }
        else {
            summary = content_temp;
        }

        if(desc!= null) summary = summary + ' \n\n' + desc + ': ' + link;
        else
        {
            summary = summary + ' ' + link;
        }
        console.log(summary);
        $cordovaClipboard
            .copy(summary)
            .then(function () {
                $cordovaToast
                    .show('Content Copied to Clipboard', 'long', 'bottom')
                    .then(function(success) {
                        $timeout(function(){
                            window.plugins.socialsharing.share(summary, subject, image, null);
                        }, 1000);

                    }, function (error) {
                        // error
                    });
            }, function () {
                // error
            });
    }
    else {
        window.plugins.socialsharing.share(message, subject, image, null);
    }

};


function downloadFile($scope,
                      $cordovaFileTransfer,
                      $cordovaLocalNotification,
                      url,
                      dirName,
                      prefix,
                      filename,
                      fileExtension)
{
    var uri = encodeURI(url);

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    function gotFS(fileSystem) {
        if(isAndroid()) {
            var appPath = cordova.file.externalDataDirectory;
            var index = appPath.indexOf('Android');
            var dirPath = appPath.substring(index,appPath.length);
            fileSystem.root.getDirectory(dirPath + '/' + dirName, {create: true}, gotDir);
        }

        if(isIOS()) {
            console.log('dirname');
            console.log(dirName);
            var appPath = cordova.file.dataDirectory;
            console.log(appPath);
            var index = appPath.indexOf('Library');
            var dirPath = appPath.substring(index,appPath.length);
            console.log(dirPath);
            gotDir();
        }
    }

    function gotDir(dirEntry) {
        // bisa di ganti disini klo mau ke folder download
        if(isAndroid()) {
            var targetPath = cordova.file.externalDataDirectory + "/" + dirName + "/" + prefix +"_" + filename + "." + fileExtension;
        }

        if(isIOS()) {
            var targetPath = cordova.file.dataDirectory + "/" + dirName + "/" + prefix +"_" + filename + "." + fileExtension;   
        }
        console.log(targetPath);

        var trustHosts = true;
        var options = {};


        $cordovaFileTransfer.download(uri, targetPath, options, trustHosts)
            .then(function (result) {
                console.log("Local Notification: Schedule Notif");
                $scope.hideDownloadLoading();

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: $scope.text_loading_download_complete,
                    text: targetPath,
                    icon: "file://res/drawable-mdpi/icon",
                }).then(function (result) {
                    // vibrate device
                    $scope.isDownloaded = true;
                    console.log("Local Notification: Notification shown, do whatever you want later.");
                });

            }, function (err) {
                console.log(err);
                $scope.isDownloaded = false;
            }, function (progress) {
                $scope.progressval = parseInt((progress.loaded / progress.total) * 100);
                if($scope.progressval == 100)
                {
                    $scope.isDownloaded = true;
                }
            });
    }

    function fail(error)
    {
        console.log("error:" + error.code);
    }
}


function showExitConfirmation ($ionicPopup, url) {
    var confirmPopup = $ionicPopup.confirm({
        title: $scope.alert_external_link_title,
        css: 'cp-button',
        template: "<div style='display:flex;justify-content:center;align-items:center;'>" + $scope.alert_external_link_content + "</div>",
        okType:'cp-button'
    });

    //confirmation dialog
    confirmPopup.then(function (res) {
        if (res) {
            window.open(url, "_system", "location=yes");
        }
    });
}

function showExternalLinkConfirmation ($cordovaClipboard,$cordovaToast, $ionicPopup, url) {
    text_title_external_url = "External URL";
    text_title_external_url_desc = "This link contains external url. Do you want to proceed?";
    button_text_external_url_open_link = "Open Link";
    button_text_external_url_send_email = "Send Email";
    button_text_external_url_copy_email = "Copy Email";
    button_text_external_url_copy_link = "Copy Link";
    button_text_external_url_copy_link_toast = "Link Copied to Clipboard";
    button_text_external_url_copy_email_toast = "Email Copied to Clipboard";
    button_text_external_url_cancel = "Cancel";

    text_title_external_url = ui_texts_general.text_title_external_url !== undefined && ui_texts_general.text_title_external_url[language]!==undefined ? ui_texts_general.text_title_external_url[language] : text_title_external_url;

    text_title_external_url_desc = ui_texts_general.text_title_external_url_desc !== undefined && ui_texts_general.text_title_external_url_desc[language]!==undefined ? ui_texts_general.text_title_external_url_desc[language] : text_title_external_url_desc;

    button_text_external_url_open_link = ui_texts_general.button_text_external_url_open_link !== undefined && ui_texts_general.button_text_external_url_open_link[language]!==undefined ? ui_texts_general.button_text_external_url_open_link[language] : button_text_external_url_open_link;

    button_text_external_url_send_email = ui_texts_general.button_text_external_url_send_email !== undefined && ui_texts_general.button_text_external_url_send_email[language]!==undefined ? ui_texts_general.button_text_external_url_send_email[language] : button_text_external_url_send_email;

    button_text_external_url_copy_email = ui_texts_general.button_text_external_url_copy_email !== undefined && ui_texts_general.button_text_external_url_copy_email[language]!==undefined ? ui_texts_general.button_text_external_url_copy_email[language] : button_text_external_url_copy_email;

    button_text_external_url_copy_link = ui_texts_general.button_text_external_url_copy_link !== undefined && ui_texts_general.button_text_external_url_copy_link[language]!==undefined ? ui_texts_general.button_text_external_url_copy_link[language] : button_text_external_url_copy_link;

    button_text_external_url_copy_link_toast = ui_texts_general.button_text_external_url_copy_link_toast !== undefined && ui_texts_general.button_text_external_url_copy_link_toast[language]!==undefined ? ui_texts_general.button_text_external_url_copy_link_toast[language] : button_text_external_url_copy_link_toast;

    button_text_external_url_copy_email_toast = ui_texts_general.button_text_external_url_copy_email_toast !== undefined && ui_texts_general.button_text_external_url_copy_email_toast[language]!==undefined ? ui_texts_general.button_text_external_url_copy_email_toast[language] : button_text_external_url_copy_email_toast;

    button_text_external_url_cancel = ui_texts_general.button_text_external_url_cancel !== undefined && ui_texts_general.button_text_external_url_cancel[language] !== undefined ? ui_texts_general.button_text_external_url_cancel[language] : button_text_external_url_cancel;

    var button_1_text = "";
    var button_2_text = "";
    var toast_text = "";

    if(url.toLowerCase().indexOf("mailto") >= 0)
    {
        button_1_text = button_text_external_url_send_email;
        button_2_text = button_text_external_url_copy_email;
        toast_text = button_text_external_url_copy_email_toast;
    }
    else
    {
        button_1_text = button_text_external_url_open_link;
        button_2_text = button_text_external_url_copy_link;
        toast_text = button_text_external_url_copy_link_toast;
    }

    var confirmPopup = $ionicPopup.alert({
            title: text_title_external_url,
            template: "<div style='display:flex;justify-content:center;align-items:center;'>"+text_title_external_url_desc+"</div>",
            cssClass: 'popup-vertical-buttons',
            buttons: [
                {
                    text: button_1_text,
                    type: 'cp-button button-block',
                    onTap: function (e) {
                        window.open(url, "_system", "location=yes");
                    }
                },
                {
                    text: button_2_text,
                    type: 'cp-button button-block',
                    onTap: function (e) {
                        if (!isPhoneGap()) {
                            showNotInMobileDeviceError($ionicPopup);
                            return;
                        }
                        $cordovaClipboard.copy(url).then(function () {
                            $cordovaToast
                                .show(toast_text, 'long', 'bottom');
                        }, function () {
                            // error
                        });
                    }

                },
                {
                    text:  button_text_external_url_cancel,
                    type: 'cp-button button-block'
                }
            ]
        });
}

function showNotInMobileDeviceError ($ionicPopup) {
    var confirmPopup = $ionicPopup.alert({
            title: "Feature Preview Unavailable",
            template: "<div style='display:flex;justify-content:center;align-items:center; text-align:center;'>Install this app on your device to view this feature. <br><br>You can request an installer before publishing on Step 4: Publish.</div>",
            cssClass: 'popup-vertical-buttons',
            buttons: [
                {
                    text:  "OK",
                    type: 'cp-button button-block'
                }
            ]
        });
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function stopVideo(){
    var iframes = document.getElementsByTagName("iframe");
    var iframesLength = iframes.length;
    if(iframesLength != 0) {
        for(var i=0; i<iframesLength; i++)
        {
            iframes[i].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');
        }
    }
}

function findMenuIndex(menus, termTemplateName){
    for (var a = 0; a < menus.length; a++){
        if (menus[a].term_template !== undefined && menus[a].term_template !== false && menus[a].term_template !== null
                && menus[a].term_template.name === termTemplateName){
            console.log(menus[a].term_template);
            return a;
        }
    }
    return -1;
}

function checkTemplate(menu) {
    if (!menu.term_template) return false;
    return menu.term_template.name === 'login';
}

var changeAppPage = function (target) {
    window.location.href = "#/app/" + target;
}

function changeFontSize(list){
    for(var i=0; i<list.length; i++)
    {
        if(list[i].title.length > 20)
            list[i].flexible_font_size = 100 + 30/(list[i].title.length / 10 - 1);
        else
            list[i].flexible_font_size = 130;
    }

    return list;
}

function openBrowser(url,screen){
    if (!isPhoneGap()){
        window.open(url,'_blank','location=yes');
    }
    else {
        if (screen != null)
            screen.unlockOrientation();
        cordova.ThemeableBrowser.open(url, '_blank', {
            statusbar: {
                color: '#ffffffff'
            },
            toolbar: {
                height: 44,
                color: '#ffffffff'
            },
            title: {
                color: '#212121ff',
                showPageTitle: true
            },
            backButton: {
                wwwImage: 'images/drawable-xhdpi/back.png',
                wwwImagePressed: 'images/drawable-xhdpi/back_pressed.png',
                wwwImageDensity: 2,
                align: 'left',
                event: 'backPressed'
            },
            forwardButton: {
                wwwImage: 'images/drawable-xhdpi/forward.png',
                wwwImagePressed: 'images/drawable-xhdpi/forward_pressed.png',
                wwwImageDensity: 2,
                align: 'left',
                event: 'forwardPressed'
            },
            closeButton: {
                wwwImage: 'images/drawable-xhdpi/close.png',
                wwwImagePressed: 'images/drawable-xhdpi/close_pressed.png',
                wwwImageDensity: 2,
                align: 'right',
                event: 'closePressed'
            },
            backButtonCanClose: true
        }).addEventListener('closePressed', function(e) {
            if (screen != null)
                screen.lockOrientation('portrait-primary');
        });
    }

};

function getSimpleDateFormatted(date){
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    var year = date.getFullYear();
    var hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    var outputDate = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;

    return outputDate;
};

var popupRegister = [];
var isPopupShown = false;

function showNextPopup(){
    if (popupRegister.length > 0 && !isPopupShown){
        var func = popupRegister.shift();
        func();
    }
    isPopupShown = false;
};

function registerPopup(func){
    popupRegister.push(func);
    if (!isPopupShown){
        showNextPopup();
    }
};

function updateCompanyUserMeta(){
    // load from sqlite
//    if (isPhoneGap()) {
//        // adMobService.initBannerAd();
//        // check if any user login data stored in database
//        if (db === '') {
//            db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});
//            console.log("HOME db sqlite");
//        }
//
//        db.transaction(function (tx) {
//            //tx.executeSql('DROP TABLE IF EXISTS contents'); // for DEBUG purposes only
//            //tx.executeSql('DROP TABLE IF EXISTS ' + user_table); // remove old users table
//            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + user_table + ' (id INTEGER PRIMARY KEY, user TEXT)');
//            tx.executeSql("SELECT id, user FROM " + user_table, [],
//                function (tx, res) {
//                    if (res.rows.length >= 1) {
//                        var data = JSON.parse(res.rows.item(0).user);
//
//                        user_id = res.rows.item(0).id;
//                        username_login = data.username;
//                        email = data.email;
//                        login_menu = menu_text_user;
//
//                        var temp_user_meta = data.company_user_meta;
//                        for(var i=0; i<temp_user_meta.length; i++)
//                        {
//                            var key = temp_user_meta[i]['key'];
//                            var value = temp_user_meta[i]['value'];
//                            if (key.indexOf('_date') !== -1) {
//                                value = new Date(value);
//                            }
//                            user_meta[key] = value;
//                        }
//                    }
//                }
//            );
//        });
//    }

    // update data
    // save to sqlite
}

function updateLocalCompanyUserMeta(userMeta){  // userMeta is JavaScript Object
    // adMobService.initBannerAd();
    // check if any user login data stored in database
    db = window.sqlitePlugin.openDatabase({name: sqlitedb, location: 'default'});

    var userData;
    db.transaction(function (tx) {
        tx.executeSql("SELECT id, user FROM " + user_table, [],
            function (tx, res) {
                if (res.rows.length >= 1) {
                    userData = JSON.parse(res.rows.item(0).user);
                    user_id = res.rows.item(0).id;
                    console.log("*******************");
                    console.log("BEFORE");
                    console.log("*******************");
                    console.log(userData);

                    var temp_user_meta = userData.company_user_meta;
                    for (var a = 0; a < userMeta.length; a++){
                        var targetKey = userMeta[a].key;
                        var targetValue = userMeta[a].value;
                        for (var b = 0; b < temp_user_meta.length; b++){
                            var savedKey = temp_user_meta[b]['key'];
                            if (targetKey === savedKey){
                                userData.company_user_meta[b]['value'] = targetValue;
                                break;
                            }
                        }
                    }
                    console.log(userData);
                    console.log(JSON.stringify(userData));
                }
            },
            function (e) {
                console.log("ERROR GETTING META DATA: " + e.message);
            }
        );

    },function(error) {
        console.log('updateLocalUserMeta ERROR: ' + error.message);
    }, function() {
        console.log('updateLocalUserMeta OK');
    });

    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM ' + user_table);
        tx.executeSql("INSERT INTO " + user_table + " (id, user) VALUES (?,?)", [user_id, JSON.stringify(userData)], function (tx, res) {
            console.log("INPUT USER META DATA SUCCESS!");
        },
        function(e){
            console.log("ERROR INPUT META DATA: " + e.message);
        });
    },function(error) {
        console.log('updateLocalUserMetaINSERT ERROR: ' + error.message);
    }, function() {
        console.log('updateLocalUserMetaINSERT OK');
    });
//
//    db.transaction(function (tx) {
//        tx.executeSql("SELECT id, user FROM " + user_table, [],
//            function (tx, res) {
//                if (res.rows.length >= 1) {
//                    userData = JSON.parse(res.rows.item(0).user);
//                    user_id = res.rows.item(0).id;
//                    console.log("*******************");
//                    console.log("CHECK SAVED DATA");
//                    console.log("*******************");
//                    console.log(userData);
//
//                    var temp_user_meta = userData.company_user_meta;
//                    for (var a = 0; a < userMeta.length; a++){
//                        var targetKey = userMeta[a].key;
//                        var targetValue = userMeta[a].value;
//                        for (var b = 0; b < temp_user_meta.length; b++){
//                            var savedKey = temp_user_meta[b]['key'];
//                            if (targetKey === savedKey){
//                                userData.company_user_meta[b]['value'] = targetValue;
//                                break;
//                            }
//                        }
//                    }
//                    console.log(userData);
//                    console.log(JSON.stringify(userData));
//                }
//            },
//            function (e) {
//                console.log("ERROR GETTING META DATA: " + e.message);
//            }
//        );
//    },function(error) {
//        console.log('updateLocalUserMetaCheck ERROR: ' + error.message);
//    }, function() {
//        console.log('updateLocalUserMetaCheck OK');
//    });
};

function getMenuText(field, defaultText){
    return field !== undefined && field[language] !== undefined ? field[language] : defaultText;
};

function loadUIMenuTexts(options, field, defaultValue){
  var opt = getPostMetaValueById(options, field) !== undefined ? getPostMetaValueById(options, field).value : defaultValue;
  return opt != defaultValue ? JSON.parse(opt) : opt;
};

var getTermMetaValueByKey = function (arr, value) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d].key === value) {
            return arr[d];
        }
    }
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getLoadingTemplate(text) {
    return '<div style="display:flex;justify-content:center;align-items:center;">' + text + '<ion-spinner></ion-spinner></div>';
}

var replaceLanguageMenuList = function($scope) {
  if ($scope.content_data.menus) {
    // console.log($scope.content_data.menus);
    for (var a = 0; a < $scope.content_data.menus.length; a++) {
      var termMeta = $scope.content_data.menus[a].term_meta;
      var meta = getMetaValueById(termMeta, 'lang_title');
      var defaultValue = {
        "english": $scope.content_data.menus[a].title
      };
      var title = JSON.parse(meta !== undefined ? meta.value : JSON.stringify(defaultValue));
      // console.log($scope.content_data.menus[a].title + " " + title[language] + " " + language);
      $scope.content_data.menus[a].title = title[language] == null || title[language] == undefined ? $scope.content_data.menus[a].title : title[language];
    }
  }
  return $scope;
};

var replaceLanguageTitle = function($scope){
  // change title language
  // console.log($scope.content_data);
  var meta = getMetaValueById($scope.content_data.term_meta, 'lang_title');
  var defaultValue = {
    "english": $scope.content_data.title
  };
  var title = JSON.parse(meta !== undefined ? meta.value : JSON.stringify(defaultValue));
  $scope.content_data.title = title[language] == null || title[language] == undefined ? $scope.content_data.title : title[language];

  return $scope;
};

var replaceLanguageMenuHomeDataList = function(data) {
    if (data) {
        for (var a = 0; a < data.length; a++) {
            var termMeta = data[a].term_meta;
            var meta = getMetaValueById(termMeta, 'lang_title');
            var title = JSON.parse(meta !== undefined ? meta.value : '{"english":"' + data[a].title + '"}');
            // console.log($scope.content_data.menus[a].title + " " + title[language] + " " + language);
            data[a].title = title[language] == null || title[language] == undefined ? data[a].title : title[language];
        }
    }
    return data;
}

var replaceLanguagePostTitle = function($scope){
  // change title language
  // console.log($scope.content_data);
  var meta = getMetaValueById($scope.content_data.post_meta, 'lang_title');
  var defaultValue = {
    "english": $scope.content_data.title
  };
  var title = JSON.parse(meta !== undefined ? meta.value : JSON.stringify(defaultValue));
  $scope.content_data.title = title[language] == null || title[language] == undefined ? $scope.content_data.title : title[language];

  return $scope;
};

var reloadTermStaticPageLanguage = function($scope, term_content_type_id){
  if (term_content_type_id == 3) {
    $scope = replaceLanguagePostTitle($scope);
  }
  return $scope;
};

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function isValidDate(strDate) {
    var myDateStr= new Date(strDate);
    if( ! isNaN ( myDateStr.getMonth() ) ) {
       return true;
    }
    return false;
}