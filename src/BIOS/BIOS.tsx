import './BIOS.css'
import LoadingBar from './LoadingBar';

interface BIOSProps {
    loadBar: number;
    onclick?: () => void;
}

const BIOS = (props: BIOSProps) => {
    return (
        <div id="BIOS" onClick={props.onclick}>
            <p id="bios-options">
                F5&ensp;&emsp;= REBOOT<br></br>
                F11 = FULL SCREEN
            </p>
            <h1 id="bios-label">GRADYN BIOS</h1>
            <h1 id="bios-domain">GRADYN.COM</h1>
            <LoadingBar progress={props.loadBar}/>
        </div>
    );
};

export default BIOS;
