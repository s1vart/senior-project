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

export default function ForgotPasswordScreen() {
  const { resetPassword, loading, error, clearError } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    const success = await resetPassword(email);
    if (success) setSent(true);
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
            <Ionicons name="mail-open" size={40} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold">Reset Password</Text>
          <Text className="text-gray-text text-base mt-1 text-center">
            Enter your email and we'll send you a link to reset your password
          </Text>
        </View>

        {error && (
          <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-400 text-sm text-center">{error}</Text>
          </View>
        )}

        {sent && !error && (
          <View className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4">
            <Text className="text-green-400 text-sm text-center">
              Check your email for a password reset link
            </Text>
          </View>
        )}

        <TextField
          label="Email"
          value={email}
          onChangeText={(text) => {
            clearError();
            setSent(false);
            setEmail(text);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Ionicons name="mail" size={18} color="#9CA3AF" />}
        />

        <Button
          title="Send Reset Link"
          onPress={handleReset}
          loading={loading}
          className="mt-2"
        />

        <TouchableOpacity
          onPress={navigateBack}
          className="mt-4 items-center"
        >
          <Text className="text-sage-accent text-sm">Back to Login</Text>
        </TouchableOpacity>

        <View style={{ height: 300 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
