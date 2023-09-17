import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useUserPostsMutation } from "../../slices/postApiSlice";
import { useGetUserMutation } from "../../slices/userApiSlice";
import MainContext from "../../Context/MainContext";
import UserPost from "../../components/UserPost";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Post from "../../components/Post";

const UserProfile = () => {
  const { postUpdated, setPostUpdated } = useContext(MainContext);
  const [userData, setUserData] = useState();
  const [userPostData, setUserPostData] = useState();
  const [loading, setLoading] = useState(false);
  const { userId } = useLocalSearchParams();

  const [userPost] = useUserPostsMutation();
  const [getUser] = useGetUserMutation();

  const router = useRouter();

  const getUserInfo = async () => {
    if (userId) {
      const res = await getUser(userId);
      setUserData(res?.data);
    }
  };

  const getUserPostData = async () => {
    try {
      setLoading(true);
      const res = await userPost(userData._id);

      setUserPostData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [postUpdated, userId]);

  useEffect(() => {
    if (userData) {
      getUserPostData();
    }
  }, [postUpdated, userData]);

  const orderedPosts = userPostData
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            top: 50,
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          <ScrollView>
            <View className="mt-10">
              <Pressable onPress={() => router.back()}>
                <Ionicons name="md-backspace" size={24} color="black" />
              </Pressable>
            </View>
            <View className=" flex flex-row justify-center mt-10 mb-6">
              <Image
                source={{ uri: `${userData?.profileImage}` }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginVertical: 10,
                  marginHorizontal: 20,
                }}
              />

              <View className=" flex flex-col justify-center">
                <Text className="font-bold text-lg">{userData?.name}</Text>
                <Text>@{userData?.username}</Text>
                <Text>{userData?.email}</Text>
              </View>
            </View>

            <ScrollView className="d-flex flex-column">
              {orderedPosts?.map((post) => (
                <Post Post={post} key={post._id} />
              ))}
            </ScrollView>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default UserProfile;
