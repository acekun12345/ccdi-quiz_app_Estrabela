import React, { useState } from 'react';
import { quizQuestions } from './quizData';
import type { AnswerStatus } from './types';
import { Check, X, HelpCircle, Trophy, RotateCcw, PlayCircle, ArrowRight } from 'lucide-react';
import './App.css';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerStatus[]>(
    Array(quizQuestions.length).fill('unanswered')
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Simulan ang Quiz
  const handleStartQuiz = () => {
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  // Submit ng Sagot sa Kasalukuyang Tanong
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = isCorrect ? 'correct' : 'wrong';
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswerSubmitted(true);
  };

  // Lumipat sa Susunod na Tanong
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    setUserAnswers(Array(quizQuestions.length).fill('unanswered'));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsQuizFinished(false);
    setHasStarted(false);
  };

  return (
    <div className="quiz-container">
      {/* HEADER */}
      <header className="quiz-header">
        <h1>CCDI React Quiz Portal</h1>
        <p>Topic: Conditional Rendering & Modal Components</p>
      </header>

      {/* TOP PROGRESS TRACKER (Pakita kapag nag-start na) */}
      {hasStarted && (
        <div className="progress-bar-card">
          <h3>Quiz Progress Tracker</h3>
          <div className="progress-items-grid">
            {userAnswers.map((status, index) => (
              <div
                key={index}
                className={`progress-item ${status} ${currentQuestionIndex === index && !isQuizFinished ? 'active' : ''}`}
              >
                <span className="item-number">#{index + 1}</span>

                {/* CONDITIONAL RENDERING NG ICONS */}
                {status === 'correct' && <Check className="icon check-icon" size={18} />}
                {status === 'wrong' && <X className="icon wrong-icon" size={18} />}
                {status === 'unanswered' && <HelpCircle className="icon pending-icon" size={18} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONDITIONAL RENDERING 1: START SCREEN */}
      {!hasStarted && (
        <div className="start-card">
          <h2>Welcome to React Quiz!</h2>
          <p> may 10 multiple-choice items tungkol sa Conditional Rendering at Modals.</p>
          <button className="btn-start" onClick={handleStartQuiz}>
            <PlayCircle size={22} /> Start Quiz
          </button>
        </div>
      )}

      {/* CONDITIONAL RENDERING 2: QUIZ MODAL PAGE (Habang nagse-session) */}
      {hasStarted && !isQuizFinished && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>

            <h3 className="question-text">
              {quizQuestions[currentQuestionIndex].question}
            </h3>

            <div className="options-list">
              {quizQuestions[currentQuestionIndex].options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  disabled={isAnswerSubmitted}
                  className={`option-btn ${selectedOption === optIdx ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(optIdx)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="modal-footer">
              {!isAnswerSubmitted ? (
                <button
                  className="btn-submit"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="btn-next" onClick={handleNextQuestion}>
                  {currentQuestionIndex + 1 === quizQuestions.length ? 'View Results' : 'Next Question'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONDITIONAL RENDERING 3: FINAL SCORE SUMMARY */}
      {isQuizFinished && (
        <div className="results-card">
          <Trophy size={64} className="trophy-icon" />
          <h2>Quiz Completed!</h2>
          <p className="score-text">
            Your Score: <span>{score}</span> / {quizQuestions.length}
          </p>
          <p className="score-percentage">
            Percentage: {((score / quizQuestions.length) * 100).toFixed(0)}%
          </p>

          <button className="btn-restart" onClick={handleRestart}>
            <RotateCcw size={18} /> Take Quiz Again
          </button>
        </div>
      )}
    </div>
  );
}