        document.addEventListener('DOMContentLoaded', () => {
            const columnsContainer = document.getElementById('columns');
            const averageElement = document.getElementById('average');
            const numColumns = 6;
            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            // Inicializa o gráfico
            const ctx = document.getElementById('chart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months.slice(0, numColumns), // Ajustado para usar apenas os meses correspondentes ao número de colunas
                    datasets: [{
                        label: '',
                        data: Array(numColumns).fill(0),
                        backgroundColor: '#black',
                        borderColor: '#black',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Inicializa as colunas
            for (let i = 0; i < numColumns; i++) {
                createColumn(i);
            }

            // Define os valores padrão dos selects
            setDefaultSelectValues();

            // Atualiza o chart após definir os valores padrão dos selects
            updateChartLabels();

            function createColumn(index) {
                const column = document.createElement('div');
                column.classList.add('column');
                column.dataset.index = index;

                const header = document.createElement('div');
                header.classList.add('header');

                // Select para escolher o mês
                const monthSelect = document.createElement('select');
                months.forEach((month, idx) => {
                    const option = document.createElement('option');
                    option.value = idx;
                    option.textContent = month;
                    monthSelect.appendChild(option);
                });
                header.appendChild(monthSelect);

                column.appendChild(header);

                const totalRow = document.createElement('div');
                totalRow.classList.add('total-row');
                totalRow.textContent = 'Total: R$ 0,00';

                column.appendChild(totalRow);

                const countRow = document.createElement('div');
                countRow.classList.add('count-row');
                countRow.textContent = 'Número de registros: 0';

                column.appendChild(countRow);

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Adicionar valor';
                input.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        const value = parseFloat(input.value.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                        if (!isNaN(value)) {
                            addEntry(column, value);
                            input.value = '';
                        }
                    }
                });

                input.addEventListener('input', (event) => {
                    let value = event.target.value.replace(/\D/g, '');
                    value = (value / 100).toFixed(2) + '';
                    value = value.replace('.', ',');
                    value = value.replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
                    event.target.value = 'R$ ' + value;
                });

                column.appendChild(input);
                columnsContainer.appendChild(column);

                // Atualiza os selects das colunas subsequentes
                monthSelect.addEventListener('change', () => {
                    let nextMonthIndex = parseInt(monthSelect.value) + 1;
                    if (nextMonthIndex >= months.length) nextMonthIndex = 0;
                    const nextColumns = document.querySelectorAll('.column:nth-child(n+' + (index + 2) + ') .header select');
                    nextColumns.forEach(select => {
                        select.value = nextMonthIndex;
                        nextMonthIndex = (nextMonthIndex + 1) % months.length;
                    });
                    updateChartLabels(); // Atualiza o chart quando o valor do select é alterado
                });

                // Desabilita os selects exceto o primeiro
                if (index !== 0) {
                    monthSelect.disabled = true;
                }
            }

            function addEntry(column, value) {
                const entry = document.createElement('div');
                entry.classList.add('entry');

                const valueSpan = document.createElement('span');
                valueSpan.classList.add('entry-value');
                valueSpan.textContent = formatCurrency(value);

                const actions = document.createElement('div');
                actions.classList.add('actions');

                const editButton = document.createElement('button');
                editButton.textContent = '✏️';
                editButton.addEventListener('click', () => {
                    const newValueStr = prompt('Editar valor:', formatCurrency(value));
                    const newValue = parseFloat(newValueStr.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                    if (!isNaN(newValue)) {
                        const difference = newValue - value;
                        value = newValue;
                        valueSpan.textContent = formatCurrency(value);
                        updateTotal(column, difference);
                    }
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️';
                deleteButton.addEventListener('click', () => {
                    entry.remove();
                    updateTotal(column, -value);
                    updateCount(column, -1); // Atualiza a contagem ao excluir um registro
                });

                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                entry.appendChild(valueSpan);
                entry.appendChild(actions);
                column.insertBefore(entry, column.lastElementChild.previousElementSibling); // Insere antes do último elemento (countRow)

                updateTotal(column, value);
                updateCount(column, 1); // Atualiza a contagem ao adicionar um registro
            }

            function updateTotal(column, difference) {
                const totalRow = column.querySelector('.total-row');
                let total = parseFloat(totalRow.textContent.replace('Total: R$', '').replace(/\./g, '').replace(',', '.'));
                total += difference;
                totalRow.textContent = 'Total: ' + formatCurrency(total);
                updateAverage();
            }

            function updateCount(column, difference) {
                const countRow = column.querySelector('.count-row');
                let count = parseInt(countRow.textContent.replace('Número de registros: ', ''));
                count += difference;
                countRow.textContent = 'Número de registros: ' + count;
            }

            function updateAverage() {
                const totals = document.querySelectorAll('.total-row');
                let sum = 0;
                const chartData = [];

                totals.forEach((total, index) => {
                    const value = parseFloat(total.textContent.replace('Total: R$', '').replace(/\./g, '').replace(',', '.'));
                    sum += value;
                    chartData[index] = value;
                });

                const average = sum / numColumns;
                averageElement.textContent = 'Média dos Totais: ' + formatCurrency(average);

                myChart.data.datasets[0].data = chartData;
                myChart.update();
            }

            function formatCurrency(value) {
                return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');
            }

            function setDefaultSelectValues() {
                const selectColumns = document.querySelectorAll('.column select');
                selectColumns.forEach((select, index) => {
                    select.value = index;
                });
            }

            function updateChartLabels() {
                const chartLabels = myChart.data.labels;
                const selectColumns = document.querySelectorAll('.column select');
                selectColumns.forEach((select, index) => {
                    const monthIndex = parseInt(select.value);
                    chartLabels[index] = months[monthIndex];
                });
                myChart.update();
            }

            // Função para exportar os dados
            function exportData() {
                const data = {
                    columns: []
                };
                const columns = document.querySelectorAll('.column');
                columns.forEach(column => {
                    const monthSelect = column.querySelector('select');
                    const totalRow = column.querySelector('.total-row');
                    const countRow = column.querySelector('.count-row'); // Adiciona a linha de contagem
                    const entries = column.querySelectorAll('.entry-value');
                    const columnData = {
                        month: monthSelect.value,
                        total: totalRow.textContent.replace('Total: R$', '').replace(/\./g, '').replace(',', '.'),
                        count: countRow.textContent.replace('Número de registros: ', ''), // Adiciona a contagem ao exportar
                        values: []
                    };
                    entries.forEach(entry => {
                        columnData.values.push(entry.textContent.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                    });
                    data.columns.push(columnData);
                });
                const dataStr = JSON.stringify(data, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.json';
                a.click();
            }

            // Função para importar os dados
            function importData(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data = JSON.parse(e.target.result);
                        if (data.columns) {
                            columnsContainer.innerHTML = ''; // Limpa as colunas existentes
                            data.columns.forEach((columnData, index) => {
                                createColumn(index);
                                const column = columnsContainer.children[index];
                                const monthSelect = column.querySelector('select');
                                const totalRow = column.querySelector('.total-row');
                                const countRow = column.querySelector('.count-row'); // Adiciona a linha de contagem
                                monthSelect.value = columnData.month;
                                totalRow.textContent = 'Total: R$ ' + parseFloat(columnData.total).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');
                                countRow.textContent = 'Número de registros: ' + columnData.count; // Define a contagem ao importar

                                // Adiciona as entradas sem atualizar novamente o total e a contagem
                                columnData.values.forEach(value => {
                                    addEntryWithoutUpdate(column, parseFloat(value));
                                });
                            });
                            updateChartLabels(); // Atualiza o chart com os novos dados
                        }
                    };
                    reader.readAsText(file);
                }
            }

            // Função para adicionar entrada sem atualizar total e contagem
            function addEntryWithoutUpdate(column, value) {
                const entry = document.createElement('div');
                entry.classList.add('entry');

                const valueSpan = document.createElement('span');
                valueSpan.classList.add('entry-value');
                valueSpan.textContent = formatCurrency(value);

                const actions = document.createElement('div');
                actions.classList.add('actions');

                const editButton = document.createElement('button');
                editButton.textContent = '✏️';
                editButton.addEventListener('click', () => {
                    const newValueStr = prompt('Editar valor:', formatCurrency(value));
                    const newValue = parseFloat(newValueStr.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                    if (!isNaN(newValue)) {
                        const difference = newValue - value;
                        value = newValue;
                        valueSpan.textContent = formatCurrency(value);
                        updateTotal(column, difference);
                    }
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️';
                deleteButton.addEventListener('click', () => {
                    entry.remove();
                    updateTotal(column, -value);
                    updateCount(column, -1); // Atualiza a contagem ao excluir um registro
                });

                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                entry.appendChild(valueSpan);
                entry.appendChild(actions);
                column.insertBefore(entry, column.lastElementChild.previousElementSibling); // Insere antes do último elemento (countRow)
            }

            document.getElementById('exportButton').addEventListener('click', exportData);
            document.getElementById('importButton').addEventListener('click', () => document.getElementById('importInput').click());
            document.getElementById('importInput').addEventListener('change', importData);
        });
