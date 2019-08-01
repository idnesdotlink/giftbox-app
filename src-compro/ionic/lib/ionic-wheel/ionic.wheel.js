/*
 * Heavily modified by Ericko Yap @2016
 * 1. Added $watch to refresh directive, because loading is slow.
 * 2. Code based on ionic-wheel bug fix by alastairparagas 
 * 3. Added snap angle when drag end (bug happens if menus.length != 4)
 * 
 */

angular.module('ionic.wheel', [])
  .directive('ionWheel', function($ionicGesture, $timeout) {

    return {
      restrict: 'E',
      template: '<div id="ionic-wheel" ng-transclude></div>',
      transclude: true,
      link: function($scope, $element, $attr) {
        $scope.$watch('content_data',function(newValue, oldValue){
           
//           console.log("*** OLD VALUE: ***");
//           console.log(oldValue);
//           console.log("*** NEW VALUE: ***");
//           console.log(newValue);
//           if (oldValue != undefined)
//           console.log("*** VALUE SAME? " + (newValue.title == oldValue.title));
           if (oldValue == undefined || (oldValue != undefined && newValue.title == oldValue.title))
           $timeout(function () {
//               console.log("Rewrite directive...");
                var updatedAngle = 0,
                    originalAngle = -90,
                    currentAngle = -90;
                /**
                 * Get elements
                 */
//                var templateTitle = newValue == undefined ? '' : '-' + newValue.title;
                var circle = $element[0],
                    circles = document.getElementsByClassName('ionic-wheel-circle'),// + templateTitle),
                    circleDimensions = circle.getBoundingClientRect(),
                    transcludeDiv = document.getElementById('ionic-wheel'),
                    centerCircle = document.getElementById('activate');
                /**
                 * Position circles around parent circle
                 */

                var theta = [];

                var n = oldValue != undefined ? oldValue.menus.length : circles.length;
                
                var winDiv = window.getComputedStyle(transcludeDiv);
//                console.log(winDiv);
//                console.log(circles[0]);
//                console.log("Total Menus on Watch: " + n);
                var r = (winDiv.height.slice(0, -2) / 2) - (circles[0] != undefined ? (window.getComputedStyle(circles[0]).height.slice(0, -2) / 2) : 0);
//                                
//                for (var i = n; i > 0; i--) {
//                    console.log(circles[i]);
//                }
                var frags = 360 / n;
                for (var i = n; i > 0; i--) {
                    theta.push((frags / 180) * i * Math.PI);
                }

                var mainHeight = parseInt(winDiv.height.slice(0, -2)) / 1.25;

                for (var i = 0; i < circles.length; i++) {
                  circles[i].posx = Math.round(r * (Math.cos(theta[i]))) + 'px';
                  circles[i].posy = Math.round(r * (Math.sin(theta[i]))) + 'px';
                  circles[i].style.top = ((mainHeight / 2) - parseInt(circles[i].posy.slice(0, -2))) + 'px';
                  circles[i].style.left = ((mainHeight / 2 ) + parseInt(circles[i].posx.slice(0, -2))) + 'px';
                }
                
                var rotateAngle = -90;
                circle.style.transform = circle.style.webkitTransform  = 'rotate(' + rotateAngle + 'deg)';
                                
                for (var i = 0; i < circles.length; i++) {                  
                  circles[i].style.opacity = 1;
                  circles[i].style.transform = circles[i].style.webkitTransform = 'rotate(' + -rotateAngle + 'deg)';
               }  

                /**
                 * Rotate circle on drag
                 */

                var center = {
                  x: circleDimensions.left + circleDimensions.width / 2,
                  y: circleDimensions.top + circleDimensions.height / 2
                };

                var getAngle = function(x, y){
                  var deltaX = x - center.x,
                      deltaY = y - center.y,
                      angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                  if(angle < 0) {
                    angle = angle + 360;
                  }

                  return angle;
                };


                $ionicGesture.on('dragstart', function(e){
                  var pageX = e.gesture.touches[0].pageX;
                  var pageY = e.gesture.touches[0].pageY;
                  updatedAngle = getAngle(pageX, pageY);
                }, angular.element(circle));

                $ionicGesture.on('drag', function(e){

                  e.gesture.srcEvent.preventDefault();

                  var pageX = e.gesture.touches[0].pageX;
                  var pageY = e.gesture.touches[0].pageY;

                  currentAngle = getAngle(pageX, pageY) - updatedAngle + originalAngle;

                  circle.style.transform = circle.style.webkitTransform  = 'rotate(' + currentAngle + 'deg)';

                  for (var i = 0; i < circles.length; i++) {
                    circles[i].style.transform = circles[i].style.webkitTransform = 'rotate(' + -currentAngle + 'deg)';
                  }              
                  //centerCircle.style.transform = centerCircle.style.webkitTransform  = 'rotate(' + -currentAngle + 'deg)';
                }, angular.element(circle));

                $ionicGesture.on('dragend', function(e){
                    originalAngle = currentAngle;
                  
                    var totalMenu = circles.length;
                    var menuDeg = 360/totalMenu;
                    var snapOffset = 90 - menuDeg;
//                    console.log(currentAngle  + " " + menuDeg + " " + (currentAngle / menuDeg) + " " + Math.round(currentAngle / menuDeg));
                    var snapAngle = Math.round((currentAngle+snapOffset) / menuDeg) * menuDeg - snapOffset;
                    originalAngle = snapAngle;
//                    console.log('*** snapAngle: ' + snapAngle);

                    circle.style.transform = circle.style.webkitTransform  = 'rotate(' + snapAngle + 'deg)';

                    for (var i = 0; i < circles.length; i++) {
                      circles[i].style.transform = circles[i].style.webkitTransform = 'rotate(' + -snapAngle + 'deg)';
                    }   
                }, angular.element(circle));
            }, 16);
        });
        
      }
    };

  });