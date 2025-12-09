import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Anthropometrics = () => {
  const navigation = useNavigation(); // Hook de navegação
  const [form, setForm] = useState({
    estatura: "",
    peso: "",
    envergadura: "",
  });

  const handleGoBack = () => {
    navigation.navigate("HOME");
  };

  const handleNavigateNext = () => {
    // Substitua "NextScreen" pelo nome da próxima tela no seu navigator
    navigation.navigate("FITNESSFORM");
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const WizardSteps = ({ step }) => {
    return (
      <View style={styles.wizardContainer}>
        <View style={styles.progressLine} />

        <View
          style={[
            styles.stepContainer,
            step >= 1 && styles.activeStep,
            step > 1 && styles.completedStep,
          ]}
        >
          <MaterialIcons name="person" size={24} color="white" />
        </View>

        {/* Step 2 */}
        <View
          style={[
            styles.stepContainer,
            step >= 2 && styles.activeStep,
            step > 2 && styles.completedStep,
          ]}
        >
          <MaterialIcons name="favorite" size={20} color="white" />
        </View>

        {/* Step 3 */}
        <View
          style={[
            styles.stepContainer,
            step >= 3 && styles.activeStep,
            step > 3 && styles.completedStep,
          ]}
        >
          <MaterialIcons name="fitness-center" size={20} color="white" />
        </View>

        {/* Step 4 */}
        <View
          style={[
            styles.stepContainer,
            step >= 4 && styles.activeStep,
            step > 4 && styles.completedStep,
          ]}
        >
          <MaterialIcons name="directions-run" size={20} color="white" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View style={styles.textContainer}>
          <TouchableOpacity style={styles.ellipsisButton}>
            <Ionicons name="ellipsis-vertical" color={colors.white} size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons
              name={"arrow-back-outline"}
              color={colors.white}
              size={25}
            />
          </TouchableOpacity>
          <Text style={styles.headingText}>Medidas</Text>
          <Text style={styles.headingText}>Antropométricas</Text>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="man" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Estatura (cm)"
            placeholderTextColor={colors.secondary}
            value={form.estatura}
            onChangeText={(text) => handleChange("estatura", text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="barbell" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Peso (kg)"
            placeholderTextColor={colors.secondary}
            value={form.peso}
            onChangeText={(text) => handleChange("peso", text)}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="resize" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Envergadura (cm)"
            placeholderTextColor={colors.secondary}
            value={form.envergadura}
            onChangeText={(text) => handleChange("envergadura", text)}
            keyboardType="number-pad"
          />
        </View>

        {/* Wizard Steps */}
        <WizardSteps step={3} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.previousButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back-outline"
              color={colors.white}
              size={30}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextStepButton}
            onPress={handleNavigateNext}
          >
            <Ionicons
              name="chevron-forward-outline"
              color={colors.white}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 30,
  },
  textContainer: {
    marginVertical: 20,
    marginTop: 30,
  },
  headingText: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fonts.SemiBold,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    marginTop: 10,
    paddingHorizontal: 5,
    fontFamily: fonts.Light,
    color: colors.white,
  },
  backButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    right: 10,
    marginBottom: 30,
  },
  ellipsisButton: {
    position: "absolute",
    left: 320,
    top: 4,
    zIndex: 1,
  },
  wizardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
    marginTop: 30,
  },
  progressLine: {
    position: "absolute",
    top: "50%",
    left: 30,
    right: 30,
    height: 2,
    backgroundColor: colors.white,
  },

  stepContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: colors.black,
    borderWidth: 2,
    borderColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  completedStep: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 200,
  },
  nextStepButton: {
    backgroundColor: colors.blue,
    left: 10,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  previousButton: {
    backgroundColor: colors.blue,
    right: 10,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Anthropometrics;
