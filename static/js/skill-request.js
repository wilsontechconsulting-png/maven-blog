// Skill Request Form with AI Estimation
(function() {
    const modal = document.getElementById('skillRequestModal');
    const closeBtn = document.getElementById('skillRequestClose');
    const steps = {
        intro: document.getElementById('step-intro'),
        questions: document.getElementById('step-questions'),
        estimate: document.getElementById('step-estimate'),
        contact: document.getElementById('step-contact'),
        success: document.getElementById('step-success')
    };
    
    let currentStep = 'intro';
    let estimateData = {};
    let formOpenTime = null;
    
    // Open modal function (called from Skills page button)
    window.openSkillRequest = function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showStep('intro');
        
        // Set timestamp
        formOpenTime = Date.now();
        document.getElementById('skillFormTimestamp').value = formOpenTime;
    };
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetForm();
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Show specific step
    function showStep(stepName) {
        Object.values(steps).forEach(step => step?.classList.remove('active'));
        steps[stepName]?.classList.add('active');
        currentStep = stepName;
    }
    
    // Start button
    document.getElementById('startButton')?.addEventListener('click', function() {
        showStep('questions');
    });
    
    // Analyze button - AI estimation
    document.getElementById('analyzeButton')?.addEventListener('click', async function() {
        const form = document.getElementById('skillQuestionsForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const button = this;
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        const formData = {
            purpose: document.getElementById('skillPurpose').value,
            problem: document.getElementById('skillProblem').value,
            scenarios: document.getElementById('skillScenarios').value,
            data: document.getElementById('skillData').value,
            output: document.getElementById('skillOutput').value
        };
        
        try {
            // Call AI to analyze complexity
            const estimate = await analyzeComplexity(formData);
            estimateData = estimate;
            
            // Display estimate
            document.getElementById('estimateComplexity').textContent = estimate.complexity;
            document.getElementById('estimateTimeline').textContent = estimate.timeline;
            document.getElementById('estimatePrice').textContent = estimate.price;
            document.getElementById('estimateSummary').innerHTML = `<p>${estimate.summary}</p>`;
            
            showStep('estimate');
        } catch (error) {
            console.error('Estimation error:', error);
            alert('Unable to generate estimate. Please try again or contact us directly.');
        } finally {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // AI Analysis Function
    async function analyzeComplexity(formData) {
        // For MVP: Simple rule-based estimation
        // In production: Call Claude API for smart analysis
        
        const prompt = `Analyze this custom AI skill request and provide:
1. Complexity level (Simple/Medium/Complex/Advanced)
2. Development timeline (1-14 days)
3. Price range ($500-$5000+)
4. Brief summary (2-3 sentences)

Request details:
Purpose: ${formData.purpose}
Problem: ${formData.problem}
Scenarios: ${formData.scenarios}
Data needs: ${formData.data}
Output: ${formData.output}

Complexity criteria:
- Simple: Basic automation, single data source, text output (1-2 days, $500-800)
- Medium: Multiple integrations, data processing, structured output (2-4 days, $1200-1800)
- Complex: Advanced logic, API integrations, custom analysis (3-7 days, $2500-3500)
- Advanced: Multiple systems, real-time processing, complex algorithms (7-14 days, $5000+)

Return JSON format:
{
  "complexity": "Medium",
  "timeline": "3-5 days",
  "price": "$1,800",
  "summary": "This skill requires..."
}`;
        
        // MVP: Rule-based logic
        const textLength = Object.values(formData).join(' ').length;
        const hasMultipleSources = formData.data.toLowerCase().includes('api') || formData.data.toLowerCase().includes('multiple');
        const hasComplexOutput = formData.output.toLowerCase().includes('chart') || formData.output.toLowerCase().includes('report');
        
        let complexity, timeline, price, summary;
        
        if (textLength < 300) {
            complexity = 'Simple';
            timeline = '1-2 days';
            price = '$500-800';
            summary = 'This appears to be a straightforward automation skill with basic data processing. Perfect for simple, repeatable tasks.';
        } else if (textLength < 600 && !hasMultipleSources) {
            complexity = 'Medium';
            timeline = '2-4 days';
            price = '$1,200-1,800';
            summary = 'This skill requires moderate development with structured data handling and processing logic. Good balance of capability and complexity.';
        } else if (hasMultipleSources || hasComplexOutput) {
            complexity = 'Complex';
            timeline = '3-7 days';
            price = '$2,500-3,500';
            summary = 'This is an advanced skill requiring multiple integrations, sophisticated data processing, and custom output generation. Professional-grade capability.';
        } else {
            complexity = 'Advanced';
            timeline = '7-14 days';
            price = '$5,000+';
            summary = 'This is a highly sophisticated skill requiring extensive development, testing, and integration work. Enterprise-level capability with ongoing support.';
        }
        
        return { complexity, timeline, price, summary };
    }
    
    // Back button
    document.getElementById('backButton')?.addEventListener('click', function() {
        showStep('questions');
    });
    
    // Proceed to contact
    document.getElementById('proceedButton')?.addEventListener('click', function() {
        // Copy data to hidden fields
        document.getElementById('hiddenPurpose').value = document.getElementById('skillPurpose').value;
        document.getElementById('hiddenProblem').value = document.getElementById('skillProblem').value;
        document.getElementById('hiddenScenarios').value = document.getElementById('skillScenarios').value;
        document.getElementById('hiddenData').value = document.getElementById('skillData').value;
        document.getElementById('hiddenOutput').value = document.getElementById('skillOutput').value;
        document.getElementById('hiddenComplexity').value = estimateData.complexity;
        document.getElementById('hiddenTimeline').value = estimateData.timeline;
        document.getElementById('hiddenPrice').value = estimateData.price;
        document.getElementById('hiddenSummary').value = estimateData.summary;
        
        showStep('contact');
    });
    
    // Form submission
    document.getElementById('skillContactForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Honeypot validation
        if (this.website.value || this.phone_number.value || this.confirm_email.value) {
            console.log('Bot detected - honeypot filled');
            return false;
        }
        
        // Timestamp validation (must take at least 10 seconds for skill form)
        const timeElapsed = Date.now() - formOpenTime;
        if (timeElapsed < 10000) {
            console.log('Bot detected - form completed too quickly');
            return false;
        }
        
        const button = this.querySelector('button[type="submit"]');
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showStep('success');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            alert('Submission failed. Please email us directly at jed@powerofadvertising.com');
        } finally {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // Close success
    document.getElementById('closeSuccess')?.addEventListener('click', closeModal);
    
    // Reset form
    function resetForm() {
        document.getElementById('skillQuestionsForm')?.reset();
        document.getElementById('skillContactForm')?.reset();
        estimateData = {};
        showStep('intro');
    }
})();
