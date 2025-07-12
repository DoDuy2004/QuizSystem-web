import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/user/UserService";
import _, { create } from "lodash";
// import jwtService from "@/services/auth/jwtService";
import UserModel from "../../models/UserModel";

export interface initialStateProps {
  role: string | string[];
  data: any;
}

const initialState: initialStateProps = {
  role: [],
  data: null,
};

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user: any, { dispatch }) => {
    const roleType = user.role[0] ?? "";

    // console.log("role: ", roleType);

    return _.merge({}, initialState, user);
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch, getState }) => {
    const { user } = getState() as { user: initialStateProps };

    if (!user.role || user.role.length === 0) {
      return null;
    }

    dispatch(userLoggedOut());
    return null;
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (params: any) => {
    const userId = params?.userId;
    const form = params?.form;

    const response: any = await userService.changePassword({ userId, form });

    const data = response.data;

    return data;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (params: any) => {
    const userId = params?.userId;
    const form = params?.form;

    const response: any = await userService.updateUser({ userId, form });

    const data = response.data;

    return data;
  }
);

// export const updateUser = createAsyncThunk(
//   "user/update",
//   async (params: any, { dispatch, getState }: any) => {
//     const user = getState().user.data;
//     const userId = user?.id;
//     console.log({ params: params?.form });
//     // delete params?.avatar;
//     console.log("Call");
//     params = _.pick(params, _.keys(UserModel({})));
//     const response = (await userService.updateUser({
//       userId,
//       form: params?.form,
//     })) as any;
//     const data = await response.data;

//     return data;
//   }
// );

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    userLoggedOut: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.role = action.payload.role;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {});
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.role = action.payload.role;
    });
  },
});

export const selectUser = ({ userSlice }: any) => userSlice?.data;

export default userSlice.reducer;

export const { userLoggedOut } = userSlice.actions;
