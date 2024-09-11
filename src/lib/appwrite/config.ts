import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import config from "../../config/config";

export const appwriteConfig = {
  url: config.appwriteUrl,
  projectId: config.appwriteProjectId,
  storageId: config.appwriteBucketId,
  databaseId: config.appwriteDatabaseId,
  savesCollectionId: config.appwriteSavesCollectionId,
  usersCollectionId: config.appwriteUsersCollectionId,
  errorPostsCollectionId: config.appwriteErrorPostsCollectionId,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
