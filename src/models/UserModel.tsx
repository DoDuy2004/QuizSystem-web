import _ from "lodash";

function UserModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    username: null,
    fullName: "",
    email: "",
    gender: true ? "MALE" : "FEMALE",
    dateOfBirth: null,
    avatarUrl: "",
    status: null,
    createdAt: "",
    role: null,
    phoneNumber: "",
    // code: "",
    // isFirstTimeLogin: null,
    // facutly: "",
  });
}

export default UserModel;
