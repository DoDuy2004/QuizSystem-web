import axios from "axios";
import { reject } from "lodash";

class ExamService {
  // getExams = () => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${import.meta.env.VITE_DOMAIN}/api/exams`)
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

  getExams = (searchText?: string) => {
    return new Promise((resolve, reject) => {
      const params = searchText && searchText.length >= 3 ? { searchText } : {};

      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/exams`, { params })
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

  getExambyId = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/exams/${id}`)
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

  getQuestionByExam = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/exams/${id}/questions`)
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

  addExam = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/exams`, form)
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

  updateExam = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .put(`${import.meta.env.VITE_DOMAIN}/api/exams/${id}`, form)
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

  deleteExam = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_DOMAIN}/api/exams/${id}`)
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

  createExamMatrix =  (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/exams/create-matrix`, form)
        .then((response) => {
          // Chỉ trả về response.data (dữ liệu JSON từ API)
          resolve(response);
        })
        .catch(function (error) {
          if (error.response) {
            console.log({ error });
            // Lỗi từ server (ví dụ: 400 Bad Request)
            console.log("Server error data:", error.response?.data);
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

  addQuestionToExam = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/exams/${id}/AddQuestion`,
          form
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

  deleteQuestionFromExam = (params: any) => {
    return new Promise((resolve, reject) => {
      const examId = params?.examId;
      const questionId = params?.questionId;
      axios
        .delete(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/exams/${examId}/questions/${questionId}`
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

  searchExams = (params: any) => {
    return new Promise((resolve, reject) => {
      const key = params?.key;
      const limit = params?.limit;
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/exams/search`, {
          params: {
            key,
            limit,
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
}

const instance = new ExamService();

export default instance;
