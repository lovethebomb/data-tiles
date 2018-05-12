import { StatelessComponent } from "next";
import { Props } from "react";

const TileContent: StatelessComponent<Props> = ({ children, className = ""}) => (
    <div className={`Tile__Content ${className}`}>
        {children}
        <style jsx>{`
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