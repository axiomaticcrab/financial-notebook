angular.module('financialBook').service('noteService', ['apiService', function (apiService) {

    this.add = function () {

    }

    this.remove = function (id) {
        var url = apiService.buildUrl('note', 'remove');
        url = apiService.parameterize(url, id);
        return apiService.makeGetRequest(url);
    }
}]);