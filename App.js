import React, { useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import SignIn from "./components/screens/signIn/SignIn";
import SignUp from "./components/screens/signUp/SignUp";
import DeliveryInfo from "./components/screens/onboardingScreens/DeliveryInfo";
import Home from "./components/screens/home/Home";
import WelcomeScreen from "./components/screens/welcomeScreen/WelcomeScreen";
import WelcomeScreen2 from "./components/screens/onboardingScreens/WelcomeScreen2";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AllergyOptions from "./components/screens/onboardingScreens/flavourProfile/AllergyOptions";
import FlavourProfile from "./components/screens/onboardingScreens/flavourProfile/FlavourProfile";
import { AuthContext } from "./components/Context";
import AsyncStorage from "@react-native-community/async-storage";
import RootStack from "./components/RootStack";
import HomeScreen from "./components/screens/homeScreen/HomeScreen";
import Footer from "./components/footer/Footer";
import OrderConfirmation from "./components/screens/homeScreen/OrderConfirmation";
import YourOrderScreen from "./components/screens/homeScreen/YourOrderScreen";
import DishDetailScreen from "./components/screens/homeScreen/DishDetailScreen";
import EditDelivery from "./components/screens/profileScreens/EditDelivery";
import EditCustomer from "./components/screens/profileScreens/EditCustomer";
import EditFlavourProfile from "./components/screens/profileScreens/EditFlavourProfile";
import OrderStatus from "./components/tabs/OrderStatus";
import RevealConfirm from "./components/tabs/RevealConfirm";
import OrderTab from "./components/tabs/OrderTab";
import ReviewRating from "./components/screens/review/ReviewRating";
import ThanksFeedback from "./components/screens/review/ThanksFeedback";
import LoggedInGoogle from "./components/screens/signIn/LoggedInGoogle";
import { getCustomerAddress } from "./services/api";

const Stack = createStackNavigator();

const App = () => {
  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };
  const [isExistingUser, setIsExistingUser] = React.useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = React.useState(false);
  const [isUserLoading, setIsUserLoading] = React.useState(true);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,

          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,

          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const existedUserHandler = () => {
    getCustomerAddress().then((res) => {
      if (res.address !== undefined) {
        setIsExistingUser(true);
      }
    }),
      (err) => {
        console.log(err);
        setIsExistingUser(false);
      };
    setIsUserLoading(false);
    // console.log("95", isUserLoading)
    // console.log("96", isExistingUser)
  };
  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        const userToken = foundUser;
        try {
          await AsyncStorage.setItem("userToken", userToken);
          existedUserHandler();
        } catch (e) {
          console.log(e);
        }

        dispatch({ type: "LOGIN", token: userToken });
      },
      signInGoogle: async (token, firstName, lastName) => {
        const userToken = token;
        try {
          await AsyncStorage.setItem("userToken", userToken);
          existedUserHandler();
          setIsGoogleLogin(true);
          setFirstName(firstName);
          setLastName(lastName);
        } catch (e) {
          console.log(e);
        }

        dispatch({ type: "LOGIN", token: userToken });
      },
      signOut: async () => {
        try {
          // await AsyncStorage.removeItem("userToken");
          await AsyncStorage.clear();
          setIsExistingUser(false);
          setIsGoogleLogin(false);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      signUp: async (foundUser) => {
        const userToken = foundUser;
        try {
          await AsyncStorage.setItem("userToken", userToken);
          setIsUserLoading(false);
          setIsExistingUser(false);
          // existedUserHandler()
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "REGISTER", token: userToken });
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
        if (userToken !== null) {
          existedUserHandler();
        }
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 2000);
  }, []);

  const RootSignUp = () => {
    return (
      <Stack.Navigator style={styles.container}>
        <Stack.Screen name="WelcomeScreen2" component={WelcomeScreen2} />
        <Stack.Screen name="Footer" component={Footer} />
        <Stack.Screen name="FlavourProfile" component={FlavourProfile} />
        <Stack.Screen name="LoggedInGoogle" component={LoggedInGoogle} />
        <Stack.Screen name="ReviewRating" component={ReviewRating} />
        <Stack.Screen name="ThanksFeedback" component={ThanksFeedback} />
        <Stack.Screen
          name="EditFlavourProfile"
          component={EditFlavourProfile}
        />
        <Stack.Screen name="EditDelivery" component={EditDelivery} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="DeliveryInfo1" component={DeliveryInfo} />
        <Stack.Screen name="OrderTab" component={OrderTab} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen name="YourOrderScreen" component={YourOrderScreen} />
        <Stack.Screen name="DishDetailScreen" component={DishDetailScreen} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RevealConfirm" component={RevealConfirm} />
      </Stack.Navigator>
    );
  };

  const RootSignIn = () => {
    return (
      <Stack.Navigator style={styles.container}>
        <Stack.Screen name="Footer" component={Footer} />
        <Stack.Screen name="ReviewRating" component={ReviewRating} />
        <Stack.Screen name="ThanksFeedback" component={ThanksFeedback} />
        <Stack.Screen
          name="EditFlavourProfile"
          component={EditFlavourProfile}
        />
        <Stack.Screen name="EditDelivery" component={EditDelivery} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="DeliveryInfo1" component={DeliveryInfo} />
        <Stack.Screen name="OrderTab" component={OrderTab} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen name="YourOrderScreen" component={YourOrderScreen} />
        <Stack.Screen name="DishDetailScreen" component={DishDetailScreen} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RevealConfirm" component={RevealConfirm} />
      </Stack.Navigator>
    );
  };
  const RootGoogle = () => {
    return (
      <Stack.Navigator style={styles.container}>
        <Stack.Screen name="LoggedInGoogle" component={LoggedInGoogle} />
        <Stack.Screen name="WelcomeScreen2" component={WelcomeScreen2} />
        <Stack.Screen name="Footer" component={Footer} />
        <Stack.Screen name="FlavourProfile" component={FlavourProfile} />
        <Stack.Screen name="ReviewRating" component={ReviewRating} />
        <Stack.Screen name="ThanksFeedback" component={ThanksFeedback} />
        <Stack.Screen
          name="EditFlavourProfile"
          component={EditFlavourProfile}
        />
        <Stack.Screen name="EditDelivery" component={EditDelivery} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="DeliveryInfo1" component={DeliveryInfo} />
        <Stack.Screen name="OrderTab" component={OrderTab} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen name="YourOrderScreen" component={YourOrderScreen} />
        <Stack.Screen name="DishDetailScreen" component={DishDetailScreen} />
        <Stack.Screen name="OrderStatus" component={OrderStatus} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RevealConfirm" component={RevealConfirm} />
      </Stack.Navigator>
    );
  };
  const Root = () => {
    return (
      <Stack.Navigator initialRouteName="WelcomeScreen1" independent={true}>
        <Stack.Screen name="WelcomeScreen1" component={WelcomeScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Root" component={Root} />
      </Stack.Navigator>
    );
  };
  const checkUser = () => {
    if (isExistingUser || (isGoogleLogin && isExistingUser)) {
      return RootSignIn();
    } else if (isGoogleLogin && !isExistingUser) {
      return RootGoogle();
    } else {
      return RootSignUp();
    }
  };
  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null && isUserLoading !== true
          ? checkUser()
          : Root()}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get("window").width,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
