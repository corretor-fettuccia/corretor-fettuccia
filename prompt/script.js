// Template padrão
const DEFAULT_TEMPLATE = `DESCRIÇÃO PARA SITE (SEM EMOJIS) - MODELO DE ANUNCIO
Quero que você gere exatamente no formato abaixo, seguindo este padrão, SEM usar emojis em nenhuma parte:

Título SEO até 60 caracteres
Meta description (SEO) até 150 caracteres
Descrição completa para o site, no estilo profissional, clara e objetiva, seguindo estrutura específica (abaixo)

Utilize SOMENTE as informações fornecidas a seguir:

✅ INFORMAÇÕES BRUTAS DO IMÓVEL (EU IREI PREENCHER): 
Tipo: [Casa / Apartamento]
Empreendimento: [Nome do empreendimento ou "Nenhum"]
Construtora: [Nome da construtora ou "Nenhuma"]
Dormitórios: [X]
Suíte: [Sim / Não / Quantas]
Banheiros: [X]
Garagem: [X vaga(s)]
Pátio: [Sim / Não]
Pé-direito duplo: [Sim / Não]
Área privativa: [X m²]
Rua: [Nome da rua]
Bairro: [Nome do bairro]
Cidade: [Cidade - Estado]
Posição solar: [Ex.: Frente Oeste]
Perfil: [Novo / Em construção / Usado]
Aceita financiamento: [Sim / Não]
Aceita permuta: [Sim / Não]
Estuda propostas: [Sim / Não]
Características: [lista completa aqui]
Pontos próximos: [escolas, parques, áreas verdes, posto de saúde, Tabaí-Canoas etc.]

✅ INSTRUÇÕES DE PRODUÇÃO

1) TÍTULO SEO (ATÉ 60 CARACTERES)
Formato obrigatório:[Tipo] [X Dorm] | [Relevante 1] | [Relevante 2] | [Diferencial]
Exemplo:Casa 2 Dorm | Suíte | Garagem | Pátio
Sempre SEM emojis.

2) META DESCRIPTION (ATÉ 150 CARACTERES)
Criar frase objetiva, citando:
- cidade
- tipo de imóvel
- principais diferenciais
Sem emojis.

3) DESCRIÇÃO COMPLETA PARA O SITE
Seguir exatamente esta estrutura, SEM emojis:
1. Título descritivo longo
2. Endereço
3. Linha comercial inicial
4. Bloco de informações gerais
5. Medidas (se constar)
6. Texto principal descritivo
7. Tópicos com detalhes do imóvel
8. Diferenciais do imóvel
9. Localização detalhada
10. Pontos de interesse próximos
11. Chamada final

✅ OBSERVAÇÕES IMPORTANTES
• Não usar emojis.
• Não inventar informações.
• Seguir o padrão do texto exemplo.

COM ESTES DADOS FAÇA A FORMATAÇÃO LINEAR COM PONTOS DE DESTAQUE QUE POSSA COPIAR E COLAR

1 - TÍTULO
2 - Descrição do imóvel
3 - SEO título
4 - Descrição SEO
-----------------------------------------------------------------
Segue descrição do imóvel para ser formatado:`;

// Elements
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const toast = document.getElementById('toast');
const copyBtn = document.getElementById('copy-btn');

// Initialize Lucide icons
lucide.createIcons();

// Load saved text or default template
document.addEventListener('DOMContentLoaded', () => {
    const savedText = localStorage.getItem('realEstateTemplate');
    if (savedText) {
        textInput.value = savedText;
    } else {
        textInput.value = DEFAULT_TEMPLATE;
    }
    updateStats();
    textInput.focus();
});

// Auto-save to localStorage
textInput.addEventListener('input', () => {
    localStorage.setItem('realEstateTemplate', textInput.value);
    updateStats();
});

// Update character and word count
function updateStats() {
    const text = textInput.value;
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    charCount.textContent = chars.toLocaleString();
    wordCount.textContent = words.toLocaleString();
    
    // Visual feedback for SEO limits
    if (chars > 60 && chars <= 150) {
        charCount.className = 'text-amber-600';
    } else if (chars > 150) {
        charCount.className = 'text-red-600';
    } else {
        charCount.className = 'text-indigo-600';
    }
}

// Copy functionality
async function copyText() {
    const text = textInput.value;
    
    if (!text.trim()) {
        showToast('Nada para copiar!', 'error');
        return;
    }
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (!successful) throw new Error('Fallback copy failed');
        }
        
        showToast('Texto copiado para área de transferência!', 'success');
        
        // Button feedback
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i><span>COPIADO!</span>`;
        copyBtn.classList.add('bg-emerald-600');
        copyBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        lucide.createIcons();
        
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.classList.remove('bg-emerald-600');
            copyBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            lucide.createIcons();
        }, 2000);
        
    } catch (err) {
        showToast('Erro ao copiar. Tente novamente.', 'error');
        console.error('Copy failed:', err);
    }
}

// Clear text
function clearText() {
    if (confirm('Tem certeza que deseja limpar o texto? (Você pode restaurar o template depois)')) {
        textInput.value = '';
        localStorage.setItem('realEstateTemplate', '');
        updateStats();
        textInput.focus();
    }
}

// Reset to default template
function resetTemplate() {
    if (confirm('Restaurar para o template original? Isso substituirá o texto atual.')) {
        textInput.value = DEFAULT_TEMPLATE;
        localStorage.setItem('realEstateTemplate', DEFAULT_TEMPLATE);
        updateStats();
        showToast('Template restaurado!', 'success');
    }
}

// Download as .txt
function downloadText() {
    const text = textInput.value;
    if (!text.trim()) {
        showToast('Nada para download!', 'error');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `descricao-imovel-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Arquivo baixado!', 'success');
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('i');
    const title = toast.querySelector('p.font-semibold');
    const subtitle = toast.querySelector('p.text-sm');
    
    // Configure based on type
    if (type === 'error') {
        toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 toast-enter z-50';
        icon.setAttribute('data-lucide', 'alert-circle');
        title.textContent = 'Ops!';
        subtitle.textContent = message;
    } else {
        toast.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 toast-enter z-50';
        icon.setAttribute('data-lucide', 'check-circle');
        title.textContent = 'Sucesso!';
        subtitle.textContent = message;
    }
    
    lucide.createIcons();
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.remove('toast-exit');
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyText();
    }
    // Esc to clear (with confirmation handled in function)
    if (e.key === 'Escape' && textInput.value.trim() !== '') {
        if (confirm('Limpar texto?')) {
            clearText();
        }
    }
});
