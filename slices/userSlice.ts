import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { User } from "@/src/types";

export interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    userId: 0,
    userOrgProfileId: 0,
    organizationId: 0,
    securityProfileId: 0,
    role: 0,
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    securityProfileName: "",
    organizationType: "",
    organizationName: "",
    organizationCode: "",
    fullName: "",
    userInitial: "",
    securityProfileInitial: "",
    originationChannel: 0,
    originationChannelName: "",
    token: "",
    accessToken: "",
    tokenExpirationDate: null,
    startDate: null,
    terminationDate: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userJosn: string }>) => {
      state.user = JSON.parse(action.payload.userJosn);
    },
    resetUser: (state) => {
      state.user = initialState.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
