import { useState } from 'react'
import { ArrowIcon, PageIntro } from '../components'
import { site } from '../data'

export function ContactPage() {
  const [copyStatus, setCopyStatus] = useState('')
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopyStatus('Email copied. Ready when you are.')
    } catch {
      setCopyStatus('Couldn’t copy automatically. Use the email link above.')
    }
  }

  return (
    <div className="route-page contact-page">
      <PageIntro
        number="05"
        eyebrow="CONTACT / BENGALURU / INDIA"
        title="Good work starts with a clear conversation."
        description="For software roles, AI projects, research collaborations, or an interesting problem that needs a careful builder—reach me directly."
      />

      <section className="contact-stage inverse-section">
        <div className="contact-statement" data-reveal>
          <span>LET’S MAKE SOMETHING</span>
          <h2>LET’S<br /><em>TALK.</em></h2>
          <p>No forms or friction. Choose the channel that works for you.</p>
        </div>

        <div className="contact-methods">
          <a href={`mailto:${site.email}`} data-cursor="EMAIL" data-reveal>
            <span>01</span>
            <div><small>EMAIL</small><strong>{site.email}</strong><p>Best for roles, project briefs, and collaboration details.</p></div>
            <ArrowIcon />
          </a>
          <div className="email-copy-control"><button type="button" onClick={copyEmail}>Copy email address <span aria-hidden="true">↗</span></button><p role="status">{copyStatus}</p></div>
          <a href={site.linkedin} target="_blank" rel="noreferrer" data-cursor="CONNECT" data-reveal>
            <span>02</span>
            <div><small>LINKEDIN</small><strong>Connect with Tejas NG</strong><p>Best for a quick professional introduction or ongoing conversation.</p></div>
            <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="contact-details section-pad">
        <div data-reveal><span>LOCATION</span><strong>{site.location}</strong><p>India Standard Time / UTC +05:30</p></div>
        <div data-reveal><span>AVAILABILITY</span><strong>Open to opportunities</strong><p>Software engineering, AI/ML, research, and meaningful product work.</p></div>
        <div className="contact-signoff" data-reveal><span>THANK YOU FOR VISITING</span><strong>TN<span>↗</span></strong></div>
      </section>
    </div>
  )
}
