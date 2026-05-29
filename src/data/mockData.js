export const mockTools = [
  {
    id: 1,
    name: "Microsoft Teams",
    category: "Communication",
    requirement: "Required for all interns",
    guideUrl: "https://www.microsoft.com/microsoft-teams/download-app",
    status: "Required",
    estimatedTime: "10 min"
  },
  {
    id: 2,
    name: "Outlook",
    category: "Email and Calendar",
    requirement: "Configure Genpact account and calendar",
    guideUrl: "https://support.microsoft.com/outlook",
    status: "Required",
    estimatedTime: "15 min"
  },
  {
    id: 3,
    name: "VPN Client",
    category: "Secure Access",
    requirement: "Needed for internal systems access",
    guideUrl: "#",
    status: "Required",
    estimatedTime: "20 min"
  },
  {
    id: 4,
    name: "VS Code",
    category: "Developer Tools",
    requirement: "Recommended for technical interns",
    guideUrl: "https://code.visualstudio.com/download",
    status: "Recommended",
    estimatedTime: "10 min"
  }
];

export const mockCourses = [
  {
    id: 101,
    title: "Genpact Culture and Values",
    provider: "Genpact Learning",
    dueDate: "Friday, Week 1",
    duration: "45 min",
    progress: 100,
    status: "Completed"
  },
  {
    id: 102,
    title: "Information Security Basics",
    provider: "Compliance Academy",
    dueDate: "Wednesday, Week 1",
    duration: "60 min",
    progress: 65,
    status: "In Progress"
  },
  {
    id: 103,
    title: "Data Privacy and Responsible AI",
    provider: "Risk and Compliance",
    dueDate: "Friday, Week 1",
    duration: "50 min",
    progress: 25,
    status: "In Progress"
  },
  {
    id: 104,
    title: "Workplace Health and Safety",
    provider: "People Operations",
    dueDate: "Friday, Week 1",
    duration: "30 min",
    progress: 0,
    status: "Not Started"
  }
];

export const mockContacts = [
  {
    id: 201,
    name: "Priya Sharma",
    role: "Intern Program Manager",
    team: "People Operations",
    email: "priya.sharma@genpact.example",
    phone: "+1 555 0101",
    location: "New York",
    tags: ["program", "policy", "schedule"]
  },
  {
    id: 202,
    name: "Alex Morgan",
    role: "Technology Support Lead",
    team: "IT Support",
    email: "alex.morgan@genpact.example",
    phone: "+1 555 0102",
    location: "Remote",
    tags: ["laptop", "vpn", "access"]
  },
  {
    id: 203,
    name: "Maya Chen",
    role: "Analytics Mentor",
    team: "Data and AI",
    email: "maya.chen@genpact.example",
    phone: "+1 555 0103",
    location: "Chicago",
    tags: ["mentor", "analytics", "projects"]
  },
  {
    id: 204,
    name: "Daniel Rivera",
    role: "Engineering Mentor",
    team: "Digital Engineering",
    email: "daniel.rivera@genpact.example",
    phone: "+1 555 0104",
    location: "Dallas",
    tags: ["mentor", "frontend", "backend"]
  }
];
