import {
  ActivityIndicator,
  Image,
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
import { Picker } from "@react-native-picker/picker";

const UserDetails = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    sexo: "",
    turma: "",
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigateNext = () => {
    navigation.navigate("PHYSICALMEASUREMENTS");
  };

  const handleChange = (field, value) => {
    let formattedValue = value;

    // Se for o campo 'turma', filtra para permitir apenas números
    if (field === "turma") {
      formattedValue = value.replace(/\D/g, ""); // Remove tudo o que não for número
    }

    // Caso seja a data de nascimento, já mantemos a lógica existente
    if (field === "nascimento") {
      formattedValue = value.replace(/[^\d]/g, "");

      // Limita a 8 caracteres e aplica as barras após os números
      if (formattedValue.length > 8) {
        formattedValue = formattedValue.slice(0, 8);
      }
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
      if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 5) + "/" + formattedValue.slice(5);
      }
    }

    setForm({ ...form, [field]: formattedValue });
  };

  const WizardSteps = ({ step }) => {
    return (
      <View style={styles.wizardContainer}>
        <View style={styles.progressLine} />
        <View style={[styles.stepContainer, step >= 1 && styles.activeStep]}>
          <MaterialIcons name="person" size={24} color="white" />
        </View>
        <View style={[styles.stepContainer, step >= 2 && styles.activeStep]}>
          <MaterialIcons name="favorite" size={20} color="white" />
        </View>
        <View style={[styles.stepContainer, step >= 3 && styles.activeStep]}>
          <MaterialIcons name="fitness-center" size={20} color="white" />
        </View>
        <View style={[styles.stepContainer, step >= 4 && styles.activeStep]}>
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
          <Text style={styles.headingText}>Dados</Text>
          <Text style={styles.headingText}>Cadastrais</Text>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Digite o Nome Completo"
            placeholderTextColor={colors.secondary}
            value={form.nome}
            onChangeText={(text) => handleChange("nome", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="calendar" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Data de Nascimento (DD/MM/AAAA)"
            placeholderTextColor={colors.secondary}
            value={form.nascimento}
            onChangeText={(text) => handleChange("nascimento", text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="male-female" size={20} color={colors.secondary} />
          <Picker
            selectedValue={form.sexo}
            style={[styles.textInput, { height: 50 }]}
            onValueChange={(itemValue) => setForm({ ...form, sexo: itemValue })}
          >
            <Picker.Item label="Selecione o Sexo" value="" />
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Feminino" value="F" />
          </Picker>
          <Ionicons
            name="caret-down-outline"
            size={20}
            color={colors.secondary}
            style={{ position: "absolute", right: 20, top: 28 }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="school" size={20} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Turma"
            placeholderTextColor={colors.secondary}
            value={form.turma}
            onChangeText={(text) => handleChange("turma", text)}
            keyboardType="number-pad"
          />
        </View>

        {/* Wizard Steps */}
        <WizardSteps step={1} />

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
    marginBottom: 10,
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
  nextStepButton: {
    marginTop: 80,
    alignSelf: "flex-end",
    backgroundColor: colors.blue,
    padding: 10,
    left: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserDetails;
