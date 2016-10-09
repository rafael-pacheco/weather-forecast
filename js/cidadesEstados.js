window.onload = function () {

    new dgCidadesEstados({
        estado: document.getElementById('estado'),
        cidade: document.getElementById('cidade'),
        estadoVal: '<%=Request("estado") %>',
        cidadeVal: '<%=Request("cidade") %>'
    });
}
