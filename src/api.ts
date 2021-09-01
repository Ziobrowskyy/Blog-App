import axios, {AxiosResponse} from "axios";


const api = axios.create({
    baseURL: "http://192.168.0.52:8000"
});

let apis: {
    checkConnection: () => Promise<AxiosResponse<any>>;
    deletePostById: (id: any) => Promise<AxiosResponse<any>>;
    getPostById: (id: any) => Promise<AxiosResponse<any>>;
    getAllPosts: () => Promise<AxiosResponse<any>>;
    insertPost: (data: any) => Promise<AxiosResponse<any>>;
    updatePostById: (id: any, data: any) => Promise<AxiosResponse<any>>
};
apis = {
    insertPost: (data) => api.post("/post", data),
    getPostById: (id) => api.get("/posts" + id),
    getAllPosts: () => api.get("/posts"),
    updatePostById: (id, data) => api.put("/post/" + id, data),
    deletePostById: (id) => api.delete("/post/" + id),
    checkConnection: () => api.get("/")
};
export default apis;