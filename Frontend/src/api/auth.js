import axios from 'axios';
import config from '../config/config.js';

export class AuthService {

  constructor() {
    this.api = axios.create({
      baseURL: config.BACKEND_URL,
      withCredentials: true,
    });
  }

  async createAccount({ email, password, username }) {
    try {
      const userAccount = await this.api.post("user/register",{
        username:username,
        email:email,
        password:password,
    });
      return userAccount.data;
    } catch (error) {
      console.log("service :: createAccount :: error", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const response = await this.api.post("user/login",{
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.log("service :: login :: error", error);
      throw error;
    }
  }
async getCurrentUser() {
  try {
    const response = await this.api.post("user/get-user");
    return response.data?.data ?? null;
  } catch {
    return null;
  }
}
  async updateAccount(payload) {
    try {
      const response = await this.api.patch("user/update-account", payload);
      return response.data?.data ?? null;
    } catch (error) {
      console.log("service :: updateAccount :: error", error);
      throw error;
    }
  }
  async logout() {
    try {
      const response = await this.api.post("user/logout");
      return response.data;
    } catch (error) {
      console.log("service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
