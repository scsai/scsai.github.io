document.addEventListener("DOMContentLoaded", function () {
    const POSTS_PER_PAGE = 5;
    let currentPage = 1;
    let posts = [];

    // Detect if we're in the Chinese or English index page
    const isChinese = window.location.pathname.includes("index_zh.html");
    const language = isChinese ? "zh" : "en";
    const singlePage = isChinese ? "single_zh.html" : "single.html";

    // Update language switch link in nav
    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
        langSwitch.href = isChinese ? "index.html" : "index_zh.html";
        langSwitch.textContent = isChinese ? "English" : "中文";
    }

    function renderPosts() {
        const container = document.getElementById("posts-container");
        container.innerHTML = "";

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const postsToRender = posts.slice(startIndex, endIndex);

        if (postsToRender.length === 0) {
            container.innerHTML = "<p>No posts available.</p>";
            return;
        }

        postsToRender.forEach(post => {
            const postFile = post.file[language];
            const postUrl = `${singlePage}?post=${postFile}&lang=${language}`;

            const article = document.createElement("article");
            article.className = "post";
            article.innerHTML = `
                <header>
                    <div class="title">
                        <h2><a href="${postUrl}">${post.title[language]}</a></h2>
                        <p>${post.full_title[language]}</p>
                    </div>
                    <div class="meta">
                        <time class="published" datetime="${post.date}">
                            ${new Date(post.date).toLocaleDateString(
                                isChinese ? "zh-CN" : "en-US",
                                { year: "numeric", month: "long", day: "numeric" }
                            )}
                        </time>
                        <a href="#" class="author">
                            <span class="name">${post.author}</span>
                            <img src="images/avatar.jpg" alt="Author Avatar" />
                        </a>
                    </div>
                </header>
                <a href="${postUrl}" class="image featured">
                    <img src="posts/${postFile.replace("_zh", "").replace(".md", "")}/figure1.png" alt="Featured Image" />
                </a>
                <p>${post.abstract[language] || ""}</p>
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

    function updatePaginationControls() {
        const prevButton = document.getElementById("prev-page");
        const nextButton = document.getElementById("next-page");

        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        prevButton.classList.toggle("disabled", currentPage === 1);
        nextButton.classList.toggle("disabled", currentPage === totalPages);
    }

    document.getElementById("prev-page").addEventListener("click", event => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    document.getElementById("next-page").addEventListener("click", event => {
        event.preventDefault();
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    });

    fetch("posts/posts.json")
        .then(response => response.json())
        .then(data => {
            posts = data;
            renderPosts();
        })
        .catch(error => {
            console.error("Error loading posts:", error);
            document.getElementById("posts-container").innerHTML = "<p>Error loading posts.</p>";
        });
});
