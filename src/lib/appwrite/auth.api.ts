import { Client, Account, ID } from "appwrite";
import config from "../../config/config";
import { INewUser } from "@/types";

class Service {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
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
      return newAccount;
    } catch (error) {
      console.log("Error: ", error);
      return error;
    }
  }
}

const service = new Service();

export default service;
