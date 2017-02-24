angular.module('financialBook').service('apiService', ['$http', function ($http) {
    console.log('apiUriService started');

    var paths = [{
        path: 'http://localhost:3000',
        code: 'base'
    }, {
        path: '/income/',
        code: 'income'
    }, {
        path: '/expense/',
        code: 'expense'
    }, {
        path: '/summary/',
        code: 'summary'
    }, {
        path: '/note/',
        code: 'note'
    }];

    this.getPath = function (pathCode) {

        for (i = 0; i < paths.length; i++) {
            if (paths[i].code === pathCode) {
                return paths[i].path;
            }
        }
        return null;
    };

    this.buildUrl = function (pathCode, methodName) {
        if (pathCode === 'base') {
            return null;
        } else {
            return this.getPath('base').concat(this.getPath(pathCode), methodName);
        }
    };

    this.parameterize = function () {
        var result = '';
        for (i = 0; i < arguments.length; i++) {
            result += arguments[i];
            result += '/'
        }
        return result;
    }

    this.makeGetRequest = function (uri) {
        return $http({
            method: "GET",
            url: uri
        }).then(function (result) {
            return result.data;
        });
    };

    this.makePostRequest = function (uri, data) {
        data = JSON.stringify(data);
        return $http({
            method: "POST",
            url: uri,
            data: data
        }).then(function (result) {
            return result.data;
        });
    };
}]);