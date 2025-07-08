import _ from "lodash";

function UserModel(data?: any) {
  // Clone object để tránh mutate trực tiếp object bất biến
  data = _.cloneDeep(data || {});

  return _.defaults(data, {
    id: null,
    username: null,
    fullName: "",
    email: "",
    gender: "MALE",
    dateOfBirth: null,
    avatarUrl: "",
    status: null,
    createdAt: "",
    role: null,
    phoneNumber: "",
    password: "",
  });
}

export default UserModel;
