import { useEffect, useState } from 'react'
import { ArrowIcon, ContactBand, ExternalLink, SectionHeading } from '../components'
import { featuredProjects, site } from '../data'
import { Link } from '../router'

const indexPages = [
  { path: '/projects', no: '01', title: 'The work', detail: 'Products, experiments & open source', meta: 'Explore projects' },
  { path: '/skills', no: '02', title: 'The toolkit', detail: 'Technology, practice & credentials', meta: 'See my skills' },
  { path: '/about', no: '03', title: 'The person', detail: 'Engineering, leadership & everything between', meta: 'Meet Tejas' },
]

export function HomePage() {
  const [selected, setSelected] = useState(0)
  const [localTime, setLocalTime] = useState('')
  const project = featuredProjects[selected]

  useEffect(() => {
    const update = () => setLocalTime(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()))
    update()
    const timer = window.setInterval(update, 60000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="route-page home-page studio-home">
      <section className="studio-hero">
        <div className="studio-hero-meta"><span><i /> OPEN TO OPPORTUNITIES</span><span>BENGALURU, IN <time>{localTime} IST</time></span></div>
        <div className="studio-hero-body">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">SOFTWARE ENGINEER IN THE MAKING</p>
            <h1>Ideas into<br /><span>working things.</span></h1>
            <p className="studio-hero-description">I’m Tejas. I build web experiences and AI systems, with curiosity for the problem and care for the details.</p>
            <div className="studio-hero-actions"><Link to="/projects" className="studio-button light" data-cursor="EXPLORE">Explore my work <ArrowIcon /></Link><Link to="/about" className="studio-text-link">A little about me <ArrowIcon /></Link></div>
          </div>
          <div className="studio-portrait" onPointerMove={(event) => {
            if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            const rect = event.currentTarget.getBoundingClientRect()
            event.currentTarget.style.setProperty('--photo-x', `${((event.clientX - rect.left) / rect.width - .5) * 5}deg`)
            event.currentTarget.style.setProperty('--photo-y', `${((event.clientY - rect.top) / rect.height - .5) * -5}deg`)
          }} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--photo-x', '0deg'); event.currentTarget.style.setProperty('--photo-y', '0deg') }}>
            <div className="studio-portrait-image"><img src="/assets/tejas-ng.jpg" alt="Tejas NG" fetchPriority="high" /><span className="portrait-corner">↗</span></div>
            <div className="studio-portrait-caption"><strong>Tejas NG</strong><span>CS @ RVITM · Class of 2027</span></div>
            <span className="studio-portrait-tag">BUILDING. LEARNING. REPEATING.</span>
          </div>
        </div>
        <div className="studio-wordmark" aria-hidden="true">TEJAS NG<span>✳</span></div>
        <div className="studio-hero-foot"><span>SOFTWARE / AI / RESEARCH</span><a href="#selected-work">SCROLL TO EXPLORE <span>↓</span></a><span>PORTFOLIO — 2026</span></div>
      </section>

      <div className="studio-ticker" aria-hidden="true"><div>{[0, 1].map((copy) => <span key={copy}>PYTHON <i>✳</i> REACT <i>✳</i> MACHINE LEARNING <i>✳</i> OPEN SOURCE <i>✳</i> HUMAN CURIOSITY <i>✳</i> </span>)}</div></div>

      <section className="studio-work section-pad" id="selected-work">
        <SectionHeading index="01" title="Built with intent." note="A few things I’ve spent time thinking about, building, and making better." action={<Link className="arrow-link" to="/projects">All projects <ArrowIcon /></Link>} />
        <div className="studio-project-picker" role="group" aria-label="Choose a featured project">{featuredProjects.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={selected === index ? 'selected' : ''}><span>0{index + 1}</span>{item.name}<ArrowIcon /></button>)}</div>
        <article className="studio-feature" key={project.id}>
          <a className="studio-feature-image" href={project.live ?? project.repository} target="_blank" rel="noreferrer" data-cursor={project.live ? 'LAUNCH' : 'CODE'} aria-label={`Open ${project.name}${project.live ? ' live demo' : ' on GitHub'}`}>
            {project.image ? <img src={project.image} alt={project.imageAlt} loading="lazy" /> : <div className="studio-type-art"><small>NATURAL LANGUAGE PROCESSING</small><strong>Words.<br />Patterns.<br />Evidence.</strong><span>TF-IDF → CLASSIFICATION → EXPLANATION</span></div>}
            <span className="studio-image-badge">{project.status} <ArrowIcon /></span>
          </a>
          <div className="studio-feature-copy"><span className="studio-eyebrow">0{selected + 1} / {project.label}</span><h3>{project.name}</h3><p>{project.summary}</p><div className="project-stack">{project.stack.map((stack) => <span key={stack}>{stack}</span>)}</div><div className="studio-feature-actions"><a className="studio-button dark" href={project.live ?? project.repository} target="_blank" rel="noreferrer">{project.live ? 'Live demo' : 'Explore project'} <ArrowIcon /></a>{project.live && <ExternalLink href={project.repository}>GitHub</ExternalLink>}</div></div>
        </article>
      </section>

      <section className="studio-index section-pad"><div className="studio-index-intro" data-reveal><span className="studio-eyebrow">02 / MORE THAN A COLLECTION OF PROJECTS</span><h2>Different sides.<br /><em>Same curiosity.</em></h2></div><div className="studio-index-links">{indexPages.map((page) => <Link to={page.path} key={page.path} data-cursor="ENTER" data-reveal><span>{page.no}</span><div><h3>{page.title}</h3><p>{page.detail}</p></div><small>{page.meta}</small><ArrowIcon /></Link>)}</div></section>

      <section className="studio-about section-pad"><div data-reveal><span className="studio-eyebrow">03 / A LITTLE CONTEXT</span><h2>Curious by nature.<br />Committed by practice.</h2></div><div data-reveal><p>Computer Science at RVITM. Web development at IIT Ropar and Edunet. Leadership through NCC. Each experience shapes the way I build and the way I work with people.</p><p>I’m drawn to work that connects thoughtful engineering with something people can actually use.</p><Link to="/about" className="arrow-link">The longer story <ArrowIcon /></Link><div className="studio-socials"><ExternalLink href={site.github}>GitHub</ExternalLink><ExternalLink href={site.linkedin}>LinkedIn</ExternalLink><ExternalLink href={site.codolio}>Codolio</ExternalLink></div></div></section>
      <ContactBand label="Let’s make something worth using." />
    </div>
  )
}
