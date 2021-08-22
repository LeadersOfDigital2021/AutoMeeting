function RecognizedSpeech() {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative items-center">
            <div className="back absolute opacity-60 inset-0 z-0" />
            <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-700">
                        zvuk-razgovorov-tolpyi.mp3
                    </h2>
                </div>

                <div className="grid grid-cols-1 space-y-2">
                    <label className="text-sm font-bold text-gray-500 tracking-wide">
                        <i className="fa fa-arrow-left"></i> Вернуться
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col flex-auto h-full p-6">
                            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                                <div className="flex flex-col h-full overflow-x-auto mb-4">
                                    <div className="flex flex-col h-full">
                                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-400 flex-shrink-0">
                                                    A
                                                </div>
                                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                    <div>
                                                        Hey How are you today?
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-400 flex-shrink-0">
                                                    B
                                                </div>
                                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                    <div>
                                                        Lorem ipsum dolor sit
                                                        amet, consectetur
                                                        adipisicing elit. Vel
                                                        ipsa commodi illum saepe
                                                        numquam maxime
                                                        asperiores voluptate
                                                        sit, minima
                                                        perspiciatis.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-400 flex-shrink-0">
                                                    A
                                                </div>
                                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                    <div>
                                                        Lorem ipsum dolor sit
                                                        amet !
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                                            <div className="flex flex-row items-center">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-400 flex-shrink-0">
                                                    B
                                                </div>
                                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                    <div>
                                                        Lorem ipsum dolor sit
                                                        amet consectetur
                                                        adipisicing elit.
                                                        Perspiciatis, in.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecognizedSpeech;
