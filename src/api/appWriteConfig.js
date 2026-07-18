import config from "../config/config.js";
import { Client,ID,TablesDB,Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor(){
        this.client
        .setEndpoint(config.appWriteUrl)
        .setProject(config.appWriteProjectId);
        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }
    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.tablesDB.createRow({
                databaseId:config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                rowId: slug,
                data: {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            });
        } catch (error) {
            console.log("AppWrite createPost error",error);
        }
    }    
    async updatePost(rowId,{title,content,featuredImage,status} = {}){
        try {
            if (!rowId) {
                console.log("Appwrite service update post error", "Missing rowId");
                return false;
            }
            return await this.tablesDB.updateRow({
                databaseId:config.appWriteDatabaseId,
                tableId:config.appWriteTableId,
                rowId:rowId,
                data:{
                    title,
                    content,
                    featuredImage,
                    status,
                }
        })
        } catch (error) {
            console.log("Appwrite service update post error",error);
        }
    }

    async deletePost(slug){
        try {
            await this.tablesDB.deleteRow(
                config.appWriteDatabaseId,
                config.appWriteTableId,
                slug,
            )
            return true;
        } catch (error) {
            console.log("AppWrite Delete post error: ",error);
        }
    }

    async getPost(slug) {
        try {
            return await this.tablesDB.getRow(
                {
                    databaseId: config.appWriteDatabaseId,
                    tableId: config.appWriteTableId,
                    rowId:slug,
                }
            );

        } catch (error) {
            console.log("AppWrite getPost error: ",error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.tablesDB.listRows({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                queries:queries,
            })
        } catch (error) {
            console.log("App write service :: getPosts :: error: " ,error);
            return false;
        }
    }

    async uploadFile(file) {
        try {
            console.log(config.appWriteBucketId);
            return await this.bucket.createFile({
                bucketId: config.appWriteBucketId,
                fileId: ID.unique(),
                file: file,
        })
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: error: ",error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            return await this.bucket.deleteFile({
                bucketId: config.appWriteBucketId,
                fileId:fileId,
        })
            return true;
        } catch (error) {
            console.log("AppWrite Service :: deleteFile :: error: ",error);
            return false;
        }
    }

    async previewFile(fileId) {
        return this.bucket.getFilePreview(config.appWriteBucketId,fileId);
    }
}

const service = new Service();

export default service;