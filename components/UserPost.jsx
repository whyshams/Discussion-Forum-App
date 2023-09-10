import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import MainContext from "../Context/MainContext";

import UpdatePost from "./UpdatePost";
import {
  useDeletePostMutation,
  useLikePostMutation,
} from "../slices/postApiSlice";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import moment from "moment";

const UserPost = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();

  const numberOfLikes = Object.keys(post.likes).length;

  const { userData } = useSelector((state) => state.auth);
  const { postUpdated, setPostUpdated, loading, setLoading } =
    useContext(MainContext);

  const postLikeHandle = async () => {
    const body = {
      token: userData.token,

      postId: post._id,

      userId: userData._id,
    };
    try {
      setIsLiked(!isLiked);

      await likePost(body);
      setPostUpdated(!postUpdated);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePost({ token: userData.token, _id: post._id });
      setPostUpdated(!postUpdated);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const orderedComments = post.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="">
          <View style={style.card}>
            <View className="flex flex-row justify-around">
              <TouchableOpacity onPress={() => setEditClicked(!editClicked)}>
                <AntDesign name="edit" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <AntDesign name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
            {editClicked ? (
              <UpdatePost Post={post} setEditClicked={setEditClicked} />
            ) : (
              <View>
                <View>
                  <View className="flex flex-row m-4">
                    <Image
                      source={{ uri: post.userProfileImage }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        margin: 2,
                      }}
                    />
                    <Text className="m-3">{post.name}</Text>
                  </View>
                  <View className="flex justify-center">
                    <Text className="p-3">{post.description}</Text>
                    {post.image && (
                      <Image
                        source={{ uri: post.image }}
                        style={{
                          margin: 15,
                          width: 200,
                          height: 200,
                          borderRadius: 10,
                        }}
                      />
                    )}
                    <Text className="m-5">
                      Posted {moment(post.createdAt).fromNow()}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row justify-around my-5">
                  <Pressable onPress={postLikeHandle}>
                    {isLiked || post.likes[userData._id] === true ? (
                      <View className="flex flex-row">
                        <AntDesign name="like1" size={24} color="skyblue" />
                        <Text className="p-1 font-bold">{numberOfLikes}</Text>
                      </View>
                    ) : (
                      <View className="flex flex-row">
                        <AntDesign name="like2" size={24} color="black" />
                        <Text className="p-1 font-bold">{numberOfLikes}</Text>
                      </View>
                    )}
                  </Pressable>
                  <TouchableOpacity
                    onPress={() => setCommentOpen(!commentOpen)}
                  >
                    <View className="flex flex-row">
                      <FontAwesome name="comment-o" size={24} color="black" />
                      <Text className="p-1 font-bold">
                        {post.comments.length}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {commentOpen && (
                  <View>
                    <Comment post={post} />
                    {orderedComments.map((data) => (
                      <View key={data._id}>
                        <Image
                          source={{ uri: data.userProfileImage }}
                          style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <Text>{data.username}:</Text>
                        <Text>"{data.text}"</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const style = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    margin: 10,
  },
});

export default UserPost;
