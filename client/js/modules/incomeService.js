angular.module('financialBook').service('incomeService', ['apiService', function (apiService) {

    this.add = function () {

    }

    this.remove = function (id) {
        var url = apiService.buildUrl('income', 'remove');
        url = apiService.parameterize(url, id);
        return apiService.makeGetRequest(url);
    }
}]);