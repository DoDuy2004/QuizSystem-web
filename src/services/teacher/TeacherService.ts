import axios from "axios";

class TeacherService {
  getTeachers = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/teachers`)
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

  importTeachers = (file: File) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/teachers/import-preview`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
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

  addListTeachers = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/teachers/import-confirm`,
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
}

const instance = new TeacherService();

export default instance;
