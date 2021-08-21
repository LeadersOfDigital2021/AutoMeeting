import { useState, useEffect, useReducer } from "react";
import axios from "./axios";
import uuid from "react-uuid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UploadedFile from "./components/UploadedFile";
import UploadingFile from "./components/UploadingFile";
import UploadFileForm from "./components/UploadFileForm";

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea.addEventListener("drop", (event) => {
            event.preventDefault();
            handleFileUpload(event, event.dataTransfer.files[0]);
        });
    });

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
    });

    const handleFileUpload = (event, dropedFile = null) => {
        let file = dropedFile ?? event.target.files[0];
        if (!file) {
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        let fileName = file.name;
        setFileName(fileName);

        axios
            .request({
                method: "post",
                url: "/upload",
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
                        let id = uuid();
                        let files = [
                            ...state.files,
                            {
                                fileName,
                                fileSize,
                                id,
                                isPending: true,
                            },
                        ];
                        dispatch({ type: "SET_FILES", data: { files } });
                        setProgress(0);
                    }
                },
            })
            .then((result) => {
                console.log(result.data);
                result.data.success ? toast.info('Файл загружен') : toast.warning('Что-то пошло не так...') 
                dispatch({
                    type: "SET_IS_PENDING",
                    data: { fileName, value: false },
                });
            });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative items-center">
            <div className="back absolute opacity-60 inset-0 z-0" />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ToastContainer />

            

            <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Загрузка записи
                    </h2>
                </div>

                <UploadFileForm handleFileUpload={handleFileUpload} />

                {progress > 0 ? (
                    <section className="progress-area onprogress">
                        <UploadingFile
                            progress={progress}
                            fileName={fileName}
                        />
                    </section>
                ) : (
                    <section className="progress-area"></section>
                )}

                <section className="uploaded-area">
                    {state.files.map((item, index) => (
                        <UploadedFile key={index} item={item} />
                    ))}
                </section>
            </div>
        </div>
    );
}

export default App;

const initialState = { files: [] };

function reducer(state, action) {
    console.log(action);
    switch (action.type) {
        case "SET_FILES":
            return { files: [...action.data.files] };
        case "SET_IS_PENDING":
            let files = state.files.map((element) => {
                if (element.fileName === action.data.fileName)
                    element.isPending = action.data.value;
                return element;
            });
            console.log({ files: [...files] });
            return { files: [...files] };
        default:
            return initialState;
    }
}
