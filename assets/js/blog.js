document.addEventListener("DOMContentLoaded", function () {
    // Detect current language from the page file name
    const isChinese = window.location.pathname.includes("single_zh.html");
    const language = isChinese ? "zh" : "en";

    // Get blog file from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get("post");

    if (!postFile) {
        document.getElementById("blog-content").innerHTML = "<p>Error: No blog post specified.</p>";
        return;
    }

    // Fetch the corresponding blog markdown file
    fetch(`posts/${postFile}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to load blog content.");
            return response.text();
        })
        .then(markdown => {
            // Convert markdown to HTML
            const converter = new showdown.Converter({
                literalMidWordUnderscores: true,
                tables: true,
                strikethrough: true,
                emoji: true,
                extensions: [{
                    type: "lang",
                    regex: /(?<!\\)\$(.+?)\$/g,
                    replace: "\\($1\\)"
                }]
            });

            const html = converter.makeHtml(markdown);

            // Extract the first <h1> tag as the title
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const titleElement = tempDiv.querySelector("h1");
            const title = titleElement ? titleElement.textContent : "Untitled";

            // Set the blog title
            document.getElementById("blog-title").textContent = title;

            // Remove the <h1> from the blog content and display the rest
            if (titleElement) titleElement.remove();
            document.getElementById("blog-content").innerHTML = tempDiv.innerHTML;

            // Adjust image sizes
            document.querySelectorAll("#blog-content img").forEach(img => {
                img.style.width = "80%";
                img.style.display = "block";
                img.style.margin = "auto";
            });

            // Render MathJax equations
            MathJax.typesetPromise()
                .then(() => console.log("MathJax rendering complete."))
                .catch(err => console.error("MathJax rendering error:", err));

            // Update language switch link to keep same blog
            const langSwitch = document.getElementById("lang-switch");
            if (langSwitch) {
                const newLangPage = language === "en" ? "single_zh.html" : "single.html";
                langSwitch.href = `${newLangPage}?post=${postFile.replace(language === "en" ? ".md" : "_zh.md", language === "en" ? "_zh.md" : ".md")}`;
            }
        })
        .catch(error => {
            document.getElementById("blog-content").innerHTML = `<p>Error: ${error.message}</p>`;
            console.error(error);
        });
});
