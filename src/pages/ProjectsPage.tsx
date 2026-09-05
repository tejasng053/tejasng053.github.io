import { useState } from 'react'
import { ArrowIcon, ContactBand, ExternalLink, PageIntro, ProjectCard, SectionHeading } from '../components'
import { codingStats, featuredProjects, openSourceContribution, publications, repositories, site } from '../data'

export function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const search = query.trim().toLowerCase()
  const filteredRepositories = repositories.filter((repository) => {
    const matchesQuery = `${repository.name} ${repository.description} ${repository.language}`.toLowerCase().includes(search)
    const matchesFilter = filter === 'All' || (filter === 'Live demos' ? Boolean(repository.live) : filter === 'Forks' ? repository.kind === 'Fork' : repository.kind !== 'Fork')
    return matchesQuery && matchesFilter
  })

  return (
    <div className="route-page projects-page">
      <PageIntro
        number="02"
        eyebrow="PROJECTS / RESEARCH / OPEN SOURCE"
        title="Selected work & every public build."
        description="A working archive of products, machine-learning systems, research tools, experiments, and public contributions—shown with the context behind them."
      />

      <section className="project-snapshot section-pad section-rule">
        <div className="snapshot-note" data-reveal>
          <span>PUBLIC SNAPSHOT</span>
          <strong>31 AUG 2026</strong>
          <p>GitHub counts update over time. This verified snapshot separates original work, forks, and earlier experiments.</p>
          <ExternalLink href={site.github}>View live profile</ExternalLink>
        </div>
        <div className="snapshot-stats">
          {codingStats.map((stat, index) => (
            <div key={stat.label} data-reveal>
              <small>{String(index + 1).padStart(2, '0')}</small>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-projects-section section-pad section-rule">
        <SectionHeading
          index="01"
          title="Featured case studies"
          note="The projects that best represent how I frame, build, test, and communicate technical work."
        />
        <div className="featured-project-stack">
          {featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      </section>

      <section className="open-source-panel inverse-section">
        <div className="open-source-heading" data-reveal>
          <span>02 / OPEN SOURCE</span>
          <p>UPSTREAM CONTRIBUTION</p>
          <h2>From fork<br />to merged.</h2>
        </div>
        <a className="pull-request-card" href={openSourceContribution.url} target="_blank" rel="noreferrer" data-cursor="PR #26" data-reveal>
          <div className="pr-top">
            <span>{openSourceContribution.project}</span>
            <b>{openSourceContribution.status}</b>
          </div>
          <h3>{openSourceContribution.title}</h3>
          <p>Added long and short CLI flags so users can inspect the installed package version directly.</p>
          <div className="pr-meta">
            <span>{openSourceContribution.date}</span>
            <span>+{openSourceContribution.additions} lines</span>
            <span>{openSourceContribution.files} files</span>
            <ArrowIcon />
          </div>
        </a>
      </section>

      <section className="repository-section section-pad section-rule">
        <SectionHeading
          index="03"
          title="All public repositories"
          note="All 19 repositories are included. Forks and small early experiments are labelled plainly."
          action={<ExternalLink href={site.github}>GitHub profile</ExternalLink>}
        />
        <div className="repository-controls">
          <label htmlFor="repository-search">FIND SOMETHING INTERESTING
            <input id="repository-search" type="search" placeholder="Search projects, ideas, or languages…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="repository-filters" role="group" aria-label="Filter repositories">
            {['All', 'Live demos', 'Originals', 'Forks'].map((option) => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
          </div>
        </div>
        <p className="repository-result-count" role="status">{filteredRepositories.length} of {repositories.length} repositories</p>
        <div className="repository-head" aria-hidden="true">
          <span>No.</span><span>Repository</span><span>Type</span><span>Language</span><span>Updated</span><span>Links</span>
        </div>
        <div className="repository-list">
          {filteredRepositories.map((repository) => (
            <article className="repository-row" key={repository.name}>
              <span className="repository-index">{String(repositories.indexOf(repository) + 1).padStart(2, '0')}</span>
              <div className="repository-name">
                <h3>{repository.name}</h3>
                <p>{repository.description}</p>
              </div>
              <span className="repository-kind">{repository.kind}</span>
              <span className="repository-language">{repository.language}</span>
              <time>{repository.updated}</time>
              <div className="repository-links">
                <a href={repository.url} target="_blank" rel="noreferrer" data-cursor="CODE" aria-label={`${repository.name} source code`}>Code <ArrowIcon /></a>
                {repository.live && <a href={repository.live} target="_blank" rel="noreferrer" data-cursor="LIVE" aria-label={`${repository.name} live site`}>Live <ArrowIcon /></a>}
              </div>
            </article>
          ))}
          {filteredRepositories.length === 0 && <div className="repository-empty"><h3>No matches this time.</h3><p>Try another keyword or explore the full archive.</p><button type="button" onClick={() => { setQuery(''); setFilter('All') }}>Reset filters <ArrowIcon /></button></div>}
        </div>
      </section>

      <section className="publications-section section-pad section-rule">
        <SectionHeading
          index="04"
          title="Research & writing"
          note="Published work connecting machine learning with real operating problems."
        />
        <div className="publication-list">
          {publications.map((publication, index) => (
            <a href={publication.url} target="_blank" rel="noreferrer" key={publication.title} data-cursor="READ" data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <time>{publication.year}</time>
              <h3>{publication.title}</h3>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </section>

      <ContactBand label="Want to discuss the thinking behind a build?" />
    </div>
  )
}
