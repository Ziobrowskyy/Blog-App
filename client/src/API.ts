import axios, {AxiosResponse} from "axios";


const API = axios.create({
    // baseURL: "http://192.168.0.52:8000/api",
    baseURL: process.env.REACT_APP_API_URL,
});

interface IApi {
    checkConnection: () => Promise<AxiosResponse<any>>;
    deletePostById: (id: any) => Promise<AxiosResponse<any>>;
    getPostById: (id: any) => Promise<AxiosResponse<any>>;
    getAllPosts: () => Promise<AxiosResponse<any>>;
    insertPost: (data: FormData) => Promise<AxiosResponse<any>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<any>>
}

const Apis: IApi = {
    insertPost: (data) => API.post("/post", data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    getPostById: (id) => API.get("/posts" + id),
    getAllPosts: () => API.get("/posts"),
    updatePostById: (id, data) => API.put("/post/" + id, data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    deletePostById: (id) => API.delete("/post/" + id),
    checkConnection: () => API.get("/")
};
export default Apis;