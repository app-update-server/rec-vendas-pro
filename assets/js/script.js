document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. LÓGICA DO MODO ESCURO ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Ícone (seleciona o <i> dentro do botão)
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    // Verifica preferência salva
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
            } else {
                localStorage.setItem('theme', 'light');
                if(icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
            }
        });
    }

    // --- 2. MENU MOBILE (HAMBURGUER) ---
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('main-menu');
    const menuLinks = document.querySelectorAll('.menu a'); // Seleciona todos os links do menu

    if(mobileBtn && menu) {
        mobileBtn.addEventListener('click', () => {
            menu.classList.toggle('open');
            const menuIcon = mobileBtn.querySelector('i');
            if (menu.classList.contains('open')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        // Fecha o menu automaticamente ao clicar em qualquer link (Substitui o onclick do HTML)
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menu.classList.remove('open');
                    const menuIcon = mobileBtn.querySelector('i');
                    if(menuIcon) {
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- 3. VOLTAR AO TOPO ---
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
                backToTopBtn.style.display = "block"; // Força exibição
                setTimeout(() => { backToTopBtn.style.opacity = "1"; }, 10);
            } else {
                backToTopBtn.style.opacity = "0";
                setTimeout(() => { 
                    if(window.scrollY <= 300) backToTopBtn.style.display = "none"; 
                }, 400);
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
	
	// --- 4. ABAS DE SCREENSHOTS (TABS) ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-pane');

    if(tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 1. Remove classe 'active' de todos os botões e conteúdos
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // 2. Adiciona 'active' no botão clicado
                tab.classList.add('active');

                // 3. Mostra o conteúdo correspondente (pelo data-tab)
                const targetId = tab.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if(targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
	
	// --- 4. CARREGAR BLOG NA HOME (SELEÇÃO MANUAL) ---
    const homeBlogContainer = document.getElementById('home-blog-container');
    
    if (homeBlogContainer) {
        fetch('assets/data/blog-posts.json')
            .then(response => response.json())
            .then(posts => {
                
                // --- ID Manual ---
                // Coloque os IDs dos artigos que você quer na Home, na ordem desejada
                const selectedIds = [
                    "gestao-os-assistencia",  // Card 1
                    "rec-vendas-5-hub-servicos",       // Card 2
                    "gestao-hibrida-loja-servicos" // Card 3
                ];

                // Filtra apenas os posts que estão na lista acima
                let featuredPosts = posts.filter(p => selectedIds.includes(p.id));
				
				// --- VERIFICAÇÃO INTELIGENTE ---
                // Se não tiver posts selecionados, esconde a seção inteira e para
                const blogSection = document.getElementById('blog-home');
                if (featuredPosts.length === 0) {
                    if (blogSection) blogSection.style.display = 'none';
                    return;
                } else {
                    // Garante que apareça se tiver posts
                    if (blogSection) blogSection.style.display = 'block'; 
                }
                // -------------------------------------

                // Opcional: Garante que eles apareçam na ordem que você definiu no array
                featuredPosts.sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));
                // ---------------------------

                homeBlogContainer.innerHTML = featuredPosts.map(post => `
                    <article class="feature-card" style="text-align:left; padding:0; overflow:hidden; display:flex; flex-direction:column;">
                        <a href="post.html?id=${post.id}" style="height: 200px; overflow:hidden;">
                            <img src="${post.image}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s;">
                        </a>
                        <div style="padding:25px; display:flex; flex-direction:column; flex:1;">
                            <span style="font-size:0.75rem; color:var(--accent); font-weight:800; text-transform:uppercase; margin-bottom:10px;">${post.category}</span>
                            <h3 style="font-size:1.1rem; margin-bottom:10px; flex:1;">
                                <a href="post.html?id=${post.id}" style="text-decoration:none; color:var(--text-title);">${post.title}</a>
                            </h3>
                            <a href="post.html?id=${post.id}" style="color:var(--primary); font-weight:600; text-decoration:none; font-size:0.9rem;">Ler artigo &rarr;</a>
                        </div>
                    </article>
                `).join('');
            })
            .catch(err => {
                console.error("Erro ao carregar blog na home:", err);
                homeBlogContainer.innerHTML = "<p>Não foi possível carregar os artigos.</p>";
            });
    }
	
	});

/* --- ATUALIZAÇÃO AUTOMÁTICA DO ANO (FOOTER) --- */
document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

/* --- GOOGLE SHEETS INTEGRATION (EVENT DELEGATION - BLINDADO) --- */
// Usamos delegação no 'document' para capturar formulários estáticos (footer) e dinâmicos (post)
document.addEventListener('submit', function(e) {
    // Verifica se o elemento que disparou o evento tem a classe correta
    if (e.target && e.target.classList.contains('newsletter-form')) {
        e.preventDefault(); // PARE O ENVIO PADRÃO IMEDIATAMENTE
        
        const form = e.target;
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwe-qiCzQLCRUlfOkDBwTkUY35tfkmYygrQW5P7_9-dg62g1AZljiyzGBti9slxsdlQfQ/exec';
        
        // Elementos visuais (Busca dentro do container do formulário atual)
        const btn = form.querySelector('button');
        const originalBtn = btn.innerHTML;
        const container = form.parentElement; // O pai (seja .footer-col ou .lead-box-pro)
        
        // Busca mensagens de feedback próximas
        const successMsg = container.querySelector('.sheet-success');
        const errorMsg = container.querySelector('.sheet-error');

        // Feedback Visual (Loading)
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'; 
        btn.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                form.reset();
                if(successMsg) successMsg.style.display = 'block';
                if(errorMsg) errorMsg.style.display = 'none';
                
                btn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                
                // Restaura o botão após 3 segundos
                setTimeout(() => {
                    btn.innerHTML = originalBtn;
                    btn.disabled = false;
                    if(successMsg) successMsg.style.display = 'none'; 
                }, 4000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                if(errorMsg) errorMsg.style.display = 'block';
                if(successMsg) successMsg.style.display = 'none';
                
                btn.innerHTML = 'Erro';
                setTimeout(() => {
                    btn.innerHTML = originalBtn;
                    btn.disabled = false;
                }, 3000);
            });
    }
});

/* --- PLAYER DE VÍDEO INTELIGENTE (Padrão Nativo) --- */
document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById('videoOverlay');
    const video = document.getElementById('heroVideo');

    // Verifica se os elementos existem na página antes de rodar
    if (overlay && video) {
        
        // --- 1. O GATILHO INICIAL (Apenas na Capa) ---
        // Este evento só ocorre no primeiro clique sobre a capa/botão play.
        overlay.addEventListener('click', function() {
            // Efeito visual de sumir
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            
            // Remove a capa do caminho (display: none) após a transição
            setTimeout(() => {
                overlay.style.display = 'none';
                
                // Inicia o vídeo e entrega o controle ao navegador
                video.play();
                video.controls = true; 
            }, 300);
        });

        // --- 2. RESET INTELIGENTE (Opcional) ---
        // Quando o vídeo termina, volta a mostrar a capa bonita.
        video.addEventListener('ended', function() {
             video.controls = false; // Esconde os controles nativos
             video.load(); // Recarrega o vídeo para o frame zero
             overlay.style.display = 'flex'; // Traz a capa de volta
             // Pequeno delay para garantir que o display:flex aplicou antes da opacidade
             setTimeout(() => { overlay.style.opacity = '1'; }, 10);
        });
    }
});