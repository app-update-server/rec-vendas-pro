(function() {
    // 1. Bloqueio Mobile: Se for celular, nem carrega o script (Evita irritação em tela pequena)
    if (window.innerWidth <= 768) return;

    // 2. Verifica se já mostrou (Memória Persistente)
    // Se o usuário já fechou uma vez, não mostramos nunca mais para não ser chato.
    if (localStorage.getItem('jupiter_exit_shown') === 'true') return;

    // --- INJEÇÃO DE CSS (Estilos) ---
    const style = document.createElement('style');
    style.innerHTML = `
        .exit-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.95); /* Fundo mais escuro para foco total */
            z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: opacity 0.3s;
            backdrop-filter: blur(5px);
        }
        .exit-overlay.visible { opacity: 1; visibility: visible; }
        
        .exit-modal {
            background: white; width: 90%; max-width: 480px; padding: 40px;
            border-radius: 16px; text-align: center; position: relative;
            border-top: 6px solid #f97316; /* Laranja da Marca */
            transform: translateY(20px); transition: transform 0.3s;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            font-family: 'Inter', sans-serif;
        }
        .exit-overlay.visible .exit-modal { transform: translateY(0); }
        
        .exit-x-btn { 
            position: absolute; top: 10px; right: 15px; 
            font-size: 24px; cursor: pointer; background: none; border: none; 
            color: #94a3b8; transition: color 0.2s;
        }
        .exit-x-btn:hover { color: #ef4444; }
        
        .exit-icon { font-size: 48px; margin-bottom: 15px; display: block; animation: floatIcon 3s infinite ease-in-out; }
        .exit-title { color:#1e293b; margin-bottom:10px; font-size: 1.8rem; font-weight: 800; line-height: 1.2; }
        .exit-text { color:#64748b; font-size: 1.05rem; margin-bottom: 25px; line-height: 1.6; }
        .exit-highlight { font-weight: 800; color: #f97316; }

        /* Botão Principal (Bloco) */
        .exit-btn { 
            background: #2563eb; color: white; 
            display: block; width: 100%; padding: 18px; 
            border-radius: 50px; font-weight: 800; text-decoration: none; 
            font-size: 1.1rem; margin-top: 25px; 
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
            transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .exit-btn:hover { 
            background: #1d4ed8; 
            transform: translateY(-3px); 
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
        }

        /* Botão Secundário (Link Abaixo) */
        .exit-close-link { 
            display: block; 
            margin-top: 15px; 
            font-size: 0.85rem; 
            color: #94a3b8; 
            text-decoration: underline; 
            cursor: pointer; 
            background: none; 
            border: none; 
            width: 100%;
        }
        .exit-close-link:hover { color: #64748b; }

        @keyframes floatIcon {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    // --- CRIAÇÃO DO HTML (DOM) ---
    const overlay = document.createElement('div');
    overlay.className = 'exit-overlay';
    
    // Copywriting de Alta Conversão (Opção 1)
    overlay.innerHTML = `
        <div class="exit-modal">
            <button class="exit-x-btn">&times;</button>
            
            <span class="exit-icon">🚀</span>
            
            <h2 class="exit-title">Espere! Vai continuar pagando mensalidades?</h2>
            
            <p class="exit-text">
                Antes de ir, faça as contas: Apps online cobram todo mês. <br>
                O <strong>Júpiter Smart Pro</strong> é <span class="exit-highlight">VITALÍCIO</span>.
                <br><br>
                Pague uma única vez (R$ 89,90) e tenha um gestor financeiro com Inteligência Artificial para sempre.
            </p>
            
            <a href="#comprar" class="exit-btn">QUERO ECONOMIZAR AGORA</a>
            
            <button class="exit-close-link">Não, prefiro gastar mais.</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // --- LÓGICA DE FUNCIONAMENTO ---

    const closeExit = () => {
        overlay.classList.remove('visible');
        localStorage.setItem('jupiter_exit_shown', 'true'); // Grava para sempre (até limpar cache)
    };

    let hasTriggered = false;

    // Gatilho: Mouse saindo da tela (Desktop)
    document.addEventListener('mouseleave', (e) => {
        // Só dispara se o mouse sair POR CIMA (tentar fechar aba/voltar)
        // E se nunca disparou antes nesta sessão ou histórico
        if (e.clientY < 0 && !hasTriggered && !localStorage.getItem('jupiter_exit_shown')) {
            overlay.classList.add('visible');
            hasTriggered = true; 
        }
    });

    // Eventos de clique para fechar
    overlay.querySelector('.exit-x-btn').addEventListener('click', closeExit);
    
    // Psicologia Reversa no link de fechar
    overlay.querySelector('.exit-close-link').addEventListener('click', () => {
        closeExit();
        // Opcional: Console log para métricas
        console.log("Usuário recusou a oferta de saída."); 
    });
    
    // Se clicar no botão de comprar, fecha o popup e rola para a oferta
    overlay.querySelector('.exit-btn').addEventListener('click', () => {
        closeExit();
        // O href="#comprar" já faz o scroll nativo
    });
})();