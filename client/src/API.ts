import axios, {AxiosResponse} from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
});

interface IApi {
    checkConnection: () => Promise<AxiosResponse<any>>;
    deletePostById: (id: any) => Promise<AxiosResponse<any>>;
    getPostById: (id: any) => Promise<AxiosResponse<any>>;
    getAllPosts: () => Promise<AxiosResponse<any>>;
    insertPost: (data: FormData) => Promise<AxiosResponse<any>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<any>>
}

export const Apis: IApi = {
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