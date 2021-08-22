import React, { useContext } from "react";
import { ContextApp } from "../reducer.js";
import axios from "../axios";

const ProtocolCreationForm = () => {
    const { state, dispatch } = useContext(ContextApp);

    const createDocument = () => {
        axios.post(`/protocol/${state.file.data.id}`, state.file.data).then( (result) => {
            console.log("created file: ", result)
            dispatch("SET_DOC_CREATED_STATUS");
            document.querySelector('#downloadLink').href = result.data.url;
        });
    };

    const addFact = (e) => {
        e.preventDefault();
        dispatch({type: "ADD_FACT"})
    };

    const addParticipant = (e) => {
        e.preventDefault();
        dispatch({type: "ADD_PARTICIPANTS"})
    };

    return (
        <div className="w-full p-10 bg-white rounded-xl z-10">
            <h1 className="text-2xl font-bold mb-2">
                Форма создания протокола
            </h1>
            <label
                className="text-sm font-bold text-gray-500 tracking-wide hover:text-red-500"
                onClick={() => {
                    dispatch({ type: "RESET_APP" });
                }}
            >
                <i className="fa fa-arrow-left" aria-hidden="true">
                    {" "}
                </i>{" "}
                Загрузить новую запись
            </label>
            <form id="form" className="mt-6" noValidate>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="text"
                        name="topic"
                        placeholder=""
                        value={
                            (state.file &&
                                state.file.data &&
                                state.file.data.secretary) ??
                            ""
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "CHANGE_SECRETARY",
                                data: e.target.value,
                            })
                        }
                        required
                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                    />
                    <label
                        htmlFor="name"
                        className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                    >
                        Секретарь
                    </label>
                    <span className="text-sm text-red-600 hidden" id="error">
                        Необходимо секретаря
                    </span>
                </div>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="text"
                        name="topic"
                        placeholder=""
                        value={
                            (state.file &&
                                state.file.data &&
                                state.file.data.presiding) ??
                            ""
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "CHANGE_PRESIDING",
                                data: e.target.value,
                            })
                        }
                        required
                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                    />
                    <label
                        htmlFor="name"
                        className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                    >
                        Председатель
                    </label>
                    <span className="text-sm text-red-600 hidden" id="error">
                        Необходимо председателя
                    </span>
                </div>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="text"
                        name="topic"
                        placeholder=""
                        value={
                            (state.file &&
                                state.file.data &&
                                state.file.data.topic) ??
                            ""
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "CHANGE_TOPIC",
                                data: e.target.value,
                            })
                        }
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
                        name="date"
                        type="date"
                        value={
                            (state.file &&
                                state.file.data &&
                                state.file.data.date) ??
                            ""
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "CHANGE_DATE",
                                data: e.target.value,
                            })
                        }
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
                        value={
                            (state.file &&
                                state.file.data &&
                                state.file.data.agenda) ??
                            ""
                        }
                        onChange={(e) =>
                            dispatch({
                                type: "CHANGE_AGENDA",
                                data: e.target.value,
                            })
                        }
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
                {state.file &&
                    state.file.data &&
                    state.file.data.facts.map((fact, index) => {
                        console.log("fact: ", fact);
                        return (
                            <div
                                key={index}
                                className="relative z-0 w-full mb-5"
                            >
                                <input
                                    type="text"
                                    name="fact"
                                    value={fact.data}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "CHANGE_FACT",
                                            data: e.target.value,
                                            id: fact.id,
                                        })
                                    }
                                    placeholder=" "
                                    className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                >
                                    Факт
                                </label>
                                <span
                                    className="text-sm text-red-600 hidden"
                                    id="error"
                                >
                                    Необходимо указать факт
                                </span>
                            </div>
                        );
                    })}
                
                {state.file &&
                state.file.data &&
                state.file.data.participants.map((participant, index) => {
                    console.log("participant: ", participant);
                    return (
                        <div key={index} className="flex z-0 w-full mb-5 space-x-6">
                            <div className="w-1/2 flex justify-start">
                                <input
                                    type="text"
                                    name="participient"
                                    value={participant.name}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "CHANGE_PARTICIPIENT_NAME",
                                            data: e.target.value,
                                            id: participant.id,
                                        })
                                    }
                                    placeholder="ФИО"
                                    className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                />
                                <label
                                    htmlFor="participient"
                                    className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                >
                                    ФИО
                                </label>
                            </div>
                            <div className="w-1/2 flex justify-end">
                                <input
                                    type="text"
                                    name="position"
                                    value={participant.position}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "CHANGE_PARTICIPIENT_POSITION",
                                            data: e.target.value,
                                            id: participant.id,
                                        })
                                    }
                                    placeholder="Должность"
                                    className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                />
                                <label
                                    htmlFor="position"
                                    className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                                >
                                    Должность
                                </label>
                            </div>
                        </div>
                    );
                })}
                    
                
                <div className="p-2 flex">
                    <div className="w-1/2 flex justify-center">
                        <button
                            onClick={addFact}
                            className="bg-gray-500 text-white p-2 rounded text-lg w-full"
                        >
                            Добавить факт
                        </button>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <button
                            onClick={addParticipant}
                            className="bg-yellow-500 text-white p-2 ml-6 rounded text-lg w-full"
                        >
                            Добавить присутствующего
                        </button>
                    </div>
                </div>
                <button
                    id="button"
                    type="button"
                    onClick={createDocument}
                    className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-red-500 hover:bg-red-600 hover:shadow-lg focus:outline-none"
                >
                    Создать протокол
                </button>
            </form>
            {state.isWordDocCreated ?
                (
                <a href="/#" id="downloadLink" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    <span>Download</span>
                </a>
                )
                :
                ""
            }
        </div>
    );
};

export default ProtocolCreationForm;
