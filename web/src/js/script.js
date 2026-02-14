// Get the CTA button
const ctaButton = document.getElementById('cta-button');

// Add click event listener
ctaButton.addEventListener('click', function() {
    alert('Welcome to GitOps! This project demonstrates HTML, CSS, and JavaScript integration.');
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Page load event
window.addEventListener('load', function() {
    console.log('GitOps web project loaded successfully!');
});
