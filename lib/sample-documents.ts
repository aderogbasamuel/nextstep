export type SampleDocument = {
  id: string;
  label: string;
  build: (today?: Date) => string;
};

function longDate(from: Date, plusDays: number): string {
  const d = new Date(from);
  d.setDate(d.getDate() + plusDays);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Deadlines are generated relative to today so the demo never shows an expired sample.
export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "scholarship",
    label: "Scholarship announcement",
    build: (today = new Date()) => `Harbour Point Foundation
STEM Access Scholarship 2026/2027

About the scholarship
The Harbour Point Foundation is pleased to announce the STEM Access Scholarship for the 2026/2027 academic session. The scholarship supports promising students in science, technology, engineering and mathematics who might otherwise struggle to complete their degrees. Twenty (20) awards of N600,000 each will be made this year.

Who can apply
Applicants must be Nigerian citizens currently enrolled as full-time undergraduate students at an accredited university in Nigeria. Preference is given to students in Computer Science, Engineering, Mathematics, Physics and related fields, although students from other disciplines may be considered where they show strong evidence of technical work. Applicants must be in their second (200 level), third (300 level) or fourth (400 level) year of study during the 2026/2027 session, and must have a minimum Cumulative Grade Point Average (CGPA) of 4.00 on a 5.00 scale as at the end of the last completed session.

What to submit
A complete application includes: (1) a copy of your most recent official transcript or result slip; (2) a letter of admission or current student ID card; (3) one reference letter from a lecturer or head of department, written within the last six months; and (4) a personal statement of not more than 500 words describing a project you have built or a problem in your community you would like to solve with technology. Incomplete applications will not be reviewed. Applicants who have previously received a scholarship of N300,000 or more from another organisation for the same session are not eligible.

How to apply
Applications are submitted through the Foundation's online portal. Late applications will not be accepted. The closing date is ${longDate(today, 21)}. Shortlisted candidates will be invited to a 20-minute virtual interview within two weeks after the closing date, and results will be announced in December.`,
  },
  {
    id: "internship",
    label: "Software internship",
    build: (today = new Date()) => `Nimbus Ledger
Software Engineering Intern (Lagos, Hybrid)

Nimbus Ledger builds payment reconciliation tools for small businesses across West Africa. We are opening our summer internship cohort for ten (10) weeks, running from June to August, working with our product engineering team in Yaba, Lagos, at least three days a week on site.

The role
Interns work on real features in our web platform, including dashboards and reporting tools used by merchants, and pair with a senior engineer throughout the programme.

What we are looking for
You should be currently pursuing a degree in Computer Science, Computer Engineering, Software Engineering or a closely related field, and be in your second year or above. You should be comfortable building user interfaces with JavaScript or TypeScript and React, and have used Git for version control on at least one project. Experience with Node.js and SQL is a plus, and knowledge of Python is an advantage but not required. We care more about what you have built than about grades, so please include a link to at least one project on GitHub or a live demo. You must be available for the full ten weeks and able to work from Lagos.

How to apply
Send your CV (maximum two pages), a link to your GitHub or portfolio, and a short recommendation from a lecturer or previous employer who can speak to your technical ability. Applications close on ${longDate(today, 14)}. We review applications on a rolling basis, so early applications are encouraged. Successful candidates will complete a short take-home task followed by a 45-minute technical interview.`,
  },
];