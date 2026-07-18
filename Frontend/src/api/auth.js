import axios from 'axios';


export class AuthService {

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:4000/api/v1/user",
      withCredentials: true,
    });
  }

  async createAccount({ email, password, username }) {
    try {
      const userAccount = await this.api.post("/register",{
        username:username,
        email:email,
        password:password,
    });
      if (userAccount) {
        return this.login({ email, password });
      } else userAccount;
    } catch (error) {
      console.log("service :: createAccount :: error", error);
    }
  }

  async login({ email, password }) {
    try {
      const response = await this.api.post("/login",{
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
    return  await this.api.post("/get-user");
  } catch (error) {
    return null;
  }
}
  async logout() {
    try {
      const response = await this.api.post("/logout");
      return response.data;
    } catch (error) {
      console.log("service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
