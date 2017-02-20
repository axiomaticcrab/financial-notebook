angular.module('financialBook').controller('appController', ['$scope', 'summaryService', function ($scope, summaryService) {
    console.log('appController started');

    $scope.date = moment().format('MM-YYYY');
    fetchData();

    function fetchData() {
        console.log('date to fetch : ' + $scope.date);
        var summary = summaryService.getSummary($scope.date);

        if (summary) {
            $scope.summary = summary;
        } else {
            $scope.summary = null;
        }
    }

    function addMonth(date, amount) {
        return moment(date, 'MM-YYYY').add(amount, 'M').format('MM-YYYY');
    }

    $scope.nextMonth = function () {
        $scope.date = addMonth($scope.date, 1);
        fetchData();
    }

    $scope.prevMonth = function () {
        $scope.date = addMonth($scope.date, -1);
        fetchData();
    }

    $scope.addIncome = function () {
        console.log('add income');
    }
}]);