import React from "react";

import { useState, useEffect, useReducer } from "react";
import axios from "./axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UploadedFile from "./components/UploadedFile";
import UploadingFile from "./components/UploadingFile";
import UploadFileForm from "./components/UploadFileForm";

import { ContextApp, mainReducer, initialState } from "./reducer";

function App() {
    const [state, dispatch] = useReducer(mainReducer, initialState);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    window.state = state;

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea &&
            dropArea.addEventListener("drop", (event) => {
                event.preventDefault();
                handleFileUpload(event, event.dataTransfer.files[0]);
            });
    });

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea &&
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
                        console.log("Файл загружен");
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
                    data: { fileName, id: result.data.id },
                });

                // @todo очистить интервал
                let interval = setInterval(function () {
                    let url = `status/${result.data.id}`;
                    axios.get(url).then( (result) => {
                        console.log("get status:", result);
                        console.log('interval', interval)
                        if (!result.data.isPending) {
                            clearInterval(interval)
                        }
                        dispatch({
                            type: "SET_IS_PENDING",
                            data: {
                                fileName,
                                isPending: result.data.isPending,
                                data: result.data.data,
                            },
                        });
                    });
                }, 1000);
            });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
            />
            <ToastContainer />

            <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative items-center">
                <div className="back absolute opacity-60 inset-0 z-0" />

                <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
                    {state.isProtocolCreating ? (
                        <>
                            <h1 className="text-2xl font-bold mb-8">
                                Форма создания протокола
                            </h1>
                            <form id="form" noValidate>
                                {state.file && state.file.data ? (
                                    <>
                                        <div className="relative z-0 w-full mb-5">
                                            <input
                                                type="text"
                                                name="topic"
                                                placeholder=""
                                                value={state.file.data.topic}
                                                required
                                                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                            >
                                                Тема совещания
                                            </label>
                                            <span
                                                className="text-sm text-red-600 hidden"
                                                id="error"
                                            >
                                                Необходимо указать тему
                                            </span>
                                        </div>
                                        <div className="relative z-0 w-full mb-5">
                                            <input
                                                type="date"
                                                name="date"
                                                value={state.file.data.date}
                                                placeholder=" "
                                                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                            >
                                                Дата проведения
                                            </label>
                                            <span
                                                className="text-sm text-red-600 hidden"
                                                id="error"
                                            >
                                                Необходимо указать дату
                                            </span>
                                        </div>
                                        <div className="relative z-0 w-full mb-5">
                                            <input
                                                type="text"
                                                name="agenda"
                                                value={state.file.data.agenda}
                                                placeholder=" "
                                                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                            />
                                            <label
                                                htmlFor="password"
                                                className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                            >
                                                Повестка
                                            </label>
                                            <span
                                                className="text-sm text-red-600 hidden"
                                                id="error"
                                            >
                                                /Необходимо указать повестку
                                            </span>
                                        </div>
                                        {state.file.data.facts.map(
                                            (fact, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="relative z-0 w-full mb-5"
                                                    >
                                                        <input
                                                            type="text"
                                                            name="fact"
                                                            value={fact}
                                                            placeholder=" "
                                                            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                        />
                                                        <label
                                                            htmlFor="password"
                                                            className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                                        >
                                                            Зафиксируем факт
                                                        </label>
                                                        <span
                                                            className="text-sm text-red-600 hidden"
                                                            id="error"
                                                        >
                                                            /Необходимо указать
                                                            факт
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                        <button
                                            id="button"
                                            type="button"
                                            className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-red-500 hover:bg-red-600 hover:shadow-lg focus:outline-none"
                                        >
                                            Создать протокол
                                        </button>
                                    </>
                                ) : (
                                    ""
                                )}
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Загрузка записи
                                </h2>
                            </div>

                            <UploadFileForm
                                handleFileUpload={handleFileUpload}
                            />

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

                            {state && state.file && state.file.isUploaded ? (
                                <section className="uploaded-area">
                                    <ContextApp.Provider
                                        value={{ dispatch, state }}
                                    >
                                        <UploadedFile />
                                    </ContextApp.Provider>
                                </section>
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
