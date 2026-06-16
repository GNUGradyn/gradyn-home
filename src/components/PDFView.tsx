import "./PDFView.css"

interface PDFViewProps {
    url: string;
}

const PDFView = (props: PDFViewProps) => (
    <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
        <div className="pdfview-url">
            <input type="text" value={props.url}/>
            <button onClick={() => window.open(props.url, "_blank")}>Open In Host</button>
        </div>
        <iframe src={props.url} style={{flex: 1}}/>
    </div>
)

export default PDFView;
