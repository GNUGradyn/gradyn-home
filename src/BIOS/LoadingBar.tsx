import "./LoadingBar.css"

interface LoadingBarProps {
    progress: number;
}

const LoadingBar = (props: LoadingBarProps) => {
    return (
        <div className="loading-bar">
            <div className="loading-bar__progress" style={{ width: `${props.progress * 100}%` }}></div>
        </div>
    )
};

export default LoadingBar;
