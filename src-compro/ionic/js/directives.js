//var app = angular.module('starter.directives', []);


app.directive('compile', function($compile, $sce) {
  // directive factory creates a link function
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
         // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function(value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);

        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      }
    );
  };
});

app.directive('socialShare', function() {
    return {
        restrict: 'E',
        scope: {
            summary: '@summary',
            title: '@title',
            share: '&'
        },
        templateUrl: 'templates/social-share.html'
    }
});

app.directive('commentPane', function ($ionicScrollDelegate) {
    return {
        restrict: 'E',
        scope: false,
        transclude: false,
        templateUrl: 'templates/comment-pane.html'
    }
});

app.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
});

app.directive('shoppingCart', function () {
    return {
        restrict: 'E',
        scope: false,
        transclude: false,
        templateUrl: 'templates/shopping-cart.html'
    }
});

app.directive('wishlistCart', function () {
    return {
        restrict: 'E',
        scope: false,
        transclude: false,
        templateUrl: 'templates/wishlist-cart.html'
    }
});

app.directive('sourceonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$broadcast('src-loaded');
                console.log('SRC Loaded');
            });
            element.bind('error', function(){
                console.log('SRC could not be loaded');
            });
        }
    };
});

app.directive('loadingPane', function () {
    return {
        restrict: 'EA',
        scope: {
            isTimeout: '=timeout',
            isLoading: '=loading',
            isExist: '=exist',
            retry: '&',
            textPleaseWait: '=',
            textSomethingWrong: '=',
            textReloadToRetry: '=',
            textReload: '=',
            textNoDataFound: '='
        },
        templateUrl: 'templates/loading-pane.html'
    };
});

app.directive('map', function () {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: function ($scope, $element, $attr) {
            function initialize() {
                var mapOptions = {
                    center: new google.maps.LatLng(43.07493, -89.381388),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map($element[0], mapOptions);

                $scope.onCreate({map: map});

                // Stop the side bar from dragging when mousedown/tapdown on the map
                google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                    e.preventDefault();
                    return false;
                });
            }

            if (document.readyState === "complete") {
                initialize();
            } else {
                google.maps.event.addDomListener(window, 'load', initialize);
            }
        }
    };
});

app.directive('compareTo', function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});

app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageonload);
            });
            element.bind('error', function(){
                console.log('Failed to load image.');
            });
        }
    };
});
