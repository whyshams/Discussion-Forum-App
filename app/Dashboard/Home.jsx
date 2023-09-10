import { View, ActivityIndicator } from "react-native";
import { useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import Posts from "../../components/Posts";
import MainContext from "../../Context/MainContext";

const Home = () => {
  const router = useRouter();
  const { userData } = useSelector((state) => state.auth);
  const { loading } = useContext(MainContext);

  useEffect(() => {
    if (!userData || userData === null) {
      router.replace("/Register");
    }
  }, [userData]);
  return (
    <View className="mt-5">
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <Posts />
      )}
    </View>
  );
};

export default Home;
