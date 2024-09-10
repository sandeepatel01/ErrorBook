import { Client, Account, ID, Avatars, Databases, Query } from "appwrite";
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

  async signInAccount(user: { email: string; password: string }) {
    try {
      const session = await this.account.createSession(
        user.email,
        user.password
      );
      return session;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await this.account.get();

      if (!currentAccount) throw Error;

      const currentUser = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteUsersCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
      if (!currentUser) throw Error;

      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const service = new Service();

export default service;
