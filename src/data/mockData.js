// Mock data for collaborative coding platform
// Provides initial state for rooms, active users, and chat messages

export const users = [
  { id: 'u1', name: 'Alex Johnson', color: '#3b82f6', role: 'Host' },
  { id: 'u2', name: 'Priya Sharma', color: '#10b981', role: 'Collaborator' },
  { id: 'u3', name: 'David Lee', color: '#f59e0b', role: 'Collaborator' },
  { id: 'u4', name: 'Emma Watson', color: '#ec4899', role: 'Spectator' }
];

export const rooms = [
  {
    id: 'room-101',
    name: 'Algorithm Practice - Python',
    language: 'python',
    description: 'Solving Two Sum and dynamic programming problems together.',
    createdBy: 'Alex Johnson',
    participantsCount: 3,
    createdAt: '2026-09-29T08:30:00Z',
    code: `# Python Collaborative Room\ndef two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        if target - num in lookup:\n            return [lookup[target - num], i]\n        lookup[num] = i\n    return []\n\nprint("Result:", two_sum([2, 7, 11, 15], 9))\n`
  },
  {
    id: 'room-102',
    name: 'Frontend Playground - JavaScript',
    language: 'javascript',
    description: 'Building custom hooks and responsive DOM animations.',
    createdBy: 'Priya Sharma',
    participantsCount: 2,
    createdAt: '2026-09-29T08:45:00Z',
    code: `// JavaScript Playground\nfunction debounce(func, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => func(...args), delay);\n  };\n}\n\nconsole.log("Debounce utility initialized");\n`
  },
  {
    id: 'room-103',
    name: 'Systems Lab - C++',
    language: 'cpp',
    description: 'Working on memory management and binary trees.',
    createdBy: 'David Lee',
    participantsCount: 1,
    createdAt: '2026-09-29T09:00:00Z',
    code: `// C++ Systems Room\n#include <iostream>\n\nint main() {\n    std::cout << "Collaborative C++ Environment" << std::endl;\n    return 0;\n}\n`
  }
];

export const messages = [
  {
    id: 'msg-1',
    roomId: 'room-101',
    userId: 'u1',
    userName: 'Alex Johnson',
    userColor: '#3b82f6',
    text: 'Welcome everyone! Let us start working on the two-sum solution.',
    timestamp: '09:05 AM'
  },
  {
    id: 'msg-2',
    roomId: 'room-101',
    userId: 'u2',
    userName: 'Priya Sharma',
    userColor: '#10b981',
    text: 'Hey Alex! I added the hash map approach for O(n) runtime.',
    timestamp: '09:07 AM'
  },
  {
    id: 'msg-3',
    roomId: 'room-101',
    userId: 'u3',
    userName: 'David Lee',
    userColor: '#f59e0b',
    text: 'Looks clean. Let me run test cases for edge scenarios with duplicates.',
    timestamp: '09:09 AM'
  },
  {
    id: 'msg-4',
    roomId: 'room-101',
    userId: 'u4',
    userName: 'Emma Watson',
    userColor: '#ec4899',
    text: 'The test passed! Nice job team.',
    timestamp: '09:12 AM'
  },
  {
    id: 'msg-5',
    roomId: 'room-102',
    userId: 'u2',
    userName: 'Priya Sharma',
    userColor: '#10b981',
    text: 'Testing the debounce hook implementation.',
    timestamp: '09:14 AM'
  },
  {
    id: 'msg-6',
    roomId: 'room-103',
    userId: 'u3',
    userName: 'David Lee',
    userColor: '#f59e0b',
    text: 'Setting up the node structure for binary tree traversal.',
    timestamp: '09:15 AM'
  }
];
