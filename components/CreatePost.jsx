import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useCreatePostMutation } from "../slices/postApiSlice";
import MainContext from "../Context/MainContext";
import * as DocumentPicker from "expo-document-picker";
import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const postSchema = yup.object().shape({
  description: yup.string().required("required"),
});
const initialPost = {
  description: "",
};

const CreatePost = () => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  const { userData } = useSelector((state) => state.auth);
  const { postUpdated, setPostUpdated, loading, setLoading } =
    useContext(MainContext);

  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState();
  const [image, setImage] = useState();

  const openImagePicker = async (setFieldValue) => {
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
    const body = {
      token: userToken,
      userId: userId,
      description: values.description,
      image: image,
    };

    try {
      setLoading(true);
      await createPost(body).unwrap();
      setPostUpdated(!postUpdated);
      router.replace("/Dashboard/Home");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialPost}
          validationSchema={postSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <View className="flex justify-center item items-center">
              <View className="mt-10">
                <Pressable onPress={() => router.back()}>
                  <Ionicons name="md-backspace" size={24} color="black" />
                </Pressable>
              </View>
              <View className="mt-20">
                <Text className="my-5 font-bold text-lg">Create A Post</Text>
                <TextInput
                  multiline
                  className="mt-2 w-60 h-28 border-2 rounded-3xl flex flex-wrap p-2"
                  placeholder="What's in your mind?"
                  onBlur={handleBlur("desrcription")}
                  onChangeText={handleChange("description")}
                  value={values.description}
                />
                <TouchableOpacity
                  className="m-3"
                  onPress={() => openImagePicker(setFieldValue)}
                >
                  <Text>{values.picture ? values.picture : "Add Picture"}</Text>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 200, height: 200 }}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-950 p-2 my-3 rounded-lg "
                  onPress={handleSubmit}
                >
                  <Text className="text-white font-bold">Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      )}
    </>
  );
};

export default CreatePost;
