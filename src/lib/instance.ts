import axios from "axios"
const url = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_BACKEND_URL : null
 const instance = axios.create({
    baseURL:url!,
 })
 export default instance;