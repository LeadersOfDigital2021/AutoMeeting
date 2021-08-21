import { ToastContainer } from "react-toastify";

const MyToastContainer = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            draggable
        />
    );
};

export default MyToastContainer;
