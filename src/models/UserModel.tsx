import _ from "lodash";

function UserModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    username: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: true ? "MALE" : "FEMALE",
    dateOfBirth: null,
    avatarUrl: "",
    status: null,
    createdAt: "",
    role: null,
    // code: "",
    // isFirstTimeLogin: null,
    // facutly: "",
  });
}

export default UserModel;
