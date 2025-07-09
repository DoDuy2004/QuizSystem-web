import axios from "axios";
import { reject } from "lodash";

class RoomExamService {
  // getRoomExams = () => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.VITE_DOMAIN}/api/roomexam`)
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

  getRoomExams = (searchText?: string) => {
    return new Promise((resolve, reject) => {
      const params = searchText && searchText.length >= 3 ? { searchText } : {};

      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/roomexam`, { params })
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

  getRoomExambyId = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/roomexam/${id}`)
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

  createRoomExam = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/roomexam`, form)
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

  // getRoomExamsByStudent = (id: string) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.VITE_DOMAIN}/api/students/${id}/roomexams`)
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

  getRoomExamsByStudent = (id: string, searchText?: string) => {
    return new Promise((resolve, reject) => {
      const params = searchText && searchText.length >= 3 ? { searchText } : {};

      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/students/${id}/roomexams`, {
          params,
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

  // getRoomExamResults = () => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.VITE_DOMAIN}/api/roomexam/getroomexams`)
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

  getRoomExamResults = async (searchText = "") => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DOMAIN}/api/roomexam/getroomexams`,
        {
          params: { searchText },
        }
      );
      return response;
    } catch (error: any) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      throw error.response || error;
    }
  };

  getStudentExamsByRoom = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/roomexam/${id}/student-exams`)
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

const instance = new RoomExamService();

export default instance;
