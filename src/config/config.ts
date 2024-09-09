const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteSavesCollectionId: String(
    import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID
  ),
  appwriteUsersCollectionId: String(
    import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
  ),
  appwriteErrorPostsCollectionId: String(
    import.meta.env.VITE_APPWRITE_ERRORPOSTS_COLLECTION_ID
  ),
};

export default config;
