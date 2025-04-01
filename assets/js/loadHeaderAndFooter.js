// Footer Loading Script - with try-catch and absolute/relative path handling
document.addEventListener("DOMContentLoaded", function() {
    const footer = document.getElementById('footer');

    if (footer) {
        // Try absolute path first, then fall back to relative path if that fails
        fetchFooter('/footer.html')
            .catch(error => {
                console.log("Could not load footer from absolute path, trying relative path...");
                return fetchFooter('../footer.html');
            })
            .catch(error => {
                console.log("Could not load footer from relative path, trying alternate path...");
                return fetchFooter('footer.html');
            })
            .catch(error => {
                console.error("All attempts to load footer failed:", error);
                footer.innerHTML = '<div class="footer-bottom"><p>&copy; 2018-' +
                    new Date().getFullYear() + ' IROIRO, LLC. All rights reserved.</p></div>';
            });
    }

    // Helper function to fetch footer with a promise
    function fetchFooter(path) {
        return fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer not found at ' + path);
                }
                return response.text();
            })
            .then(data => {
                footer.innerHTML = data;
                // Update year in footer
                const yearSpan = footer.querySelector('#current-year');
                if (yearSpan && !yearSpan.textContent) {
                    yearSpan.textContent = new Date().getFullYear();
                }
                return data; // Return for chaining
            });
    }
});