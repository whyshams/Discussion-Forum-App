import React, { useState, useContext } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";

import MainContext from "../Context/MainContext";
import { useCreateCommentMutation } from "../slices/postApiSlice";

const Comment = ({ post }) => {
  const [createComment] = useCreateCommentMutation();
  const [newComment, setNewComment] = useState("");
  const { postUpdated, setPostUpdated } = useContext(MainContext);
  const [commentLoad, setCommentLoad] = useState(false);

  const { userData } = useSelector((state) => state.auth);

  const handleCommentCreate = async () => {
    const body = {
      _id: post._id,
      token: userData.token,
      userId: userData._id,
      text: newComment,
    };

    try {
      setCommentLoad(true);

      await createComment(body).unwrap();

      setPostUpdated(!postUpdated);
      setNewComment("");
      setCommentLoad(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <View>
      {commentLoad ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="mt-5">
          <View className="flex justify-center items-center">
            <Text className="font-bold my-3">Add a New Comment</Text>
          </View>
          <TextInput
            multiline
            className="w-100 h-20 border-2 border-zinc-500 rounded-xl"
            placeholder="What do you think abou the post?"
            value={newComment}
            onChangeText={setNewComment}
          />
          <View className="flex justify-center items-center">
            <Pressable
              className="bg-zinc-900 w-30 p-3 rounded-xl mt-2"
              onPress={handleCommentCreate}
            >
              <Text className="text-zinc-100">Add Comment</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default Comment;
