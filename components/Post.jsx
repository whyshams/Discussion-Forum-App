import { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import moment from "moment";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import MainContext from "../Context/MainContext";
import axios from "axios";
import Comment from "./Comment";
import { useLikePostMutation } from "../slices/postApiSlice";
import { Link, useRouter } from "expo-router";

const Post = ({ Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likePost] = useLikePostMutation();
  const numberOfLikes = Object.keys(Post.likes).length;
  const [commentOpen, setCommentOpen] = useState(false);
  const router = useRouter();
  const { userData } = useSelector((state) => state.auth);

  const { setPostUpdated, postUpdated, singlePostData, setSinglePostData } =
    useContext(MainContext);

  const postLikeHandle = async () => {
    const body = {
      token: userData.token,

      postId: Post._id,

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
  const singlePostReq = () => {
    setSinglePostData(Post);
    router.replace("/Dashboard/SinglePost");
  };

  const orderedComments = Post.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <View className="my-5 p-7 mx-1 border-zinc-800" style={style.card}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            source={{
              uri: `${Post.userProfileImage}`,
            }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          <Link href={`/Dashboard/${Post.userId}`}>
            <Text className=" text-blue-400 font-bold">{Post.name}</Text>
          </Link>
        </View>
        <Pressable onPress={singlePostReq}>
          <Text className="p-3">{Post.description}</Text>
        </Pressable>
        <Pressable onPress={singlePostReq}>
          <View className="flex-1 justify-items-center">
            {Post.image && (
              <Image
                source={{
                  uri: `${Post.image}`,
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                }}
              />
            )}
          </View>
        </Pressable>

        <Text className="py-3"> {moment(Post.createdAt).fromNow()}</Text>
        <View className="flex flex-row justify-between mt-5">
          <Pressable onPress={postLikeHandle}>
            {isLiked || Post.likes[userData._id] === true ? (
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
          <Pressable
            className="flex flex-row"
            onPress={() => setCommentOpen(!commentOpen)}
          >
            <FontAwesome name="comment-o" size={24} color="black" />
            <Text className="font-bold m-1">{orderedComments.length}</Text>
          </Pressable>
        </View>
        {commentOpen ? (
          <View>
            <Comment post={Post} />
            {orderedComments.map((data) => (
              <View key={data._id} className="mt-4">
                <View className="flex flex-row">
                  <Image
                    className="m-2"
                    source={{ uri: data.userProfileImage }}
                    style={{ width: 30, height: 30, borderRadius: 50 }}
                  />

                  <Text className="m-2 font-bold">{data.username}:</Text>
                </View>

                <Text className="m-2 flex justify-center items-center">
                  "{data.text}"
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Post;
