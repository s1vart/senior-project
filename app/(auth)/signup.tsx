import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";

export default function SignupScreen() {
  const { signup, loading, error, clearError } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const displayError = localError || error;

  const handleSignup = async () => {
    setLocalError(null);
    if (!email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    const success = await signup(email, password);
    if (success) setEmailSent(true);
  };

  const handleTextChange = () => {
    setLocalError(null);
    setEmailSent(false);
    clearError();
  };

  const navigateBack = () => {
    clearError();
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-dark-bg"
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        {displayError && (
          <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-400 text-sm text-center">
              {displayError}
            </Text>
          </View>
        )}

        {emailSent && !displayError && (
          <View className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4">
            <Text className="text-green-400 text-sm text-center">
              Check your email to confirm your account, then log in
            </Text>
          </View>
        )}

        <TextField
          label="Email"
          value={email}
          onChangeText={(text) => {
            handleTextChange();
            setEmail(text);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Ionicons name="mail" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Password"
          value={password}
          onChangeText={(text) => {
            handleTextChange();
            setPassword(text);
          }}
          placeholder="Create password"
          secureTextEntry
          icon={<Ionicons name="lock-closed" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            handleTextChange();
            setConfirmPassword(text);
          }}
          placeholder="Confirm password"
          secureTextEntry
          icon={<Ionicons name="lock-closed" size={18} color="#9CA3AF" />}
        />

        <Button
          title="Sign Up"
          onPress={handleSignup}
          loading={loading}
          className="mt-2"
        />

        <TouchableOpacity
          onPress={navigateBack}
          className="mt-4 items-center"
        >
          <Text className="text-gray-text">
            Already have an account?{" "}
            <Text className="text-sage-accent font-semibold">Log In</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ height: 300 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
