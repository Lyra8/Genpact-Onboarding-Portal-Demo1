import { useState } from "react";
import "./FaqResources.css";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "When do I get my Genpact laptop?",
    answer:
      "Laptops are distributed on Day 1 during orientation. If you are joining remotely, IT will ship your device before your start date. Contact IT Support if you have not received a tracking number 5 days before your start date.",
  },
  {
    id: "faq-2",
    question: "How do I set up VPN access?",
    answer:
      "Install the Genpact VPN client from the US-01 tools list. Your credentials will be emailed on Day 1. Once installed, connect to vpn.genpact.com and sign in with your Genpact network ID and the temporary password provided by IT.",
  },
  {
    id: "faq-3",
    question: "What is the dress code?",
    answer:
      "Genpact follows a business casual dress code. Jeans are acceptable on Fridays. When meeting clients or attending formal events, business formals are expected. Check the company policy section below for the full dress code document.",
  },
  {
    id: "faq-4",
    question: "Who is my mentor?",
    answer:
      "Your mentor assignment will be shared on Day 1. You can also find mentor and support contact details in the Contact Directory on this dashboard. Your mentor will schedule a 1-on-1 introduction during your first week.",
  },
  {
    id: "faq-5",
    question: "When are the mandatory courses due?",
    answer:
      "All Week 1 mandatory courses must be completed by Friday of your first week. Track your progress on the Course Progress Tracker above. Courses marked as Done are complete; In Progress courses should be finished before end of day Friday.",
  },
  {
    id: "faq-6",
    question: "How do I request time off during onboarding?",
    answer:
      "Submit time-off requests through the Genpact HR portal. For Week 1, notify your mentor and HR Support at least 48 hours in advance. Unplanned absences should be reported to your mentor and HR Support before 9:00 AM.",
  },
];

const POLICIES = [
  {
    id: "policy-1",
    title: "Code of Conduct",
    category: "Compliance",
    description:
      "Core ethical standards, professional conduct expectations, and anti-harassment policy for all Genpact employees.",
    link: "#",
  },
  {
    id: "policy-2",
    title: "Information Security Policy",
    category: "Security",
    description:
      "Guidelines for protecting company systems, client data, and intellectual property. Includes acceptable use of Genpact networks.",
    link: "#",
  },
  {
    id: "policy-3",
    title: "Data Privacy & GDPR",
    category: "Compliance",
    description:
      "How Genpact handles personal data, client confidentiality, and compliance with global privacy regulations.",
    link: "#",
  },
  {
    id: "policy-4",
    title: "Remote Work Guidelines",
    category: "HR",
    description:
      "Expectations for hybrid and remote interns including work hours, communication norms, and home office setup.",
    link: "#",
  },
  {
    id: "policy-5",
    title: "Leave & Attendance Policy",
    category: "HR",
    description:
      "Sick leave, personal time off, public holidays, and attendance expectations during the 8-week internship.",
    link: "#",
  },
  {
    id: "policy-6",
    title: "IT Acceptable Use Policy",
    category: "Security",
    description:
      "Rules for using Genpact-issued devices, software installation, internet usage, and social media guidelines.",
    link: "#",
  },
];

function FaqResources() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (id) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section-card faq-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-07 / US-08</p>
          <h2>FAQ & Company Policies</h2>
        </div>
      </div>

      <h3 className="faq-subheading">Frequently Asked Questions</h3>

      <dl className="faq-list">
        {FAQ_ITEMS.map((item) => {
          const isOpen = activeFaq === item.id;

          return (
            <div className="faq-item" key={item.id}>
              <dt>
                <button
                  className={`faq-toggle ${isOpen ? "faq-open" : ""}`}
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-chevron">{isOpen ? "\u25B2" : "\u25BC"}</span>
                </button>
              </dt>
              {isOpen && (
                <dd className="faq-answer">
                  <p>{item.answer}</p>
                </dd>
              )}
            </div>
          );
        })}
      </dl>

      <hr className="faq-divider" />

      <h3 className="faq-subheading">Company Policies</h3>

      <div className="policy-grid">
        {POLICIES.map((policy) => (
          <article className="policy-card" key={policy.id}>
            <div className="policy-card-header">
              <h4>{policy.title}</h4>
              <span className="policy-category">{policy.category}</span>
            </div>
            <p>{policy.description}</p>
            <a
              className="policy-link"
              href={policy.link}
              target="_blank"
              rel="noreferrer"
            >
              View policy
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FaqResources;
