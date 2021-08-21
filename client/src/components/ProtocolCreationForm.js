import React, {useContext} from "react";
import {ContextApp} from "../reducer.js";

const ProtocolCreationForm = () => {
    
    const {state, dispatch} = useContext(ContextApp);
    
    return (
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
            <h1 className="text-2xl font-bold mb-8">
                Форма создания протокола
            </h1>
            <form id="form" noValidate>
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
                    <span className="text-sm text-red-600 hidden" id="error">
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
                    <span className="text-sm text-red-600 hidden" id="error">
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
                    <span className="text-sm text-red-600 hidden" id="error">
                        /Необходимо указать повестку
                    </span>
                </div>
                {state.file.data.facts.map((fact, index) => {
                    return (
                        <div key={index} className="relative z-0 w-full mb-5">
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
                                /Необходимо указать факт
                            </span>
                        </div>
                    );
                })}
                <button
                    id="button"
                    type="button"
                    className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-red-500 hover:bg-red-600 hover:shadow-lg focus:outline-none"
                >
                    Создать протокол
                </button>
            </form>
        </div>
    );
};

export default ProtocolCreationForm;