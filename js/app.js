
/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Suroor Wijdan (suroorwijdan@gmail.com)
*/

function onError(e) {
  console.log(e);
}

var npmSearchApp = angular.module('npmSearchApp', []).filter('author', function() {
  return function(input) {
    return input.split('=')[1];
  };
}).filter('keys', function() {
    return function(input) {
      if (!input) {
        return [];
      }
      return Object.keys(input);
    }
  }).directive('ngEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
        });
      };
    })

// Main Angular controller for app.
function SearchController($scope, $http, $location) {  
  $scope.modules = {};
  $scope.title = 'Find your package';
  $scope.searchTerm = '';
  $scope.resultsLength = 0;
  $scope.loader = false;
  $scope.detailSection = false;
  $scope.currentPackage = {};  
  $scope.searched = false;

  $scope.fetchResults = function(){
    if($scope.searchTerm){
      $scope.loader = true;      
      $http.get('https://www.npmjs.org/search?q=' + $scope.searchTerm).success(function(result){      
          $scope.resultsLength = 0;
          $scope.loader = false;   
          $scope.searched = true;
          $scope.modules = {};
          $(result).find('.search-result.package').each(function(idx ,el){
            $scope.modules[$(el).find('h2').text()] = {};
            $scope.modules[$(el).find('h2').text()].name = $(el).find('h2').text();
            var info = $(el).find('p:first').text().trim().split('\n');
            $scope.modules[$(el).find('h2').text()].version = info[0];
            $scope.modules[$(el).find('h2').text()].author = info[1].trim();       
            $scope.resultsLength ++;  
          });        
      });
    }    
  };
  
  $scope.keys = function(obj){
    return obj? Object.keys(obj) : [];
  }


  $scope.showDetails = function(packageName){
    $scope.detailSection = true;
    $scope.loader = true;
    $scope.currentPackage.name = packageName;

    $http.get('http://registry.npmjs.org/'+ packageName).success(function(result){
        $scope.loader = false;          
        $scope.currentPackage = result;       
    });
  };

  $scope.goBack = function(){
    $scope.detailSection = false;
  }
}


/**
$('.search-result.package:first').find('h2 a').text(); - gives package name
$('.search-result.package:first').find('p:first').text().trim().split('\n');  - gives version and author name array
$('.search-result.package:first').find('p:first').text().trim().split('\n')[1].trim();  - gives sanitized author name

var result  = {};
$('.search-result.package').each(function(el, idx){ 
         result[$(idx).find('h2').text()] = {};
         result[$(idx).find('h2').text()].name = $(idx).find('h2').text();
         var info = $(idx).find('p:first').text().trim().split('\n');
         result[$(idx).find('h2').text()].version = info[0];
         result[$(idx).find('h2').text()].author = info[1].trim();         
});
**/