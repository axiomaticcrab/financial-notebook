angular.module('financialBook').controller('appController', ['$scope', 'summaryService', 'incomeService', 'expenseService', 'noteService', function (
    $scope,
    summaryService,
    incomeService,
    expenseService,
    noteService) {


    function NoteModel() {
        this.date = '';
        this.text = '';
    };

    function ExpenseModel() {
        this.name = '';
        this.date = '';
        this.amount = 0;
        this.toWhere = '';
        this.installmentAmount = 0;
        this.isInfinite = false;
    }

    function IncomeModel() {
        this.name = '';
        this.amount = 0;
        this.date = "";
        this.isInfinite = false;
    }


    $scope.newIncomeModel = new IncomeModel();
    $scope.newExpenseModel = new ExpenseModel();
    $scope.newNoteModel = new NoteModel();

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
        $scope.newIncomeModel.date = $scope.date;
        incomeService.add($scope.newIncomeModel).then(function (result) {
            if (result) {
                fetchData();
                $('#addIncomeModal').modal('hide');
                $scope.newIncomeModel = new IncomeModel();
            } else {
                console.log('error');
            }
        });
    }

    $scope.addExpense = function () {
        $scope.newExpenseModel.date = $scope.date;

        if ($scope.newExpenseModel.isInfinite) {
            $scope.newExpenseModel.installmentAmount = -1;
        }

        delete $scope.newExpenseModel.isInfinite;
        expenseService.add($scope.newExpenseModel).then(function (result) {
            if (result) {
                fetchData();
                $('#addExpenseModal').modal('hide');
                $scope.newExpenseModel = new ExpenseModel();
            } else {
                console.log('error');
            }
        });
    }

    $scope.addNote = function () {
        $scope.newNoteModel.date = $scope.date;
        noteService.add($scope.newNoteModel).then(function (result) {
            if (result) {
                fetchData();
                $('#addNoteModal').modal('hide');
                $scope.newNoteModel = new NoteModel();
            } else {
                console.log('error');
            }
        });
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