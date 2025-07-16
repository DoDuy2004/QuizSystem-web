import axios, { AxiosError, type AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

const DOMAIN = import.meta.env.VITE_DOMAIN;

interface JwtDecodedToken {
  exp: number;
}

interface UserRole {
  name: string;
}

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  roles?: UserRole[];
  displayName?: string;
  data?: any;
}

interface AuthResponse {
  data: {
    token: string;
    user: User;
    data?: any;
  };
  status?: number;
  message?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  status?: number;
  message?: string;
  error?: string;
}

class JwtService {
  private listeners: Record<string, Function[]> = {};

  emit = (event: string, data?: any): void => {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  };

  on = (event: string, callback: Function): void => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  };

  off = (event: string, callback: Function): void => {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  };

  constructor() {
    // super();
    this.init();
  }

  init(): void {
    this.setInterceptors();
    this.handleAuthentication();
  }

  // setInterceptors = (): void => {
  //   axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  //   axios.interceptors.response.use(
  //     (response: AxiosResponse) => {
  //       return response;
  //     },
  //     async (err: AxiosError) => {
  //       try {
  //         return await new Promise((resolve, reject) => {
  //           if (!err.response) {
  //             reject(err);
  //           }

  //           if (err.response?.status === 401 && err.config) {
  //             this.emit("onAutoLogout", "Invalid access_token");
  //           }

  //           if (err.response?.status === 500 && err.config) {
  //             this.emit("serverError", "Server Error");
  //           }

  //           if (err.response?.status === 400 && err.config) {
  //             this.emit("badRequest", "Bad Request");
  //           }
  //           throw err;
  //         });
  //       } catch (err_1: any) {
  //         if (!err_1.response) {
  //           throw err_1;
  //           // this.emit("networkError", "Network Error");
  //         }
  //       }
  //     }
  //   );
  // };

  setInterceptors = (): void => {
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.emit("onAutoLogout", "Invalid access_token");
        } else if (error.response?.status === 500) {
          this.emit("serverError", "Server Error");
        } else if (error.response?.status === 400) {
          this.emit("badRequest", "Bad Request");
        }

        return Promise.reject(error); // ✅ Phải có dòng này để lỗi đến được .catch()
      }
    );
  };

  setSession = (access_token: string | null): void => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  handleAuthentication = (): void => {
    const access_token = this.getToken();

    if (!access_token) {
      this.emit("onNoAccessToken");
      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      console.log("Sign Out", access_token);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  getCurrentSession = async (auth: AuthResponse["data"]): Promise<any> => {
    const { token } = auth;
    const role = auth.user?.roles?.[0]?.name.replace("ROLE_", "").toLowerCase();
    const userId = auth.user?.id;

    // console.log({auth})

    const currentUserResponse = await axios
      .get(`${DOMAIN}/api/user/current`, {
        headers: {
          userId,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setSession(token);
        return res;
      });

    const user = {
      data: {
        ...currentUserResponse?.data?.data,
        displayName: `${currentUserResponse?.data?.data?.fullName}`,
      },
      role: [role],
    };

    return user;
  };

  signInWithToken = async (): Promise<User> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${DOMAIN}/api/auth/token`, {
          token: this.getToken(),
        })
        .then(async (response: AxiosResponse<ApiResponse>) => {
          if (!response) {
            throw new Error("Network Error");
          }
          if (!response.data || !response.data?.data?.user) {
            this.emit("onNoAccessToken");
          }
          if (response.data.data && response.data.data.user) {
            const user = await this.getCurrentSession(response?.data?.data);
            resolve(user);
            this.emit("onLogin", user);
          } else {
            reject(new Error("Failed to login with token."));
          }
        })
        .catch((error) => {
          // this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  signInWithUsernameAndPassword = (
    username: string,
    password: string
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${DOMAIN}/api/auth/login`, { username, password })
        .then(async (response: AxiosResponse<ApiResponse>) => {
          if (!response || !response?.data?.data) {
            if (response?.status === 403) {
              throw new Error(
                "Your account is temporarily blocked. Please try again after 5 minutes."
              );
            }
            throw new Error("Network Error");
          }

          try {
            if (response?.data?.data?.user) {
              const user = await this.getCurrentSession(response?.data?.data);
              resolve(user);
              // console.log({user: response?.data?.data?.user})
              this.emit("onLogin", user);
            } else {
              reject(response.data);
            }
          } catch (err) {
            reject(err);
          }
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            reject(error.response);
          } else {
            reject(error);
          }
        });
    });
  };

  logout = (): Promise<ApiResponse> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${DOMAIN}/api/auth/logout`)
        .then((response: AxiosResponse<ApiResponse>) => {
          this.setSession(null);
          this.emit("onLogout", "Logged out");
          resolve(response.data);
          return response;
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            reject(error.response?.data);
          } else if (error.request) {
            reject({ message: "No response received from server" });
          } else {
            reject({ message: error.message });
          }
        });
    });
  };

  isAuthTokenValid = (access_token: string): boolean => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode<JwtDecodedToken>(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded?.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }
    return true;
  };

  public getToken(): string | null {
    return window.localStorage.getItem("jwt_access_token");
  }

  requestPin = (params: any) => {
    const email = params?.email;

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/auth/forgot-password/request-pin`,
          {
            email,
          }
        )
        .then((response) => {
          // Chỉ trả về response.data (dữ liệu JSON từ API)
          resolve(response?.data);
        })
        .catch(function (error) {
          if (error.response) {
            // Lỗi từ server (ví dụ: 400 Bad Request)
            console.log("Server error:", error.response?.data);
            reject(error.response?.data); // Trả về dữ liệu lỗi từ API
          } else if (error.request) {
            // Không nhận được response
            console.log("No response:", error.request);
            reject({ error: true, message: "Không thể kết nối đến server" });
          } else {
            // Lỗi khi thiết lập request
            console.log("Error:", error.message);
            reject({ error: true, message: error.message });
          }
        });
    });
  };

  validatePin = (params: any) => {
    const email = params?.email;
    const otp = params?.otp;
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/auth/validatePin`, {
          email,
          otp,
        })
        .then((response) => {
          // Chỉ trả về response.data (dữ liệu JSON từ API)
          resolve(response.data);
        })
        .catch(function (error) {
          if (error.response) {
            // Lỗi từ server (ví dụ: 400 Bad Request)
            console.log("Server error:", error.response.data);
            reject(error.response.data); // Trả về dữ liệu lỗi từ API
          } else if (error.request) {
            // Không nhận được response
            console.log("No response:", error.request);
            reject({ error: true, message: "Không thể kết nối đến server" });
          } else {
            // Lỗi khi thiết lập request
            console.log("Error:", error.message);
            reject({ error: true, message: error.message });
          }
        });
    });
  };

  resetPassword = (params: any) => {
    const email = params?.email;
    const password = params?.password;
    return new Promise((resolve, reject) => {
      axios
        .post(
          // `${AUTH_DOMAIN}/api/user/validatePin?${queryParams.toString()}`,
          `${import.meta.env.VITE_DOMAIN}/api/auth/reset-password`,
          {
            email,
            password,
          }
        )
        .then((response) => resolve(response))
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }

          reject(error.response);
        });
    });
  };
}

const jwtService = new JwtService();
export default jwtService;
