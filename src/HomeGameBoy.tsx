import { navigation } from './data'
import { Link } from './router'

const consoleNavigation = navigation.filter((item) => item.path !== '/')

export function HomeGameBoy() {
  return (
    <div className="home-console-stage" data-reveal>
      <div className="home-gameboy" aria-label="Portfolio navigation console">
        <div className="gameboy-topline" aria-hidden="true">
          <span>TN-01</span>
          <span>PORTFOLIO SYSTEM</span>
        </div>

        <div className="gameboy-screen-bezel">
          <div className="gameboy-screen">
            <div className="gameboy-screen-head">
              <span>TEJAS.OS</span>
              <span className="gameboy-ready"><i /> READY</span>
            </div>
            <p>SELECT DESTINATION</p>
            <nav className="gameboy-nav" aria-label="Portfolio navigation">
              {consoleNavigation.map((item) => (
                <Link key={item.path} to={item.path} data-cursor="OPEN">
                  <small>{item.number}</small>
                  <span>{item.label}</span>
                  <b aria-hidden="true">›</b>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="gameboy-brandline" aria-hidden="true">
          <strong>tejas</strong>
          <span>PORTFOLIO / 26</span>
        </div>

        <div className="gameboy-controls" aria-hidden="true">
          <div className="gameboy-dpad"><i /><i /></div>
          <div className="gameboy-center-controls"><i /><i /></div>
          <div className="gameboy-ab"><i>B</i><i>A</i></div>
        </div>

        <div className="gameboy-speaker" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
        </div>
      </div>
      <p className="gameboy-hint"><span>↑</span> NAV LIVES HERE — SCROLL TO DETACH</p>
    </div>
  )
}
