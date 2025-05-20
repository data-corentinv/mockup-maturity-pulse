import { User } from '../types/auth';
import { pillars, questions } from '../data/mockData';

interface AssessmentResult {
  productName: string;
  entity: string;
  businessDomain: string;
  pillarId: string;
  answers: Record<string, string>;
  score: number;
  timestamp: string;
  user: User;
}

interface DetailedAnswer {
  questionId: string;
  questionText: string;
  answer: string;
  lifecycleStage: string;
}

interface DetailedAssessmentResult extends Omit<AssessmentResult, 'answers'> {
  pillarName: string;
  answers: DetailedAnswer[];
}

async function commitToGitHub(content: string, path: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const owner = import.meta.env.VITE_GITHUB_OWNER;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration is missing. Please set VITE_GITHUB_TOKEN, VITE_GITHUB_OWNER, and VITE_GITHUB_REPO environment variables.');
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add assessment result: ${path}`,
        content: btoa(content),
        branch: 'main'
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content.html_url;
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    throw error;
  }
}

export async function logAssessment(result: AssessmentResult) {
  try {
    const timestamp = new Date(result.timestamp);
    const formattedDate = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}-${String(timestamp.getHours()).padStart(2, '0')}-${String(timestamp.getMinutes()).padStart(2, '0')}-${String(timestamp.getSeconds()).padStart(2, '0')}`;
    
    const fileName = `${result.productName}-${result.user.username}-${result.pillarId}-${formattedDate}.json`;
    const filePath = `assessments/${fileName}`;
    const pillar = pillars.find(p => p.id === result.pillarId);

    // Transform answers to include question details
    const detailedAnswers: DetailedAnswer[] = Object.entries(result.answers).map(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      return {
        questionId,
        questionText: question?.text || 'Unknown question',
        answer,
        lifecycleStage: question?.lifecycleStage || 'unknown'
      };
    });

    const detailedResult: DetailedAssessmentResult = {
      ...result,
      pillarName: pillar?.name || 'Unknown pillar',
      answers: detailedAnswers
    };

    // Save to localStorage for backup
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    assessments.push({
      ...detailedResult,
      fileName
    });
    localStorage.setItem('assessments', JSON.stringify(assessments));

    // Commit to GitHub
    const fileContent = JSON.stringify(detailedResult, null, 2);
    const fileUrl = await commitToGitHub(fileContent, filePath);

    // Log assessment details with formatting
    console.group('Assessment Logged');
    console.log('%cAssessment Details', 'font-weight: bold; color: #000089');
    console.log('File:', fileName);
    console.log('GitHub URL:', fileUrl);
    console.log('Timestamp:', new Date(result.timestamp).toLocaleString());
    
    console.group('Product Information');
    console.log('Name:', result.productName);
    console.log('Entity:', result.entity);
    console.log('Business Domain:', result.businessDomain);
    console.groupEnd();
    
    console.group('Assessment Information');
    console.log('Pillar:', pillar?.name);
    console.log('Score:', `${result.score}%`);
    console.groupEnd();
    
    console.group('User Information');
    console.log('Username:', result.user.username);
    console.log('Entity:', result.user.entity);
    console.log('Role:', result.user.role);
    console.groupEnd();
    
    console.group('Detailed Answers');
    detailedAnswers.forEach((answer) => {
      console.group(`Question: ${answer.questionText}`);
      console.log('ID:', answer.questionId);
      console.log('Answer:', answer.answer);
      console.log('Lifecycle Stage:', answer.lifecycleStage);
      console.groupEnd();
    });
    console.groupEnd();
    
    console.log('%cAssessment saved to GitHub and localStorage', 'color: green');
    console.groupEnd();

    return fileUrl;
  } catch (error) {
    console.error('Error logging assessment:', error);
    throw error;
  }
}