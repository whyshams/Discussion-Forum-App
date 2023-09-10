import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View style={style.card}>
      <View>
        <Text>
          A hypothetical Teacher Student Forum where teacher can post and
          students can only like and comment
        </Text>
        <View className="flex flex-row justify-center align-middle mt-10">
          <View className="bg-black px-5 py-3 rounded-xl">
            <Link href="/Register">
              <Text className="text-white font-bold ">Login</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 50,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 200,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default index;
