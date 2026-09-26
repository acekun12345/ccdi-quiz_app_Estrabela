import React, { useState } from 'react';
import { quizQuestions } from './quizData';
import type { AnswerStatus } from './types';
import { Check, X, HelpCircle, Trophy, RotateCcw } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerStatus[]>(
    Array(quizQuestions.length).fill('unanswered')
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Buksan ang Modal para sa napiling tanong
  const handleOpenQuestion = (index: number) => {
    if (userAnswers[index] !== 'unanswered') return;
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
    setIsModalOpen(true);
  };

  // Submit Answer Handler
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

    setIsModalOpen(false);

    // Check kung tapos na ang 10 items
    const remainingUnanswered = newAnswers.filter((status) => status === 'unanswered').length;
    if (remainingUnanswered === 0) {
      setIsQuizFinished(true);
    }
  };

  // Restart Quiz Handler
  const handleRestart = () => {
    setUserAnswers(Array(quizQuestions.length).fill('unanswered'));
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
    setIsModalOpen(false);
  };

  return (
    <div className="quiz-container">
      {/* HEADER */}
      <header className="quiz-header">
        <h1>CCDI React Quiz Portal</h1>
        <p>Topic: Conditional Rendering & Modal Components</p>
      </header>

      {/* TOP PROGRESS TRACKER (10 Items) */}
      <div className="progress-bar-card">
        <h3>Quiz Progress Tracker</h3>
        <div className="progress-items-grid">
          {userAnswers.map((status, index) => (
            <button
              key={index}
              className={`progress-item ${status} ${currentQuestionIndex === index && isModalOpen ? 'active' : ''}`}
              onClick={() => handleOpenQuestion(index)}
              disabled={status !== 'unanswered'}
            >
              <span className="item-number">#{index + 1}</span>

              {/* CONDITIONAL RENDERING NG ICONS */}
              {status === 'correct' && <Check className="icon check-icon" size={18} />}
              {status === 'wrong' && <X className="icon wrong-icon" size={18} />}
              {status === 'unanswered' && <HelpCircle className="icon pending-icon" size={18} />}
            </button>
          ))}
        </div>
      </div>

      {/* CONDITIONAL RENDERING: SUMMARY PAGE O INSTRUCTIONS */}
      {isQuizFinished ? (
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
      ) : (
        <div className="instructions-card">
          <h3>Instructions:</h3>
          <p>Click on any question number above to open the modal and submit your answer.</p>
        </div>
      )}

      {/* CONDITIONAL RENDERING: MODAL POPUP */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <h3 className="question-text">
              {quizQuestions[currentQuestionIndex].question}
            </h3>

            <div className="options-list">
              {quizQuestions[currentQuestionIndex].options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  className={`option-btn ${selectedOption === optIdx ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(optIdx)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="modal-footer">
              <button
                className="btn-submit"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}