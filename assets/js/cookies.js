// assets/js/cookies.js

(function() {
    // Verifica se já aceitou
    if (localStorage.getItem('jupiter_cookie_consent') === 'true') {
        return;
    }

    // Cria o CSS dinamicamente para não precisar mexer no style.css
    const style = document.createElement('style');
    style.innerHTML = `
        .cookie-banner {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1000px;
            background-color: #ffffff;
            color: #334155;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            font-family: 'Inter', sans-serif;
            animation: slideUp 0.5s ease-out;
        }
        .dark-mode .cookie-banner {
            background-color: #1e293b;
            color: #cbd5e1;
            border-color: #334155;
        }
        .cookie-text {
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .cookie-text a {
            color: #2563eb;
            text-decoration: underline;
        }
        .cookie-btn {
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.2s;
        }
        .cookie-btn:hover {
            background-color: #1d4ed8;
        }
        @media(max-width: 600px) {
            .cookie-banner { flex-direction: column; text-align: center; bottom: 0; width: 100%; border-radius: 12px 12px 0 0; }
            .cookie-btn { width: 100%; }
        }
        @keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    `;
    document.head.appendChild(style);

    // Cria o HTML do Banner
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-text">
            🍪 <strong>Privacidade:</strong> Utilizamos cookies para garantir que a comissão dos nossos parceiros afiliados seja atribuída corretamente e para melhorar sua experiência. Ao continuar, você concorda com nossa <a href="politica.html">Política de Privacidade</a>.
        </div>
        <button id="accept-cookies" class="cookie-btn">Entendi e Aceito</button>
    `;
    
    document.body.appendChild(banner);

    // Lógica do Botão
    document.getElementById('accept-cookies').addEventListener('click', function() {
        localStorage.setItem('jupiter_cookie_consent', 'true');
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
    });

})();