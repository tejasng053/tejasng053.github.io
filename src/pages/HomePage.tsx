import { ArrowIcon, ContactBand, ExternalLink, ProjectPreviewList, SectionHeading } from '../components'
import { codingStats, site } from '../data'
import { Link } from '../router'

const pagePreviews = [
  {
    number: '02',
    path: '/projects',
    title: 'Projects',
    eyebrow: 'Builds / research / open source',
    copy: 'Selected case studies, every public GitHub repository, contribution data, and published research.',
    meta: '19 public repositories',
  },
  {
    number: '03',
    path: '/skills',
    title: 'Skills',
    eyebrow: 'Stack / proof / credentials',
    copy: 'The technologies I use, where I have used them, Codolio activity, and verified certifications.',
    meta: 'Python leads at 42%',
  },
  {
    number: '04',
    path: '/about',
    title: 'About',
    eyebrow: 'Story / leadership / events',
    copy: 'My engineering path, internships, NCC leadership, education, and the work beyond a code editor.',
    meta: 'Bengaluru, India',
  },
  {
    number: '05',
    path: '/contact',
    title: 'Contact',
    eyebrow: 'Roles / projects / ideas',
    copy: 'A simple place to reach me by email or LinkedIn—nothing hidden behind a form.',
    meta: 'Open to opportunities',
  },
]

export function HomePage() {
  return (
    <div className="route-page home-page">
      <section className="home-hero">
        <div className="hero-topline">
          <span>01 / HOME</span>
          <span>PORTFOLIO — 2026</span>
          <span>{site.location.toUpperCase()}</span>
        </div>

        <div className="hero-grid">
          <div className="hero-main">
            <p className="hero-kicker">SOFTWARE ENGINEERING / AI–ML / RESEARCH</p>
            <h1 aria-label="Tejas NG">
              <span>TEJAS</span>
              <span className="hero-name-outline">N<span>G</span></span>
            </h1>
            <p className="hero-intro">
              I build useful software, inspectable AI systems, and research tools—then keep refining the details until the experience feels inevitable.
            </p>
          </div>

          <aside className="hero-profile" data-reveal>
            <div className="hero-photo-wrap">
              <img src="/assets/tejas-ng.jpg" alt="Tejas NG" />
              <span>FULL COLOUR / NO FILTER</span>
            </div>
            <div className="hero-profile-meta">
              <span>Computer Science undergraduate</span>
              <span>RVITM / 2027</span>
            </div>
          </aside>
        </div>

        <div className="hero-bottom">
          <div className="availability-line"><i /> Available for software and AI opportunities</div>
          <div className="hero-links">
            <ExternalLink href={site.github}>GitHub</ExternalLink>
            <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={site.codolio}>Codolio</ExternalLink>
          </div>
          <Link className="hero-scroll-link" to="/projects" data-cursor="EXPLORE">Explore the work <ArrowIcon /></Link>
        </div>
      </section>

      <section className="home-manifesto inverse-section" data-reveal>
        <p>DESIGNING WITH PURPOSE</p>
        <blockquote>
          I like hard problems, clear systems, and interfaces that make complicated work feel <em>simple.</em>
        </blockquote>
        <span>Currently exploring deep learning, developer tooling, and full-stack product engineering.</span>
      </section>

      <section className="page-preview-section section-pad">
        <SectionHeading
          index="01"
          title="The index"
          note="One focused page for every part of the story. Start anywhere."
        />
        <div className="page-preview-grid">
          {pagePreviews.map((page) => (
            <Link className="page-preview-card" to={page.path} key={page.path} data-cursor="ENTER" data-reveal>
              <div className="page-preview-top"><span>{page.number}</span><ArrowIcon /></div>
              <p>{page.eyebrow}</p>
              <h3>{page.title}</h3>
              <div className="page-preview-copy">{page.copy}</div>
              <small>{page.meta}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-home section-pad section-rule">
        <SectionHeading
          index="02"
          title="Selected work"
          note="Four directions, one approach: make the idea real and make the result understandable."
          action={<Link className="arrow-link" to="/projects" data-cursor="ALL">All projects <ArrowIcon /></Link>}
        />
        <ProjectPreviewList />
      </section>

      <section className="home-proof inverse-section">
        <div className="proof-copy" data-reveal>
          <span>03 / ACTIVITY SNAPSHOT</span>
          <h2>Work you can<br />inspect.</h2>
          <p>Public repositories, tracked practice, a merged open-source pull request, and evidence behind the stack.</p>
          <Link className="inverse-link" to="/skills" data-cursor="PROOF">See skills & proof <ArrowIcon /></Link>
        </div>
        <div className="proof-stats">
          {codingStats.slice(0, 4).map((stat, index) => (
            <div key={stat.label} data-reveal>
              <small>{String(index + 1).padStart(2, '0')}</small>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-teaser section-pad section-rule">
        <div className="about-teaser-image" data-reveal>
          <img src="/assets/tejas-ng.jpg" alt="Tejas NG, software engineering and AI student" />
          <span>PORTRAIT / BENGALURU</span>
        </div>
        <div className="about-teaser-copy" data-reveal>
          <span>04 / BEYOND THE BUILD</span>
          <h2>Engineer in progress.<br />Leader by practice.</h2>
          <p>
            I am a Computer Science undergraduate at RVITM whose path runs through web development, machine-learning research, NCC leadership, and event operations.
          </p>
          <p>
            The common thread is ownership: understand the problem, bring people together, and follow the work through.
          </p>
          <Link className="text-link-large" to="/about" data-cursor="ABOUT">More about me <ArrowIcon /></Link>
        </div>
      </section>

      <ContactBand />
    </div>
  )
}
