import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import NotificationService from "../../services/notification/NotificationService";

interface NotificationItem {
  data: any;
  messages: any[];
}

interface NotificationState {
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

// Thunk actions
export const createNotification = createAsyncThunk(
  "notification/create",
  async ({
    courseClassId,
    content,
  }: {
    courseClassId: string;
    content: string;
  }) => {
    const response: any = await NotificationService.createNotification(
      courseClassId,
      content
    );
    return response.data;
  }
);

// export const deleteNotification = createAsyncThunk(
//   "notification/delete",
//   async (id: string) => {
//     await NotificationService.deleteNotification(id);
//     return id;
//   }
// );

export const fetchNotification = createAsyncThunk(
  "notification/fetchOne",
  async (id: string) => {
    const response: any = await NotificationService.getNotification(id);
    return response.data;
  }
);

export const addMessage = createAsyncThunk(
  "notification/addMessage",
  async ({
    notificationId,
    message,
  }: {
    notificationId: string;
    message: string;
  }) => {
    const response: any = await NotificationService.addMessageToNotification(
      notificationId,
      message
    );
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "notification/fetchMessages",
  async (notificationId: string) => {
    const response: any = await NotificationService.getNotificationMessages(
      notificationId
    );
    return response.data;
  }
);

export const deleteNoti = createAsyncThunk(
  "notification/deleteNoti",
  async (notiId: string) => {
    const response: any = await NotificationService.deleteNoti(notiId);
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk(
  "notification/deleteMessage",
  async ({ notiId, messId }: any) => {
    const response: any = await NotificationService.deleteMessage(
      notiId,
      messId
    );
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Notification
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift({
          ...action.payload.data,
        });
      })

      // Delete Notification
      //   .addCase(deleteNotification.fulfilled, (state, action) => {
      //     state.notifications = state.notifications.filter(
      //       (noti) => noti.id !== action.payload
      //     );
      //   })

      // Fetch Single Notification
      .addCase(fetchNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
      })
      // Add Message
      .addCase(addMessage.fulfilled, (state, action: any) => {
        // console.log({ notiId: action.meta.arg });
        // console.log({ data: action.payload.data });
        const { notificationId } = action.meta.arg;
        const targetNoti = state.notifications.find(
          (noti: any) => noti.id === notificationId
        );
        if (targetNoti) {
          targetNoti.messages.push(action.payload.data);
        }
      })

      .addCase(deleteNoti.fulfilled, (state, action) => {
        const notiId = action.meta.arg;
        state.notifications = state.notifications.filter(
          (noti: any) => noti.id !== notiId
        );
      })
      .addCase(deleteMessage.fulfilled, (state, action: any) => {
        // console.log({ messId: action.meta.arg });

        const { messId, notiId } = action.meta.arg;
        const targetNoti = state.notifications.find(
          (noti: any) => noti.id === notiId
        );

        if (targetNoti && targetNoti.messages) {
          targetNoti.messages = targetNoti.messages.filter(
            (msg: any) => msg.id !== messId
          );
        }
      })

      // Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action: any) => {
        const notiId = action.meta.arg;
        state.loading = false;
        const targetNoti = state.notifications.find(
          (noti: any) => noti.id === notiId
        );
        if (targetNoti) {
          targetNoti.messages = action.payload.data;
        }
      });
  },
});

// export const { clearCurrentNotification } = notificationSlice.actions;

export const selectNotifications = ({ courseClass }: any) =>
  courseClass.notification?.notifications;
export const selectCurrentNotification = ({ courseClass }: any) =>
  courseClass.notification?.currentNotification;
// export const selectNotificationLoading = (courseClass: any) =>
//   courseClass.notification.loading;
// export const selectNotificationError = (courseClass: any) =>
//   courseClass.notification.error;

export default notificationSlice.reducer;
