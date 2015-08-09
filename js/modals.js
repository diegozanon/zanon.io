angular.module('zanonApp').controller('HeaderController', function ($scope, $modal) {

  $scope.about = function (size) {    

    var modalInstance = $modal.open({
      templateUrl: 'modal.html',
      controller: 'ModalInstanceController',
      size: size
    });
  };
});

angular.module('zanonApp').controller('ModalInstanceController', function ($scope, $modalInstance) {
  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };  
});