import React, {useContext} from "react";
import {ContextApp} from "../reducer.js";

import {displayFileName} from '../tools';

function UploadedFile(props) {
    const {state, dispatch} = useContext(ContextApp);

    return (
        <li className="row">
            <div className="content upload">
                <i className="fas fa-file-alt"></i>
                <div className="details">
                    <span className="name">
                        {displayFileName(state.file.fileName)} • Загружен
                    </span>
                    <span className="size">{state.file.fileSize}</span>
                </div>
            </div>
            {state.file.isPending ? (
                <i className="fas fa-cog fa-spin"></i>
            ) : (
                <i onClick={() => dispatch({type: 'SET_CREATING_PROTOCOL_STATUS'})} className="fa fa-arrow-right hover:text-blue-800"></i>
            )}
        </li>
    );
}

export default UploadedFile;
