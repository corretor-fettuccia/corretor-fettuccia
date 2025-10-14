document.addEventListener('DOMContentLoaded', () => {
    // Função para obter a data e hora formatada
    function getCurrentDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('pt-BR');
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${date} - ${time}`;
    }

    // Atualizar o label com a data e hora atual
    function updateDateTimeLabel() {
        const datetimeLabel = document.getElementById('datetime');
        datetimeLabel.textContent = getCurrentDateTime();
    }

    // Atualizar a cada segundo para manter a data e hora atualizada
    setInterval(updateDateTimeLabel, 1000);

    // Atualizar o label com a data e hora atual na inicialização
    updateDateTimeLabel();
});
