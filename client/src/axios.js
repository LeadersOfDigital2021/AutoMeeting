import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://109.248.175.110:8080/",
  headers: {"Access-Control-Allow-Origin": "*"}
})
//http://109.248.175.110:8080/ http://127.0.0.1:8080/
export default axiosInstance