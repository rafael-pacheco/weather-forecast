var app = angular.module("myForecast", []);

if ((localStorage.estadoCache == undefined ) || (localStorage.cityCache == undefined )) {
    state = "SC";
    city = "Blumenau";
} else {
    state = localStorage.estadoCache;
    city = localStorage.cityCache;
}

app.controller("myCtrlTemp", function ($scope, $http) {
    $http.get("http://developers.agenciaideias.com.br/tempo/json/" + city + "-" + state).success(function (response) {
        $scope.carriesForecast(response, city, state);
    }).error(function (response) {
        $scope.message = "Não existem previsões do tempo para esta cidade e estado";
        $('#myModal').modal('show');
    });

    $scope.predictionQuery = function () {
        if (($scope.city == undefined) || ($scope.state == undefined)) {
            $scope.message = "Informe a cidade e estado para consultar a previsão do tempo.";
            $('#myModal').modal('show');
        }
        else {
            $scope.loadData($scope.city, $scope.state);
            $scope.loading = false;
        }
    }

    $scope.loadData = function (city, state) {
        $http.get("http://developers.agenciaideias.com.br/tempo/json/" + this.city + "-" + this.state).success(function (response) {
            $scope.carriesForecast(response, this.city, this.state);
        }).error(function (response) {
            $scope.message = "Não existem previsões do tempo para está ciade e estado";
            $('#myModal').modal('show');
        });
    }

    $scope.updatedForecasts = function ($scope, list) {
        var maxima = 0;
        var minimum = 99;
        var dateMaxima;
        var dateMinimum;

        for (var i = 0; i < list.length; i++) {
            var day = list[i];
            if (day.temperatura_max > maxima) {
                maxima = day.temperatura_max;
                dateMaxima = day.data;
            }
            if (day.temperatura_min < minimum) {
                minimum = day.temperatura_min;
                dateMinimum = day.data;
            }
        }
        $scope.max = maxima;
        $scope.dtMax = dateMaxima;
        $scope.min = minimum;
        $scope.dtMin = dateMinimum;
    }

    $scope.recommendations = function ($scope, list) {
        $scope.positiveRecommendation = "";
        $scope.negativeRecommendation = "";
        $scope.weekend = false;

        if ($scope.copyDayWeek((list[2].data)) == 'Sábado') {
            temperature = list[3].temperatura_max
            if (temperature >= 25) {
                $scope.positiveRecommendation = true;
                $scope.weekend = true;
            } else {
                $scope.negativeRecommendation = true;
                $scope.weekend = true;
            }
        }

        for (var i = 3; i < 7; i++) {
            var day = "";
            var temperature = 0;

            day = list[i].data;
            day = $scope.copyDayWeek(day);
            console.log(day);

            if (day == "Sábado") {
                temperature = list[i].temperatura_max;
                console.log(temperature);
                if (temperature >= 25) {
                    $scope.positiveRecommendation = true;
                    $scope.weekend = true;
                } else {
                    $scope.negativeRecommendation = true;
                    $scope.weekend = true;
                }
            }
        }

        if ($scope.weekend == false) {
            $scope.noWeekend = true;
        }
    }

    $scope.graphicalLoads = function ($scope, list) {
        var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas);

        var areaChartData = {
            labels: [$scope.copyDayWeek(list[2].data), $scope.copyDayWeek(list[3].data), $scope.copyDayWeek(list[4].data), $scope.copyDayWeek(list[5].data), $scope.copyDayWeek(list[6].data)],
            datasets: [
                {
                    label: "Electronics",
                    fillColor: "rgba(210, 214, 222, 1)",
                    strokeColor: "rgba(210, 214, 222, 1)",
                    pointColor: "rgba(210, 214, 222, 1)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [list[2].temperatura_max, list[3].temperatura_max, list[4].temperatura_max, list[5].temperatura_max, list[6].temperatura_max]
                },
                {
                    label: "Digital Goods",
                    fillColor: "rgba(60,141,188,0.9)",
                    strokeColor: "rgba(60,141,188,0.8)",
                    pointColor: "#3b8bba",
                    pointStrokeColor: "rgba(60,141,188,1)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(60,141,188,1)",
                    data: [list[2].temperatura_min, list[3].temperatura_min, list[4].temperatura_min, list[5].temperatura_min, list[6].temperatura_min]
                }
            ]
        };

        var areaChartOptions = {
            showScale: true,
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve: true,
            bezierCurveTension: 0.3,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            legendTemplate: "" +
            "<ul class='chart-legend'>" +
            "<li>" +
            "<span style='background-color: #c1c7d1'></span>label1" +
            "</li>" +
            "<li>" +
            "<span style='background-color: #3b8bba'></span>label1" +
            "</li>" +
            "</ul>",
            maintainAspectRatio: true,
            responsive: true
        };
        areaChart.Line(areaChartData, areaChartOptions);
    }

    $scope.saveFavorite = function (city, state) {
        if ((city == undefined) || (state == undefined)) {
            $scope.message = "Informar a cidade e estado para salvar como favorito.";
            $('#myModal').modal('show');
        }
        else {
            localStorage.cityCache = city;
            localStorage.estadoCache = state;
            $scope.message = 'Cidade favorita salva com sucesso.';
            $('#myModal').modal('show');
        }
    }

    $scope.copyDayWeek = function (date) {
        var day = "";
        for (var i = 0; i < date.length; i++) {
            var str = "";
            var str = (date.charAt(i));
            day = day + str;
            if (str == ' ')
                break;
        }
        day = day.trim();
        return day;
    }

    $scope.carriesForecast = function (forecast, city, state) {
        obj = $scope.myData = forecast;
        list = $.map(obj, function (el) {
            return el
        });
        $scope.updatedForecasts($scope, list);
        $scope.recommendations($scope, list);
        $scope.graphicalLoads($scope, list);
        $scope.loading = true;
        $scope.actualCity = city;
        $scope.actualState = state;
    }
});
