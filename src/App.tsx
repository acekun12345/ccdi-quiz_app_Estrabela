import { useEffect, useReducer, useRef } from 'react';
import { quizQuestions } from './quizData';
import type { AnswerStatus, QuizPhase } from './types';
import './App.css';

interface QuizState {
  phase: QuizPhase;
  currentIndex: number;

  // String na mismo ang selected answer.
  selectedOption: string | null;

  // null = hindi pa nasasagutan.
  answers: (string | null)[];
}

type QuizAction =
  | { type: 'START' }
  | { type: 'SELECT'; option: string }
  | { type: 'SUBMIT' }
  | { type: 'NEXT' }
  | { type: 'HOME' };

const letters = ['A', 'B', 'C', 'D'];
const total = quizQuestions.length;

function createInitialState(
  phase: QuizPhase = 'start',
): QuizState {
  return {
    phase,
    currentIndex: 0,
    selectedOption: null,
    answers: Array<string | null>(total).fill(null),
  };
}

function quizReducer(
  state: QuizState,
  action: QuizAction,
): QuizState {
  if (action.type === 'START') {
    return createInitialState('quiz');
  }

  if (action.type === 'HOME') {
    return createInitialState();
  }

  if (state.phase !== 'quiz') {
    return state;
  }

  const question = quizQuestions[state.currentIndex];

  if (!question) {
    return state;
  }

  const submitted =
    state.answers[state.currentIndex] !== null;

  switch (action.type) {
    case 'SELECT': {
      // Hindi na puwedeng baguhin kapag submitted na.
      if (
        submitted ||
        !question.options.includes(action.option)
      ) {
        return state;
      }

      return {
        ...state,
        selectedOption: action.option,
      };
    }

    case 'SUBMIT': {
      // Prevent empty answers at duplicate submission.
      if (
        submitted ||
        state.selectedOption === null ||
        !question.options.includes(state.selectedOption)
      ) {
        return state;
      }

      const answers = [...state.answers];

      answers[state.currentIndex] = state.selectedOption;

      return {
        ...state,
        answers,
      };
    }

    case 'NEXT': {
      if (!submitted) {
        return state;
      }

      if (state.currentIndex === total - 1) {
        return {
          ...state,
          phase: 'results',
        };
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedOption: null,
      };
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(
    quizReducer,
    undefined,
    () => createInitialState(),
  );

  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);

  const question = quizQuestions[state.currentIndex];

  const submitted =
    state.answers[state.currentIndex] !== null;

  const answeredCount = state.answers.filter(
    (answer) => answer !== null,
  ).length;

  // Compare ang saved answer sa string answer ng question.
  // Derived ang score para hindi madoble ang points.
  const score = state.answers.reduce<number>(
    (count, savedAnswer, index) => {
      const item = quizQuestions[index];

      if (savedAnswer !== null && savedAnswer === item.answer) {
        return count + 1;
      }

      return count;
    },
    0,
  );

  const percentage = Math.round((score / total) * 100);
  const progress = Math.round((answeredCount / total) * 100);

  const isCorrect =
    state.selectedOption === question.answer;

  const isLastQuestion =
    state.currentIndex === total - 1;

  const resultTitle =
    percentage === 100
      ? 'Perfect score. Ang galing!'
      : percentage >= 70
        ? 'Nice work! Keep it going.'
        : 'Good start. Practice pa tayo!';

  const resultMessage =
    percentage === 100
      ? 'Nasagot mo nang tama ang lahat ng tanong. Ready ka na para sa next challenge.'
      : percentage >= 70
        ? 'Maganda na ang understanding mo. Balikan ang explanations para mas tumibay pa.'
        : 'Bawat attempt ay chance para matuto. Review muna ang answers, then try again.';

  useEffect(() => {
    if (hasMounted.current) {
      headingRef.current?.focus();
    } else {
      hasMounted.current = true;
    }
  }, [state.phase, state.currentIndex]);

  function getStatus(index: number): AnswerStatus {
    const savedAnswer = state.answers[index];

    if (savedAnswer === null) {
      return 'unanswered';
    }

    return savedAnswer === quizQuestions[index].answer
      ? 'correct'
      : 'wrong';
  }

  return (
    <div className="quiz-app">
      <header className="site-header">
        <a
          className="brand"
          href="#main-content"
          aria-label="CCDI React Lab"
        >
          <span className="brand-mark" aria-hidden="true">
            {'</>'}
          </span>

          <span>
            <strong>CCDI</strong>
            <span className="brand-subtitle">
              React Lab
            </span>
          </span>
        </a>

        <span className="header-tag">
          <span
            className="status-dot"
            aria-hidden="true"
          />
          Practice mode
        </span>
      </header>

      <main id="main-content" className="main-content">
        {state.phase === 'start' && (
          <section className="welcome-layout">
            <div className="welcome-copy">
              <span className="eyebrow">
                LEARN. PRACTICE. BUILD.
              </span>

              <h1 ref={headingRef} tabIndex={-1}>
                Welcome to my Quiz
                <br />
                <span className="gradient-text">
                  Coded by Estrabela.
                </span>
              </h1>

              <p className="intro">
                Gaano mo kakilala ang React? Test your skills sa
                conditional rendering, JSX, at modal components—one
                question at a time.
              </p>

              <div
                className="topic-tags"
                aria-label="Quiz topics"
              >
                <span>Conditional Rendering</span>
                <span>React Hooks</span>
                <span>Modals</span>
              </div>

              <div
                className="code-preview"
                aria-label="React code example"
              >
                <div
                  className="code-toolbar"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                  <small>your-next-level.tsx</small>
                </div>

                <pre>
                  <code>
                    <span className="code-purple">
                      const
                    </span>
                    {' readyToLearn = '}
                    <span className="code-green">
                      true
                    </span>
                    {';\n\n'}
                    <span className="code-purple">
                      return
                    </span>
                    {' readyToLearn && (\n  '}
                    <span className="code-blue">
                      {'<YourNextLevel />'}
                    </span>
                    {'\n);'}
                  </code>
                </pre>
              </div>
            </div>

            <div className="panel start-panel">
              <span
                className="large-icon"
                aria-hidden="true"
              >
                ⚡
              </span>

              <span className="eyebrow">
                THE REACT CHECKPOINT
              </span>

              <h2>Ready for the challenge?</h2>

              <p className="muted">
                A quick knowledge check para sa next React
                developer.
              </p>

              <div className="start-stats">
                <div>
                  <strong>{total}</strong>
                  <span>Questions</span>
                </div>

                <div>
                  <strong>MCQ</strong>
                  <span>Format</span>
                </div>

                <div>
                  <strong>∞</strong>
                  <span>No timer</span>
                </div>
              </div>

              <ul className="instructions">
                <li>
                  Pumili ng isang sagot sa bawat tanong.
                </li>
                <li>
                  I-check ang answer para makita ang explanation.
                </li>
                <li>
                  I-review ang results at ulitin anytime.
                </li>
              </ul>

              <button
                type="button"
                className="button button-primary"
                onClick={() => dispatch({ type: 'START' })}
              >
                Let&apos;s start
                <span aria-hidden="true">→</span>
              </button>

              <p className="small-note">
                No pressure. Learn at your own pace.
              </p>
            </div>
          </section>
        )}

        {state.phase === 'quiz' && (
          <div className="quiz-layout">
            <aside
              className="panel progress-panel"
              aria-label="Quiz progress"
            >
              <span className="eyebrow">
                YOUR SESSION
              </span>

              <h2>Keep the momentum.</h2>

              <p className="muted">
                One question closer to mastering the basics.
              </p>

              <div className="progress-label">
                <span>Completed</span>
                <strong>
                  {answeredCount}/{total}
                </strong>
              </div>

              <progress
                className="progress-meter"
                value={answeredCount}
                max={total}
                aria-label="Answered questions"
              />

              <ol className="question-tracker">
                {quizQuestions.map((item, index) => {
                  const status = getStatus(index);
                  const active =
                    index === state.currentIndex;

                  return (
                    <li
                      key={item.qnum}
                      className={`tracker-item ${status} ${
                        active ? 'active' : ''
                      }`}
                      aria-current={
                        active ? 'step' : undefined
                      }
                      aria-label={`Question ${item.qnum}: ${status}`}
                    >
                      <span aria-hidden="true">
                        {status === 'correct'
                          ? '✓'
                          : status === 'wrong'
                            ? '×'
                            : item.qnum}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="tracker-legend">
                <span>
                  <i className="legend-correct" />
                  Correct
                </span>

                <span>
                  <i className="legend-wrong" />
                  Incorrect
                </span>

                <span>
                  <i className="legend-pending" />
                  Pending
                </span>
              </div>

              <div className="session-note">
                <span aria-hidden="true">✦</span>
                <p>
                  Take your time. Mas mahalaga ang understanding
                  kaysa sa bilis.
                </p>
              </div>
            </aside>

            <section className="panel question-panel">
              <div className="question-topline">
                <span className="topic-pill">
                  {question.category}
                </span>

                <span className="question-counter">
                  {String(question.qnum).padStart(2, '0')}
                  <span>
                    {' / '}
                    {String(total).padStart(2, '0')}
                  </span>
                </span>
              </div>

              <h1
                ref={headingRef}
                tabIndex={-1}
                className="question-title"
              >
                {question.questionText}
              </h1>

              <p className="muted question-hint">
                Piliin ang pinakaangkop na sagot.
              </p>

              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  dispatch({
                    type: submitted ? 'NEXT' : 'SUBMIT',
                  });
                }}
              >
                <fieldset
                  className="options"
                  disabled={submitted}
                >
                  <legend className="sr-only">
                    Answer choices
                  </legend>

                  {question.options.map((option, index) => {
                    const selected =
                      state.selectedOption === option;

                    const correctOption =
                      option === question.answer;

                    const optionState = submitted
                      ? correctOption
                        ? 'is-correct'
                        : selected
                          ? 'is-wrong'
                          : ''
                      : selected
                        ? 'is-selected'
                        : '';

                    return (
                      <label
                        key={`${question.qnum}-${index}`}
                        className={`option ${optionState}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.qnum}`}
                          value={option}
                          checked={selected}
                          onChange={() =>
                            dispatch({
                              type: 'SELECT',
                              option,
                            })
                          }
                        />

                        <span
                          className="option-letter"
                          aria-hidden="true"
                        >
                          {letters[index]}
                        </span>

                        <span className="option-text">
                          {option}
                        </span>

                        {submitted && correctOption && (
                          <span className="answer-mark">
                            <span aria-hidden="true">
                              ✓
                            </span>
                            <span className="sr-only">
                              Correct answer
                            </span>
                          </span>
                        )}

                        {submitted &&
                          selected &&
                          !correctOption && (
                            <span className="answer-mark">
                              <span aria-hidden="true">
                                ×
                              </span>
                              <span className="sr-only">
                                Incorrect answer
                              </span>
                            </span>
                          )}
                      </label>
                    );
                  })}
                </fieldset>

                <div
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {submitted && (
                    <div
                      className={`feedback ${
                        isCorrect
                          ? 'feedback-correct'
                          : 'feedback-wrong'
                      }`}
                    >
                      <strong>
                        {isCorrect
                          ? '✓ Tama! Nice work.'
                          : '↗ Not quite. Heto ang explanation.'}
                      </strong>

                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="question-footer">
                  <span className="footer-hint">
                    {submitted
                      ? 'Answer saved'
                      : state.selectedOption !== null
                        ? 'Ready to check your answer'
                        : 'Select an answer to continue'}
                  </span>

                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={
                      !submitted &&
                      state.selectedOption === null
                    }
                  >
                    {submitted
                      ? isLastQuestion
                        ? 'View results'
                        : 'Next question'
                      : 'Check answer'}

                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {state.phase === 'results' && (
          <section className="results-layout">
            <div className="panel result-panel">
              <span className="eyebrow">
                SESSION COMPLETE
              </span>

              <div
                className="score-ring"
                style={{
                  background: `conic-gradient(
                    var(--accent) ${percentage}%,
                    var(--line) 0
                  )`,
                }}
                role="img"
                aria-label={`Score: ${percentage} percent`}
              >
                <div aria-hidden="true">
                  <strong>
                    {percentage}
                    <small>%</small>
                  </strong>
                  <span>YOUR SCORE</span>
                </div>
              </div>

              <h1 ref={headingRef} tabIndex={-1}>
                {resultTitle}
              </h1>

              <p className="muted result-description">
                {resultMessage}
              </p>

              <div className="result-stats">
                <div>
                  <strong className="text-green">
                    {score}
                  </strong>
                  <span>Correct</span>
                </div>

                <div>
                  <strong className="text-red">
                    {total - score}
                  </strong>
                  <span>Incorrect</span>
                </div>

                <div>
                  <strong>{progress}%</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div className="result-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() =>
                    dispatch({ type: 'START' })
                  }
                >
                  <span aria-hidden="true">↻</span>
                  Try again
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    dispatch({ type: 'HOME' })
                  }
                >
                  Back to home
                </button>
              </div>
            </div>

            <div className="review-section">
              <div className="review-heading">
                <div>
                  <span className="eyebrow">
                    LOOK BACK & LEARN
                  </span>
                  <h2>Your answer review</h2>
                </div>

                <span className="muted">
                  {total} questions
                </span>
              </div>

              <div className="review-list">
                {quizQuestions.map((item, index) => {
                  const savedAnswer = state.answers[index];
                  const correct =
                    savedAnswer === item.answer;

                  return (
                    <details
                      className="review-item"
                      key={item.qnum}
                    >
                      <summary>
                        <span
                          className={`review-status ${
                            correct
                              ? 'text-green'
                              : 'text-red'
                          }`}
                          aria-label={
                            correct ? 'Correct' : 'Incorrect'
                          }
                        >
                          {correct ? '✓' : '×'}
                        </span>

                        <span className="review-question">
                          <small>
                            QUESTION {item.qnum}
                          </small>
                          <span>
                            {item.questionText}
                          </span>
                        </span>

                        <span
                          className="review-toggle"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>

                      <div className="review-body">
                        <p>
                          <span>Your answer</span>
                          <strong
                            className={
                              correct
                                ? 'text-green'
                                : 'text-red'
                            }
                          >
                            {savedAnswer ?? 'No answer'}
                          </strong>
                        </p>

                        {!correct && (
                          <p>
                            <span>Correct answer</span>
                            <strong className="text-green">
                              {item.answer}
                            </strong>
                          </p>
                        )}

                        <div className="review-explanation">
                          {item.explanation}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <span>CCDI React Lab</span>
        <span>Built for curious minds.</span>
      </footer>
    </div>
  );
}