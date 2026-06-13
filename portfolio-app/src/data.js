export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const SERVICES = [
  {
    icon: '🌐',
    color: 'rgba(124,58,237,0.2)',
    label: 'Web Development',
    tag: 'React · Django · REST APIs',
    desc: 'Full-stack websites and web apps built with React frontends and Django/Spring Boot backends. Responsive, performant, and production-ready.',
  },
  {
    icon: '🤖',
    color: 'rgba(6,182,212,0.2)',
    label: 'AI Agent Integration',
    tag: 'RAG · LLMs · n8n · AWS Bedrock',
    desc: 'Custom AI agents powered by large language models. RAG pipelines, chatbots, document search, and workflow automation using n8n and AWS Bedrock.',
  },
  {
    icon: '☁️',
    color: 'rgba(16,185,129,0.2)',
    label: 'Cloud & DevOps',
    tag: 'AWS · Docker · ECS · Kubernetes',
    desc: 'Deploy and scale your application on AWS. Containerized services with Docker and ECS, CI/CD pipelines, cost-optimized infrastructure.',
  },
  {
    icon: '🔌',
    color: 'rgba(245,158,11,0.2)',
    label: 'API & Backend Engineering',
    tag: 'Python · REST · DynamoDB · Redis',
    desc: '100+ production REST APIs with optimized query performance. Redis caching, DynamoDB, and modular architecture for high-traffic systems.',
  },
  {
    icon: '🧩',
    color: 'rgba(239,68,68,0.2)',
    label: 'Chrome Extension Development',
    tag: 'React · AWS API Gateway',
    desc: 'Production-grade Chrome extensions integrated with your backend APIs, reducing workflow time and serving thousands of active users.',
  },
  {
    icon: '📊',
    color: 'rgba(124,58,237,0.15)',
    label: 'ML & LLM Solutions',
    tag: 'Fine-Tuning · Prompt Eng · OpenSearch',
    desc: 'Custom ML models, LLM fine-tuning, prompt engineering, and semantic search with OpenSearch or S3 vector stores for your domain.',
  },
];

export const CLAUDE_FEATURES = [
  'Automated code generation', 'Codebase onboarding', 'Refactoring sprints',
  'API scaffold generation', 'Test suite creation', 'PR review automation',
  'Documentation generation', 'Debugging assistance',
];

export const SKILLS = [
  { group: 'Languages', items: ['Python', 'Java', 'JavaScript'] },
  { group: 'Frameworks', items: ['Django', 'Spring Boot', 'React'] },
  { group: 'Cloud (AWS)', items: ['EC2', 'ECS', 'Lambda', 'Bedrock', 'API Gateway'] },
  { group: 'DevOps', items: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins'] },
  { group: 'AI / ML', items: ['RAG', 'LLM', 'Fine-Tuning', 'Prompt Eng', 'n8n'] },
  { group: 'Databases', items: ['DynamoDB', 'MySQL', 'Redis', 'OpenSearch'] },
  { group: 'Networking', items: ['TCP/IP', 'VPC', 'VLAN', 'Linux', 'Cisco IOS'] },
  { group: 'Tools', items: ['Git', 'Postman', 'VS Code', 'Jira'] },
];

export const EXPERIENCE = [
  {
    company: 'Hibiscus',
    role: 'Developer - I',
    location: 'Noida, UP',
    period: 'Aug 2025 – Present',
    bullets: [
      'Redis caching cut DB load by 40% and improved API response time ~30%',
      'Containerized services on AWS ECS (Fargate) — 90% service uptime',
      'Developed and maintained 100+ REST APIs with Django',
      'Multi-tenant RAG chatbot on AWS Bedrock across 10,000+ medical documents',
      'Chrome Extension (React + API Gateway) serving 500+ active users, −30% workflow time',
    ],
  },
  {
    company: 'OpenText (via Mindteck Pvt Ltd)',
    role: 'Software Engineer',
    location: 'Bengaluru, India',
    period: 'Sept 2024 – May 2025',
    bullets: [
      'Automated test scripts for functional, regression, performance, and scalability testing',
      'Integrated automated testing into CI/CD workflows using Jenkins',
      'Build validation, deployment verification, and release testing',
      'Troubleshot deployment issues and improved test environments',
    ],
  },
  {
    company: 'Sheeltron Digital System Pvt Ltd',
    role: 'Network Engineer Intern',
    location: 'Bengaluru, India',
    period: 'Internship',
    bullets: [
      'Tested Cisco and Juniper switches & routers in lab environments',
      'Functional, regression, and configuration testing for network devices',
      'Troubleshot network issues and analyzed logs',
      'Tech: Python, Cisco IOS, Junos OS, TCP/IP, VLAN, Routing',
    ],
  },
];
