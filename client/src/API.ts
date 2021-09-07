import axios, {AxiosResponse} from "axios";
import NetResponse from "./data/NetResponse";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
});

interface IApi {
    getAllPosts: () => Promise<AxiosResponse<NetResponse>>;
    getPostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    insertPost: (data: FormData) => Promise<AxiosResponse<NetResponse>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<NetResponse>>
    deletePostById: (id: any) => Promise<AxiosResponse<NetResponse>>;
    login: (data: any) => Promise<AxiosResponse<NetResponse>>
}

export const Api: IApi = {
    getAllPosts: () => api.get("/posts"),
    getPostById: (id) => api.get("/posts" + id),
    insertPost: (data) => api.post("/post", data, {
        headers: {"content-type": "multipart/form-data"}
    }),
    updatePostById: (id, data) => api.put("/post/" + id, data, {
        headers: {"content-type": "multipart/form-data"}
    }),
    deletePostById: (id) => api.delete("/post/" + id),
    login: (data) => api.post("/login", data, {
        headers: {"content-type": "application/json"}
    })
};