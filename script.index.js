document.addEventListener("DOMContentLoaded", function() {
  // Função para carregar o arquivo XML usando fetch
  function loadXMLDoc(filename) {
    return fetch(filename)
      .then(response => response.text())
      .then(str => new DOMParser().parseFromString(str, "text/xml"));
  }

  // Função para adicionar ao Link comportamento do target quando setado no XML
  function adicionarTarget(valorTarget) {
    if (["_blank", "_self", "_parent", "_top"].includes(valorTarget)) {
      return valorTarget; // O valor do atributo "target" já está correto, não precisamos fazer nada
    } else {
      return "_self"; // Atribui o valor padrão "_self" ao atributo "target"
    }
  }

  // Função para construir o menu a partir do XML
  function buildMenu(xmlDoc) {
    var menuItems = xmlDoc.getElementsByTagName("Item");
    var menu = document.getElementById("menu");

    for (var i = 0; i < menuItems.length; i++) {
      var itemName = menuItems[i].getAttribute("name");
      var itemLink = menuItems[i].getAttribute("link");
      var itemTarget = menuItems[i].getAttribute("target");

      var li = document.createElement("li");
      var a = document.createElement("a");
      a.textContent = itemName;
      a.href = itemLink || "#"; // Adiciona o link se existir, senão usa #
      a.target = adicionarTarget(itemTarget);

      li.appendChild(a);

      var subitems = menuItems[i].getElementsByTagName("SubItem");
      if (subitems.length > 0) {
        var ul = document.createElement("ul");
        ul.classList.add("submenu");

        for (var j = 0; j < subitems.length; j++) {
          var subitemName = subitems[j].getAttribute("name");
          var subitemLink = subitems[j].getAttribute("link");
          var subitemTarget = subitems[j].getAttribute("target");

          var subli = document.createElement("li");
          var suba = document.createElement("a");
          suba.textContent = subitemName;
          suba.href = subitemLink || "#"; // Adiciona o link se existir, senão usa #
          suba.target = adicionarTarget(subitemTarget);

          subli.appendChild(suba);

          var subsubitems = subitems[j].getElementsByTagName("SubSubItem");
          if (subsubitems.length > 0) {
            var subul = document.createElement("ul");
            subul.classList.add("submenu");

            for (var k = 0; k < subsubitems.length; k++) {
              var subsubitemName = subsubitems[k].getAttribute("name");
              var subsubitemLink = subsubitems[k].getAttribute("link");
              var subsubitemTarget = subsubitems[k].getAttribute("target");

              var subsubli = document.createElement("li");
              var subsuba = document.createElement("a");
              subsuba.textContent = subsubitemName;
              subsuba.href = subsubitemLink || "#"; // Adiciona o link se existir, senão usa #
              subsuba.target = adicionarTarget(subsubitemTarget);

              subsubli.appendChild(subsuba);
              subul.appendChild(subsubli);
            }

            subli.appendChild(subul);
          }

          ul.appendChild(subli);
        }

        li.appendChild(ul);
      }

      menu.appendChild(li);
    }
  }

  // Adiciona evento de clique para mostrar/ocultar o submenu
  document.getElementById("menu").addEventListener("click", function(event) {
    var target = event.target;
    var submenu = target.nextElementSibling;
    if (submenu && submenu.classList.contains("submenu")) {
      submenu.classList.toggle("opened");
    }
  });

  // Adiciona evento de clique no documento para fechar o submenu ao clicar fora do menu
  document.addEventListener("click", function(event) {
    var clickedElement = event.target;
    if (!clickedElement.closest("#menu")) {
      document.querySelectorAll(".submenu").forEach(function(submenu) {
        submenu.classList.remove("opened");
      });
    }
  });

  // Carregar o XML e construir o menu quando a página for carregada
  loadXMLDoc("menu.index.xml")
    .then(xmlDoc => buildMenu(xmlDoc))
    .catch(error => console.error("Erro ao carregar XML:", error));

  // Adicionar o atributo target="_blank" para todos os links
  var links = document.querySelectorAll("a"); // Seleciona todos os elementos <a>
  links.forEach(function(link) {
    link.setAttribute("target", "_blank");
  });
});