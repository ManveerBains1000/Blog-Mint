const config = {
    appWriteUrl: import.meta.env.VITE_APPWRITE_URL,
    appWriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appWriteTableId: import.meta.env.VITE_APPWRITE_TABLE_ID,
    appWriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    appWriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    tinyMceApiKey: import.meta.env.VITE_TINYMCE_API_KEY,
}

export default config;
