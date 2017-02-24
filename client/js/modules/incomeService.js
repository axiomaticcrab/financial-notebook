angular.module('financialBook').service('incomeService', ['apiService', function (apiService) {

    this.add = function (data) {
        var url = apiService.buildUrl('income', 'add');
        return apiService.makePostRequest(url, data);
    }

    this.remove = function (id) {
        var url = apiService.buildUrl('income', 'remove');
        url = apiService.parameterize(url, id);
        return apiService.makeGetRequest(url);
    }
}]);