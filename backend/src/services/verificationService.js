import fetch from 'node-fetch';

export const verifyDocument = async (PIN, ExamType, ExamYear, CandidateNo, ExamName) => {
  const url = 'https://verify.waeconline.org.ng/Home/InstantResultVerification'; // Replace with actual URL
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
