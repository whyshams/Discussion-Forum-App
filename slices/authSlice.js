import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    logOut: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, logOut } = authSlice.actions;

// Async action creators
export const loadUserData = () => async (dispatch) => {
  try {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      dispatch(setUserData(userData));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

export const saveUserData = (userData) => async (dispatch) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    dispatch(setUserData(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const removeUserData = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem("userData");
    dispatch(logOut());
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

export default authSlice.reducer;
