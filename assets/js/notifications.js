(function() {
    // --- CONFIGURAÇÃO DE ELITE ---
    const CONFIG = {
        minDelay: 45000,    // Mínimo 45 segundos entre uma e outra
        maxDelay: 90000,    // Máximo 1m 30s (Aleatoriedade humana)
        displayTime: 6000,  // Tempo visível na tela
        maxPerSession: 3,   // Limite real por sessão (salvo no navegador)
        startDelay: 10000   // Primeira notificação após 10s de site aberto
    };

    // --- BANCO DE DADOS (Prova Social) ---
    const data = [
        { name: "Ricardo M.", city: "São Paulo, SP", action: "adquiriu a versão Vitalícia." },
        { name: "Ana Paula", city: "Rio de Janeiro, RJ", action: "garantiu a licença Pro." },
        { name: "Carlos E.", city: "Belo Horizonte, MG", action: "começou a usar o Júpiter." },
        { name: "Fernanda L.", city: "Curitiba, PR", action: "baixou o instalador." },
        { name: "Roberto G.", city: "Porto Alegre, RS", action: "está organizando as finanças." },
        { name: "William B.", city: "Niterói, RJ", action: "aproveitou a oferta." },
        { name: "Anderson G.", city: "Contagem, MG", action: "comprou o Júpiter Smart." },
        { name: "Viviane L.", city: "Osasco, SP", action: "garantiu sua cópia." },
        { name: "Juliana S.", city: "Salvador, BA", action: "tornou-se membro Pro." },
        { name: "Marcos P.", city: "Recife, PE", action: "acabou de comprar." },
        { name: "Patrícia A.", city: "Brasília, DF", action: "garantiu a segurança do PIN." }, 
        { name: "Lucas M.", city: "Florianópolis, SC", action: "migrou para o Pro." },
        { name: "Beatriz C.", city: "Manaus, AM", action: "baixou o software." },
        { name: "Eduardo V.", city: "Goiânia, GO", action: "adquiriu o controle total." },
        { name: "Larissa T.", city: "Fortaleza, CE", action: "garantiu o desconto." },
        { name: "Rafael D.", city: "Campinas, SP", action: "investiu na sua paz financeira." },
        { name: "Sofia R.", city: "Vitória, ES", action: "comprou o Júpiter Pro." },
        { name: "Bruno K.", city: "Joinville, SC", action: "ativou sua licença." }
    ];

    // Verifica Mobile e Limite de Sessão
    if (window.innerWidth <= 768) return;
    
    // Recupera quantas já foram mostradas nesta sessão
    let sessionCount = parseInt(sessionStorage.getItem('jupiter_notif_count') || '0');
    if (sessionCount >= CONFIG.maxPerSession) return;

    // --- INJEÇÃO DE ESTILOS (CSS in JS) ---
    const style = document.createElement('style');
    style.innerHTML = `
        .social-toast {
            position: fixed; 
            bottom: 30px; left: 30px;
            background: #fff;
            border-left: 4px solid #f97316;
            padding: 15px 25px 15px 20px; 
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.12);
            display: flex; align-items: center;
            gap: 15px; z-index: 9999; font-family: 'Inter', sans-serif;
            transform: translateY(100px); 
            opacity: 0; 
            transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
            max-width: 350px; 
            pointer-events: none;
            visibility: hidden; /* Garante que não clica quando invisível */
        }
        .social-toast.visible { 
            transform: translateY(0); 
            opacity: 1; 
            pointer-events: auto;
            visibility: visible;
        }
        
        .st-icon { font-size: 24px; animation: pulseIcon 2s infinite; }
        .st-content { font-size: 0.9rem; line-height: 1.4; color: #334155; }
        .st-name { font-weight: 700; color: #1e293b; }
        .st-time { font-size: 0.75rem; color: #94a3b8; display: block; margin-top: 2px; }
        
        .close-toast { 
            position: absolute; top: 5px; right: 8px; 
            font-size: 16px; cursor: pointer; color: #cbd5e1; 
            width: 20px; height: 20px; text-align: center; line-height: 20px;
        }
        .close-toast:hover { color: #f97316; }

        @keyframes pulseIcon {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Cria o Elemento
    const toast = document.createElement('div');
    toast.className = 'social-toast';
    document.body.appendChild(toast);

    let hideTimeout; // Variável para controlar o timer de esconder

    // --- FUNÇÃO PRINCIPAL ---
    function showToast() {
        // Dupla checagem de limite
        sessionCount = parseInt(sessionStorage.getItem('jupiter_notif_count') || '0');
        if (sessionCount >= CONFIG.maxPerSession) return;

        // Seleciona dados
        const item = data[Math.floor(Math.random() * data.length)];
        const timeAgo = Math.floor(Math.random() * 10) + 2;

        toast.innerHTML = `
            <div class="close-toast">&times;</div>
            <div class="st-icon">🔥</div>
            <div class="st-content">
                <span class="st-name">${item.name}</span> de ${item.city}<br>
                ${item.action}
                <span class="st-time">Há ${timeAgo} minutos</span>
            </div>
        `;

        // Ativação visual
        requestAnimationFrame(() => {
            toast.classList.add('visible');
            
            // Incrementa contador e salva
            sessionCount++;
            sessionStorage.setItem('jupiter_notif_count', sessionCount);
        });

        // Configura o botão de fechar (Matador de bugs)
        const closeBtn = toast.querySelector('.close-toast');
        closeBtn.onclick = (e) => {
            e.stopPropagation(); // Evita conflitos
            forceClose();
        };

        // Timer para esconder (Auto-Hide)
        hideTimeout = setTimeout(() => {
            closeToast();
        }, CONFIG.displayTime);
    }

    // --- FECHAR NOTIFICAÇÃO ---
    function closeToast() {
        toast.classList.remove('visible');
        
        // Limpa qualquer timer pendente para evitar fantasmas
        if(hideTimeout) clearTimeout(hideTimeout);

        // Só agenda a próxima DEPOIS que a atual fechou (Recursividade)
        scheduleNext();
    }

    // --- FECHAR FORÇADO (Pelo usuário) ---
    function forceClose() {
        toast.classList.remove('visible');
        if(hideTimeout) clearTimeout(hideTimeout);
        // Se o usuário fechou, esperamos um pouco mais para mostrar a próxima
        scheduleNext();
    }

    // --- AGENDADOR INTELIGENTE (MOTOR) ---
    function scheduleNext() {
        if (sessionCount >= CONFIG.maxPerSession) return;

        // Gera tempo aleatório entre Min e Max
        const randomDelay = Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay + 1)) + CONFIG.minDelay;
        
        console.log(`Próxima notificação em: ${randomDelay/1000} segundos`); // Debug (pode remover depois)

        setTimeout(showToast, randomDelay);
    }

    // --- PAUSE NO MOUSE (UX PREMIUM) ---
    // Se o usuário passar o mouse, cancela o timer de esconder.
    // Quando tirar o mouse, reinicia o timer.
    toast.addEventListener('mouseenter', () => {
        if(hideTimeout) clearTimeout(hideTimeout);
    });
    
    toast.addEventListener('mouseleave', () => {
        if (toast.classList.contains('visible')) {
            hideTimeout = setTimeout(closeToast, 2000); // Dá mais 2s para ler e some
        }
    });

    // Start Inicial
    setTimeout(showToast, CONFIG.startDelay);

})();