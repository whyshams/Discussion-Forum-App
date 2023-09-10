import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useGetAllPostMutation } from "../slices/postApiSlice";
import Post from "./Post";
import MainContext from "../Context/MainContext";

const Posts = () => {
  const [getAllPost] = useGetAllPostMutation();
  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(false);
  const { postUpdated } = useContext(MainContext);

  const { userData } = useSelector((state) => state.auth);

  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await getAllPost({
        token: userData?.data?.token || userData.token,
      });

      setPostData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [postUpdated]);

  const orderedPosts = postData
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <SafeAreaView>
      {!orderedPosts ? (
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
        <ScrollView>
          {orderedPosts?.map((data) => (
            <Post key={data._id} Post={data} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Posts;
