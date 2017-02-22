angular.module('financialBook').service('expenseService', ['apiService', function (apiService) {

    this.add = function () {

    }

    this.remove = function (id) {
        var url = apiService.buildUrl('expense', 'remove');
        url = apiService.parameterize(url, id);
        return apiService.makeGetRequest(url);
    }
}]);