import React from "react";
import uuid from 'react-uuid'

export const ContextApp = React.createContext();

export const initialState = { 
    file: {},
    isProtocolCreating: false,
    isWordDocCreated: false
};

export const mainReducer = (state, action) => {
    console.log(action);
    let fileData;
    switch (action.type) {
        case "RESET_APP":
            return initialState;
        case "SET_FILE":
            return { ...state, file: Object.assign(action.data.file) };
        case "SET_FILE_ID":
            return {...state, file: {...state.file, id: action.data.id} };
        case "SET_IS_PENDING":
            return {...state, file: {...state.file, isPending: action.data.isPending, data: action.data.data} };
        case "SET_CREATING_PROTOCOL_STATUS":
            return {...state, isProtocolCreating: !state.isProtocolCreating}
        case "CHANGE_TOPIC":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, topic: action.data } }};   
        case "CHANGE_DATE":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, date: action.data } }};  
        case "CHANGE_AGENDA":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, agenda: action.data } }}; 
        case "CHANGE_PRESIDING":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, presiding: action.data } }};
        case "CHANGE_SECRETARY":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, secretary: action.data } }};  
        case "CHANGE_FACT":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            if(!fileData.facts)
                return state;
            fileData.facts.forEach( (fact) => { 
                if(fact.id === action.id) 
                    fact.data = action.data
            });
            return {...state, file: {...state.file, data: { ...fileData, facts: [...fileData.facts] } }}; 
        case "ADD_FACT":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, facts: [...fileData.facts, {id: uuid(), data: ""} ] } }};
        case "ADD_PARTICIPANTS":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            return {...state, file: {...state.file, data: { ...fileData, participants: [...fileData.participants, {id: uuid(), name: "", position: ""} ] } }};
        case "CHANGE_PARTICIPIENT_NAME":
                fileData = (state.file && state.file.data) ? state.file.data : {};
                if(!fileData.participants)
                    return state;
                fileData.participants.forEach( (participant) => { 
                    if(participant.id === action.id) 
                        participant.name = action.data
                });
                return {...state, file: {...state.file, data: { ...fileData, participants: [...fileData.participants] } }}; 
        case "CHANGE_PARTICIPIENT_POSITION":
            fileData = (state.file && state.file.data) ? state.file.data : {};
            if(!fileData.participants)
                return state;
            fileData.participants.forEach( (participant) => { 
                if(participant.id === action.id) 
                    participant.position = action.data
            });
            return {...state, file: {...state.file, data: { ...fileData, participants: [...fileData.participants] } }}; 
        case "SET_DOC_CREATED_STATUS":
            return {...state, isWordDocCreated: !state.isWordDocCreated}
        default:
            return initialState;
    }
}