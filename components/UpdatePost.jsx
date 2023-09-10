import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useUpdatePostMutation } from "../slices/postApiSlice";
import MainContext from "../Context/MainContext";
import * as DocumentPicker from "expo-document-picker";
import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "expo-router";
import axios from "axios";

const postSchema = yup.object().shape({
  description: yup.string().required("required"),
});
const initialPost = {
  description: "",
};

const UpdatePost = ({ Post, setEditClicked }) => {
  const router = useRouter();
  const [updatePost] = useUpdatePostMutation();
  const { userData } = useSelector((state) => state.auth);
  const { postUpdated, setPostUpdated } = useContext(MainContext);

  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  const [updatedPost, setUpdatedPost] = useState(Post.description);

  const openImagePicker = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync();

      setImage(res.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userData.data) {
      setUserToken(userData.data.token);
    } else {
      setUserToken(userData.token);
    }
    if (userData.data) {
      setUserId(userData.data._id);
    } else {
      setUserId(userData._id);
    }
  }, [image]);

  const handleFormSubmit = async (values) => {
    {
      /*
      const formData = new FormData();
    formData.append("token", userToken);
    formData.append("userId", userId);
    formData.append("description", values.description);
    formData.append("picture", values.picture);
  */
    }
    setUpdatedPost(values.description);

    const body = {
      token: userToken,
      postId: Post._id,
      description: updatedPost,
      image: image,
    };

    try {
      setLoading(true);
      await updatePost(body).unwrap();
      setEditClicked(false);

      setPostUpdated(!postUpdated);
      setLoading(false);
      router.replace("/Dashboard/Profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="flex justify-center item items-center">
          <View className="mt-20">
            <Text className="my-5 font-bold text-lg">Update Post</Text>
            <TextInput
              multiline
              className="mt-2 w-60 h-28 border-2 rounded-3xl flex flex-wrap p-2"
              placeholder={Post.description}
              onChangeText={setUpdatedPost}
              value={updatedPost}
            />
            <TouchableOpacity className="m-3" onPress={() => openImagePicker()}>
              <View>
                <Text>{Post.image && "Replace Image"}</Text>
                {Post.image && <Image source={{ uri: Post.image }} />}
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-950 p-2 my-3 rounded-lg "
              onPress={handleFormSubmit}
            >
              <Text className="text-white font-bold">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default UpdatePost;
