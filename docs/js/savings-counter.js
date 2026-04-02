// Cost Savings Counter
(function() {
    const startDate = new Date('2026-04-01T00:00:00-05:00');
    const baselineMonthlyCost = 112;
    const optimizedMonthlyCost = 40;
    const dailySavings = (baselineMonthlyCost - optimizedMonthlyCost) / 30; // $2.40/day
    
    function updateSavings() {
        const now = new Date();
        const daysSince = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const totalSaved = dailySavings * daysSince;
        const yearlyProjected = dailySavings * 365;
        
        const savingsElement = document.getElementById('savingsAmount');
        if (savingsElement) {
            // Animate count-up
            animateValue(savingsElement, 0, totalSaved, 2000);
        }
        
        // Update projected annual savings if element exists
        const projectedElements = document.querySelectorAll('.savings-projected');
        projectedElements.forEach(el => {
            el.textContent = `$${yearlyProjected.toFixed(0)}/year projected`;
        });
        
        // Update days counter if element exists
        const daysElements = document.querySelectorAll('.savings-label');
        daysElements.forEach(el => {
            if (el.textContent.includes('since')) {
                el.textContent = `Saved in ${daysSince} ${daysSince === 1 ? 'day' : 'days'}`;
            }
        });
    }
    
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;
            
            element.textContent = `$${current.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Update on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateSavings);
    } else {
        updateSavings();
    }
    
    // Update every hour
    setInterval(updateSavings, 3600000);
})();
