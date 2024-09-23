import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import ResultComponent from './ResultComponents';
import WAEC from './WAECForm';
import NECO from './NECOForm';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const examTypeOptions = {
    1: 'MAY/JUN',
    2: 'NOV/DEC',
  };

  const subjectsList = [
    'MATHEMATICS',
    'ENGLISH LANGUAGE',
    'BIOLOGY',
    'CHEMISTRY',
    'PHYSICS',
    'GEOGRAPHY',
    'HISTORY',
    'ECONOMICS',
    'GOVERNMENT',
    'LITERATURE',
    'AGRICULTURAL SCIENCE',
    'COMPUTER STUDIES',
    'CIVIC EDUCATION',
    'MARKETING',
    'Add Subject',
  ];

  const handleSubmit = async (event, formData) => {
    event.preventDefault();
    setResult(null);
    setIsLoading(true);
    setIsModalOpen(true);

    try {
      const response = await fetch('http://localhost:5000/api/waec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-500">
      <header className="py-4 px-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo-wide.png" alt="Logo" />
            <h1 className="text-3xl font-bold">Credly Results</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 bg-green-500 text-white p-8">
              <h2 className="text-3xl font-bold mb-6">CREDLY RESULTS</h2>
              <h3 className="text-xl font-semibold mb-4">How it works:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Choose between WAEC or NECO verification.</li>
                <li>Fill in the required details in the form.</li>
                <li>Click on the &ldquo;Verify Result&rdquo; button.</li>
                <li>View your verified result.</li>
              </ul>
              <div className="mt-8">
                <p className="font-semibold">Support mail: support@credly.com</p>
              </div>
            </div>

            <div className="w-full md:w-3/5 bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Check Result</h2>
              {activeForm && (
                <button
                  onClick={() => setActiveForm(null)}
                  className="mt-4 text-blue-600 hover:text-blue-400"
                  aria-label="Go back"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-8 h-8" />
                </button>
              )}
              {!activeForm ? (
                <div className="space-y-4 md:w-2/5">
                  <button
                    onClick={() => setActiveForm('WAEC')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Verify WAEC
                  </button>
                  <button
                    onClick={() => setActiveForm('NECO')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                  >
                    Verify NECO
                  </button>
                </div>
              ) : activeForm === 'WAEC' ? (
                <WAEC
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  subjectsList={subjectsList}
                  examTypeOptions={examTypeOptions}
                />
              ) : (
                <NECO
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  subjectsList={subjectsList}
                  examTypeOptions={examTypeOptions}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? <LoadingSpinner /> : result ? <ResultComponent result={result} /> : null}
      </Modal>

      <footer className="bg-green-600 text-white py-4 px-4 text-center mt-8">
        <p>&copy; 2024 Credly. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default App;
