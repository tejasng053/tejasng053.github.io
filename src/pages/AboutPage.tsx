import { ArrowIcon, ContactBand, ExternalLink, PageIntro, SectionHeading } from '../components'
import { experience, nonTechnicalSkills, site } from '../data'

const quickFacts = [
  ['Base', 'Bengaluru, India'],
  ['Education', 'B.E. Computer Science'],
  ['Institution', 'RVITM'],
  ['Graduation', '2027'],
  ['CGPA', '8.18 / 10'],
  ['Focus', 'Software + AI/ML'],
]

const leadershipMoments = [
  {
    index: '01',
    title: 'Cadet Under Officer',
    meta: 'NCC / JUN 2025 — FEB 2026',
    copy: 'Held a senior cadet role built around responsibility, coordination, standards, and leading from the front.',
  },
  {
    index: '02',
    title: 'Army Attachment Camp',
    meta: 'NCC / FIELD EXPERIENCE',
    copy: 'Practised discipline, adaptability, teamwork, and composure in a demanding environment beyond the classroom.',
  },
  {
    index: '03',
    title: 'Robotics Event Manager',
    meta: 'RVITM / OCT — NOV 2025',
    copy: 'Managed planning, people, participant coordination, and on-ground delivery for a college robotics event.',
  },
  {
    index: '04',
    title: 'Achievers’ Day 2026',
    meta: 'RVITM / RECOGNITION',
    copy: 'Recognized for NCC performance and participation in the Army Attachment Camp.',
  },
]

export function AboutPage() {
  return (
    <div className="route-page about-page">
      <PageIntro
        number="04"
        eyebrow="ABOUT / EXPERIENCE / LEADERSHIP"
        title="The person behind the projects."
        description="A Computer Science student shaped by engineering practice, research curiosity, team responsibility, and experiences well beyond a laptop."
      />

      <section className="about-profile-section section-pad section-rule">
        <div className="about-portrait" data-reveal>
          <div className="portrait-window">
            <img src="/assets/tejas-ng.jpg" alt="Portrait of Tejas NG" />
            <span>TEJAS_NG / 2026</span>
          </div>
          <p>Shown in full colour. The interface stays monochrome; the person does not.</p>
        </div>
        <div className="about-profile-copy" data-reveal>
          <span>INTRODUCTION</span>
          <h2>I learn by building, and I grow by taking responsibility.</h2>
          <p>
            I am Tejas NG, a Computer Science undergraduate at RV Institute of Technology and Management in Bengaluru. My work moves between full-stack product engineering, applied AI, and reproducible machine-learning research.
          </p>
          <p>
            Internships at IIT Ropar and Edunet Foundation gave me collaborative engineering practice. NCC leadership and event management taught me what code cannot: clarity under pressure, accountability to a team, and how to keep moving when the plan changes.
          </p>
          <div className="about-profile-actions">
            <a href={site.resume} target="_blank" rel="noreferrer" data-cursor="RESUME">View résumé <ArrowIcon /></a>
            <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>
          </div>
        </div>
      </section>

      <section className="quick-facts-section inverse-section">
        <div className="quick-facts-title" data-reveal><span>01 / AT A GLANCE</span><h2>Current coordinates.</h2></div>
        <div className="quick-facts-grid">
          {quickFacts.map(([label, value], index) => (
            <div key={label} data-reveal><small>{String(index + 1).padStart(2, '0')}</small><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </section>

      <section className="experience-section section-pad section-rule">
        <SectionHeading
          index="02"
          title="Experience timeline"
          note="Engineering, leadership, and event work—each one adding a different kind of range."
        />
        <div className="experience-list">
          {experience.map((item) => (
            <article key={`${item.role}-${item.organization}`} data-reveal>
              <span>{item.number}</span>
              <time>{item.period}</time>
              <div><small>{item.organization}</small><h3>{item.role}</h3></div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="leadership-section section-pad section-rule">
        <SectionHeading
          index="03"
          title="Leadership & events"
          note="The work that shaped how I communicate, organize, decide, and show up for a team."
        />
        <div className="leadership-grid">
          {leadershipMoments.map((moment) => (
            <article key={moment.title} data-reveal>
              <span>{moment.index}</span>
              <small>{moment.meta}</small>
              <h3>{moment.title}</h3>
              <p>{moment.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="human-skills-section inverse-section">
        <div className="human-skills-heading" data-reveal>
          <span>04 / HUMAN SKILLS</span>
          <h2>Not soft.<br />Operational.</h2>
          <p>Every skill below is tied to an experience, not a buzzword.</p>
        </div>
        <div className="human-skills-list">
          {nonTechnicalSkills.map((skill, index) => (
            <div key={skill.title} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{skill.title}</h3>
              <p>{skill.proof}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactBand label="Have a role that values both craft and ownership?" />
    </div>
  )
}
