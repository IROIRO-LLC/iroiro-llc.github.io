// assets/js/loadHeaderAndFooter.js
document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => response.ok ? response.text() : Promise.reject('Footer not found'))
            .then(data => {
                footerPlaceholder.innerHTML = data;
                const yearSpan = footerPlaceholder.querySelector('#current-year');
                if (yearSpan && !yearSpan.textContent) {
                    yearSpan.textContent = new Date().getFullYear();
                }
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    // Add active state to current nav button
    try { // Added try...catch for robustness
        const currentPagePath = window.location.pathname;
        const navButtons = document.querySelectorAll('.overlay-nav .nav-button');

        navButtons.forEach(button => {
            const buttonHref = button.getAttribute('href');
            let isCurrent = false;

            // Check for exact match or root path match for index
            if (buttonHref === currentPagePath ||
               (currentPagePath === '/' || currentPagePath.endsWith('/index.html')) && (buttonHref === '/' || buttonHref === './' || buttonHref === 'index.html'))
            {
                 isCurrent = true;
            }
            // More robust check: compare cleaned paths
            // const cleanCurrent = currentPagePath.replace(/index\.html$/, '').replace(/\/$/, '');
            // const cleanButton = buttonHref.replace(/index\.html$/, '').replace(/\/$/, '');
            // if (cleanCurrent === cleanButton) {
            //     isCurrent = true;
            // }


            if (isCurrent) {
                button.classList.add('current');
            } else {
                 button.classList.remove('current'); // Ensure others aren't marked current
            }
        });
    } catch (e) {
         console.error("Error setting active nav link:", e);
    }
});