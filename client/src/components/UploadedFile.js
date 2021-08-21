import {displayFileName} from '../tools';

function UploadedFile(props) {
    return (
        <li className="row">
            <div className="content upload">
                <i className="fas fa-file-alt"></i>
                <div className="details">
                    <span className="name">
                        {displayFileName(props.item.fileName)} • Загружен
                    </span>
                    <span className="size">{props.item.fileSize}</span>
                </div>
            </div>
            {props.item.isPending ? (
                <i className="fas fa-cog fa-spin"></i>
            ) : (
                <i className="fa fa-arrow-right hover:text-blue-800"></i>
            )}
        </li>
    );
}

export default UploadedFile;
