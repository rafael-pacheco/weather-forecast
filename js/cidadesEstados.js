window.onload = function () {

    new dgCidadesEstados({
        estado: document.getElementById('state'),
        cidade: document.getElementById('city'),
        estadoVal: '<%=Request("state") %>',
        cidadeVal: '<%=Request("city") %>'
    });
}
