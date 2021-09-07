import axios, {AxiosResponse} from "axios";
import NetResponse from "./data/NetResponse";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
});

interface IApi {
    checkConnection: () => Promise<AxiosResponse<NetResponse>>;
    deletePostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    getPostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    getAllPosts: () => Promise<AxiosResponse<NetResponse>>;
    insertPost: (data: FormData) => Promise<AxiosResponse<NetResponse>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<NetResponse>>
}

export const Api: IApi = {
    insertPost: data => api.post("/post", data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    getPostById: id => api.get("/posts" + id),
    getAllPosts: () => api.get("/posts"),
    updatePostById: (id, data) => api.put("/post/" + id, data, {
        headers: {'content-type': 'multipart/form-data'}
    }),
    deletePostById: id => api.delete("/post/" + id),
    checkConnection: () => api.get("/")
};