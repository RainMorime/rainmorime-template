import type { Skill, SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'web',
    name: 'WEB',
    skills: [
      { id: 'next-react', name: 'Next.js / React', level: 8, relatedProjects: [7, 10, 12, 13], description: '构建了这个个人网站，以及 SIMMC、Foacraft、MoonPixel 等项目。' },
      { id: 'js-ts', name: 'JavaScript / TypeScript', level: 7, relatedProjects: [6, 7], description: '开发了 Koishi 机器人插件和这个个人网站。' },
      { id: 'html-css', name: 'HTML / CSS', level: 7, relatedProjects: [2, 7], description: '在 FreeCodeCamp 学习了前端知识并制作了一个小作品集和这个网站的样式。' },
    ],
  },
  {
    id: 'game',
    name: 'GAME',
    skills: [
      { id: 'unity', name: 'Unity3D', level: 6, relatedProjects: [1, 3, 4], description: '学习了两年的 Unity，参加过两次 GameJam。' },
      { id: 'csharp', name: 'C#', level: 5, relatedProjects: [1, 3, 4], description: '使用 C# 进行 Unity 游戏开发，参加过两次 GameJam。' },
      { id: 'game-design', name: 'Game Design', level: 5, relatedProjects: [5, 14], description: 'SIMMC 世界观设计与文案策划，Foacraft 系统/战斗/文案策划。' },
      { id: 'godot', name: 'Godot', level: 2, relatedProjects: [], description: '学习探索中，暂无关联项目。' },
    ],
  },
  {
    id: 'general',
    name: 'GENERAL',
    skills: [
      { id: 'uiux', name: 'UI/UX Design', level: 7, relatedProjects: [7, 10, 11, 12], description: '为多个 Web 项目进行界面设计与用户体验设计。' },
      { id: 'ai-agent', name: 'AI Agent', level: 7, relatedProjects: [4, 15], description: '两次 AI Agent GameJam — 占卜师 NPC 与炼金术师。' },
      { id: 'devops', name: 'DevOps', level: 4, relatedProjects: [7], description: '腾讯云服务器部署，自定义 Node.js 服务，COS 对象存储。' },
    ],
  },
];

export const skillsData: Skill[] = skillCategories.flatMap(cat => cat.skills);
