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
  });

  $scope.searchFromStart = (input) => {
    const regex = new RegExp(`^${$scope.search.name}.+`, 'i')
    const matches = input.name.match(regex);
    if (matches === null) {
      return false
    }
    return matches.length > 0;
  };
});
