angular.module('financialBook').service('summaryService', ['apiService', function (apiService) {
    console.log('summaryService started');

    this.getSummary = function (date) {
        var url = apiService.buildUrl('summary', 'get');
        url = apiService.parameterize(url, date);
        return apiService.makeGetRequest(url);
    }
}]);