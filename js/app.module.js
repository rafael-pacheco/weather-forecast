var app = angular.module("minhaPrevisao", []);

if ((localStorage.estadoCache == undefined ) || (localStorage.cidadeCache == undefined )) {
    this.estado = "SC";
    this.cidade = "Blumenau";
} else {
    this.estado = localStorage.estadoCache;
    this.cidade = localStorage.cidadeCache;
}

app.controller("myCtrlTemp", function ($scope, $http) {
    $http.get("http://developers.agenciaideias.com.br/tempo/json/" + this.cidade + "-" + this.estado).success(function (response) {
        $scope.carregaPrevisao(response, this.cidade, this.estado);
    }).error(function (response) {
        $scope.msg = "Não existem previsão do tempo para está cidade e estado";
        $('#myModal').modal('show');
    });

    $scope.consultaPrevisao = function () {
        if (($scope.cidade == undefined) || ($scope.estado == undefined)) {
            $scope.msg = "Informe a cidade e estado para consultar a previsão do tempo.";
            $('#myModal').modal('show');
        }
        else {
            $scope.carregaDados($scope.cidade, $scope.estado);
            $scope.carregando = false;
        }
    }

    $scope.carregaDados = function (cidade, estado) {
        $http.get("http://developers.agenciaideias.com.br/tempo/json/" + cidade + "-" + estado).success(function (response) {
            $scope.carregaPrevisao(response, cidade, estado);
        }).error(function (response) {
            $scope.msg = "Não existem previsão do tempo para está cidade e estado";
            $('#myModal').modal('show');
        });
    }

    $scope.atualizaPrevisoes = function ($scope, lista) {
        var maxima = 0;
        var minima = 99;
        var dataMaxima;
        var dataMinima;

        for (var i = 0; i < lista.length; i++) {
            var dia = lista[i];
            // Temperatura Máxima
            if (dia.temperatura_max > maxima) {
                maxima = dia.temperatura_max;
                dataMaxima = dia.data;
            }
            // Temperatura Mínima
            if (dia.temperatura_min < minima) {
                minima = dia.temperatura_min;
                dataMinima = dia.data;
            }
        }
        $scope.max = maxima;
        $scope.dtMax = dataMaxima;
        $scope.min = minima;
        $scope.dtMin = dataMinima;
    }

    $scope.recomendacoes = function ($scope, lista) {
        $scope.recomendacaoPositivo = "";
        $scope.recomendacaoNegativo = "";
        $scope.finalSemana = false;

        if ($scope.copiaDiaSemana((lista[2].data)) == 'Sábado') {
            temperatura = lista[3].temperatura_max
            if (temperatura >= 25) {
                $scope.recomendacaoPositivo = true;
                $scope.finalSemana = true;
            } else {
                $scope.recomendacaoNegativo = true;
                $scope.finalSemana = true;
            }
        }

        for (var i = 3; i < 7; i++) {
            var dia = "";
            var temperatura = 0;

            dia = lista[i].data;
            dia = $scope.copiaDiaSemana(dia);
            console.log(dia);

            if (dia == "Sábado") {
                temperatura = lista[i].temperatura_max;
                console.log(temperatura);
                if (temperatura >= 25) {
                    $scope.recomendacaoPositivo = true;
                    $scope.finalSemana = true;
                } else {
                    $scope.recomendacaoNegativo = true;
                    $scope.finalSemana = true;
                }
            }
        }

        if ($scope.finalSemana == false) {
            $scope.semFinal = true;
        }
    }

    $scope.carregaGrafico = function ($scope, lista) {
        var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
        var areaChart = new Chart(areaChartCanvas);

        var areaChartData = {
            labels: [$scope.copiaDiaSemana(lista[2].data),
                $scope.copiaDiaSemana(lista[3].data),
                $scope.copiaDiaSemana(lista[4].data),
                $scope.copiaDiaSemana(lista[5].data),
                $scope.copiaDiaSemana(lista[6].data)],
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
            legendTemplate: "<ul class='chart-legend'><li><span style='background-color: #c1c7d1'></span>label1</li><li><span style='background-color: #3b8bba'></span>label1</li></ul>",
            maintainAspectRatio: true,
            responsive: true
        };
        areaChart.Line(areaChartData, areaChartOptions);
    }

    $scope.salvaFavorito = function (cid, est) {
        if ((cid == undefined) || (est == undefined)) {
            $scope.msg = "Informar a cidade e estado para salvar favorito.";
            $('#myModal').modal('show');
        }
        else {
            localStorage.cidadeCache = cid;
            localStorage.estadoCache = est;
            $scope.msg = 'Favorito salvo com sucesso.';
            $('#myModal').modal('show');
        }
    }

    $scope.copiaDiaSemana = function (data) {
        var dia = "";
        for (var i = 0; i < data.length; i++) {
            var str = "";
            var str = (data.charAt(i));
            dia = dia + str;
            if (str == ' ')
                break;
        }
        dia = dia.trim();
        return dia;
    }

    $scope.carregaPrevisao = function (previsao, cidade, estado) {
        obj = $scope.myData = previsao;
        lista = $.map(obj, function (el) {
            return el
        });
        $scope.atualizaPrevisoes($scope, lista);
        $scope.recomendacoes($scope, lista);
        $scope.carregaGrafico($scope, lista);
        $scope.carregando = true;
        $scope.cidadeAtual = cidade;
        $scope.estadoAtual = estado;
    }
});
