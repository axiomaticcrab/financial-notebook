angular.module('financialBook').service('noteService', ['apiService', function (apiService) {

    this.add = function (data) {
        var url = apiService.buildUrl('note', 'add');
        return apiService.makePostRequest(url, data);
    }

    this.remove = function (id) {
        var url = apiService.buildUrl('note', 'remove');
        url = apiService.parameterize(url, id);
        return apiService.makeGetRequest(url);
    }
}]);