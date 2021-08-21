import { useEffect } from "react";

function UploadFileForm(props) {

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea &&
            dropArea.addEventListener("drop", (event) => {
                event.preventDefault();
                props.handleFileUpload(event, event.dataTransfer.files[0]);
            });
    });

    useEffect(() => {
        const dropArea = document.querySelector(".drop-area");
        dropArea &&
            dropArea.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
    });

    return (
        <form className="mt-3 space-y-3" action="#" method="POST">
        <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold text-gray-500 tracking-wide">
                Прикрепите документ
            </label>
            <div className="drop-area flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                    <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                        <p className="pointer-none text-gray-500 ">
                            Перетащите файл
                            <span className="font-semibold"> сюда</span> <br /> или{" "}
                            <span className="text-blue-600 hover:underline">
                                выберите файл
                            </span>{" "}
                            с вашего компьютера
                        </p>
                    </div>
                    <input
                        type="file"
                        onChange={props.handleFileUpload}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
        <p className="text-sm text-gray-300">
            <span>Мои загрузки:</span>
        </p>
    </form>
    );
}

export default UploadFileForm;
