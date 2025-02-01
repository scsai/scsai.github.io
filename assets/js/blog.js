document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get("post"); // Get post filename
    let language = urlParams.get("lang") || "en"; // Get language (default: English)
    const isChinese = language === "zh";

    // Update language switch button
    const langSwitch = document.getElementById("lang-switch");
    if (langSwitch) {
        langSwitch.href = isChinese
            ? `single.html?post=${postFile.replace("_zh.md", ".md")}&lang=en`
            : `single_zh.html?post=${postFile.replace(".md", "_zh.md")}&lang=zh`;
        langSwitch.textContent = isChinese ? "English" : "中文";
    }

    // Ensure showdown is loaded
    if (typeof showdown === "undefined") {
        console.error("Showdown.js is not loaded. Make sure the library is included.");
        document.getElementById("blog-content").innerHTML = `<p>Error: Markdown parser is missing.</p>`;
        return;
    }

    // Fetch and render Markdown
    function loadMarkdown(postPath) {
        fetch(postPath)
            .then(response => {
                if (!response.ok) throw new Error("Failed to load blog content.");
                return response.text();
            })
            .then(markdown => {
                const converter = new showdown.Converter({
                    literalMidWordUnderscores: true,
                    extensions: [{
                        type: 'lang',
                        regex: /(?<!\\)\$(.+?)\$/g,
                        replace: '\\($1\\)'
                    }]
                });

                const html = converter.makeHtml(markdown);

                // Extract first <h1> as title
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = html;
                const titleElement = tempDiv.querySelector("h1");
                const title = titleElement ? titleElement.textContent : "Untitled";

                // Update blog title and remove extracted <h1>
                document.getElementById("blog-title").textContent = title;
                if (titleElement) titleElement.remove();
                document.getElementById("blog-content").innerHTML = tempDiv.innerHTML;

                // Ensure images in markdown adjust to 80% width
                document.querySelectorAll("#blog-content img").forEach(img => {
                    img.style.width = "80%";
                    img.style.display = "block";
                    img.style.margin = "0 auto";
                });

                // Render MathJax if available
                if (typeof MathJax !== "undefined") {
                    MathJax.typesetPromise()
                        .then(() => console.log("MathJax rendering complete."))
                        .catch(err => console.error("MathJax rendering error:", err));
                }
            })
            .catch(error => {
                console.error(error);
                document.getElementById("blog-content").innerHTML = `<p>Error: ${error.message}</p>`;
            });
    }

    if (postFile) {
        loadMarkdown(`posts/${postFile}`);
    } else {
        document.getElementById("blog-content").innerHTML = `<p>Error: No post specified.</p>`;
    }
});
