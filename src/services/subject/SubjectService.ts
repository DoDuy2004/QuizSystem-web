import axios from "axios";

class SubjectService {
  getChapters = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/subjects/${id}/chapters`)
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

  getSubjects = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/subjects`)
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

  getSubjectById = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/subjects/${id}`)
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

  createSubject = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/subjects`, form)
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

  updateSubject = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .put(`${import.meta.env.VITE_DOMAIN}/api/subjects/${id}`, form)
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

  addChapter = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/subjects/${id}/add-chapter`,
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
  updateChapter = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .put(`${import.meta.env.VITE_DOMAIN}/api/chapters/${id}`, form)
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

const instance = new SubjectService();
export default instance;
