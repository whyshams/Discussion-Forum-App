import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store";
import { ContextProvider } from "../Context/MainContext";

const _layout = () => {
  return (
    <Provider store={store}>
      <ContextProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Dashboard"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ContextProvider>
    </Provider>
  );
};

export default _layout;
