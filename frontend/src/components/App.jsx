import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import ResultComponent from './ResultComponents';
import Form from './Form';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState('WAEC');

  const WAECExamTypeOptions = {
    1: 'MAY/JUN',
    2: 'NOV/DEC',
  };

  const NECOExamTypeOptions = {
    1: 'ssce_int',
    2: 'ssce_ext',
    3: 'ncee',
    4: 'bece',
    5: 'gifted',
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
    'DATA PROCESSING',
    'MARKETING',
    'ISLAMIC STUDIES',
    'CHRISTIAN RELIGIOUS STUDIES',
    'CATERING CRAFT PRACTICE',
  ].sort();

  const handleSubmit = async (event, formData, formType) => {
    event.preventDefault();
    setResult(null);
    setIsLoading(true);
    setIsModalOpen(true);

    const url = formType === 'WAEC'
      ? 'http://localhost:5000/api/waec'
      : 'http://localhost:5000/api/neco';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer Dummy.Auth.Token',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
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
              <div className="mt-8 flex items-center space-x-4">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.9998 0.166504C11.7398 0.166504 0.166504 11.7398 0.166504 25.9998C0.166504 40.2598 11.7398 51.8332 25.9998 51.8332C40.2598 51.8332 51.8332 40.2598 51.8332 25.9998C51.8332 11.7398 40.2598 0.166504 25.9998 0.166504ZM39.5623 28.0923C39.5623 28.5315 39.5365 28.9448 39.4848 29.3582C39.0973 33.9307 36.3848 36.204 31.4248 36.204H30.7532C30.3398 36.204 29.9265 36.4107 29.6682 36.7465L27.6273 39.459C26.7232 40.6732 25.2765 40.6732 24.3723 39.459L22.3315 36.7465C22.099 36.4623 21.6082 36.204 21.2465 36.204H20.5748C15.1757 36.204 12.4373 34.8607 12.4373 28.0665V21.2723C12.4373 16.3123 14.7365 13.5998 19.2832 13.2123C19.6965 13.1865 20.1357 13.1865 20.5748 13.1865H31.4248C36.824 13.1865 39.5623 15.899 39.5623 21.324V28.0923Z" fill="white" /></svg>
                <h3 className="text-base font-semibold">Support mail: support@credly.com</h3>
              </div>
            </div>

            <div className="w-full md:w-3/5 bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Check Result</h2>
              <div className="flex flex-col sm:flex-row justify-center mb-6 py-3 bg-white rounded-md shadow-md overflow-hidden">
                <button
                  className={`p-3 mb-2 sm:mb-0 sm:mr-3 border rounded-md w-full sm:w-auto transition-colors duration-200 ${
                    selectedForm === 'WAEC'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedForm('WAEC')}
                >
                  WAEC
                </button>
                <button
                  className={`p-3 border rounded-md w-full sm:w-auto transition-colors duration-200 ${
                    selectedForm === 'NECO'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedForm('NECO')}
                >
                  NECO
                </button>
              </div>
              <Form
                onSubmit={(event, formData) => handleSubmit(event, formData, selectedForm)}
                isLoading={isLoading}
                subjectsList={subjectsList}
                examTypeOptions={selectedForm === 'WAEC' ? WAECExamTypeOptions : NECOExamTypeOptions}
                form={selectedForm}
              />

            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          result ? <ResultComponent result={result} /> : null
        )}
      </Modal>

      <footer className="bg-green-600 text-white py-4 px-4 text-center mt-8">
        <p>&copy; 2024 Credly. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default App;
