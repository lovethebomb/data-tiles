import Link from 'next/link'
import css from 'styled-jsx/css'

const Header = () => (
  <div className="Header">
    <h1>Data Tiles ::</h1>
    <div className="nav">
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
    <style jsx={true}>{headerStyle}</style>
  </div>
)

const headerStyle = css`
.Header h1 {
  font-size: 14px;
  text-transform: uppercase;
  display: inline-block;
}

.Header .nav {
  display: inline-block;
}

.Header a {
  margin: 0 0.5em;
}
`

export default Header