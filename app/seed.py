"""
Optional script to seed the database from the SQLModel models directly.
Prefer app/db/init.sql for a fresh PostgreSQL instance.
"""

from sqlmodel import Session

from app.database import _get_engine, init_db
from app.models.contact import Contact, ContactRole
from app.models.course import Course, CourseCategory
from app.models.tool import Tool, ToolCategory


def seed() -> None:
    init_db()

    tools = [
        Tool(name="Microsoft Teams", description="Enterprise chat, calling, and video meetings platform", category=ToolCategory.COMMUNICATION, download_url="https://teams.microsoft.com/downloads", is_required=True, display_order=1),
        Tool(name="Outlook", description="Email and calendar client for corporate communication", category=ToolCategory.COMMUNICATION, download_url="https://outlook.office.com", is_required=True, display_order=2),
        Tool(name="Visual Studio Code", description="Lightweight but powerful source code editor", category=ToolCategory.IDE, download_url="https://code.visualstudio.com/download", is_required=True, display_order=3),
        Tool(name="Git + GitHub Desktop", description="Distributed version control and GUI client", category=ToolCategory.VERSION_CONTROL, download_url="https://desktop.github.com", is_required=True, display_order=4),
        Tool(name="Microsoft 365", description="Word, Excel, PowerPoint, and OneDrive for business productivity", category=ToolCategory.OFFICE_SUITE, download_url="https://www.office.com", is_required=True, display_order=5),
        Tool(name="VPN Client", description="Secure remote access to Genpact corporate network", category=ToolCategory.SECURITY, is_required=True, display_order=6),
        Tool(name="Postman", description="API development and testing tool", category=ToolCategory.DEVELOPMENT, download_url="https://www.postman.com/downloads", is_required=False, display_order=7),
        Tool(name="Docker Desktop", description="Container platform for local development", category=ToolCategory.DEVELOPMENT, download_url="https://www.docker.com/products/docker-desktop", is_required=False, display_order=8),
    ]

    courses = [
        Course(title="Genpact Code of Conduct", description="Core ethical standards, integrity policies, and professional behavior expected of every Genpact employee", category=CourseCategory.COMPLIANCE, duration_minutes=45, is_mandatory=True, week_number=1, display_order=1),
        Course(title="Information Security Essentials", description="Data protection principles, phishing awareness, password hygiene, and secure handling of client information", category=CourseCategory.SECURITY, duration_minutes=30, is_mandatory=True, week_number=1, display_order=2),
        Course(title="Welcome to Genpact Culture", description="Company history, values, leadership vision, and what makes Genpact a great place to work", category=CourseCategory.CULTURE, duration_minutes=20, is_mandatory=True, week_number=1, display_order=3),
        Course(title="Workplace Safety & Emergency Procedures", description="Fire drills, evacuation routes, first-aid contacts, and occupational health guidelines", category=CourseCategory.HR, duration_minutes=25, is_mandatory=True, week_number=1, display_order=4),
        Course(title="Introduction to Agile @ Genpact", description="How Genpact teams use Scrum, Kanban, and Jira to deliver client projects iteratively", category=CourseCategory.TECHNICAL, duration_minutes=40, is_mandatory=True, week_number=1, display_order=5),
        Course(title="Data Privacy & GDPR Basics", description="Understanding personally identifiable information (PII), GDPR compliance, and client confidentiality obligations", category=CourseCategory.COMPLIANCE, duration_minutes=35, is_mandatory=True, week_number=1, display_order=6),
    ]

    contacts = [
        Contact(name="Priya Sharma", role=ContactRole.MENTOR, department="Digital Transformation", email="priya.sharma@genpact.com", phone="+91-9876543210", is_primary=True, display_order=1),
        Contact(name="Rajesh Kumar", role=ContactRole.HR_SUPPORT, department="Human Resources — APAC", email="rajesh.kumar@genpact.com", phone="+91-9876543211", is_primary=False, display_order=2),
        Contact(name="Anita Desai", role=ContactRole.IT_SUPPORT, department="Global IT Service Desk", email="anita.desai@genpact.com", phone="+91-9876543212", is_primary=True, display_order=3),
        Contact(name="Michael Chen", role=ContactRole.MANAGER, department="Digital Transformation", email="michael.chen@genpact.com", phone="+65-91234567", is_primary=False, display_order=4),
        Contact(name="Sneha Patel", role=ContactRole.BUDDY, department="Digital Transformation", email="sneha.patel@genpact.com", phone="+91-9876543214", is_primary=False, display_order=5),
        Contact(name="Edona Xhemajli", role=ContactRole.HR_SUPPORT, department="Data Engineer", email="edona.xhemajli1234@genpact.com", phone="+91-9876543221", is_primary=False, display_order=6),
    ]

    with Session(_get_engine()) as session:
        for obj in tools + courses + contacts:
            session.add(obj)
        session.commit()

    print(f"Seeded {len(tools)} tools, {len(courses)} courses, {len(contacts)} contacts.")


if __name__ == "__main__":
    seed()
