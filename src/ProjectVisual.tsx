import type { FeaturedProject } from './data'
import { usePointerTilt } from './usePointerTilt'

export function ProjectVisual({ project, home = false }: { project: FeaturedProject; home?: boolean }) {
  const tilt = usePointerTilt<HTMLAnchorElement>()
  return (
    <a {...tilt} className={`${home ? 'studio-feature-image' : 'project-visual-new'} playful-preview`} href={project.live ?? project.repository} target="_blank" rel="noreferrer" data-cursor={project.live ? 'LAUNCH' : 'CODE'} aria-label={`Open ${project.name}${project.live ? ' live demo' : ' on GitHub'}`}>
      <span className="preview-backplate" aria-hidden="true" />
      <span className="preview-window">
        <span className="preview-toolbar" aria-hidden="true"><span className="preview-dots"><i /><i /><i /></span><span>{project.name}</span><span>↗</span></span>
        {project.image ? <img className="preview-screenshot" src={project.image} alt={project.imageAlt ?? `${project.name} interface`} loading="lazy" decoding="async" /> : <span className="preview-type-art"><small>{project.label}</small><strong>{project.visualCode}</strong><span>{project.stack.slice(0, 3).join(' / ')}</span></span>}
      </span>
      <span className="preview-sticker" aria-hidden="true">{project.live ? 'TAKE A LOOK' : 'UNDER THE HOOD'} <span>↗</span></span>
      <span className="preview-caption"><span>{project.status}</span><span>{project.year}</span></span>
    </a>
  )
}
