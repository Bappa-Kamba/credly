import fetch from 'node-fetch';
import { API_URL } from '../config';

export const verifyDocument = async (PIN, ExamType, ExamYear, CandidateNo, ExamName) => {
  const url = API_URL;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin' : '*',

    },
    body: JSON.stringify({ CandidateNo, ExamName, ExamType, ExamYear, PIN }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
