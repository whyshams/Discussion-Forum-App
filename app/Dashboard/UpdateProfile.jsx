import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as yup from "yup";
import { useUpdateUserMutation } from "../../slices/userApiSlice";
import { setUserData } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import MainContext from "../../Context/MainContext";

import { useRouter } from "expo-router";

const FormikForm = () => {
  const router = useRouter();
  const { loading, setLoading } = useContext(MainContext);

  const [profileImage, setProfileImage] = useState();

  const [updateUser] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  // Initial Values and Schema for Form
  const registerSchema = yup.object().shape({
    name: yup.string().required("required"),
    username: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string(),
    role: yup.string(),
  });

  const initialValuesRegister = {
    name: userData.name,
    username: userData.username,
    email: userData.email,
    profileImage: userData.profileImage,
    password: "",
    role: userData.role,
  };

  // Initial Values and Schema for Form end

  const userUpdate = async (values) => {
    const body = {
      token: userData.token,

      _id: userData._id,
      name: values.name,
      username: values.username,
      email: values.email,
      profileImage: profileImage || userData.profileImage,
      password: values.password,
      role: values.role,
    };

    try {
      setLoading(true);

      const res = await updateUser(body).unwrap();
      dispatch(setUserData(res));
      router.replace("/Dashboard/Profile");

      Alert.alert("", "Profile Updated!", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "ok",
        },
      ]);
      setLoading(false);
    } catch (err) {
      Alert.alert("", "LoggedIn Failed!", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "ok",
        },
      ]);
    }
  };

  const openImagePicker = async (setFieldValue) => {
    try {
      const res = await DocumentPicker.getDocumentAsync();
      setProfileImage(res.assets[0].uri);

      //setFieldValue("picture", res.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = async (values) => {
    await userUpdate(values);
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text className="text-lg font-bold ">Update Profile</Text>

          <View className="py-5">
            <TextInput
              className="border-2 border-red-100 rounded-lg m-3 w-52 px-3 py-2"
              placeholder="Name"
              onBlur={handleBlur("name")}
              onChangeText={handleChange("name")}
              value={values.name}
            />
            <View>
              <Picker
                style={{ height: 50, width: 200 }}
                selectedValue={values.role}
                onValueChange={handleChange("role")}
              >
                <Picker.Item label="Change Role" value="" />
                <Picker.Item label="Teacher" value="teacher" />
                <Picker.Item label="Student" value="student" />
                {/* Add more options as needed */}
              </Picker>
            </View>
            <TextInput
              className="border-2 border-red-200 rounded-lg m-3 w-52 px-3 py-2"
              placeholder="Email"
              onBlur={handleBlur("email")}
              onChangeText={handleChange("email")}
              value={values.email}
            />
            <TouchableOpacity
              className="m-3"
              onPress={() => openImagePicker(setFieldValue)}
            >
              {userData.profileImage ? (
                <Image
                  source={{ uri: `${userData.profileImage}` }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
              ) : (
                <Text> Add Picture</Text>
              )}
            </TouchableOpacity>
          </View>

          <View>
            <TextInput
              className="border-2 border-red-300 rounded-lg m-3 w-52 px-3 py-2"
              placeholder="Username"
              onBlur={handleBlur("username")}
              onChangeText={handleChange("username")}
              value={values.username}
            />
            <TextInput
              className="border-2 border-red-400 rounded-lg m-3 w-52 px-3 py-2"
              placeholder="Password"
              onBlur={handleBlur("password")}
              onChangeText={handleChange("password")}
              value={values.password}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            className="bg-gray-950 p-2 my-3 rounded-lg "
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold">Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default FormikForm;
