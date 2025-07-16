import axios from "axios";

class NotificationService {
  createNotification = (courseClassId: string, content: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${courseClassId}`,
          { content }
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

  addMessageToNotification = (notiId: string, message: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${notiId}/AddMessage`,
          { message }
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

  getNotificationMessages = (notiId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${notiId}/GetMessage`
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

  getNotification = (courseClassId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${courseClassId}/notification`
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

  deleteNoti = (notiId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${notiId}`
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

  deleteMessage = (notiId: string, messId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/NotificationForCourseClass/${notiId}/message/${messId}`
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

const instance = new NotificationService();

export default instance;
