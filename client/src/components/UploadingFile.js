import { displayFileName } from "../tools";

function UploadingFile(props) {
    return (
        <li className="row">
            <i className="fas fa-file-alt"></i>
            <div className="content">
                <div className="details">
                    <span className="name">
                        {displayFileName(props.fileName)} • Uploading
                    </span>
                    <span className="percent">{props.progress}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{
                            width: `${props.progress}%`,
                        }}
                    ></div>
                </div>
            </div>
        </li>
    );
}

export default UploadingFile;
