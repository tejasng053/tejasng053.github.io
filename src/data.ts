export type FeaturedProject = {
  id: string
  name: string
  label: string
  year: string
  status: string
  summary: string
  detail: string
  stack: string[]
  repository: string
  live?: string
  image?: string
  imageAlt?: string
  visualCode: string
}

export type Repository = {
  name: string
  description: string
  language: string
  updated: string
  url: string
  live?: string
  kind: 'Project' | 'Fork' | 'Earlier experiment'
}

export const site = {
  name: 'Tejas NG',
  email: 'tejasng053@gmail.com',
  location: 'Bengaluru, India',
  github: 'https://github.com/tejasng053',
  linkedin: 'https://www.linkedin.com/in/tejas-ng-04ba0a27b/',
  codolio: 'https://codolio.com/profile/Tejas_N_G',
  leetcode: 'https://leetcode.com/u/Tejas_NG/',
  resume: '/tejas-ng-resume.pdf',
}

export const navigation = [
  { number: '01', label: 'Home', path: '/' },
  { number: '02', label: 'Projects', path: '/projects' },
  { number: '03', label: 'Skills', path: '/skills' },
  { number: '04', label: 'About', path: '/about' },
  { number: '05', label: 'Contact', path: '/contact' },
]

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'echo-research',
    name: 'Echo Research',
    label: 'Deep-learning research framework',
    year: '2026',
    status: 'Live demo',
    summary: 'A reproducible framework for left-ventricle segmentation in echocardiography.',
    detail: 'Extends Pix2Pix with boundary-aware and functional-consistency supervision, patient-level split safety, ablations, robustness tests, and clinical evaluation hooks.',
    stack: ['Python', 'PyTorch', 'ONNX Runtime', 'FastAPI', 'Pix2Pix'],
    repository: 'https://github.com/tejasng053/echocardiogram',
    live: 'https://echo-lv-live-demo.ngtejas9.chatgpt.site',
    image: '/assets/echo-lv-live-demo.png',
    imageAlt: 'Echo LV live segmentation demo showing an echocardiogram and predicted ventricular overlay',
    visualCode: 'LV / 2CH / 4CH',
  },
  {
    id: 'ai-hr-interviewer',
    name: 'AI HR Interviewer',
    label: 'Audio-first candidate evaluation',
    year: '2026',
    status: 'Open source',
    summary: 'A resume-aware interview system that asks, transcribes, evaluates, and reports.',
    detail: 'Combines resume parsing, role-specific question generation, timed audio answers, Groq Whisper transcription, Llama-based scoring, and downloadable evaluation reports.',
    stack: ['Python', 'Streamlit', 'Groq', 'Whisper', 'Llama'],
    repository: 'https://github.com/tejasng053/AI-HR-Interviewer',
    image: '/assets/ai-hr-dashboard.png',
    imageAlt: 'AI HR Interviewer dashboard',
    visualCode: 'ASK / LISTEN / SCORE',
  },
  {
    id: 'fake-news',
    name: 'Explainable Fake News Detector',
    label: 'Inspectable NLP classification',
    year: '2026',
    status: 'Tested',
    summary: 'A text classifier that exposes confidence, probabilities, and influential terms.',
    detail: 'Pairs an inspectable TF-IDF and logistic-regression baseline with a Streamlit interface, local JSON API, evaluation artifacts, and unit tests.',
    stack: ['Python', 'scikit-learn', 'NLP', 'TF-IDF', 'Streamlit'],
    repository: 'https://github.com/tejasng053/Fack-news-detection-system',
    visualCode: 'TEXT / VECTOR / WHY',
  },
  {
    id: 'ironpulse',
    name: 'IronPulse Pro',
    label: 'Gym operations platform',
    year: '2026',
    status: 'Live',
    summary: 'A role-aware system for members, trainers, attendance, classes, billing, and reporting.',
    detail: 'Designed around dedicated admin, member, and trainer surfaces backed by a TypeScript, React, Node.js, Express, and MongoDB application stack.',
    stack: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    repository: 'https://github.com/tejasng053/GYM_management',
    live: 'https://gym-management-phi-ten.vercel.app',
    image: '/assets/gym-management.jpg',
    imageAlt: 'IronPulse Pro gym management interface',
    visualCode: 'TRAIN / TRACK / OPERATE',
  },
]

export const repositories: Repository[] = [
  { name: 'xcpng-cloud-plugin', description: 'Fork exploring ephemeral Jenkins agents provisioned on XCP-ng.', language: 'Multi-language', updated: 'Aug 2026', url: 'https://github.com/tejasng053/xcpng-cloud-plugin', kind: 'Fork' },
  { name: 'pythonnative', description: 'Contribution fork used for the merged upstream CLI version-flag pull request.', language: 'Python', updated: 'Aug 2026', url: 'https://github.com/tejasng053/pythonnative', live: 'https://pythonnative.com', kind: 'Fork' },
  { name: 'realtime-chat-app', description: 'MERN one-to-one chat with authentication, persistent messages, typing indicators, and presence.', language: 'JavaScript', updated: 'Aug 2026', url: 'https://github.com/tejasng053/realtime-chat-app', kind: 'Project' },
  { name: 'Fack-news-detection-system', description: 'Explainable NLP classification with a training pipeline, interface, API, evaluation artifacts, and tests.', language: 'Python', updated: 'Aug 2026', url: 'https://github.com/tejasng053/Fack-news-detection-system', kind: 'Project' },
  { name: 'resume-showcase', description: 'A responsive personal résumé and portfolio interface built in React and TypeScript.', language: 'TypeScript', updated: 'Aug 2026', url: 'https://github.com/tejasng053/resume-showcase', kind: 'Project' },
  { name: 'echocardiogram', description: 'Reproducible research kit plus a live ONNX demo for left-ventricle segmentation in echocardiography.', language: 'Python', updated: 'Sep 2026', url: 'https://github.com/tejasng053/echocardiogram', live: 'https://echo-lv-live-demo.ngtejas9.chatgpt.site', kind: 'Project' },
  { name: 'GYM_management', description: 'Role-aware gym operations platform for members, trainers, attendance, billing, and reporting.', language: 'TypeScript', updated: 'Jul 2026', url: 'https://github.com/tejasng053/GYM_management', live: 'https://gym-management-phi-ten.vercel.app', kind: 'Project' },
  { name: 'AI-HR-Interviewer', description: 'Audio-first interview workflow with résumé parsing, transcription, evaluation, and reports.', language: 'Python', updated: 'Jun 2026', url: 'https://github.com/tejasng053/AI-HR-Interviewer', kind: 'Project' },
  { name: 'college-os', description: 'Early coursework placeholder for operating-system concepts.', language: 'Coursework', updated: 'Apr 2026', url: 'https://github.com/tejasng053/college-os', kind: 'Earlier experiment' },
  { name: 'Printly', description: 'Student document-upload and printing service with separate user and admin surfaces.', language: 'JavaScript', updated: 'Apr 2026', url: 'https://github.com/tejasng053/Printly', live: 'https://printly-ten.vercel.app', kind: 'Project' },
  { name: 'ai_health_chatbot', description: 'Static health-assistant frontend prototype with dashboards and emergency information.', language: 'HTML', updated: 'Nov 2025', url: 'https://github.com/tejasng053/ai_health_chatbot', live: 'https://tejasng053.github.io/ai_health_chatbot/', kind: 'Project' },
  { name: 'ai_powered_health_chatbot', description: 'Multilingual health-assistant frontend concept with chat, alerts, and service discovery.', language: 'CSS', updated: 'Oct 2025', url: 'https://github.com/tejasng053/ai_powered_health_chatbot', live: 'https://tejasng053.github.io/ai_powered_health_chatbot/', kind: 'Project' },
  { name: 'Plateful_ai', description: 'Meal-planning and home-cooking application concept focused on dietary goals.', language: 'Python', updated: 'Oct 2025', url: 'https://github.com/tejasng053/Plateful_ai', kind: 'Project' },
  { name: 'weather-web', description: 'Weather dashboard with city and geolocation search, forecasts, and unit switching.', language: 'JavaScript', updated: 'Sep 2025', url: 'https://github.com/tejasng053/weather-web', live: 'https://tejasng053.github.io/weather-web/', kind: 'Project' },
  { name: 'Smart-Study-Planner', description: 'A focused study-planning interface for time and task management.', language: 'CSS', updated: 'Sep 2025', url: 'https://github.com/tejasng053/Smart-Study-Planner', kind: 'Project' },
  { name: 'workshop', description: 'Code written during an RVITM machine-learning workshop.', language: 'Python', updated: 'Sep 2025', url: 'https://github.com/tejasng053/workshop', kind: 'Earlier experiment' },
  { name: 'movies-search', description: 'React movie search with navigation, shared state, and favourites management.', language: 'JavaScript', updated: 'Apr 2025', url: 'https://github.com/tejasng053/movies-search', kind: 'Project' },
  { name: 'projects', description: 'Collection of early practice work, including an Amazon interface clone.', language: 'Mixed', updated: 'Mar 2025', url: 'https://github.com/tejasng053/projects', kind: 'Earlier experiment' },
  { name: 'git-practice-', description: 'Small HTML repository used to learn Git and GitHub workflows.', language: 'HTML', updated: 'Mar 2025', url: 'https://github.com/tejasng053/git-practice-', live: 'https://tejasng053.github.io/git-practice-/', kind: 'Earlier experiment' },
]

export const codingStats = [
  { value: '95', label: 'GitHub contributions / last year' },
  { value: '19', label: 'Public repositories' },
  { value: '114', label: 'Commits tracked by Codolio' },
  { value: '01', label: 'Merged open-source PR' },
]

export const codolioDevelopmentStats = [
  { value: '139', label: 'Total tracked contributions' },
  { value: '114', label: 'Commits' },
  { value: '41', label: 'Development-active days' },
  { value: '04', label: 'Maximum development streak' },
]

export const problemStats = [
  { value: '97', label: 'Problems solved' },
  { value: '213', label: 'Submissions' },
  { value: '80', label: 'Problem-solving days' },
  { value: '14', label: 'Maximum streak' },
]

export const languageShare = [
  { name: 'Python', value: 42 },
  { name: 'TypeScript', value: 21 },
  { name: 'JavaScript', value: 20 },
  { name: 'Java', value: 10 },
  { name: 'HTML', value: 3 },
  { name: 'Other', value: 4 },
]

export const skillGroups = [
  { number: '01', title: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'SQL'], evidence: 'Used across 19 public repositories, research work, and production-facing interfaces.' },
  { number: '02', title: 'Frontend', items: ['React', 'Vite', 'HTML5', 'CSS3', 'Responsive UI', 'Streamlit'], evidence: 'Applied in IronPulse Pro, Printly, internship work, dashboards, and interactive ML tools.' },
  { number: '03', title: 'Backend & product', items: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'FastAPI', 'Git'], evidence: 'Used for role-aware applications, report pipelines, real-time experiments, and team delivery.' },
  { number: '04', title: 'AI & data', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'pandas', 'NumPy', 'NLP', 'CNNs'], evidence: 'Used in echocardiography research, interview evaluation, fake-news classification, and health experiments.' },
  { number: '05', title: 'Engineering practice', items: ['Testing', 'Docker', 'AWS', 'Linux', 'Agile', 'Debugging'], evidence: 'Used across internship delivery, reproducible research, version-controlled workflows, and deployments.' },
]

export const certifications = [
  { issuer: 'Cisco', title: 'Introduction to IoT', type: 'Verified credential', url: 'https://www.credly.com/badges/93a4e2d2-4e77-4a16-9d5f-285cbbc75200' },
  { issuer: 'IBM SkillsBuild', title: 'Web Development Fundamentals', type: 'Verified credential', url: 'https://www.credly.com/badges/3e86bff8-bcb7-49c1-88bb-a3be7269fdab' },
  { issuer: 'Scaler Topics', title: 'Master Computer Networking', type: 'Course certificate', url: 'https://moonshot.scaler.com/s/li/Wq1o25f_Cu' },
  { issuer: 'Scaler Topics', title: 'Operating System Fundamentals', type: 'Course certificate' },
  { issuer: 'National Cadet Corps', title: 'NCC B Certificate', type: 'Leadership credential' },
]

export const experience = [
  { number: '01', period: 'Feb — May 2026', role: 'Web Development Intern', organization: 'IIT Ropar', detail: 'Four-month remote internship focused on responsive interfaces, collaborative delivery, testing, debugging, and Git-based workflows.' },
  { number: '02', period: 'Jun 2025 — Feb 2026', role: 'Cadet Under Officer', organization: 'National Cadet Corps — India', detail: 'Served in a senior cadet leadership role and was recognized at Achievers’ Day 2026 for NCC performance and Army Attachment Camp participation.' },
  { number: '03', period: 'Oct — Nov 2025', role: 'Robotics Event Manager', organization: 'RV Institute of Technology and Management', detail: 'Led planning and on-ground coordination across event operations, team leadership, and participant management.' },
  { number: '04', period: 'Aug — Sep 2025', role: 'Frontend Developer', organization: 'Edunet Foundation', detail: 'Completed a six-week AICTE–Edunet Foundation SkillsBuild internship powered by IBM, centered on frontend learning and mentorship.' },
]

export const nonTechnicalSkills = [
  { title: 'Leadership', proof: 'Senior responsibility as an NCC Cadet Under Officer.' },
  { title: 'Event operations', proof: 'Planned and coordinated a robotics event at RVITM.' },
  { title: 'Discipline & composure', proof: 'Developed through NCC and Army Attachment Camp participation.' },
  { title: 'Communication', proof: 'Practiced across internship teams, mentors, cadets, and event participants.' },
  { title: 'Ownership', proof: 'Recognized at Achievers’ Day 2026 and demonstrated through independent projects.' },
]

export const publications = [
  { year: '2026', title: 'Automated Soiling Detection & Predictive Maintenance for Large-Scale Solar Farms', url: 'http://hbrppublication.com/OJS/index.php/JARIOTS/issue/view/1804' },
  { year: '2025', title: 'Comparative Fake-News Detection Using Machine Learning', url: 'https://doi.org/10.5281/zenodo.17959336' },
]

export const openSourceContribution = {
  title: 'feat(cli): add --version flag',
  project: 'pythonnative/pythonnative',
  status: 'Merged',
  date: '29 Aug 2026',
  additions: 21,
  files: 2,
  url: 'https://github.com/pythonnative/pythonnative/pull/26',
}
