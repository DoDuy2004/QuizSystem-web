import axios from "axios";

// {
//     "classCode": "CDTH22WEBC - CSDL",
//     "name": "CDTH22WEBC - CSDL",
//     "credit": 4,
//     "status": 0,
//     "teacherId": "326ecbe8-f7cb-4d0e-807a-99f9ec49ce91",
//     "subjectId": "2935a1a7-7acb-417a-b696-71f4bfc4771f"
//   }

class CourseClassService {
  getSubjects = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/courseclasses/subjects`)
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
  getClassesByTeacher = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/teachers/${id}/classes`)
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

  addClass = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      axios
        .post(`${import.meta.env.VITE_DOMAIN}/api/courseclasses`, form)
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

  updateClass = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .put(`${import.meta.env.VITE_DOMAIN}/api/courseclasses/${id}`, form)
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

  deleteClass = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_DOMAIN}/api/courseclasses/${id}`)
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

  getClassById = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/courseclasses/${id}`)
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

  getStudentsByClass = (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_DOMAIN}/api/courseclasses/${id}/students`)
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

  addStudentToClass = (params: any) => {
    return new Promise((resolve, reject) => {
      const form = params?.form;
      const id = params?.id;
      axios
        .post(
          `${import.meta.env.VITE_DOMAIN}/api/courseclasses/${id}/add-student`,
          { form }
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

const instance = new CourseClassService();

export default instance;
