document.addEventListener("DOMContentLoaded", function() {
    carregarXML();
});

function carregarXML() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var modelos = xmlDoc.querySelectorAll("modelo");
            var selectModelo = document.getElementById("modelo-select");

            modelos.forEach(function(modelo) {
                var nome = modelo.getAttribute("nome");
                var option = document.createElement("option");
                option.text = nome;
                option.value = nome;
                selectModelo.add(option);
            });
        }
    };
    xhttp.open("GET", "ModelosTexto.xml", true);
    xhttp.send();
}

document.getElementById("modelo-select").addEventListener("change", function() {
    preencherCampos(this.value);
});

function preencherCampos(modeloSelecionado) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var modelo = xmlDoc.querySelector('modelo[nome="' + modeloSelecionado + '"]');
            var textoModelo = modelo.querySelector("texto").textContent;

            var campos = modelo.querySelectorAll("campo");
            var camposDinamicosDiv = document.getElementById("campos-dinamicos");
            camposDinamicosDiv.innerHTML = "";

            campos.forEach(function(campo) {
                var tipo = campo.getAttribute("tipo");
                var id = campo.getAttribute("id");
                var label = document.createElement("label");
                label.textContent = id + ": ";
                var input;

                if (tipo === "datetime-local") {
                    input = document.createElement("input");
                    input.type = tipo;
                    input.id = id;
                    input.name = id;
                    input.min = "2024-06-07 08:00";
                    input.max = "2050-06-14 19:00";
                    camposDinamicosDiv.appendChild(label);
                    camposDinamicosDiv.appendChild(input);
                    flatpickr("#" + id, {
                        enableTime: true,
                        dateFormat: "d/m/Y H:i",
                        // Outras opções personalizadas conforme necessário
                    });
                } else if (tipo === "select") {
                    input = document.createElement("select");
                    // Adicione opções ao select se necessário
                    var places = modelo.querySelectorAll("places > " + id);
                    places.forEach(function(place) {
                        var dados = place.textContent.split(";");
                        var nome = dados[0];
                        var endereco = dados[1];
                        var option = document.createElement("option");
                        option.text = nome;
                        option.value = endereco;
                        input.add(option);
                    });
                    input.id = id;
                    camposDinamicosDiv.appendChild(label);
                    camposDinamicosDiv.appendChild(input);
                } else {
                    input = document.createElement("input");
                    input.type = tipo;
                    input.id = id;
                    camposDinamicosDiv.appendChild(label);
                    camposDinamicosDiv.appendChild(input);
                }

                input.addEventListener("change", function() {
                    atualizarTextoModelo(textoModelo);
                });
            });

            var textareaFixado = document.getElementById("texto-fixado");
            textareaFixado.value = textoModelo;
        }
    };
    xhttp.open("GET", "ModelosTexto.xml", true);
    xhttp.send();
}

function atualizarTextoModelo(textoModelo) {
    var camposDinamicos = document.querySelectorAll("#campos-dinamicos input, #campos-dinamicos select");
    camposDinamicos.forEach(function(campo) {
        var id = campo.id;
        var valor = campo.value;
        var marcador = "[" + id + "]";
        var regex = new RegExp("\\[" + id + "\\]", "g");
        textoModelo = textoModelo.replace(regex, valor);
    });

    var textareaFixado = document.getElementById("texto-fixado");
    textareaFixado.value = textoModelo;
}


document.addEventListener("DOMContentLoaded", function() {
    flatpickr("#datetimepicker", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        // Outras opções personalizadas conforme necessário
    });
});


document.getElementById("copiar-texto").addEventListener("click", function() {
    var textoFixado = document.getElementById("texto-fixado");
  
    textoFixado.select();
    textoFixado.setSelectionRange(0, 99999); /* Para dispositivos móveis */
  
    document.execCommand("copy");
  
    alert("Texto copiado para a área de transferência!\n\n revise antes de enviar ;)");
});

