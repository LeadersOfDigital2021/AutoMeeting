
export const displayFileName = (fileName) => {
    if (fileName.length >= 12) {
        let fileExtention = fileName.split(".").pop();
        return fileName.substring(0, 13) + "... ." + fileExtention;
    }
    return fileName;
}