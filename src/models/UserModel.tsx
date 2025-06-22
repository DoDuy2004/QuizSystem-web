import _ from "lodash";

function UserModel(data?: any) {
  data = data || {};

  return _.defaults(data, {
    id: null,
    username: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: true,
    dateOfBirth: "",
    avatarUrl: "",
    status: null,
    passwordHash: "",
    createdAt: "",
    role: null,
    code: "",
    isFirstTimeLogin: null,
    facutly: "",
  });
}

export default UserModel;
