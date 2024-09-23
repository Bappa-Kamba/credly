import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function ResultComponent({ result }) {
  const {
    mismatch = false, content = {}, mismatches = {}, success = true,
  } = result;

  if (!success) {
    toast.error(content);
    // return (
    //   <div className="result w-full bg-red-100 border-l-4 border-red-500 p-4 mb-6">
    //     <h2 className="text-2xl text-center font-bold mb-2 text-black">Error ❌</h2>
    //     <p className="text-xl text-center text-red-700">{content}</p>
    //   </div>
    // );
  } else {
    return (
      <div className="result w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Verification Result
        </h2>
        {!mismatch && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
            <h2 className="text-2xl text-center font-bold mb-2 text-black">Verified ✅</h2>
          </div>
        )}

        {/* Render Candidate Information */}
        {content.candidate_info && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Candidate Information</h3>
            <ul className="space-y-2">
              {Object.entries(content.candidate_info).map(([key, value]) => {
                const hasMismatch = mismatches['Info Mismatches'] && mismatches['Info Mismatches'][key];
                return (
                  <li
                    key={key}
                    className="flex"
                    style={{
                      backgroundColor: hasMismatch ? '#FB0C0B' : '#20DF22',
                    }}
                  >
                    <span className="font-medium w-1/3">{key}:</span>
                    <span className="w-2/3">
                      {hasMismatch ? mismatches['Info Mismatches'][key].received : value}
                      {hasMismatch && (
                        <span className="text-sm block">
                          Expected: {mismatches['Info Mismatches'][key].expected}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Render Subject Grades */}
        {content.subject_grades && content.subject_grades.length > 0 && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Subject Grades</h3>
            <ul className="grid grid-cols-2 gap-2">
              {content.subject_grades.map((subject) => {
                const hasMismatch = mismatches['Subj Mismatches'] && mismatches['Subj Mismatches'][subject.subject];
                return (
                  <li
                    key={subject.subject}
                    className="flex justify-between p-2 rounded"
                    style={{
                      backgroundColor: hasMismatch ? '#FB0C0B' : '#20DF22',
                    }}
                  >
                    <span className="font-medium">{subject.subject}:</span>
                    <span>
                      {hasMismatch ? mismatches['Subj Mismatches'][subject.subject].received : subject.grade}
                      {hasMismatch && (
                        <span className="text-sm block">
                          Expected: {mismatches['Subj Mismatches'][subject.subject].expected}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Render Card Information */}
        {content.card_info && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Card Information</h3>
            <ul className="space-y-2">
              {Object.entries(content.card_info).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-medium w-1/3">{key}:</span>
                  <span className="w-2/3">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

ResultComponent.propTypes = {
  result: PropTypes.shape({
    content: PropTypes.shape({
      candidate_info: PropTypes.objectOf(PropTypes.string),
      subject_grades: PropTypes.arrayOf(
        PropTypes.shape({
          subject: PropTypes.string.isRequired,
          grade: PropTypes.string.isRequired,
        }),
      ),
      card_info: PropTypes.objectOf(PropTypes.string),
    }),
    mismatches: PropTypes.shape({
      'Info Mismatches': PropTypes.objectOf(
        PropTypes.shape({
          expected: PropTypes.string.isRequired,
          received: PropTypes.string.isRequired,
        }),
      ),
      'Subj Mismatches': PropTypes.objectOf(
        PropTypes.shape({
          expected: PropTypes.string.isRequired,
          received: PropTypes.string.isRequired,
        }),
      ),
    }),
  }).isRequired,
};

export default ResultComponent;
