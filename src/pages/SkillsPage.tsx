import { ArrowIcon, ContactBand, ExternalLink, PageIntro, SectionHeading } from '../components'
import { certifications, codolioDevelopmentStats, languageShare, problemStats, site, skillGroups } from '../data'

export function SkillsPage() {
  return (
    <div className="route-page skills-page">
      <PageIntro
        number="03"
        eyebrow="SKILLS / EVIDENCE / CERTIFICATIONS"
        title="A stack grounded in things I have built."
        description="Tools matter most in context. This page connects the technologies I use with projects, research, tracked practice, and verified learning."
      />

      <section className="skill-groups-section section-pad section-rule">
        <SectionHeading
          index="01"
          title="Technical toolkit"
          note="Broad enough to move across the product, focused enough to know where the hard parts live."
        />
        <div className="skill-group-list">
          {skillGroups.map((group) => (
            <article className="skill-group-row" key={group.title} data-reveal>
              <span>{group.number}</span>
              <h3>{group.title}</h3>
              <div className="skill-pills">{group.items.map((item) => <i key={item}>{item}</i>)}</div>
              <p>{group.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="codolio-section inverse-section">
        <div className="codolio-intro" data-reveal>
          <span>02 / CODOLIO SNAPSHOT</span>
          <h2>Practice,<br />measured.</h2>
          <p>Development and problem-solving statistics are a verified snapshot from my public Codolio profile.</p>
          <ExternalLink href={site.codolio}>Open Codolio</ExternalLink>
        </div>
        <div className="codolio-data">
          <div className="language-chart" data-reveal>
            <div className="chart-title"><span>LANGUAGE DISTRIBUTION</span><span>DEVELOPMENT ACTIVITY</span></div>
            <div className="language-bar" aria-label="Language distribution">
              {languageShare.map((language) => <i key={language.name} style={{ width: `${language.value}%` }} title={`${language.name} ${language.value}%`} />)}
            </div>
            <div className="language-legend">
              {languageShare.map((language, index) => (
                <div key={language.name}><small>{String(index + 1).padStart(2, '0')}</small><span>{language.name}</span><strong>{language.value}%</strong></div>
              ))}
            </div>
          </div>
          <div className="codolio-stat-grid">
            {codolioDevelopmentStats.map((stat, index) => (
              <div key={stat.label} data-reveal><small>D{String(index + 1).padStart(2, '0')}</small><strong>{stat.value}</strong><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="problem-solving-section section-pad section-rule">
        <SectionHeading
          index="03"
          title="Problem-solving practice"
          note="A snapshot across linked coding profiles; not a claim of mastery, but a record of consistency."
          action={<ExternalLink href={site.leetcode}>LeetCode</ExternalLink>}
        />
        <div className="problem-stat-grid">
          {problemStats.map((stat, index) => (
            <div key={stat.label} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="certification-section section-pad section-rule">
        <SectionHeading
          index="04"
          title="Certifications"
          note="Formal learning across the web, connected systems, core computer science, and leadership."
        />
        <div className="certification-list">
          {certifications.map((certificate, index) => {
            const content = (
              <>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><small>{certificate.issuer}</small><h3>{certificate.title}</h3></div>
                <p>{certificate.type}</p>
                {certificate.url ? <ArrowIcon /> : <i>—</i>}
              </>
            )
            return certificate.url ? (
              <a className="certificate-row" href={certificate.url} target="_blank" rel="noreferrer" key={certificate.title} data-cursor="VERIFY" data-reveal>{content}</a>
            ) : (
              <div className="certificate-row" key={certificate.title} data-reveal>{content}</div>
            )
          })}
        </div>
      </section>

      <section className="profile-links-section section-pad section-rule" data-reveal>
        <span>05 / PUBLIC PROFILES</span>
        <h2>Follow the evidence.</h2>
        <div>
          <a href={site.github} target="_blank" rel="noreferrer" data-cursor="GITHUB"><span>GitHub</span><small>Code & contributions</small><ArrowIcon /></a>
          <a href={site.codolio} target="_blank" rel="noreferrer" data-cursor="CODOLIO"><span>Codolio</span><small>Development & DSA stats</small><ArrowIcon /></a>
          <a href={site.leetcode} target="_blank" rel="noreferrer" data-cursor="LEETCODE"><span>LeetCode</span><small>Problem solving</small><ArrowIcon /></a>
        </div>
      </section>

      <ContactBand label="Need this stack on a real problem?" />
    </div>
  )
}
