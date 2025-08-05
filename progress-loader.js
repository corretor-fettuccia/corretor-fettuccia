(function() {
    // Função para inicializar o plugin de carregamento
    function initProgressLoader() {
        // Cria o container de carregamento
        var loadingContainer = document.createElement('div');
        loadingContainer.id = 'loading-container';

        // Cria o círculo de carregamento
        var loadingCircle = document.createElement('div');
        loadingCircle.id = 'loading-circle';

        // Cria o gráfico de pizza e o texto de porcentagem
        var progressCircle = document.createElement('div');
        progressCircle.className = 'progress-circle';

        var percentageText = document.createElement('span');
        percentageText.id = 'percentage-text';
        percentageText.innerText = '0%'; // Inicializa em 0%

        // Cria a mensagem de "Carregando"
        var loadingMessage = document.createElement('div');
        loadingMessage.id = 'loading-message';
        loadingMessage.innerText = 'Carregando...'; // Mensagem ao redor do círculo

        // Adiciona o texto ao círculo
        progressCircle.appendChild(percentageText);
        loadingCircle.appendChild(progressCircle);
        loadingCircle.appendChild(loadingMessage);
        loadingContainer.appendChild(loadingCircle);

        // Adiciona o container ao body
        document.body.appendChild(loadingContainer);

        // Função para atualizar o progresso
        function updateProgress(percentage) {
            percentageText.innerText = percentage + '%'; // Atualiza o texto
            progressCircle.style.setProperty('--percentage', percentage + '%'); // Atualiza o gráfico
        }

        // Simula o progresso de carregamento (você pode trocar pela lógica de carregamento real)
        let loadPercentage = 0;
        let interval = setInterval(function() {
            loadPercentage += 5; // Incremento do carregamento (simulado)
            if (loadPercentage >= 100) {
                loadPercentage = 100;
                clearInterval(interval);
                loadingContainer.classList.add('fade-out'); // Adiciona animação de fade-out
                setTimeout(function() {
                    loadingContainer.remove(); // Remove o loader após o fade-out
                }, 600); // Tempo da animação
            }
            updateProgress(loadPercentage); // Atualiza o gráfico
        }, 200);

        // Quando todos os recursos da página estiverem carregados
        window.addEventListener('load', function() {
            clearInterval(interval);
            updateProgress(100); // Força 100% no final
            loadingContainer.classList.add('fade-out');
            setTimeout(function() {
                loadingContainer.remove(); // Remove o loader
            }, 600);
        });
    }

    // Exponha a função como um método global para ser chamado
    window.ProgressLoader = {
        init: initProgressLoader
    };
})();

