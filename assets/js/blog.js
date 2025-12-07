// Função global para o botão "Copiar Link"
window.copyShareLink = function(btn) {
    navigator.clipboard.writeText(window.location.href);
    // Salva o ícone original
    const originalContent = '<i class="fas fa-link"></i> Copiar Link';
    
    // Muda para feedback visual
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    btn.classList.add('active'); // Opcional: para efeitos visuais extras

    // Restaura após 2 segundos
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('active');
    }, 2000);
};

// Função Profissional de Compartilhamento (Popup)
window.shareSocial = function(network, title, url) {
    let shareUrl = "";
    const width = 600;
    const height = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},top=${top},left=${left}`;

    switch(network) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'whatsapp':
            // WhatsApp funciona melhor em nova aba, não popup
            window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, 'shareWindow', params);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // --- CONFIGURAÇÕES ---
    const ITEMS_PER_PAGE = 6; // Quantos posts por página
    let currentPage = 1;      // Página inicial padrão

    // Elementos do DOM
    const listContainer = document.getElementById('list-render-area'); // Área da lista
    const paginationContainer = document.getElementById('pagination-area'); // Área dos botões
    const postContainer = document.getElementById('post-render-area'); // Área do post único
    const sidebarContainer = document.getElementById('sidebar-render-area'); // Sidebar

    try {
        // 1. CARREGAMENTO DOS DADOS (O "Cardápio")
        const response = await fetch('assets/data/blog-posts.json');
        const posts = await response.json();

        // --- RENDERIZAÇÃO DA SIDEBAR (Comum a todas as telas) ---
        if (sidebarContainer) {
            renderSidebar(posts);
        }

        // --- ROTEAMENTO INTELIGENTE ---
        
        // CENÁRIO A: Estamos na Home do Blog (Lista)
        if (listContainer && paginationContainer) {
            loadPageData(posts, currentPage);
        }

        // CENÁRIO B: Estamos lendo um Artigo (Single Post)
        if (postContainer) {
            await renderSinglePost(posts); // Agora é assíncrono para buscar arquivos externos
        }

    } catch (e) {
        console.error("Erro ao carregar blog:", e);
        if(listContainer) listContainer.innerHTML = "<p>Erro ao carregar artigos. Tente recarregar.</p>";
    }

    // --- FUNÇÕES DE LÓGICA ---

    // 1. Gerencia a exibição da página atual (Lista + Paginação)
    function loadPageData(allPosts, page) {
        const listElement = document.getElementById('list-render-area');
        const paginationElement = document.getElementById('pagination-area');
        
        // Limpa conteúdo anterior
        listElement.innerHTML = "";
        paginationElement.innerHTML = "";

        // Cálculo Matemático da Paginação
        page--; 
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedItems = allPosts.slice(start, end);

        // Renderiza os Itens
        paginatedItems.forEach(post => {
            const articleHTML = `
                <article class="blog-card">
                    <a href="post.html?id=${post.id}" class="blog-card-link-img">
                        <img src="${post.image}" alt="${post.title}" class="blog-card-img">
                    </a>
                    <div class="blog-card-body">
                        <span class="blog-card-cat">${post.category}</span>
                        <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                        <p>${post.summary}</p>
                        <a href="post.html?id=${post.id}" class="read-link">Ler Artigo Completo &rarr;</a>
                    </div>
                </article>
            `;
            listElement.innerHTML += articleHTML;
        });

        // Renderiza os Botões de Paginação
        setupPagination(allPosts, paginationElement, ITEMS_PER_PAGE);
    }

    // 2. Cria os botões de controle
    function setupPagination(items, wrapper, rows_per_page) {
        wrapper.innerHTML = "";
        let page_count = Math.ceil(items.length / rows_per_page);

        // Botão "Anterior"
        let prevBtn = paginationButton(currentPage - 1, items, '❮');
        if(currentPage === 1) prevBtn.disabled = true;
        wrapper.appendChild(prevBtn);

        // Botões Numéricos
        for (let i = 1; i < page_count + 1; i++) {
            let btn = paginationButton(i, items, i);
            wrapper.appendChild(btn);
        }

        // Botão "Próximo"
        let nextBtn = paginationButton(currentPage + 1, items, '❯');
        if(currentPage === page_count) nextBtn.disabled = true;
        wrapper.appendChild(nextBtn);
    }

    // 3. Fabrica o botão individual
    function paginationButton(page, items, textContent) {
        let button = document.createElement('button');
        button.innerHTML = textContent;
        button.classList.add('page-btn');

        if (currentPage == page && typeof textContent === 'number') button.classList.add('active');
        if (typeof textContent === 'string') button.classList.add(textContent === '❮' ? 'prev' : 'next');

        button.addEventListener('click', function () {
            currentPage = page;
            loadPageData(items, currentPage);
            
            // Scroll suave
            const mainArea = document.querySelector('.blog-main-content');
            if(mainArea) {
                const yOffset = -100; 
                const y = mainArea.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });

        return button;
    }

    // 4. Renderiza Sidebar (CORRIGIDO PARA REC VENDAS)
    function renderSidebar(posts) {
        const sidebarContainer = document.getElementById('sidebar-render-area');
        const recentPosts = posts.slice(0, 5);
        
        sidebarContainer.innerHTML = `
            <div class="widget">
                <h3 style="margin-bottom:20px; font-size:1.1rem; color:var(--text-title); border-bottom:2px solid var(--primary); padding-bottom:10px; display:inline-block;">Últimos Artigos</h3>
                <div class="sidebar-posts-list">
                    ${recentPosts.map(p => `
                        <div class="sidebar-post-item">
                            <a href="post.html?id=${p.id}">
                                <img src="${p.image}" alt="${p.title}" class="sidebar-thumb">
                            </a>
                            <div class="sidebar-content">
                                <h4><a href="post.html?id=${p.id}">${p.title}</a></h4>
                                <span class="sidebar-date"><i class="far fa-calendar-alt"></i> ${p.date}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="widget widget-sales sticky-offer">
                <h3 style="margin-bottom:15px; font-size:1.1rem; color:var(--text-title);">⚡ Oferta Especial</h3>
                <img src="assets/img/hero-img.webp" alt="Interface do Rec Vendas">
                <p style="font-size:0.9rem; color:var(--text-muted);">Organize sua assistência ou escritório com Rec Vendas Pro.</p>
                <div class="widget-price">R$ 89,90</div>
                <a href="./#comprar" class="widget-btn">BAIXAR AGORA</a>
            </div>
        `;
    }

    // 5. Renderiza Post Único (CORRIGIDO PARA REC VENDAS)
    async function renderSinglePost(posts) {
        const postContainer = document.getElementById('post-render-area');
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const post = posts.find(p => p.id === postId);

        if (post) {
            document.title = `${post.title} - Blog Rec Vendas`; // Título da Aba Corrigido

            let finalContent = "";

            // Lógica de Carregamento
            if (post.contentUrl) {
                try {
                    const contentResponse = await fetch(post.contentUrl);
                    if (contentResponse.ok) {
                        finalContent = await contentResponse.text();
                    } else {
                        finalContent = "<p>Erro: Não foi possível carregar o texto do artigo.</p>";
                    }
                } catch (err) {
                    finalContent = "<p>Erro de conexão ao buscar artigo.</p>";
                }
            } else {
                finalContent = post.content || "<p>Conteúdo indisponível.</p>";
            }

            // --- CÁLCULO DO TEMPO DE LEITURA ---
            const textOnly = finalContent.replace(/<[^>]*>/g, ' '); 
            const wordCount = textOnly.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); 

            // --- PREPARAÇÃO PARA VIRALIZAÇÃO ---
            const pageUrl = encodeURIComponent(window.location.href);
            const postTitleEncoded = encodeURIComponent(post.title);

            // --- LÓGICA DE POSTS RELACIONADOS ---
            const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 3);
            
            const relatedHTML = relatedPosts.map(p => `
                <div class="related-card" style="flex: 1; min-width: 250px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: transform 0.2s;">
                    <span style="font-size: 0.75rem; color: var(--accent); font-weight: 800; text-transform: uppercase;">${p.category}</span>
                    <h4 style="margin: 10px 0; font-size: 1.1rem; line-height: 1.4;">
                        <a href="post.html?id=${p.id}" style="text-decoration: none; color: var(--text-title);">${p.title}</a>
                    </h4>
                    <a href="post.html?id=${p.id}" style="font-size: 0.85rem; color: var(--text-muted); text-decoration: none;">Ler agora &rarr;</a>
                </div>
            `).join('');

            // --- RENDERIZA O HTML COMPLETO ---
            postContainer.innerHTML = `
                <div class="article-header">
                    <span class="badge">${post.category}</span>
                    <h1>${post.title}</h1>
                    <span class="article-meta">
                        ${post.date} • Por ${post.author} • 
                        <span style="color:var(--accent); font-weight:700; margin-left:5px;">
                            <i class="far fa-clock"></i> ${readingTime} min de leitura
                        </span>
                    </span>
                </div>
                <img src="${post.image}" class="article-hero-img">
                
                <div class="article-body" id="article-dynamic-content">
                    ${finalContent}
                </div>

                <div class="share-box">
                    <div class="share-title">Compartilhe este conhecimento</div>
                    <div class="share-buttons">
                        <button onclick="window.shareSocial('whatsapp', '${postTitleEncoded}', '${pageUrl}')" class="share-btn share-wa"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                        <button onclick="window.shareSocial('twitter', '${postTitleEncoded}', '${pageUrl}')" class="share-btn share-x"><i class="fab fa-x-twitter"></i> X</button>
                        <button onclick="window.shareSocial('linkedin', '${postTitleEncoded}', '${pageUrl}')" class="share-btn share-li"><i class="fab fa-linkedin-in"></i> LinkedIn</button>
                        <button onclick="window.copyShareLink(this)" class="share-btn share-copy"><i class="fas fa-link"></i> Copiar Link</button>
                    </div>
                </div>
                
                <div style="margin-top:50px; padding:30px; background:var(--cause-bg); border-radius:12px; text-align:center; border:1px solid var(--cause-border);">
                    <h3 style="color:var(--accent); margin-bottom:10px;">Gostou do conteúdo?</h3>
                    <p style="color:var(--text-muted); margin-bottom:20px;">Leve sua organização para o próximo nível com o <strong>Rec Vendas Pro</strong>.</p>
                    <a href="./#comprar" class="btn btn-cta">GARANTIR ACESSO VITALÍCIO</a>
                </div>

                <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--border);">
                    <h3 style="margin-bottom: 25px; color: var(--text-title);">Veja também</h3>
                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                        ${relatedHTML}
                    </div>
                </div>
            `;

            // --- LÓGICA DA BARRA DE PROGRESSO ---
            window.addEventListener('scroll', () => { 
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                
                const bar = document.getElementById("myBar");
                if (bar) {
                    bar.style.width = scrolled + "%";
                }
            });

        } else {
            postContainer.innerHTML = "<h2>Artigo não encontrado.</h2><p>Volte para a <a href='blog.html'>Home do Blog</a>.</p>";
        }
    }
});