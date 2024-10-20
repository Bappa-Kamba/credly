import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Form = ({
  onSubmit, isLoading, subjectsList, examTypeOptions, form,
}) => {
  const currentYear = new Date().getFullYear();
  const [PIN, setPIN] = useState('');
  const [ExamType, setExamType] = useState('');
  const [ExamName, setExamName] = useState('');
  const [ExamYear, setExamYear] = useState(currentYear);
  const [CandidateNo, setCandidateNo] = useState('');
  const [Name, setName] = useState('');
  const [CentreName, setCentreName] = useState('');
  const [serial, setSerial] = useState('');
  const [subjects, setSubjects] = useState(
    Array.from({ length: 9 }, () => ({ id: uuidv4(), subject: '', grade: '' })),
  );
  // const [newSubject, setNewSubject] = useState('');
  // const [newGrade, setNewGrade] = useState('');

  const inputClassName = 'mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500';
  const selectClassName = 'mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500';

  const handleSubjectChange = (id, name, value) => {
    setSubjects((prevSubjects) => (
      prevSubjects.map(
        (subject) => (subject.id === id ? { ...subject, [name]: value } : subject),
      )
    ));
  };

  const handleSelectChange = (id, e) => {
    const { name, value } = e.target;
    handleSubjectChange(id, name, value);
  };

  // const addCustomSubject = () => {
  //   if (newSubject && newGrade) {
  //     setSubjects((prevSubjects) => [...prevSubjects, {
  //       id: uuidv4(), subject: newSubject, grade: newGrade,
  //     }]);
  //     handleSelectChange();
  //     setNewSubject(''); // Clear the input after adding
  //     setNewGrade(''); // Clear the grade input
  //   } else {
  //     toast.error('Please fill both subject and grade before adding.');
  //   }
  // };

  const getAvailableSubjects = (currentSubjectId) => {
    const selectedSubjects = subjects
      .filter((subj) => subj.id !== currentSubjectId)
      .map((subj) => subj.subject);

    return subjectsList.filter((subject) => !selectedSubjects.includes(subject));
  };

  const examTypeHandler = ({ target: { value } }) => {
    setExamType(value);
    setExamName(examTypeOptions[value] || '');
  };

  const validateForm = () => {
    const errors = [];

    if (!PIN) errors.push('PIN');
    if (form === 'WAEC' && !serial) errors.push('Serial Number');
    if (!Name) errors.push('Name');
    if (!ExamType) errors.push('Exam Type');
    if (!ExamYear) errors.push('Exam Year');
    if (!CandidateNo) errors.push('Exam Number');
    if (!CentreName) errors.push('Centre Name');

    // Check if subjects and grades are selected
    subjects.forEach((subj, index) => {
      if (!subj.subject || !subj.grade) {
        errors.push(`Subject ${index + 1} or Grade`);
      }
    });

    if (errors.length === 0) return true; // All fields filled

    if (errors.length === 1) {
      toast.error(`Please fill the required field: ${errors[0]}`);
    } else {
      toast.error(`Please fill the required fields: ${errors.join(', ')}`);
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create the form data
    const formData = {
      PIN,
      ExamType,
      ExamYear,
      CandidateNo,
      ExamName,
      Name,
      subjects,
      CentreName,
    };

    // Add serial only if the form is WAEC
    if (form === 'WAEC') {
      formData.serial = serial;
    }

    toast.success('Request sent!');
    onSubmit(event, formData, form);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="PIN" className="block text-sm font-bold text-gray-800 mb-1">PIN*</label>
            <input
              type="text"
              id="PIN"
              value={PIN}
              onChange={(e) => setPIN(e.target.value)}
              placeholder="Reference PIN"
              required
              className={inputClassName}
            />
          </div>
          {form === 'WAEC' && (
            <div>
              <label htmlFor="serial" className="block text-sm font-bold text-gray-800 mb-1">Serial No*</label>
              <input
                type="text"
                id="serial"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Serial Number"
                required
                className={inputClassName}
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="Name" className="block text-sm font-bold text-gray-800 mb-1">Name*</label>
          <input
            type="text"
            id="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
            className={inputClassName}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="ExamType" className="block text-sm font-bold text-gray-800 mb-1">Exam Type*</label>
            <select
              id="ExamType"
              value={ExamType}
              onChange={examTypeHandler}
              required
              className={selectClassName}
            >
              <option value="">Select Exam Type*</option>
              {Object.entries(examTypeOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ExamYear" className="block text-sm font-bold text-gray-800 mb-1">Exam Year*</label>
            <select
              id="ExamYear"
              value={ExamYear}
              onChange={(e) => setExamYear(Number(e.target.value))}
              required
              className={selectClassName}
            >
              {[...Array(currentYear - 1977).keys()].map((i) => {
                const year = currentYear - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
          <div>
            <label htmlFor="CandidateNo" className="block text-sm font-bold text-gray-800 mb-1">Exam Number*</label>
            <input
              type="text"
              id="CandidateNo"
              value={CandidateNo}
              onChange={(e) => setCandidateNo(e.target.value)}
              placeholder="Enter Exam Number"
              required
              className={inputClassName}
            />
          </div>
        </div>
        <div>
          <label htmlFor="CentreName" className="block text-sm font-bold text-gray-800 mb-1">Centre Name*</label>
          <input
            type="text"
            id="CentreName"
            value={CentreName}
            onChange={(e) => setCentreName(e.target.value)}
            placeholder="Centre Name"
            required
            className={inputClassName}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Subjects and Grades*</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subj) => (
              <div key={subj.id} className="flex space-x-2">
                <select
                  id={`subject-${subj.id}`}
                  name="subject"
                  value={subj.subject}
                  onChange={(e) => handleSelectChange(subj.id, e)}
                  className={`w-2/3 ${selectClassName}`}
                >
                  <option value="">Select Subject</option>
                  {getAvailableSubjects(subj.id).map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <select
                  id={`grade-${subj.id}`}
                  name="grade"
                  value={subj.grade}
                  onChange={(e) => handleSelectChange(subj.id, e)}
                  className={`w-1/3 ${selectClassName}`}
                >
                  <option value="">Grade</option>
                  {['N/A', 'A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="mt-4">
          <h4 className="text-md font-bold text-gray-700 mb-2">Add Custom Subject</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className={`w-1/2 ${inputClassName}`}
            />
            <select
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              className={`w-1/4 ${selectClassName}`}
            >
              <option value="">Grade</option>
              {['N/A', 'A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addCustomSubject}
              className="w-1/6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600
              transition duration-300 shadow-md font-bold"
            >
              Add
            </button>
          </div>
        </div> */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300 shadow-md font-bold"
        >
          {isLoading ? 'Validating...' : 'Verify Result'}
        </button>
      </form>
    </div>
  );
};

export default Form;
