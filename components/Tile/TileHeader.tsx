import css from 'styled-jsx/css'
import { ReactNode, StatelessComponent } from "react";

const headerStyle = css`
.Tile__Header {
    background: #2f2f2f;
    padding: 20px;
    height: 64px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.Tile__Header > :global(.Tile__Header__TimeAgo) {
    font-size: 10px;
    font-family: monospace;
    text-transform: uppercase;
    vertical-align: middle;
    display: block;
    display: inline-block;
    color: #585858;
    font-weight: bold;
}

.Tile__Header > :global(a:hover) {
    opacity: 0.8;
}
`
const TileHeader: StatelessComponent<{children?: ReactNode, className?: any}> = ({ children, className = ""}) => (
    <header className={`Tile__Header ${className}`}>
        {children}
        <style jsx={true}>{headerStyle}</style>
    </header>
)
export default TileHeader 