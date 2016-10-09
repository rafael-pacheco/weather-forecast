var app = angular.module("weatherForecasts", []);

if ((localStorage.estadoCache == undefined ) || (localStorage.cidadeCache == undefined )) {
    estado = "SC";
    cidade = "Blumenau";
} else {
    estado = localStorage.estadoCache;
    cidade = localStorage.cidadeCache;
}

app.controller("myCtrlTemp", function ($scope, $http) {
    $http.get("http://developers.agenciaideias.com.br/tempo/json/" + cidade + "-" + estado).success(function (response) {
        $scope.loadForecasting(response, cidade, estado);
    }).error(function (response) {
        $scope.msg = "Não existem previsão do tempo para esta cidade e estado";
        $('#myModal').modal('show');
    });

    $scope.consultationForecasts = function () {
        if (($scope.cidade == undefined) || ($scope.estado == undefined)) {
            $scope.msg = "Informe a cidade e estado para consulta";
            $('#myModal').modal('show');
        }
        else {
            $scope.loadData($scope.cidade, $scope.estado);
            $scope.loading = false;
        }
    }

    $scope.loadData = function (city, state) {
        $http.get("http://developers.agenciaideias.com.br/tempo/json/" + city + "-" + state).success(function (response) {
            $scope.loadForecasting(response, city, state);
        }).error(function (response) {
            $scope.msg = "Não existem previsão do tempo para esta cidade e estado";
            $('#myModal').modal('show');
        });
    }

    $scope.updateForecasts = function ($scope, list) {
        var maximum = 0;
        var minimum = 99;
        var maximumDate;
        var minimumDate;

        for (var i = 0; i < list.length; i++) {
            var day = list[i];
            if (day.temperatura_max > maximum) {
                maximum = day.temperatura_max;
                maximumDate = day.data;
            }
            if (day.temperatura_min < minimum) {
                minimum = day.temperatura_min;
                minimumDate = day.data;
            }
        }
        $scope.max = maximum;
        $scope.dtMax = maximumDate;
        $scope.min = minimum;
        $scope.dtMin = minimumDate;
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
            $scope.withoutWeekend = true;
        }
    }

    $scope.loadChart = function ($scope, lista) {
        var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas);

        var areaChartData = {
            labels: [$scope.copyDayWeek(lista[2].data),
                $scope.copyDayWeek(lista[3].data),
                $scope.copyDayWeek(lista[4].data),
                $scope.copyDayWeek(lista[5].data),
                $scope.copyDayWeek(lista[6].data)],
            datasets: [
                {
                    label: "Electronics",
                    fillColor: "rgba(210, 214, 222, 1)",
                    strokeColor: "rgba(210, 214, 222, 1)",
                    pointColor: "rgba(210, 214, 222, 1)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [lista[2].temperatura_max,
                        lista[3].temperatura_max,
                        lista[4].temperatura_max,
                        lista[5].temperatura_max,
                        lista[6].temperatura_max]
                },
                {
                    label: "Digital Goods",
                    fillColor: "rgba(60,141,188,0.9)",
                    strokeColor: "rgba(60,141,188,0.8)",
                    pointColor: "#3b8bba",
                    pointStrokeColor: "rgba(60,141,188,1)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(60,141,188,1)",
                    data: [lista[2].temperatura_min,
                        lista[3].temperatura_min,
                        lista[4].temperatura_min,
                        lista[5].temperatura_min,
                        lista[6].temperatura_min]
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
            "<span style='background-color: #c1c7d1'></span>" +
            "label1" +
            "</li>" +
            "<li>" +
            "<span style='background-color: #3b8bba'></span>" +
            "label1</li>" +
            "</ul>",
            maintainAspectRatio: true,
            responsive: true
        };
        areaChart.Line(areaChartData, areaChartOptions);
    }

    $scope.saveFavorite = function (cid, est) {
        if ((cid == undefined) || (est == undefined)) {
            $scope.msg = "Informar a cidade e estado para favoritar";
            $('#myModal').modal('show');
        }
        else {
            localStorage.cidadeCache = cid;
            localStorage.estadoCache = est;
            $scope.msg = 'Favorito salvo com sucesso.';
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

    $scope.loadForecasting = function (forecast, city, state) {
        obj = $scope.myData = forecast;
        lista = $.map(obj, function (el) {
            return el
        });
        $scope.updateForecasts($scope, lista);
        $scope.recommendations($scope, lista);
        $scope.loadChart($scope, lista);
        $scope.loading = true;
        $scope.cidadeAtual = city;
        $scope.estadoAtual = state;
    }
});
