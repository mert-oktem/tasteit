import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AllergyOptions from "./AllergyOptions";
import CuisineOptions from "./CuisineOptions";
import DietTypes from "./DietTypes";
import H1 from "../../../texts/H1";
import SpicinessOptions from "./SpicinessOptions";
import {
  getSpiciness,
  getAllergy,
  getCuisine,
  getDietType,
  postChoice,
} from "../../../../services/api";

const MaterialTopTabs = createMaterialTopTabNavigator();

export default class FlavourProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spicinessData: [],
      allergiesData: [],
      dietTypesData: [],
      cuisinesData: [],
      isLoaded: true,
      isSpiciness: true,
      isCuisines: true,
      isDietTypes: true,
      isAllergies: true,
      isTest: true,
    };
    this.handleSpicinessChange = this.handleSpicinessChange.bind(this);
  }
  // ***************************************get data from server through api *********************************************/
  componentDidMount() {
    getSpiciness().then(
      (res) => {
        this.setState({
          isLoaded: false,
        });
        let needData = [];
        for (let i = 0; i < res.length; i++) {
          needData.push({
            id: i,
            key: res[i].choiceDescription,
            checked: false,
            icon: res[i].pictureURI
          });
        }
        this.setState({
          spicinessData: needData,
        });
      },
      (error) => {
        Alert.alert("Error", `Something went wrong! ${error}`);
      }
    );
    getAllergy().then(
      (res) => {
        this.setState({
          isLoaded: false,
        });
        let needData = [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].choiceDescription !== "No Allergens") {
            needData.push({
              id: i,
              key: res[i].choiceDescription,
              checked: false,
              icon: res[i].pictureURI
            });
          }
        }
        this.setState({
          allergiesData: needData,
        });
      },
      (error) => {
        Alert.alert("Error", `Something went wrong! ${error}`);
      }
    );
    getDietType().then(
      (res) => {
        this.setState({
          isLoaded: false,
        });
        let needData = [];
        for (let i = 0; i < res.length; i++) {
          needData.push({
            id: i,
            key: res[i].choiceDescription,
            checked: false,
            icon: res[i].pictureURI
          });
        }
        this.setState({
          dietTypesData: needData,
        });
      },
      (error) => {
        Alert.alert("Error", `Something went wrong! ${error}`);
      }
    );
    getCuisine().then(
      (res) => {
        this.setState({
          isLoaded: false,
        });
        let needData = [];
        for (let i = 0; i < res.length; i++) {
          needData.push({
            id: i,
            key: res[i].choiceDescription,
            checked: false,
            icon: res[i].pictureURI
          });
        }
        this.setState({
          cuisinesData: needData,
        });
      },
      (error) => {
        Alert.alert("Error", `Something went wrong! ${error}`);
      }
    );
  }

  // *************************************** get desired arrays from all the choices*********************************************/
  getSelectedSpiciness() {
    const keys = this.state.spicinessData.map((k) => k.key);
    var checks = this.state.spicinessData.map((k) => k.checked);
    let Selected = [];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == true) {
        Selected.push(keys[i]);
      }
    }
    return Selected;
  }
  getSelectedCuisines() {
    const keys = this.state.cuisinesData.map((k) => k.key);
    var checks = this.state.cuisinesData.map((k) => k.checked);
    let Selected = [];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == true) {
        Selected.push(keys[i]);
      }
    }
    return Selected;
  }
  getSelectedDietTypes() {
    const keys = this.state.dietTypesData.map((k) => k.key);
    var checks = this.state.dietTypesData.map((k) => k.checked);
    let Selected = [];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == true) {
        Selected.push(keys[i]);
      }
    }
    return Selected;
  }
  getSelectedAllergies() {
    const keys = this.state.allergiesData.map((k) => k.key);
    var checks = this.state.allergiesData.map((k) => k.checked);
    let Selected = [];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == true) {
        Selected.push(keys[i]);
      }
    }
    return Selected;
  }

  onNext = () => {
    const spicinessArray = this.getSelectedSpiciness();
    const cuisinesArray = this.getSelectedCuisines();
    const dietTypesArray = this.getSelectedDietTypes();
    const allergiesArray = this.getSelectedAllergies();

    const finalArray = [
      ...spicinessArray,
      ...cuisinesArray,
      ...dietTypesArray,
      ...allergiesArray,
    ];
    if (
      allergiesArray.length > 0 ||
      spicinessArray.length > 0 ||
      cuisinesArray.length > 0 ||
      dietTypesArray.length > 0
    ) {
      for (let i = 0; i < finalArray.length; i++) {
        postChoice(finalArray[i]).then(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
            Alert.alert("Error", `Something went wrong! ${error}`);
          }
        );
      }
      Alert.alert("successfull", "choices saved");
      this.props.navigation.navigate("DeliveryInfo1");
    } else {
      Alert.alert("Choices Missing", "Please Select Choices by switching tabs");
    }
  };
  // ***************************************change state dynimacally when user clicks any checkbox return an updated array *********************************************/
  handleSpicinessChange = (update) => {
    this.setState({
      spicinessData: update,
    });
    // console.log(this.state.spicinessData);
  };
  handleAllergiesChange = (update) => {
    this.setState({
      allergiesData: update,
    });
    // console.log(this.state.allergiesData);
  };
  handleDietTypesChange = (update) => {
    this.setState({
      dietTypesData: update,
    });
    // console.log(this.state.dietTypesData);
  };
  handleCuisinesChange = (update) => {
    this.setState({
      cuisinesData: update,
    });
    // console.log(this.state.cuisinesData);
  };

  // ***************************************to render all tabs and pass props *********************************************/
  createTopTabs = () => {
    return (
      <MaterialTopTabs.Navigator
        style={styles.navContainer}
        sceneContainerStyle={[
          {
            borderWidth: 2,
            borderRadius: 20,
            borderColor: "#d4cde3",
            marginTop: 20,
            marginLeft: Dimensions.get("screen").width * 0.1,
            marginRight: Dimensions.get("screen").width * 0.1,
          },
        ]}
      >
        <MaterialTopTabs.Screen
          name="Allergy"
          children={() => (
            <AllergyOptions
              key= "1"
              allergies={this.state.allergiesData}
              updateAllergies={this.handleAllergiesChange}
            />
          )}
        />
        <MaterialTopTabs.Screen
          name="Cuisine"
          backgroundColor="white"
          children={() => (
            <CuisineOptions
              key="2"
              cuisines={this.state.cuisinesData}
              updateCuisines={this.handleCuisinesChange}
            />
          )}
        />
        <MaterialTopTabs.Screen
          name="Diet Type"
          children={() => (
            <DietTypes
              key="3"
              dietTypes={this.state.dietTypesData}
              updateDietTypes={this.handleDietTypesChange}
            />
          )}
        />
        <MaterialTopTabs.Screen
          name="Spiciness"
          children={() => (
            <SpicinessOptions
              key="4"
              spiciness={this.state.spicinessData}
              updateSpiciness={this.handleSpicinessChange}
            />
          )}
        />
      </MaterialTopTabs.Navigator>
    );
  };

  // *************************************** render all components *********************************************/
  render() {
    if (this.state.isLoaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <ScrollView style={{ backgroundColor: "white" }}>
          <View style={styles.page}>
            <View
              style={[
                {
                  width: Dimensions.get("screen").width * 0.8,
                  marginLeft: Dimensions.get("screen").width * 0.1,
                  marginBottom: 20,
                },
              ]}
            >
              <H1 h1Text="Flavour Profile" />
              <Text>Tell us what you love</Text>
            </View>
            <NavigationContainer independent={true}>
              {this.createTopTabs()}
            </NavigationContainer>
            <Button
              title="Next"
              onPress={() => {
                this.onNext();
              }}
            />
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  page: {
    marginTop: 50,
  },
  navContainer: {
    backgroundColor: "white",
  },
});
