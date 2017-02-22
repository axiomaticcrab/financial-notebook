angular.module('financialBook').controller('appController', ['$scope', 'summaryService', 'incomeService', 'expenseService', 'noteService', function ($scope, summaryService, incomeService, expenseService, noteService) {
    console.log('appController started');

    var newIncomeModel = {
        name: '',
        amount: 0,
        toWhere: '',
        installmentAmount: 0,
        inInfinite: false,
    };

    $scope.newIncomeModel = newIncomeModel;

    var newExpenseModel = {

    }

    var newNoteModel = {

    }

    $scope.summary = null;
    $scope.date = moment().format('MM-YYYY');
    fetchData();

    function fetchData() {
        console.log('date to fetch : ' + $scope.date);

        summaryService.getSummary($scope.date).then(function (result) {
            if (result) {
                $scope.summary = result;

                if ($scope.summary.balance < 0) {
                    $scope.isNegative = true;
                } else {
                    $scope.isNegative = false;
                }
            } else {
                $scope.summary = null;
            }
            console.log($scope.summary);
        });
    };

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

    $scope.addExpense = function () {

    }

    $scope.addNote = function () {

    }

    $scope.removeIncome = function (item) {
        incomeService.remove(item._id).then(function (result) {
            if (result) {
                fetchData();
            } else {
                $scope.error = true;
            }
        });
    }

    $scope.removeExpense = function (item) {
        expenseService.remove(item.expenseId).then(function (result) {
            if (result) {
                fetchData();
            } else {
                $scope.error = true;
            }
        });
    }

    $scope.removeNote = function (item) {
        noteService.remove(item._id).then(function (result) {
            if (result) {
                fetchData();
            } else {
                $scope.error = true;
            }
        });
    }
}]);