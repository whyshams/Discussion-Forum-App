import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useContext } from "react";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import MainContext from "../Context/MainContext";
import { useSelector } from "react-redux";

const Header = () => {
  const { setLoading } = useContext(MainContext);
  const { userData } = useSelector((state) => state.auth);

  const router = useRouter();
  const pathname = usePathname();

  const onHomeClick = () => {
    router.replace("/Dashboard/Home");
  };
  const onProfileClick = () => {
    setLoading(true);
    router.replace("/Dashboard/Profile");
    setLoading(false);
  };

  const onCreateClick = () => {
    router.replace("/Dashboard/Upload");
  };
  return (
    <View className="flex-row justify-around py-5">
      <TouchableOpacity onPress={onHomeClick}>
        {pathname === "/Dashboard/Home" ? (
          <MaterialCommunityIcons name="post" size={26} color="black" />
        ) : (
          <MaterialCommunityIcons name="post-outline" size={24} color="black" />
        )}
      </TouchableOpacity>
      {userData.role === "teacher" && (
        <Pressable onPress={onCreateClick}>
          {pathname === "/Dashboard/Upload" ? (
            <AntDesign name="pluscircle" size={26} color="black" />
          ) : (
            <AntDesign name="pluscircleo" size={24} color="black" />
          )}
        </Pressable>
      )}

      <Pressable onPress={onProfileClick}>
        {pathname === "/Dashboard/Profile" ? (
          <FontAwesome name="user" size={26} color="black" />
        ) : (
          <FontAwesome name="user-o" size={24} color="black" />
        )}
      </Pressable>
    </View>
  );
};

export default Header;
