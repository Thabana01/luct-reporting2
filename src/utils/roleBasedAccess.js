// utils/roleBasedAccess.js

export const getMenuItems = (role) => {
  switch (role) {
    case 'student':
      return [
        { label: 'Monitoring', path: '/monitoring', icon: 'bi bi-bar-chart' },
        { label: 'Ratings', path: '/ratings', icon: 'bi bi-star' },
      ];

    case 'lecturer':
      return [
        { label: 'Classes', path: '/classes/management', icon: 'bi bi-journal' }, // ✅ fixed path
        { label: 'Reports', path: '/reports', icon: 'bi bi-file-earmark-text' },
        { label: 'Monitoring', path: '/monitoring', icon: 'bi bi-bar-chart' },
        { label: 'Ratings', path: '/ratings', icon: 'bi bi-star' },
      ];

    case 'principal_lecturer':
      return [
        { label: 'Courses', path: '/courses', icon: 'bi bi-book' },
        { label: 'Reports', path: '/reports', icon: 'bi bi-file-earmark-text' },
        { label: 'Monitoring', path: '/monitoring', icon: 'bi bi-bar-chart' },
        { label: 'Ratings', path: '/ratings', icon: 'bi bi-star' },
        { label: 'Classes', path: '/classes/management', icon: 'bi bi-journal' }, // ✅ fixed path
      ];

    case 'program_leader':
      return [
        { label: 'Courses', path: '/courses', icon: 'bi bi-book' },
        { label: 'Reports', path: '/reports', icon: 'bi bi-file-earmark-text' },
        { label: 'Monitoring', path: '/monitoring', icon: 'bi bi-bar-chart' },
        { label: 'Classes', path: '/classes/management', icon: 'bi bi-journal' }, // ✅ fixed path
        { label: 'Lectures', path: '/lectures', icon: 'bi bi-person-lines-fill' },
        { label: 'Ratings', path: '/ratings', icon: 'bi bi-star' },
      ];

    default:
      return [];
  }
};
