import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import moment from "moment";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import MainContext from "../../Context/MainContext";
import axios from "axios";
import Comment from "../../components/Comment";
import {
  useLikePostMutation,
  useSinglePostMutation,
} from "../../slices/postApiSlice";
import { Link, useRouter } from "expo-router";

const SinglePost = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [Post, setPost] = useState();
  const [likePost] = useLikePostMutation();
  const [singlePost] = useSinglePostMutation();
  const [commentOpen, setCommentOpen] = useState(true);
  const router = useRouter();
  const { userData } = useSelector((state) => state.auth);

  const { setPostUpdated, postUpdated, singlePostData } =
    useContext(MainContext);

  const getSinglePost = async () => {
    try {
      const res = await singlePost(singlePostData._id);

      setPost(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSinglePost();
  }, [postUpdated]);

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

  const orderedComments = Post?.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const screenWidth = Dimensions.get("window").width;
  const aspectRatio = 16 / 9;
  const imageHeight = screenWidth / aspectRatio;

  return (
    <View className="my-10 mx-1 border-zinc-800">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="md-backspace" size={24} color="black" />
      </Pressable>
      {Post ? (
        <View className="mt-9">
          <View>
            <View className="flex flex-row">
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
            <Text className="p-3">{Post.description}</Text>
            <View className="">
              {Post.image && (
                <View>
                  <Image
                    source={{
                      uri: `${Post.image}`,
                    }}
                    style={{
                      maxWidth: screenWidth,
                      height: imageHeight,
                      resizeMode: "center",
                    }}
                  />
                </View>
              )}
            </View>

            <Text className="py-3"> {moment(Post.createdAt).fromNow()}</Text>
            <View className="flex flex-row justify-between mt-5">
              <Pressable onPress={postLikeHandle}>
                {isLiked || Post.likes[userData._id] === true ? (
                  <View className="flex flex-row">
                    <AntDesign name="like1" size={24} color="skyblue" />
                    <Text className="p-1 font-bold">
                      {Object.keys(Post?.likes).length}
                    </Text>
                  </View>
                ) : (
                  <View className="flex flex-row">
                    <AntDesign name="like2" size={24} color="black" />
                    <Text className="p-1 font-bold">
                      {Object.keys(Post?.likes).length}
                    </Text>
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
      ) : (
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
      )}
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SinglePost;
