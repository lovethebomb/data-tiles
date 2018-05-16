import { ReactNode, StatelessComponent,  } from "react";

const TileContent: StatelessComponent<{children?: ReactNode, className?: string}> = ({ children, className = ""}) => (
    <div className={`Tile__Content ${className}`}>
        {children}
        <style jsx={true}>{`
        .Tile__Content {
            display: flex;
            background: #2f2f2f;
            padding: 20px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            box-sizing: border-box;
        }`}</style>
    </div>
)
export default TileContent