/**
 * Quiz Module - Interactive Quiz for Sala 6
 * Implements a clean, modular quiz system with immediate feedback
 */

class Quiz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.quizData = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
    }

    /**
     * Initialize quiz by loading data and rendering first question
     */
    async init() {
        try {
            await this.loadQuizData();
            this.renderQuizStart();
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.renderError();
        }
    }

    /**
     * Load quiz data from JSON
     */
    async loadQuizData() {
        const response = await fetch('data/ca/quiz.json');
        if (!response.ok) {
            throw new Error('Failed to load quiz data');
        }
        this.quizData = await response.json();
    }

    /**
     * Render quiz start screen
     */
    renderQuizStart() {
        this.container.innerHTML = `
            <div class="quiz-start">
                <h3>${this.quizData.title}</h3>
                <p class="quiz-subtitle">${this.quizData.subtitle}</p>
                <p class="quiz-info">10 preguntes · Nivell progressiu</p>
                <button class="btn btn-primary quiz-start-btn" id="startQuizBtn">
                    Començar el quiz
                </button>
            </div>
        `;

        document.getElementById('startQuizBtn').addEventListener('click', () => {
            this.renderQuestion();
        });
    }

    /**
     * Render current question
     */
    renderQuestion() {
        if (this.currentQuestionIndex >= this.quizData.questions.length) {
            this.renderResults();
            return;
        }

        const question = this.quizData.questions[this.currentQuestionIndex];
        this.isAnswered = false;

        this.container.innerHTML = `
            <div class="quiz-question-container">
                <div class="quiz-header">
                    <span class="quiz-progress">Pregunta ${this.currentQuestionIndex + 1} de ${this.quizData.questions.length}</span>
                    <span class="quiz-difficulty badge-${question.difficulty}">${this.getDifficultyLabel(question.difficulty)}</span>
                </div>
                
                <div class="quiz-question">
                    <p>${question.question}</p>
                </div>

                <div class="quiz-options" id="quizOptions">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">
                            <span class="option-letter">${String.fromCharCode(97 + index)}</span>
                            <span class="option-text">${option}</span>
                            <span class="option-icon"></span>
                        </button>
                    `).join('')}
                </div>

                <div class="quiz-feedback" id="quizFeedback"></div>

                <div class="quiz-actions">
                    <button class="btn btn-outline" id="nextBtn" disabled>
                        Següent pregunta →
                    </button>
                </div>
            </div>
        `;

        this.attachOptionListeners();
    }

    /**
     * Attach click listeners to option buttons
     */
    attachOptionListeners() {
        const options = document.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('nextBtn');

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                if (this.isAnswered) return;

                const selectedIndex = parseInt(e.currentTarget.dataset.index);
                this.checkAnswer(selectedIndex);
                nextBtn.disabled = false;
            });
        });

        nextBtn.addEventListener('click', () => {
            this.currentQuestionIndex++;
            this.renderQuestion();
        });
    }

    /**
     * Check if selected answer is correct and show feedback
     */
    checkAnswer(selectedIndex) {
        this.isAnswered = true;
        const question = this.quizData.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;

        if (isCorrect) {
            this.score++;
        }

        this.userAnswers.push({
            questionId: question.id,
            selected: selectedIndex,
            correct: question.correct,
            isCorrect: isCorrect
        });

        // Update UI
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.disabled = true;

            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Show feedback
        this.showFeedback(isCorrect, question.explanation);

        // Play sound effect
        this.playSound(isCorrect);
    }

    /**
     * Show feedback message
     */
    showFeedback(isCorrect, explanation) {
        const feedback = document.getElementById('quizFeedback');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'} show`;
        feedback.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
            <div class="feedback-content">
                <strong>${isCorrect ? 'Correcte!' : 'Incorrecte'}</strong>
                <p>${explanation}</p>
            </div>
        `;
    }

    /**
     * Play sound effect (simple beep using Web Audio API)
     */
    playSound(isCorrect) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = isCorrect ? 800 : 400;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            // Silently fail if Web Audio API is not supported
        }
    }

    /**
     * Render final results
     */
    renderResults() {
        const percentage = Math.round((this.score / this.quizData.questions.length) * 100);
        const message = this.getScoringMessage();

        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-score">
                    <div class="score-circle">
                        <svg viewBox="0 0 100 100">
                            <circle class="score-bg" cx="50" cy="50" r="45"></circle>
                            <circle class="score-progress" cx="50" cy="50" r="45" 
                                style="stroke-dashoffset: ${283 - (283 * percentage / 100)}"></circle>
                        </svg>
                        <div class="score-text">
                            <span class="score-number">${this.score}</span>
                            <span class="score-total">/ ${this.quizData.questions.length}</span>
                        </div>
                    </div>
                    <p class="score-percentage">${percentage}% encerts</p>
                </div>

                <div class="results-message">
                    <h3>${message.title}</h3>
                    <p>${message.message}</p>
                </div>

                <div class="results-actions">
                    <button class="btn btn-primary" id="restartBtn">
                        Tornar a intentar
                    </button>
                    <a href="index.html" class="btn btn-outline">
                        Tornar a l'inici
                    </a>
                </div>
            </div>
        `;

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.reset();
            this.renderQuizStart();
        });
    }

    /**
     * Get scoring message based on score
     */
    getScoringMessage() {
        for (const msg of this.quizData.scoringMessages) {
            if (this.score >= msg.min && this.score <= msg.max) {
                return msg;
            }
        }
        return this.quizData.scoringMessages[0];
    }

    /**
     * Get difficulty label in Catalan
     */
    getDifficultyLabel(difficulty) {
        const labels = {
            'easy': 'Fàcil',
            'medium': 'Mitjà',
            'hard': 'Difícil'
        };
        return labels[difficulty] || difficulty;
    }

    /**
     * Reset quiz state
     */
    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
    }

    /**
     * Render error message
     */
    renderError() {
        this.container.innerHTML = `
            <div class="quiz-error">
                <p>Error al carregar el quiz. Si us plau, torna-ho a intentar.</p>
                <button class="btn btn-outline" onclick="location.reload()">
                    Recarregar
                </button>
            </div>
        `;
    }
}

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const quiz = new Quiz('quiz-container');
        quiz.init();
    }
});