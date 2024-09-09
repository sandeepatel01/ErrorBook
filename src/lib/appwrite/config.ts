import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import config from "../../config/config";

class Service {
  client = new Client();
  databases = new Databases(this.client);
  storage = new Storage(this.client);
  account;
  avatars = new Avatars(this.client);

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }
}

const service = new Service();

export default service;
