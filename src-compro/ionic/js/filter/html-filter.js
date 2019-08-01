app.filter('unsafe', function($sce) {
   return function(str) {
       return $sce.trustAsHtml(str);
   };
});
