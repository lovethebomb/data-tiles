import { StatelessComponent } from "next";
import { Props } from "react";

const TileHeader: StatelessComponent<Props> = ({ children, className = ""}) => (
    <header className={`Tile__Header ${className}`}>
        {children}
        <style jsx>{`
        .Tile__Header {
            background: #2f2f2f;
            padding: 20px;
            min-height: 32px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            box-sizing: border-box;
        }

        .Tile__Header > :global(a:hover) {
            opacity: 0.8;
        }
        `}</style>
    </header>
)
export default TileHeader 