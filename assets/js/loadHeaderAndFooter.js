// assets/js/loadHeaderAndFooter.js

// Load header and footer, then initialize pagination dots
export function loadHeaderAndFooter() {
    return Promise.all([
        fetch('/header.html').then(response => response.text()).then(data => {
            document.getElementById('header').innerHTML = data;
        }),
        fetch('/footer.html').then(response => response.text()).then(data => {
            document.getElementById('footer').innerHTML = data;
            // Update year in footer
            document.getElementById("current-year").textContent = new Date().getFullYear();
        })
    ]);
}
