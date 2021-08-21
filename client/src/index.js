import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MyToastContainer from "./components/MyToastContainer";

ReactDOM.render(
    <React.StrictMode>
        <MyToastContainer />
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative items-center">
            <div className="back absolute opacity-60 inset-0 z-0" />
            <App />
        </div>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
