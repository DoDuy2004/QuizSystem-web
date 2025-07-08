import axios from "axios";
import { reject } from "lodash";

class UserService {
  getStudents = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.DOMAIN}/api/students`)
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

  changePassword = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const userId = params?.userId;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/user/change-password`, form, {
          headers: {
            userId,
          },
        })
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

  updateUser = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const userId = params?.userId;
      axios
        .put(`${import.meta.env.VITE_DOMAIN}/api/user/update-profile`, form, {
          headers: {
            userId,
          },
        })
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

  deleteUser = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_DOMAIN}/api/user/${id}`)
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

  // getUserByTagname = (tagname: string) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.DOMAIN}/api/user/tag/${tagname}`)
  //       .then((response) => resolve(response))
  //       .catch(function (error) {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //           // http.ClientRequest in node.js
  //           console.log(error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error", error.message);
  //         }

  //         reject(error.response);
  //       });
  //   });
  // };

  // getUserById = (id: number) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.DOMAIN}/api/admin/user/${id}`)
  //       .then((response) => resolve(response))
  //       .catch(function (error) {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //           // http.ClientRequest in node.js
  //           console.log(error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error", error.message);
  //         }

  //         reject(error.response);
  //       });
  //   });
  // };

  // uploadAvatar = (params: any) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post(
  //         `${import.meta.env.DOMAIN}/api/admin/user/${params.id}/upload/avatar`,
  //         params.file
  //       )
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch(function (error) {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //           // http.ClientRequest in node.js
  //           console.log(error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error", error.message);
  //         }
  //         console.log(error.config);
  //         reject(error.response);
  //       });
  //   });
  // };

  // updateUser = (params: any) => {
  //   return new Promise((resolve, reject) => {
  //     const { userId, form } = params;
  //     axios

  //       .put(`${import.meta.env.DOMAIN}/api/user/${userId}`, form)
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch(function (error) {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //           console.log(error.response.data);
  //           console.log(error.response.status);
  //           console.log(error.response.headers);
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //           // http.ClientRequest in node.js
  //           console.log(error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error", error.message);
  //         }
  //         reject(error.response);
  //       });
  //   });
  // };
  // addUser = (params: any) => {
  //   return new Promise((resolve, reject) => {
  //     const { form } = params;
  //     axios

  //       .post(`${import.meta.env.VITE_AUTH_DOMAIN}/api/registration`, form)
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch(function (error) {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //           console.log(error.response.data);
  //           console.log(error.response.status);
  //           console.log(error.response.headers);
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //           // http.ClientRequest in node.js
  //           console.log(error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error", error.message);
  //         }
  //         reject(error.response);
  //       });
  //   });
  // };

  // checkEmailExistence = (params: any) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(
  //         `${import.meta.env.DOMAIN}/api/user/email/check?email=${params.email}`
  //       )
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           console.error("Error response:", error.response);
  //         } else if (error.request) {
  //           console.error("Error request:", error.request);
  //         } else {
  //           console.error("Error", error.message);
  //         }
  //         reject(error);
  //       });
  //   });
  // };
}

const instance = new UserService();

export default instance;
