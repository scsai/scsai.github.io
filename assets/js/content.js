document.addEventListener("DOMContentLoaded", function () {
    const POSTS_PER_PAGE = 5;
    let currentPage = 1;
    let posts = [];

    // Get language from URL, default is English
    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get("lang") || "en"; 
    const isChinese = language === "zh";

    // Update language switch link
    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
        langSwitch.href = window.location.pathname.includes("single")
            ? (isChinese ? "single.html" : "single_zh.html") + window.location.search.replace(/lang=zh|lang=en/, `lang=${isChinese ? "en" : "zh"}`)
            : (isChinese ? "index.html" : "index_zh.html") + window.location.search.replace(/lang=zh|lang=en/, `lang=${isChinese ? "en" : "zh"}`);
        langSwitch.textContent = isChinese ? "English" : "中文";
    }

    // Function to render posts for the current page
    function renderPosts() {
        const container = document.getElementById('posts-container');
        container.innerHTML = ''; 

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const postsToRender = posts.slice(startIndex, endIndex);

        if (postsToRender.length === 0) {
            container.innerHTML = '<p>No posts available.</p>';
            return;
        }

        postsToRender.forEach(post => {
            const postFile = post.file[language];
            const postTitle = post.title[language];
            const postFullTitle = post.full_title[language] || "";
            const postAbstract = post.abstract ? post.abstract[language] : "";
            const postUrl = `single.html?post=${postFile}&lang=${language}`;

            const article = document.createElement('article');
            article.className = 'post';

            article.innerHTML = `
                <header>
                    <div class="title">
                        <h2><a href="${postUrl}">${postTitle}</a></h2>
                        <p>${postFullTitle}</p>
                    </div>
                    <div class="meta">
                        <time class="published" datetime="${post.date}">
                            ${new Date(post.date).toLocaleDateString(isChinese ? "zh-CN" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <a href="#" class="author">
                            <span class="name">${post.author}</span>
                            <img src="images/avatar.jpg" alt="Author Avatar" />
                        </a>
                    </div>
                </header>
                <a href="${postUrl}" class="image featured">
                    <img src="posts/${postFile.replace('.md', '')}/figure1.png" alt="Featured Image" />
                </a>
                <p>${postAbstract}</p>
                <footer>
                    <ul class="actions">
                        <li><a href="${postUrl}" class="button large">${isChinese ? "继续阅读" : "Continue Reading"}</a></li>
                    </ul>
                </footer>
            `;

            container.appendChild(article);
        });

        updatePaginationControls();
    }

    // Function to update pagination buttons
    function updatePaginationControls() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

        prevButton.classList.toggle('disabled', currentPage === 1);
        nextButton.classList.toggle('disabled', currentPage === totalPages);
    }

    // Event listeners for pagination buttons
    document.getElementById('prev-page').addEventListener('click', event => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    document.getElementById('next-page').addEventListener('click', event => {
        event.preventDefault();
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });

    // Fetch posts.json and initialize the page
    fetch('posts/posts.json')
        .then(response => response.json())
        .then(data => {
            posts = data; 
            renderPosts(); 
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            document.getElementById('posts-container').innerHTML = '<p>Error loading posts.</p>';
        });
});
