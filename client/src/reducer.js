import React from "react";

export const ContextApp = React.createContext();

export const initialState = { 
    file: {},
    isProtocolCreating: false
};

export const mainReducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case "SET_FILE":
            return { ...state, file: Object.assign(action.data.file) };
        case "SET_FILE_ID":
            return {...state, file: {...state.file, id: action.data.id} };
        case "SET_IS_PENDING":
            console.log('text: ', action.data.data)
            return {...state, file: {...state.file, isPending: action.data.isPending, data: action.data.data} };
        case "SET_CREATING_PROTOCOL_STATUS":
            return {...state, isProtocolCreating: !state.isProtocolCreating}
        default:
            return initialState;
    }
}