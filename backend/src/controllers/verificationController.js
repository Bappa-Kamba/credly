import { verifyDocument } from '../services/verificationService.js';

export const requestHandler = async (req, res) => {
  try {
    const { PIN, ExamType, ExamYear, CandidateNo, ExamName } = req.body;
    const result = await verifyDocument(CandidateNo, ExamYear, PIN, ExamType, ExamName);
    res.json(result);
  } catch (error) {
    console.log(`${CandidateNo}, ${PIN} - ${ExamYear}`);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
};
