angular.module('beer', [
  'ui.materialize',
])

.controller('BeerCtrl', ($scope, $http) => {
  $scope.beers = [];
  $scope.search = {
    name: '',
  };

  $http.get('beers.json')
  .then((data) => {
    $scope.beers = data.data;
    console.log($scope.beers);
  });
});
