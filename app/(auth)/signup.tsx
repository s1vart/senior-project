import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    signup(email, password);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-2xl bg-sage-accent items-center justify-center mb-4">
            <Ionicons name="leaf" size={40} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold">Create Account</Text>
          <Text className="text-gray-text text-base mt-1">
            Start your plant journey
          </Text>
        </View>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Ionicons name="mail" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          secureTextEntry
          icon={<Ionicons name="lock-closed" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
          icon={<Ionicons name="lock-closed" size={18} color="#9CA3AF" />}
        />

        <Button title="Sign Up" onPress={handleSignup} className="mt-2" />

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 items-center"
        >
          <Text className="text-gray-text">
            Already have an account?{" "}
            <Text className="text-sage-accent font-semibold">Log In</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
