import "./DesktopIcon.css"

interface DesktopIconProps {
    icon: string;
    name: string;
    open: () => void
}

const DesktopIcon = (props: DesktopIconProps) => {
    return (
        <div className="desktop-icon" onClick={() => props.open()}>
            <img src={props.icon} alt={props.name + " App (Desktop Icon)"}/>
            <p>{props.name}</p>
        </div>
    )
}

export default DesktopIcon;
