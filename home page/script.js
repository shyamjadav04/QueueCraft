// Scroll Reveal Animation
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
    reveals.forEach(section => {
        const windowHeight = window.innerHeight;
        const elementTop = section.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            section.classList.add("active");
        }
    });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Trigger on page load

// Add stagger effect to multiple elements
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Parallax and Scroll Effects for Hero Elements
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const floatingCards = document.querySelectorAll(".floating-card");
    const particles = document.querySelectorAll(".particle");
    const heroContent = document.querySelector(".hero-content");

    // Parallax effect on floating cards
    floatingCards.forEach((card, index) => {
        const offset = scrollY * (0.3 + index * 0.1);
        card.style.transform = `translateY(${offset}px)`;
    });

    // Parallax effect on particles
    particles.forEach((particle, index) => {
        const offset = scrollY * (0.2 + index * 0.05);
        particle.style.transform = `translateY(${offset}px)`;
    });

    // Subtle fade and scale on hero content
    const heroFadeStart = window.innerHeight * 0.5;
    if (scrollY < heroFadeStart) {
        const fadeProgress = scrollY / heroFadeStart;
        if (heroContent) {
            heroContent.style.opacity = Math.max(0.3, 1 - fadeProgress * 0.5);
            heroContent.style.transform = `translateY(${fadeProgress * 30}px)`;
        }
    }

    // Animate hero background on scroll
    const heroBg = document.querySelector(".hero::before");
    if (heroBg) {
        const bgOffset = scrollY * 0.5;
        document.querySelector(".hero").style.backgroundPosition = `${bgOffset}px ${bgOffset}px`;
    }
});
