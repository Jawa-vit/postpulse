import type { SamplePost } from '../types';

export const STATIC_SAMPLE_POSTS: SamplePost[] = [
  {
    id: 'sample_ml_project',
    title: 'Student ML Project',
    category: 'Student / Tech',
    description: 'Classic slow-hook post with buried value and weak ending.',
    text: `Today I would like to share my experience of working on an interesting machine learning project. I am happy to announce that I have successfully completed building a prediction model using Python. It took me around two months to gather the dataset, clean the missing rows, and train three different models. In the end, Random Forest gave the highest accuracy of 91%. I learned a lot about data preprocessing and hyperparameter tuning. Hope you find this informative. Thank you.`
  },
  {
    id: 'sample_saas_launch',
    title: 'SaaS Founder Launch',
    category: 'Founder / Growth',
    description: 'High-potential product launch with buried value hook and no clear CTA.',
    text: `Hello everyone, I wanted to take a moment to introduce what our team has been working on for the past 6 months. We built an automated document intelligence engine for marketing teams. It automatically reads PDFs, extracts text from images, and scores copy engagement. We noticed that most creators spend 4 hours every week reformatting posts for different platforms. Our system cuts that time down to 10 seconds. Check it out if you have time.`
  },
  {
    id: 'sample_career_advice',
    title: 'Technical Interview Advice',
    category: 'Career / Engineering',
    description: 'Good educational content that could be transformed into high-viral formats.',
    text: `Here is why most junior engineers struggle in technical interviews. They spend 90% of their prep memorizing LeetCode algorithms without understanding system tradeoffs. When senior interviewers ask about latency, concurrency, and failure recovery, candidates freeze. Focus on understanding bottlenecks, database indexing, and API design first before memorizing obscure graphs.`
  },
  {
    id: 'sample_corporate_fluff',
    title: 'Corporate Announcement',
    category: 'Corporate Fluff',
    description: 'Extremely slow preamble, zero curiosity, guaranteed high scroll risk.',
    text: `I am thrilled and excited to share that our organization has officially kicked off Q3 strategic planning. As we navigate an evolving technological landscape, synergy and cross-functional alignment remain paramount. We are committed to delivering excellence across all stakeholder touchpoints. Looking forward to an impactful quarter ahead with our fantastic team.`
  }
];
