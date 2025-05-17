import React, { useEffect, useState } from 'react';
import { getQuiz } from '../api/quiz';

export default function Quiz({ videoId }) {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line
  }, [videoId]);

  const fetchQuiz = async () => {
    const data = await getQuiz(videoId);
    setQuiz(data);
    setAnswers(Array(data.length).fill(null));
    setSubmitted(false);
  };

  const handleChange = (i, val) => {
    setAnswers(ans => ans.map((a, idx) => (idx === i ? Number(val) : a)));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!quiz.length) return null;

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center mb-3">
        <i className="bi bi-question-circle fs-5 text-primary me-2"></i>
        <h5 className="mb-0">Quiz</h5>
      </div>
      <form onSubmit={handleSubmit} className="quiz-form">
        {quiz.map((q, i) => (
          <div key={i} className="mb-4 p-3 rounded bg-light border">
            <div className="fw-semibold mb-2">{i + 1}. {q.question}</div>
            <div className="row">
              {q.options.map((opt, j) => (
                <div key={j} className="col-12 col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={answers[i] === j}
                      onChange={e => handleChange(i, e.target.value)}
                      disabled={submitted}
                      id={`q${i}opt${j}`}
                    />
                    <label className="form-check-label" htmlFor={`q${i}opt${j}`}>{opt}</label>
                  </div>
                </div>
              ))}
            </div>
            {submitted && (
              <div className={answers[i] === q.answer ? 'text-success mt-2' : 'text-danger mt-2'}>
                {answers[i] === q.answer ? (
                  <><i className="bi bi-check-circle me-1"></i>Correct!</>
                ) : (
                  <><i className="bi bi-x-circle me-1"></i>Wrong. Correct: <b>{q.options[q.answer]}</b></>
                )}
              </div>
            )}
          </div>
        ))}
        {!submitted && <button className="btn btn-primary px-4 fw-semibold" type="submit">Submit Quiz</button>}
      </form>
    </div>
  );
} 