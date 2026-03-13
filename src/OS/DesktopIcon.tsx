interface DesktopIconProps {
    icon: string;
    name: string;
}

const DesktopIcon = (props: DesktopIconProps) => {
    return (
        <div className="desktop-icon">
            <img src={props.icon} alt={props.name + " App (Desktop Icon)"}/>
            <p>{props.name}</p>
        </div>
    )
}

export default DesktopIcon;
