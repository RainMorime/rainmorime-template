import type { Skill, SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'FRONTEND',
    skills: [
      { id: 'react', name: 'React / Next.js', level: 7, relatedProjects: [], description: 'Built this portfolio and several web apps.' },
      { id: 'js-ts', name: 'JavaScript / TypeScript', level: 7, relatedProjects: [], description: 'Primary language for web development.' },
      { id: 'html-css', name: 'HTML / CSS / SCSS', level: 6, relatedProjects: [], description: 'Responsive layouts and custom animations.' },
    ],
  },
  {
    id: 'backend',
    name: 'BACKEND',
    skills: [
      { id: 'node', name: 'Node.js', level: 5, relatedProjects: [], description: 'Server-side APIs and tooling.' },
      { id: 'python', name: 'Python', level: 4, relatedProjects: [], description: 'Scripting and data processing.' },
      { id: 'database', name: 'Database', level: 4, relatedProjects: [], description: 'SQL and NoSQL basics.' },
    ],
  },
  {
    id: 'general',
    name: 'GENERAL',
    skills: [
      { id: 'uiux', name: 'UI/UX Design', level: 6, relatedProjects: [], description: 'Interface design and user experience.' },
      { id: 'devops', name: 'DevOps', level: 3, relatedProjects: [], description: 'Cloud deployment and CI/CD.' },
      { id: 'git', name: 'Git / GitHub', level: 6, relatedProjects: [], description: 'Version control and collaboration.' },
    ],
  },
];

export const skillsData: Skill[] = skillCategories.flatMap(cat => cat.skills);
