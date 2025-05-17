import React, { useState } from 'react';

export default function VideoForm({ initialData = {}, onSubmit, submitLabel = 'Save', mode = 'upload' }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    url: initialData.url || '',
    tags: (initialData.tags || []).join ? (initialData.tags || []).join(', ') : (initialData.tags || ''),
    difficulty: initialData.difficulty || '',
    category: initialData.category || '',
    duration: initialData.duration || '',
    codeSnippets: initialData.codeSnippets || [],
    quiz: initialData.quiz || [],
    isPublic: initialData.isPublic !== undefined ? initialData.isPublic : true,
  });
  const [snippet, setSnippet] = useState({ timestamp: '', code: '', language: '' });
  const [quizQ, setQuizQ] = useState({ question: '', options: '', answer: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSnippet = () => {
    if (!snippet.timestamp || !snippet.code || !snippet.language) return;
    setForm({ ...form, codeSnippets: [...form.codeSnippets, { ...snippet, timestamp: Number(snippet.timestamp) }] });
    setSnippet({ timestamp: '', code: '', language: '' });
  };

  const removeSnippet = idx => {
    setForm({ ...form, codeSnippets: form.codeSnippets.filter((_, i) => i !== idx) });
  };

  const addQuizQ = () => {
    if (!quizQ.question || !quizQ.options) return;
    setForm({ ...form, quiz: [...form.quiz, { ...quizQ, options: quizQ.options.split(',').map(o => o.trim()), answer: Number(quizQ.answer) }] });
    setQuizQ({ question: '', options: '', answer: 0 });
  };

  const removeQuizQ = idx => {
    setForm({ ...form, quiz: form.quiz.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await onSubmit({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
        duration: Number(form.duration),
      });
      setSuccess(mode === 'upload' ? 'Video uploaded!' : 'Video updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save video');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Title</label>
        <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label>Description</label>
        <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label>YouTube/Vimeo Embed URL</label>
        <input name="url" className="form-control" value={form.url} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label>Tags (comma separated)</label>
        <input name="tags" className="form-control" value={form.tags} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label>Difficulty</label>
        <input name="difficulty" className="form-control" value={form.difficulty} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label>Category</label>
        <input name="category" className="form-control" value={form.category} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label>Duration (seconds)</label>
        <input name="duration" type="number" className="form-control" value={form.duration} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label>Code Snippets</label>
        <div className="d-flex gap-2 mb-2">
          <input placeholder="Timestamp (sec)" type="number" className="form-control" style={{ maxWidth: 120 }} value={snippet.timestamp} onChange={e => setSnippet({ ...snippet, timestamp: e.target.value })} />
          <input placeholder="Language" className="form-control" style={{ maxWidth: 120 }} value={snippet.language} onChange={e => setSnippet({ ...snippet, language: e.target.value })} />
          <input placeholder="Code" className="form-control" value={snippet.code} onChange={e => setSnippet({ ...snippet, code: e.target.value })} />
          <button type="button" className="btn btn-outline-primary" onClick={addSnippet}>Add</button>
        </div>
        <ul className="list-group mb-2">
          {form.codeSnippets.map((s, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              <span><b>{new Date(s.timestamp * 1000).toISOString().substr(11, 8)}</b> [{s.language}] <pre className="d-inline">{s.code}</pre></span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSnippet(i)}>&times;</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <label>Quiz (optional)</label>
        <div className="d-flex gap-2 mb-2">
          <input placeholder="Question" className="form-control" value={quizQ.question} onChange={e => setQuizQ({ ...quizQ, question: e.target.value })} />
          <input placeholder="Options (comma)" className="form-control" value={quizQ.options} onChange={e => setQuizQ({ ...quizQ, options: e.target.value })} />
          <input placeholder="Answer (index)" type="number" className="form-control" style={{ maxWidth: 80 }} value={quizQ.answer} onChange={e => setQuizQ({ ...quizQ, answer: e.target.value })} />
          <button type="button" className="btn btn-outline-primary" onClick={addQuizQ}>Add</button>
        </div>
        <ul className="list-group mb-2">
          {form.quiz.map((q, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              <span><b>{q.question}</b> [Options: {q.options.join(', ')}] [Answer: {q.answer}]</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeQuizQ(i)}>&times;</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} id="isPublic" />
        <label className="form-check-label" htmlFor="isPublic">Public</label>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
} 