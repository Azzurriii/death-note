export interface ExamRecord {
  examId: string;
  dateTaken: string;
  part1Answers: string[];
  part2Answers: string[];
  part3Answer: string;
  completed: boolean;
}

export const mockExams = [
  {
    id: "1",
    title: "Mock Test 1",
    description: "Practice test with standard TOEIC Writing format",
  },
  {
    id: "2",
    title: "October Sample Exam",
    description: "Official sample questions from October test",
  },
  {
    id: "3",
    title: "Advanced Practice Test",
    description: "Challenging questions for advanced learners",
  },
  {
    id: "4",
    title: "Business Writing Test",
    description: "Focus on professional communication skills",
  },
  {
    id: "5",
    title: "Academic Writing Test",
    description: "University-level writing exercises",
  },
  {
    id: "6",
    title: "Quick Practice Test",
    description: "Short format for quick skill assessment",
  },
];

export const mockExamHistory: ExamRecord[] = [
  {
    examId: "1",
    dateTaken: "2024-01-15T10:30:00Z",
    part1Answers: [
      "The meeting will be held in Conference Room A at 2 PM tomorrow.",
      "Please bring your laptop and the quarterly report for review.",
      "We will discuss the new project timeline and budget allocation.",
      "All department heads are required to attend this important meeting.",
      "The agenda will be sent via email by the end of today.",
    ],
    part2Answers: [
      "I am writing to express my interest in the Software Engineer position advertised on your company website. With my background in computer science and three years of experience in web development, I believe I would be a valuable addition to your team.",
      "During my previous role at TechCorp, I successfully led a team of five developers in creating a customer management system that increased efficiency by 40%. I am proficient in JavaScript, React, and Node.js, and I am always eager to learn new technologies.",
    ],
    part3Answer:
      "In my opinion, remote work has fundamentally changed the modern workplace in both positive and challenging ways. On the positive side, it has provided employees with greater flexibility and work-life balance, allowing them to be more productive by eliminating commute times and creating personalized work environments. Companies have also benefited from access to a global talent pool and reduced overhead costs. However, remote work also presents challenges such as maintaining team cohesion, ensuring effective communication, and managing the potential for social isolation among employees. The key to successful remote work lies in establishing clear communication protocols, investing in proper technology infrastructure, and creating opportunities for virtual team building. As we move forward, I believe a hybrid model that combines the benefits of both remote and in-office work will become the standard for most organizations.",
    completed: true,
  },
  {
    examId: "2",
    dateTaken: "2024-01-05T09:15:00Z",
    part1Answers: [
      "The quarterly sales report shows a 15% increase compared to last year.",
      "All employees must complete the mandatory safety training by month end.",
      "The new office renovation project will begin next Monday morning.",
      "Customer feedback indicates high satisfaction with our recent service improvements.",
      "The annual company picnic is scheduled for Saturday at Riverside Park.",
    ],
    part2Answers: [
      "I would like to formally request a three-day vacation leave from March 15-17 to attend my sister's wedding ceremony. I have ensured that all my current projects will be completed before my departure.",
      "My colleague Sarah has agreed to handle any urgent matters during my absence, and I will provide her with a detailed handover document. I will also be available via phone for any critical issues that may arise.",
    ],
    part3Answer:
      "Social media has become an integral part of modern communication, fundamentally altering how people interact and share information. The benefits are numerous: it enables instant global communication, helps maintain relationships across distances, and provides platforms for communities to form around shared interests. Businesses leverage social media for marketing and customer engagement, while individuals use it for personal expression and staying informed about current events. However, social media also presents significant challenges, including privacy concerns, the spread of misinformation, cyberbullying, and its potential impact on mental health, particularly among young users. The addictive nature of these platforms can lead to decreased productivity and real-world social skills. To maximize benefits while minimizing harm, users should practice digital literacy, be mindful of their online presence, and maintain a healthy balance between virtual and face-to-face interactions.",
    completed: true,
  },
  {
    examId: "3",
    dateTaken: "2024-01-10T14:20:00Z",
    part1Answers: [
      "The conference has been rescheduled to next Friday due to venue availability.",
      "Please confirm your attendance by replying to this email before Wednesday.",
      "Lunch will be provided for all registered participants at the event.",
      "The keynote speaker will present the latest industry trends and innovations.",
      "Parking is available in the main building lot for conference attendees.",
    ],
    part2Answers: [
      "Thank you for your inquiry about our premium membership package. I am pleased to provide you with detailed information about the benefits and pricing options available.",
      "Our premium package includes unlimited access to all facilities, personal training sessions, nutrition consultations, and exclusive member events. The monthly fee is $99, which represents excellent value for the comprehensive services provided.",
    ],
    part3Answer:
      "Technology has revolutionized education in unprecedented ways, transforming how students learn and teachers instruct. Digital platforms and online learning tools have made education more accessible, allowing students from diverse backgrounds and geographical locations to access quality educational content. Interactive learning applications, virtual reality experiences, and AI-powered tutoring systems have made learning more engaging and personalized than ever before. However, this technological shift also brings challenges, including the digital divide that can exclude students without access to devices or reliable internet, and concerns about screen time and reduced face-to-face interaction. Additionally, the rapid pace of technological change requires continuous adaptation from both educators and students. Despite these challenges, I believe technology's positive impact on education far outweighs the drawbacks, as it prepares students for a digital future while providing innovative ways to enhance learning outcomes.",
    completed: true,
  },
  {
    examId: "4",
    dateTaken: "2024-01-20T16:45:00Z",
    part1Answers: [
      "The new product launch has been scheduled for next month's marketing campaign.",
      "All team members should prepare their presentations by Friday afternoon.",
      "The client meeting went very well and exceeded our expectations completely.",
      "Please review the contract details before sending it to legal department.",
      "The training session will cover advanced techniques for better productivity.",
    ],
    part2Answers: [
      "I am pleased to inform you that your application for the Marketing Manager position has been approved. We were impressed by your extensive experience in digital marketing and your innovative approach to campaign development.",
      "Your starting date will be March 1st, and you will be working directly with our creative team. We look forward to welcoming you to our company and seeing your contributions to our upcoming projects.",
    ],
    part3Answer:
      "The impact of artificial intelligence on the job market is a topic of significant debate in today's society. While AI has the potential to automate many routine tasks, leading to concerns about job displacement, it also creates new opportunities for innovation and career development. Industries such as healthcare, finance, and education are already benefiting from AI technologies that enhance human capabilities rather than replace them entirely. Workers who adapt by learning new skills and embracing technology are likely to thrive in this evolving landscape. Companies should invest in retraining programs to help their employees transition to new roles that complement AI systems. Additionally, governments and educational institutions must work together to prepare future generations for careers that will coexist with artificial intelligence. The key is to view AI as a tool that can augment human potential rather than a threat to employment security.",
    completed: true,
  },
  {
    examId: "5",
    dateTaken: "2024-01-25T11:30:00Z",
    part1Answers: [
      "The university library will extend its hours during the final exam period.",
      "Students must register for courses before the deadline next week.",
      "The research project requires extensive data collection and analysis methods.",
      "Professor Johnson will hold extra office hours for struggling students.",
      "The academic conference will showcase innovative research from various departments.",
    ],
    part2Answers: [
      "I am writing to request an extension for my final research paper due to unexpected family circumstances. I have been maintaining excellent academic performance throughout the semester and believe I can deliver quality work with additional time.",
      "I would appreciate the opportunity to discuss this matter with you personally and provide any necessary documentation. I am committed to completing the assignment to the best of my abilities and meeting the course requirements.",
    ],
    part3Answer:
      "The importance of financial literacy in modern society cannot be overstated, as it directly impacts individuals' ability to make informed decisions about their economic well-being. Many people struggle with basic financial concepts such as budgeting, investing, and understanding credit, which can lead to poor financial choices and long-term consequences. Educational institutions should incorporate comprehensive financial education into their curricula from an early age, teaching students about savings, debt management, and investment strategies. Furthermore, employers can play a crucial role by offering financial wellness programs that help employees understand retirement planning and employee benefits. Technology has also made financial education more accessible through mobile apps and online platforms that provide personalized advice and tools for financial planning. Governments should support these initiatives by implementing policies that promote financial literacy and protect consumers from predatory financial practices. Ultimately, improving financial literacy across all demographics will lead to a more economically stable and prosperous society.",
    completed: true,
  },
  {
    examId: "6",
    dateTaken: "2024-01-28T08:15:00Z",
    part1Answers: [
      "The quick assessment will help identify areas for skill improvement.",
      "Participants should complete all sections within the allotted time frame.",
      "The practice test covers essential writing techniques and grammar rules.",
      "Feedback will be provided immediately after submission for review.",
      "Regular practice sessions can significantly improve overall writing performance.",
    ],
    part2Answers: [
      "Thank you for your interest in our language learning program. I am excited to provide you with information about our intensive English writing course that begins next month.",
      "The program includes personalized feedback, group workshops, and access to our online resource library. The course fee is $299 per month, which includes all materials and unlimited practice exercises.",
    ],
    part3Answer:
      "Environmental conservation has become one of the most pressing issues of our time, requiring immediate action from individuals, communities, and governments worldwide. Climate change, deforestation, and pollution threaten the delicate balance of our ecosystems and the future of human civilization. Individual actions such as reducing energy consumption, recycling, and choosing sustainable products can make a meaningful difference when adopted by millions of people. Communities can implement local initiatives like green spaces, renewable energy projects, and waste reduction programs that benefit both the environment and residents' quality of life. Governments must establish and enforce environmental regulations, invest in clean technology research, and promote international cooperation to address global challenges. Educational institutions play a vital role in raising awareness and teaching future generations about environmental stewardship. The business sector should embrace sustainable practices and develop innovative solutions that balance economic growth with environmental protection. Success in environmental conservation requires a collaborative effort from all sectors of society, working together toward a common goal of preserving our planet for future generations.",
    completed: true,
  },
];

export const part1Questions = [
  {
    id: 1,
    keywords: "frame, but",
    imageUrl: "https://picsum.photos/300/400",
  },
  {
    id: 2,
    keywords: "woman, reading",
    imageUrl: "https://picsum.photos/300/400",
  },
  {
    id: 3,
    keywords: "meeting, discuss",
    imageUrl: "https://picsum.photos/300/400",
  },
  {
    id: 4,
    keywords: "computer, working",
    imageUrl: "https://picsum.photos/300/400",
  },
  {
    id: 5,
    keywords: "coffee, while",
    imageUrl: "https://picsum.photos/300/400",
  },
];

export const part2Prompts = [
  "You are organizing a company event. Write an email to your colleagues inviting them to the event. Include details about the date, time, location, and what they should bring.",
  "You received a complaint from a customer about a delayed order. Write a response email apologizing for the delay and explaining how you will resolve the issue.",
];

export const part3Prompt =
  "Some people believe that working from home is more productive than working in an office, while others think that office work is more effective. Which do you prefer and why? Use specific reasons and examples to support your opinion. Write at least 300 words.";
