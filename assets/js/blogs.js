document.addEventListener("DOMContentLoaded", function () {
    const POSTS_PER_PAGE = 5; 
    let currentPage = 1;
    let posts = [];

    // Detect the current language from the URL (default: English)
    const isChinese = window.location.pathname.includes("index_zh.html");
    const language = isChinese ? "zh" : "en";

    // Function to fetch and load posts
    function fetchPosts() {
        fetch("posts/posts.json")
            .then(response => response.json())
            .then(data => {
                posts = data; // Store posts data
                renderPosts(); // Render the first page
            })
            .catch(error => {
                console.error("Error loading posts:", error);
                document.getElementById("posts-container").innerHTML = "<p>Error loading posts.</p>";
            });
    }

    // Function to render posts for the current page
    function renderPosts() {
        const container = document.getElementById("posts-container");
        container.innerHTML = ""; // Clear previous posts

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const postsToRender = posts.slice(startIndex, endIndex);

        if (postsToRender.length === 0) {
            container.innerHTML = "<p>No posts available.</p>";
            return;
        }

        postsToRender.forEach(post => {
            const article = document.createElement("article");
            article.className = "post";

            article.innerHTML = `
                <header>
                    <div class="title">
                        <h2><a href="single.html?post=${post.file[language]}&lang=${language}">${post.title[language]}</a></h2>
                        <p>${post.full_title[language]}</p>
                    </div>
                    <div class="meta">
                        <time class="published" datetime="${post.date}">${new Date(post.date).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                        <a href="#" class="author">
                            <span class="name">${post.author}</span>
                            <img src="images/avatar.jpg" alt="Author Avatar" />
                        </a>
                    </div>
                </header>
                <a href="single.html?post=${post.file[language]}&lang=${language}" class="image featured">
                    <img src="posts/${post.file[language].replace("_zh", "").replace(".md", "")}/figure1.png" alt="Featured Image" />
                </a>
                <p>${post.abstract[language] || ""}</p>
                <footer>
                    <ul class="actions">
                        <li><a href="single.html?post=${post.file[language]}&lang=${language}" class="button large">${language === "zh" ? "继续阅读" : "Continue Reading"}</a></li>
                    </ul>
                </footer>
            `;

            container.appendChild(article);
        });

        updatePaginationControls();
    }

    // Function to update pagination buttons
    function updatePaginationControls() {
        const prevButton = document.getElementById("prev-page");
        const nextButton = document.getElementById("next-page");

        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

        prevButton.classList.toggle("disabled", currentPage === 1);
        nextButton.classList.toggle("disabled", currentPage === totalPages);
    }

    // Event listeners for pagination buttons
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

    // Load posts on page load
    fetchPosts();
});
