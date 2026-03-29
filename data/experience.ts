import type { ExperienceItem } from '../types';

// ============================================================
// Timeline — Replace with your own education & work history!
// ============================================================
export const experienceData: ExperienceItem[] = [
  {
    id: 'highschool',
    type: 'education',
    duration: '2016 - 2022',
    title: 'High School',
    location: 'Your High School Name',
    details: [
      'Your High School Name',
    ],
    alignment: 'right',
    galleryImages: [],
  },
  {
    id: 'university',
    type: 'education',
    duration: '2022 - Present',
    title: 'University',
    location: 'Your University Name',
    details: [
      'Your University Name',
      'Your Major',
    ],
    alignment: 'left',
    galleryImages: [],
  },
  {
    id: 'internship',
    type: 'work',
    duration: '2024.07 - 08',
    title: 'Internship',
    location: 'Company Name',
    details: [
      'Company Name',
      'Department',
      'Your role description',
    ],
    alignment: 'left',
    galleryImages: [],
  },
];
