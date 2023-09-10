import { View, Text } from "react-native";
import React, { useContext } from "react";
import MainContext from "../../Context/MainContext";
import { Redirect, Stack } from "expo-router";
import Header from "../../components/Header";
import { useSelector } from "react-redux";

export const unstable_settings = {
  initialRouteName: "Dashboard",
};

const _layout = () => {
  const { loading } = useContext(MainContext);
  const { userData } = useSelector((state) => state.auth);

  return (
    <>
      {userData ? (
        <>
          <Stack initialRouteName="Dashboard">
            <Stack.Screen name="Home" options={{ headerShown: false }} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} />
            <Stack.Screen name="Upload" options={{ headerShown: false }} />
            <Stack.Screen name="[userId]" options={{ headerShown: false }} />
            <Stack.Screen name="SinglePost" options={{ headerShown: false }} />
            <Stack.Screen
              name="UpdateProfile"
              options={{ headerShown: false }}
            />
          </Stack>
          <Header />
        </>
      ) : (
        <Redirect href="/" />
      )}
    </>
  );
};

export default _layout;
