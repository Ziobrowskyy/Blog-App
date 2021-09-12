import { ActionResult } from "../data/ActionReult";
import Post from "../data/Post";

export interface PostAction {
    createPost() : Promise<Post>;
}