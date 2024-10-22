// observeSections.js

import { loadHeaderAndFooter } from './loadHeaderAndFooter.js';

// Function to update the active dot based on which section is in view
function observeSections() {
    const paginationDots = document.querySelectorAll('.pagination-dot');

    const options = {
        root: null, // null means observing relative to the viewport
        threshold: 0.5 // 50% of the element must be in view to trigger the callback
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'header-section') {
                    // When the header is in view
                    paginationDots[0].classList.add('active');
                    paginationDots[1].classList.remove('active');
                } else if (entry.target.id === 'footer-section' || entry.target.id === 'content-section-small') {
                    // When the footer or content-section-small is in view
                    paginationDots[1].classList.add('active');
                    paginationDots[0].classList.remove('active');
                }
            }
        });
    }, options);

    // Observe the sections
    const headerSection = document.querySelector('header');
    const contentSection = document.getElementById('content-section');
    const contentSectionSmall = document.getElementById('content-section-small');
    const footerSection = document.getElementById('footer');

    // Assign IDs to the sections for easier identification
    headerSection.id = 'header-section';
    contentSection.id = 'content-section';
    contentSectionSmall.id = 'content-section-small';
    footerSection.id = 'footer-section';

    observer.observe(headerSection);
    observer.observe(contentSection);
    observer.observe(contentSectionSmall);
    observer.observe(footerSection);
}

// Run the loadHeaderAndFooter function and then observe sections
window.addEventListener('load', () => {
    loadHeaderAndFooter().then(observeSections);
});
