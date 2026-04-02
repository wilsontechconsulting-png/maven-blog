// AI Automation Readiness Quiz
(function() {
    const modal = document.getElementById('quizModal');
    const closeBtn = document.getElementById('quizClose');
    
    // Quiz questions
    const questions = [
        {
            id: 1,
            question: "How much time do you spend on repetitive tasks each week?",
            options: [
                { text: "Less than 5 hours", value: 1 },
                { text: "5-10 hours", value: 2 },
                { text: "10-20 hours", value: 3 },
                { text: "More than 20 hours", value: 4 }
            ]
        },
        {
            id: 2,
            question: "What's your biggest workflow bottleneck?",
            options: [
                { text: "Data entry and admin tasks", value: 3 },
                { text: "Content creation and writing", value: 4 },
                { text: "Customer communication", value: 3 },
                { text: "Analysis and reporting", value: 4 }
            ]
        },
        {
            id: 3,
            question: "How often do you forget important context or lose information?",
            options: [
                { text: "Rarely - I have great systems", value: 1 },
                { text: "Sometimes - things slip through", value: 2 },
                { text: "Often - it's a real problem", value: 3 },
                { text: "Constantly - I lose track daily", value: 4 }
            ]
        },
        {
            id: 4,
            question: "Have you tried automation tools before?",
            options: [
                { text: "No, never tried", value: 1 },
                { text: "Yes, but they didn't stick", value: 3 },
                { text: "Yes, using basic tools (Zapier, IFTTT)", value: 2 },
                { text: "Yes, using advanced tools (n8n, custom scripts)", value: 4 }
            ]
        },
        {
            id: 5,
            question: "How technical is your team?",
            options: [
                { text: "Non-technical (need simple solutions)", value: 2 },
                { text: "Basic tech literacy", value: 3 },
                { text: "Comfortable with tools", value: 4 },
                { text: "Developers on team", value: 4 }
            ]
        },
        {
            id: 6,
            question: "What would automation free you up to do?",
            options: [
                { text: "Focus on strategy", value: 4 },
                { text: "Spend time with clients", value: 3 },
                { text: "Build new products", value: 4 },
                { text: "Just reduce stress", value: 2 }
            ]
        },
        {
            id: 7,
            question: "How many team members handle repetitive work?",
            options: [
                { text: "Just me (solo)", value: 3 },
                { text: "2-5 people", value: 4 },
                { text: "6-10 people", value: 4 },
                { text: "10+ people", value: 4 }
            ]
        },
        {
            id: 8,
            question: "What's your monthly budget for productivity tools?",
            options: [
                { text: "Under $100/month", value: 2 },
                { text: "$100-500/month", value: 3 },
                { text: "$500-2000/month", value: 4 },
                { text: "$2000+/month", value: 4 }
            ]
        },
        {
            id: 9,
            question: "How do you currently track tasks and context?",
            options: [
                { text: "Email and memory", value: 1 },
                { text: "Spreadsheets", value: 2 },
                { text: "Project management tools", value: 3 },
                { text: "Custom systems", value: 4 }
            ]
        },
        {
            id: 10,
            question: "What's your timeline for improving efficiency?",
            options: [
                { text: "Just exploring options", value: 2 },
                { text: "Within 3-6 months", value: 3 },
                { text: "Within 1-3 months", value: 4 },
                { text: "ASAP - it's urgent", value: 4 }
            ]
        }
    ];
    
    let currentQuestion = 0;
    let answers = [];
    let quizScore = 0;
    
    // Open quiz function
    window.openAutomationQuiz = function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetQuiz();
    };
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Start quiz
    document.getElementById('startQuiz')?.addEventListener('click', function() {
        showStep('step-questions');
        renderQuestion();
    });
    
    // Show step
    function showStep(stepId) {
        document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
        document.getElementById(stepId)?.classList.add('active');
    }
    
    // Render question
    function renderQuestion() {
        const question = questions[currentQuestion];
        const container = document.getElementById('questionContainer');
        
        container.innerHTML = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((opt, idx) => `
                        <label class="quiz-option">
                            <input type="radio" name="q${question.id}" value="${opt.value}" data-text="${opt.text}">
                            <span class="option-text">${opt.text}</span>
                            <span class="option-check">✓</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Update progress
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        
        // Add listeners
        container.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', function() {
                document.getElementById('nextBtn').disabled = false;
                // Visual feedback
                container.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                this.closest('.quiz-option').classList.add('selected');
            });
        });
        
        // Update navigation
        document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
        document.getElementById('nextBtn').disabled = true;
    }
    
    // Next button
    document.getElementById('nextBtn')?.addEventListener('click', function() {
        const selected = document.querySelector(`input[name="q${questions[currentQuestion].id}"]:checked`);
        if (selected) {
            answers.push({
                question: questions[currentQuestion].question,
                answer: selected.dataset.text,
                value: parseInt(selected.value)
            });
            
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                // Quiz complete - show email gate
                calculateScore();
                showStep('step-email');
            }
        }
    });
    
    // Previous button
    document.getElementById('prevBtn')?.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            answers.pop();
            renderQuestion();
        }
    });
    
    // Calculate score
    function calculateScore() {
        quizScore = answers.reduce((sum, a) => sum + a.value, 0);
        const maxScore = questions.length * 4;
        const percentage = Math.round((quizScore / maxScore) * 100);
        
        // Store for results
        document.getElementById('hiddenScore').value = percentage;
        document.getElementById('hiddenAnswers').value = JSON.stringify(answers);
        
        return percentage;
    }
    
    // Email form submission
    document.getElementById('quizEmailForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Honeypot check
        if (this.website.value) return false;
        
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
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showResults();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // Show results
    function showResults() {
        const percentage = calculateScore();
        showStep('step-results');
        
        // Animate score
        animateScore(percentage);
        
        // Determine level and recommendations
        let level, description, recommendations;
        
        if (percentage < 30) {
            level = "Automation Beginner";
            description = "You're just getting started - lots of opportunity ahead!";
            document.getElementById('hiddenLevel').value = "Beginner";
            recommendations = [
                { icon: "📝", title: "Start with Content Automation", desc: "Blog posts, emails, reports - reduce 10-15 hours/week" },
                { icon: "💾", title: "Add Memory Systems", desc: "Stop losing context and re-explaining things" },
                { icon: "📊", title: "Simple Data Collection", desc: "Automate spreadsheet updates and reporting" }
            ];
        } else if (percentage < 60) {
            level = "Automation Explorer";
            description = "You've started but there's untapped potential!";
            document.getElementById('hiddenLevel').value = "Explorer";
            recommendations = [
                { icon: "🔄", title: "Multi-Step Workflows", desc: "Chain tools together for complex processes" },
                { icon: "🧠", title: "Smart Decision Making", desc: "AI that handles conditional logic automatically" },
                { icon: "⚡", title: "Real-Time Processing", desc: "Respond to events as they happen" }
            ];
        } else if (percentage < 80) {
            level = "Automation Professional";
            description = "You're advanced - ready for autonomous systems!";
            document.getElementById('hiddenLevel').value = "Professional";
            recommendations = [
                { icon: "🤖", title: "Full Autonomy", desc: "Systems that work independently with oversight" },
                { icon: "📈", title: "Self-Improvement", desc: "AI that learns and optimizes itself" },
                { icon: "🔗", title: "Deep Integrations", desc: "Connect every tool in your stack" }
            ];
        } else {
            level = "Automation Expert";
            description = "You're ready to build a complete AI company!";
            document.getElementById('hiddenLevel').value = "Expert";
            recommendations = [
                { icon: "🏢", title: "AI Product Company", desc: "45+ skills working as a complete team" },
                { icon: "🎯", title: "Strategic Orchestration", desc: "Meta-level system coordination" },
                { icon: "💡", title: "Predictive Intelligence", desc: "AI that anticipates your needs" }
            ];
        }
        
        document.getElementById('scoreLevel').textContent = level;
        document.getElementById('scoreDescription').textContent = description;
        
        const recsContainer = document.getElementById('recommendationsContainer');
        recsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="rec-icon">${rec.icon}</div>
                <div class="rec-content">
                    <h5>${rec.title}</h5>
                    <p>${rec.desc}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Animate score circle
    function animateScore(percentage) {
        const circle = document.getElementById('scoreCircle');
        const number = document.getElementById('scoreNumber');
        const circumference = 565;
        const offset = circumference - (percentage / 100) * circumference;
        
        let current = 0;
        const duration = 2000;
        const start = Date.now();
        
        function animate() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            current = Math.floor(progress * percentage);
            number.textContent = current;
            circle.style.strokeDashoffset = circumference - (current / 100) * circumference;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    // Reset quiz
    function resetQuiz() {
        currentQuestion = 0;
        answers = [];
        quizScore = 0;
        showStep('step-start');
    }
})();
