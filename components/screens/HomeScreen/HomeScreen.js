import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import H1 from "../../texts/H1";
import RNPickerSelect from "react-native-picker-select";
import { NavigationContainer } from "@react-navigation/native";
import {
  getSuitableMenu,
  getCustomerInfo,
  getCustomerAddress,
} from "../../../services/api";
import { set } from "react-native-reanimated";

export default function HomeScreen(props) {
  // const HomeScreen = (props) => {
  const [data, setData] = React.useState({
    numberOfPeople: "",
    budget: "",
  });
  const [firstName, setFirstName] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  useEffect(() => {
    getCustomerInfo().then(
      (res) => {
        setFirstName(res.firstName);
      },
      (err) => {
        console.log(err);
      }
    );
    getCustomerAddress().then(
      (res) => {
        setAddress(res.address);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const noOfPeopleChange = (val) => {
    setData({
      ...data,
      numberOfPeople: val,
    });
  };

  const budgetChange = (val) => {
    setData({
      ...data,
      budget: val,
    });
  };

  const orderHandle = () => {
    getSuitableMenu(data.numberOfPeople, data.budget).then(
      (res) => {
        // console.log(res)
        props.onHandleHomeChange(res, data.numberOfPeople);
      },
      (err) => {
        console.log(err);
        Alert.alert("Error", `Something went wrong! ${err}`);
      }
    );
  };
  return (
    <ScrollView>
      <View>
        <View style={styles.center}>
          <View>
            <Image />
            <Text style={styles.title}>Delivery now</Text>
          </View>
          <Text style={styles.address}>{address}</Text>
        </View>
        <Image />
      </View>
      <View>
        <H1 h1Text="Hello" />
        <Text>{firstName}</Text>
        <Text>Explore your surprised food today.</Text>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={require("../../../assets/foodIllustration/customerSide/Nacho.png")}
          />
          <View style={styles.boxChild}>
            <View style={styles.pickerField}>
              <Text style={styles.pickerText}>Quantity</Text>
              <RNPickerSelect
                onValueChange={(value) => noOfPeopleChange(value)}
                items={[
                  { label: "1 Meal", value: "1" },
                  { label: "2 Meals", value: "2" },
                  { label: "3 Meals", value: "3" },
                  { label: "4 Meals", value: "4" },
                  { label: "5 Meals", value: "5" },
                ]}
              />
            </View>
            <View style={styles.pickerField}>
              <Text style={styles.pickerText}>Budget</Text>
              <RNPickerSelect
                onValueChange={(value) => budgetChange(value)}
                items={[
                  { label: "$6 to $10", value: "10" },
                  { label: "$11 to $15", value: "15" },
                  { label: "$16 to $20", value: "20" },
                  { label: "+$20", value: "100" },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              type="submit"
              onPress={() => orderHandle()}
            >
              <Text style={styles.buttonText}>Submit Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    margin: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  image: {
    height: Dimensions.get("screen").width * 0.6,
    width: "auto",
    position: "relative",
    top: 11,
    marginTop: 50,
    // backgroundColor: "lightgray",
  },
  box: {
    width: Dimensions.get("screen").width * 0.8,
    marginLeft: Dimensions.get("screen").width * 0.1,
  },
  boxChild: {
    borderColor: "#D4CDE3",
    borderTopColor: "transparent",
    borderWidth: 2,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 50,
  },
  pickerField: {
    width: Dimensions.get("screen").width * 0.6,
    marginLeft: Dimensions.get("screen").width * 0.1,
  },
  pickerText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#632DF1",
    width: Dimensions.get("screen").width * 0.6,
    marginLeft: Dimensions.get("screen").width * 0.1,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
