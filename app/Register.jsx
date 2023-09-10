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
import {
  useRegistererMutation,
  useLoginMutation,
} from "../slices/userApiSlice";
import { setUserData } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import MainContext from "../Context/MainContext";

import { useRouter } from "expo-router";

const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  role: yup.string(),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "",
};
const initialValuesLogin = {
  username: "",
  password: "",
};

const FormikForm = () => {
  const router = useRouter();
  const { loading, setLoading } = useContext(MainContext);
  const [pageType, setPageType] = useState("register");
  const [profileImage, setProfileImage] = useState();

  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [registerer] = useRegistererMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  {
    /*


*/
  }
  useEffect(() => {
    if (userData) {
      router.replace("/Dashboard/Home");
    }
  }, [userData]);

  const logIn = async (values) => {
    try {
      setLoading(true);
      const res = await login(values).unwrap();

      dispatch(setUserData(res));

      Alert.alert("", "LoggedIn Successfully!", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "ok",
        },
      ]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert("", "Something went wrong!", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "ok",
        },
      ]);
    }
  };

  const register = async (values) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("profileImage", profileImage);

    try {
      setLoading(true);

      const res = await registerer(formData).unwrap();
      dispatch(setUserData(res));

      Alert.alert("", "LoggedIn Successfully!", [
        {
          text: "Thik Ase",
          onPress: () => console.log("Cancel Pressed"),
          style: "ok",
        },
      ]);
      setLoading(false);
    } catch (err) {
      Alert.alert("", "Log In Failed!", [
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

  const handleFormSubmit = async (values, { resetForm }) => {
    if (isLogin) await logIn(values);
    if (isRegister) await register(values);
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
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
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
          <Text className="text-lg font-bold ">
            {isLogin ? "LOGIN" : "REGISTER"}
          </Text>
          {isRegister && (
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
                  <Picker.Item label="Login as" value="" />
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
                {profileImage ? (
                  <Image
                    source={{ uri: `${profileImage}` }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                ) : (
                  <Text> Add Picture</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
            <Text className="text-white font-bold">
              {isLogin ? "LOGIN" : "REGISTER"}
            </Text>
          </TouchableOpacity>
          <Text
            className="my-5 font-bold text-yellow-500"
            onPress={() => {
              setPageType(isLogin ? "register" : "login");
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up!"
              : "Login if you already have an account"}
          </Text>
        </View>
      )}
    </Formik>
  );
};

export default FormikForm;
