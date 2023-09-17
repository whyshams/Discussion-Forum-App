import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUserPostsMutation } from "../../slices/postApiSlice";
import {
  useLogoutApiMutation,
  useDeleteUserMutation,
} from "../../slices/userApiSlice";
import { logOut } from "../../slices/authSlice";
import { useSelector } from "react-redux";
import MainContext from "../../Context/MainContext";
import UserPost from "../../components/UserPost";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const Profile = () => {
  const { postUpdated, setPostUpdated } = useContext(MainContext);
  const { userData } = useSelector((state) => state.auth);
  const [userPostData, setUserPostData] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userPost] = useUserPostsMutation();
  const [logoutApi] = useLogoutApiMutation();
  const [deleteUser] = useDeleteUserMutation();

  const getUserPostData = async () => {
    try {
      const res = await userPost(userData._id);
      setUserPostData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = async () => {
    await logoutApi();
    dispatch(logOut());
    router.replace("/");
    Alert.alert("", "Logged Out!", [
      {
        text: "Accha",
        onPress: () => console.log("Cancel Pressed"),
        style: "ok",
      },
    ]);
  };

  const deactivate = async () => {
    await deleteUser({ token: userData.token, _id: userData._id });
    router.replace("/");
    Alert.alert("", "Shu Shu!", [
      {
        text: "Accha",
        onPress: () => console.log("Cancel Pressed"),
        style: "ok",
      },
    ]);
  };

  useEffect(() => {
    if (userData) {
      getUserPostData();
    }
  }, [postUpdated]);

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
                source={{ uri: `${userData.profileImage}` }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginVertical: 10,
                  marginHorizontal: 20,
                }}
              />

              <View className=" flex flex-col justify-center">
                <Text className="font-bold text-lg">{userData.name}</Text>
                <Text>@{userData.username}</Text>
                <Text>{userData.email}</Text>
                <Text className="font-bold">
                  Role : {userData.role.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="flex flex-row justify-around my-6">
              <View className="bg-black p-3 rounded-xl">
                <Link href="/Dashboard/UpdateProfile">
                  <Text className="text-white font-bold">Update</Text>
                </Link>
              </View>
              <Pressable
                onPress={logoutUser}
                className="bg-black p-3 rounded-xl"
              >
                <Text className="text-white font-bold">Logout</Text>
              </Pressable>
              <Pressable
                onPress={deactivate}
                className="bg-red-500 p-3 rounded-xl"
              >
                <Text className="text-white font-bold">Deactivate</Text>
              </Pressable>
            </View>

            {userPostData && (
              <ScrollView className="d-flex flex-column">
                {orderedPosts?.map((post) => (
                  <UserPost post={post} key={post._id} />
                ))}
              </ScrollView>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Profile;
