import axios from "axios";
import config from "../config/config.js";

export class Service {
    constructor(){
        this.api = axios.create({
            baseURL: config.BACKEND_URL,
            withCredentials:true
        });
    }
    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            const formData = new FormData();
            formData.append("title",title);
            formData.append("slug",slug);
            formData.append("content",content);
            formData.append("status",status);
            if (featuredImage) {
                formData.append("featuredImage",featuredImage);
            }
            return await this.api.post("/post",formData);
        } catch (error) {
            console.log("createPost error",error);
        }
        return false;
    }    
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.api.patch(`/post/${slug}`,{
                title:title,
                content:content,
                slug:slug,
                featuredImage:featuredImage,
                status:status,
            })
        } catch (error) {
            console.log("Appwrite service update post error",error);
        }
        return false;
    }

    async deletePost(slug){
        try {
            return await this.api.delete(`/post/${slug}`);
        } catch (error) {
            console.log("AppWrite Delete post error: ",error);
        }
        return false;
    }

    async getPost(slug) {
        try {
            return await this.api.get(`/post/${slug}`);
        } catch (error) {
            console.log("AppWrite getPost error: ",error);
            return false;
        }
        return false;
    }

    async getCommentsByPost(postId) {
        try {
            return await this.api.get(`/post/${postId}/comments`);
        } catch (error) {
            console.log("getCommentsByPost error: ", error);
            return false;
        }
    }

    async createComment(postId, content) {
        try {
            return await this.api.post(`/post/${postId}/comments`, { content });
        } catch (error) {
            console.log("createComment error: ", error);
            return false;
        }
    }

    async getPosts(){
        try {
            return await this.api.get("post");
        } catch (error) {
            console.log("App write service :: getPosts :: error: " ,error);
            return false;
        }
        return false;
    }

    async getUserPosts() {
        try {
            return await this.api.get("/post/my-posts");
        }
        catch(error) {
            console.log("getUserPost :: error :",error);
        }
        return false;
    }
}

const service = new Service();

export default service;