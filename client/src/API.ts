import axios, {AxiosResponse} from "axios";
import NetResponse from "./data/NetResponse";


const API = axios.create({
    // baseURL: "http://192.168.0.52:8000/api",
    baseURL: "/api",
});

interface IApi {
    checkConnection: () => Promise<AxiosResponse<NetResponse>>;
    deletePostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    getPostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    getAllPosts: () => Promise<AxiosResponse<NetResponse>>;
    insertPost: (data: FormData) => Promise<AxiosResponse<NetResponse>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<NetResponse>>
}

const Apis: IApi = {
    insertPost: data => API.post("/post", data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    getPostById: id => API.get("/posts" + id),
    getAllPosts: () => API.get("/posts"),
    updatePostById: (id, data) => API.put("/post/" + id, data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    deletePostById: id => API.delete("/post/" + id),
    checkConnection: () => API.get("/")
};
export default Apis;