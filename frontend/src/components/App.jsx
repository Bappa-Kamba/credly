import React, { useState } from 'react';
import '../styles/App.css';
import '../styles/Form.css';
import LoadingSpinner from './LoadingSpinner';
import ResultComponent from './ResultComponents';

function App() {
  const currentYear = new Date().getFullYear();
  const [PIN, setPIN] = useState('');
  const [ExamType, setExamType] = useState('');
  const [ExamName, setExamName] = useState('');
  const [ExamYear, setExamYear] = useState(currentYear);
  const [CandidateNo, setCandidateNo] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Map ExamType values to names
  const examTypeOptions = {
    1: 'WASSCE (For School Candidates)',
    2: 'WASSCE (For Private Candidates)',
  };

  const examTypeHandler = ({ target: { value } }) => {
    setExamType(value);
    setExamName(examTypeOptions[value] || '');
  };

  const validateForm = () => PIN && ExamType && ExamYear && CandidateNo;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PIN, ExamType, ExamYear, CandidateNo, ExamName,
          }),
        });
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError('Verification failed. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Please fill out all fields correctly.');
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>University Document Verification</h1>
        <p>Verify the authenticity of your WAEC and NECO certificates</p>
      </header>
      <main style={{ marginTop: '60px' }}>
        <div className="centered-container">
          {error && <p className="error">{error}</p>}
          {loading && <LoadingSpinner />}
        </div>
        <div className="verification-form">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group mb-4">
              <label htmlFor="PIN" className="f-15">Reference PIN*</label>
              <input
                type="text"
                id="PIN"
                value={PIN}
                onChange={(e) => setPIN(e.target.value)}
                placeholder="Reference PIN"
                required
              />
            </div>
            <div className="form-group mb-4" style={'display:flex; flex-direction: row'}>
                   <div >
              <label htmlFor="ExamYear" className="f-15">Exam Year*</label>
              <select
                id="ExamYear"
                value={ExamYear}
                onChange={(e) => setExamYear(Number(e.target.value))}
                required
              >
                {[...Array(currentYear - 1977).keys()].map((i) => {
                  const year = currentYear - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            <div>

          
              <label htmlFor="ExamType" className="f-15">Exam Type*</label>
              <select
                id="ExamType"
                value={ExamType}
                name={ExamName}
                onChange={examTypeHandler}
                required
              >
                <option value="">Select Exam Type</option>
                <option value="1">WASSCE (For School Candidates)</option>
                <option value="2">WASSCE (For Private Candidates)</option>
              </select>
                </div>
            </div>
       
            <div className="form-group mb-4">
              <label htmlFor="CandidateNo" className="f-15">Exam Number*</label>
              <input
                type="text"
                id="CandidateNo"
                value={CandidateNo}
                onChange={(e) => setCandidateNo(e.target.value)}
                placeholder="Enter Exam Number"
                required
              />
            </div>
            <div className="d-flex flex-wrap">
              <button type="submit" id="btnVerify" className="btn btn-primary btn-sm">
                Verify Now
              </button>
              <p className="d-inline">
                Don&apos;t have a PIN? click&nbsp;
                <a href="/BuyPIN">here to buy now</a>
              </p>
            </div>
          </form>
          {result && <ResultComponent result={result} />}
        </div>
      </main>
    </div>
  );
}

export default App;
