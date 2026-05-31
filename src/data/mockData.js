export const mockTools = [
  {
    id: "mock-tool-1",
    name: "Microsoft Teams",
    description: "Enterprise chat, calling, and video meetings platform",
    category: "Communication",
    download_url: "https://teams.microsoft.com/downloads",
    is_required: true,
    display_order: 1
  },
  {
    id: "mock-tool-2",
    name: "Outlook",
    description: "Email, calendar, and meeting scheduling for Genpact interns",
    category: "Email and Calendar",
    download_url: "https://support.microsoft.com/outlook",
    is_required: true,
    display_order: 2
  },
  {
    id: "mock-tool-3",
    name: "VPN Client",
    description: "Secure access tool for internal Genpact systems",
    category: "Secure Access",
    download_url: "#",
    is_required: true,
    display_order: 3
  },
  {
    id: "mock-tool-4",
    name: "VS Code",
    description: "Code editor recommended for technical onboarding tasks",
    category: "Developer Tools",
    download_url: "https://code.visualstudio.com/download",
    is_required: false,
    display_order: 4
  }
];

export const mockCourses = [
  {
    id: "mock-course-1",
    title: "Genpact Code of Conduct",
    description: "Core ethical standards and professional conduct expectations.",
    category: "Compliance",
    duration_minutes: 45,
    is_mandatory: true,
    week_number: 1,
    content_url: null,
    display_order: 1
  },
  {
    id: "mock-course-2",
    title: "Information Security Basics",
    description: "Foundational guidance for protecting company systems and data.",
    category: "Security",
    duration_minutes: 60,
    is_mandatory: true,
    week_number: 1,
    content_url: null,
    display_order: 2
  },
  {
    id: "mock-course-3",
    title: "Data Privacy and Responsible AI",
    description: "Privacy principles and responsible use of AI in client work.",
    category: "Risk and Compliance",
    duration_minutes: 50,
    is_mandatory: true,
    week_number: 1,
    content_url: null,
    display_order: 3
  },
  {
    id: "mock-course-4",
    title: "Workplace Health and Safety",
    description: "Essential workplace safety and wellbeing practices.",
    category: "People Operations",
    duration_minutes: 30,
    is_mandatory: true,
    week_number: 1,
    content_url: null,
    display_order: 4
  }
];

export const mockProgress = [
  {
    id: "mock-progress-1",
    course_id: "mock-course-1",
    intern_id: "00000000-0000-0000-0000-000000000001",
    status: "Not Started",
    created_at: "2026-05-31T00:00:00Z",
    updated_at: "2026-05-31T00:00:00Z"
  },
  {
    id: "mock-progress-2",
    course_id: "mock-course-2",
    intern_id: "00000000-0000-0000-0000-000000000001",
    status: "Not Started",
    created_at: "2026-05-31T00:00:00Z",
    updated_at: "2026-05-31T00:00:00Z"
  },
  {
    id: "mock-progress-3",
    course_id: "mock-course-3",
    intern_id: "00000000-0000-0000-0000-000000000001",
    status: "Not Started",
    created_at: "2026-05-31T00:00:00Z",
    updated_at: "2026-05-31T00:00:00Z"
  },
  {
    id: "mock-progress-4",
    course_id: "mock-course-4",
    intern_id: "00000000-0000-0000-0000-000000000001",
    status: "Not Started",
    created_at: "2026-05-31T00:00:00Z",
    updated_at: "2026-05-31T00:00:00Z"
  }
];

export const mockContacts = [
  {
    id: "mock-contact-1",
    name: "Priya Sharma",
    role: "Mentor",
    department: "Digital Transformation",
    email: "priya.sharma@genpact.com",
    phone: "+91-9876543210",
    is_primary: true,
    display_order: 1
  },
  {
    id: "mock-contact-2",
    name: "Alex Morgan",
    role: "Technology Support Lead",
    department: "IT Support",
    email: "alex.morgan@genpact.com",
    phone: "+1 555 0102",
    is_primary: true,
    display_order: 2
  },
  {
    id: "mock-contact-3",
    name: "Maya Chen",
    role: "Analytics Mentor",
    department: "Data and AI",
    email: "maya.chen@genpact.com",
    phone: "+1 555 0103",
    is_primary: false,
    display_order: 3
  },
  {
    id: "mock-contact-4",
    name: "Daniel Rivera",
    role: "Engineering Mentor",
    department: "Digital Engineering",
    email: "daniel.rivera@genpact.com",
    phone: "+1 555 0104",
    is_primary: false,
    display_order: 4
  },
  {
    id: "mock-contact-5",
    name: "Edona Xhemajli",
    role: "HR Support",
    department: "Human Resources — APAC",
    email: "edona.xhemajli1234@genpact.com",
    phone: "+91-9876543221",
    is_primary: false,
    display_order: 5
  }
];
