// assets/js/navDots.js

document.addEventListener("DOMContentLoaded", () => {
    const dots = document.querySelectorAll(".nav-dot");
    const contentSection = document.getElementById("content-start");

    if (!dots.length || !contentSection) {
        console.warn("Navigation dots or content section not found.");
        return;
    }

    const topDot = document.querySelector('.nav-dot[data-target="top"]');
    const contentDot = document.querySelector('.nav-dot[data-target="content"]');

    // --- Smooth Scrolling ---
    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            e.preventDefault();
            const target = dot.getAttribute("data-target");

            if (target === "top") {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                // --- CALL RESET FUNCTION HERE ---
                if (typeof window.initializeParticles === 'function') {
                    console.log("Resetting particles via top dot click...");
                    window.initializeParticles(); // Call the global function
                } else {
                    console.warn("initializeParticles function not found on window.");
                }
                // --- END OF CALL ---
            } else if (target === "content") {
                 window.scrollTo({
                     top: window.innerHeight,
                     behavior: "smooth"
                 });
            }
        });
    });

    // --- Active State Update ---
    const activateDot = (targetDot) => {
        dots.forEach(d => d.classList.remove("active"));
        if (targetDot) {
            targetDot.classList.add("active");
        }
    };

    const handleScroll = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const threshold = window.innerHeight * 0.6;

        if (scrollPosition < threshold) {
            activateDot(topDot);
        } else {
            activateDot(contentDot);
        }
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    window.addEventListener("scroll", throttle(handleScroll, 100));
    handleScroll();
});