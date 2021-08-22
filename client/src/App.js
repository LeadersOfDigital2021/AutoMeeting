import React from "react";

import { useState, useReducer } from "react";
import axios from "./axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UploadedFile from "./components/UploadedFile";
import UploadingFile from "./components/UploadingFile";
import UploadFileForm from "./components/UploadFileForm";
import UploadFormTitle from "./components/UploadFormTitle";
import ProtocolCreationForm from "./components/ProtocolCreationForm";


import { ContextApp, mainReducer, initialState } from "./reducer";

function App() {
    const [state, dispatch] = useReducer(mainReducer, initialState);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    window.state = state;

    const handleFileUpload = (event, dropedFile = null) => {
        let file = dropedFile ?? event.target.files[0];
        if(!file) {
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        let fileName = file.name;
        setFileName(fileName);

        axios
            .request({
                method: "post",
                url: "upload",
                data: formData,
                onUploadProgress: ({ loaded, total }) => {
                    let progress = Math.floor((loaded / total) * 100);
                    setProgress(progress);

                    let fileSize = "";
                    let fileTotal = Math.floor(total / 1000);
                    fileTotal < 1024
                        ? (fileSize = fileTotal + " KB")
                        : (fileSize =
                              (loaded / (1024 * 1024)).toFixed(2) + " MB");

                    if (loaded === total) {
                        toast.info("Файл загружен");

                        let file = {
                            fileName,
                            fileSize,
                            id: "",
                            data: {},
                            isPending: true,
                            isUploaded: true,
                        };
                        dispatch({ type: "SET_FILE", data: { file } });
                        setProgress(0);
                    }
                },
            })
            .then((result) => {
                dispatch({
                    type: "SET_FILE_ID",
                    data: { id: result.data.id },
                });

                axios.get(`status/${result.data.id}`).then((result) => {
                    console.log("get status:", result);
                    dispatch({
                        type: "SET_IS_PENDING",
                        data: {
                            fileName,
                            isPending: result.data.isPending,
                            data: result.data.data,
                        },
                    });
                });
            });
    };

    return (
        <ContextApp.Provider value={{ dispatch, state }}>
                {state.isProtocolCreating ?
                    <ProtocolCreationForm />
                : (
                    <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
                        
                        <UploadFormTitle />

                        <UploadFileForm handleFileUpload={handleFileUpload} />

                        {progress > 0 ? (
                            <section className="progress-area onprogress">
                                <UploadingFile
                                    progress={progress}
                                    fileName={fileName}
                                />
                            </section>
                        ) : 
                            <section className="progress-area"/>
                        }

                        {state && state.file && state.file.isUploaded ? (
                            <section className="uploaded-area">
                                <UploadedFile />
                            </section>
                        ) :
                        ""
                        }
                    </div>
                    )
                }
        </ContextApp.Provider>
    );
}

export default App;
