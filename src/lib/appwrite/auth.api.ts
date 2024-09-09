import { Client, Account, ID, Avatars, Databases } from "appwrite";
import config from "../../config/config";
import { INewUser } from "@/types";

export class Service {
  client = new Client();
  account;
  avatars;
  databases;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
    this.avatars = new Avatars(this.client);
    this.databases = new Databases(this.client);
  }

  // ============================== SIGN UP
  async createUserAccount(user: INewUser) {
    try {
      const newAccount = await this.account.create(
        ID.unique(),
        user.email,
        user.name,
        user.password
      );

      if (!newAccount) throw Error;

      const avatarUrl = this.avatars.getInitials(user.name);

      const newUser = await this.saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      });

      return newUser;
    } catch (error) {
      console.log("Error: ", error);
      return error;
    }
  }

  // ============================== SAVE USER TO DB
  async saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
  }) {
    try {
      const newUser = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        ID.unique(),
        user
      );
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new Service();

export default service;
