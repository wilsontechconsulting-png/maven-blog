// xCloud-style mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav nav') || document.querySelector('header nav');
    if (!nav) return;
    
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    
    const menu = nav.querySelector('.menu');
    const navButtons = nav.querySelector('.nav-buttons');
    
    if (menu) {
        nav.appendChild(hamburger);
        
        // Toggle with body scroll lock
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
            if (navButtons) navButtons.classList.toggle('active');
            
            // Lock/unlock body scroll
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                if (navButtons) navButtons.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
});
