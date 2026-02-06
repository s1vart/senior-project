import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../../components/PlantPhoto";
import { TextField } from "../../../../components/ui/TextField";
import { Toggle } from "../../../../components/ui/Toggle";
import { Card } from "../../../../components/ui/Card";
import { mockPlants } from "../../../../data/mockPlants";

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = mockPlants.find((p) => p.id === id);

  const [nickname, setNickname] = useState(plant?.nickname ?? "");
  const [plantType, setPlantType] = useState(plant?.commonName ?? "");
  const [lastWatered, setLastWatered] = useState(plant?.lastWatered ?? "");
  const [directSunlight, setDirectSunlight] = useState(
    plant?.directSunlight ?? false
  );
  const [sunlightHours, setSunlightHours] = useState(
    plant?.sunlightHours?.toString() ?? ""
  );
  const [distanceFromWindow, setDistanceFromWindow] = useState(
    plant?.distanceFromWindow?.toString() ?? ""
  );
  const [windowOrientation, setWindowOrientation] = useState(
    plant?.windowOrientation ?? ""
  );

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-white text-lg">Plant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Edit Plant Details
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-violet-accent font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <View className="items-center mb-6">
          <PlantPhoto uri={plant.photoUrl} size={100} />
          {plant.completionPercent !== undefined && (
            <Text className="text-violet-light text-sm font-semibold mt-2">
              {plant.completionPercent}% Complete
            </Text>
          )}
        </View>

        <TextField
          label="Name"
          value={nickname}
          onChangeText={setNickname}
          placeholder="Plant nickname"
          icon={<Ionicons name="pencil" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Plant Type"
          value={plantType}
          onChangeText={setPlantType}
          placeholder="e.g. Bredasdorp Gasteria"
          icon={<Ionicons name="leaf" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Last Watered On"
          value={lastWatered}
          onChangeText={setLastWatered}
          placeholder="YYYY-MM-DD"
          icon={<Ionicons name="calendar" size={18} color="#9CA3AF" />}
        />

        <Card className="mt-2">
          <View className="flex-row items-center mb-3">
            <Ionicons name="sunny" size={20} color="#EAB308" />
            <Text className="text-white text-lg font-semibold ml-2">Light</Text>
          </View>

          <Toggle
            label="Direct Sunlight?"
            value={directSunlight}
            onValueChange={setDirectSunlight}
          />

          <TextField
            label="Hours of Direct Sunlight"
            value={sunlightHours}
            onChangeText={setSunlightHours}
            placeholder="e.g. 4"
            keyboardType="numeric"
            icon={<Ionicons name="time" size={18} color="#9CA3AF" />}
          />

          <TextField
            label="Distance from Window"
            value={distanceFromWindow}
            onChangeText={setDistanceFromWindow}
            placeholder="e.g. 2.0 ft"
            keyboardType="numeric"
            icon={<Ionicons name="resize" size={18} color="#9CA3AF" />}
          />

          <TextField
            label="Window Orientation"
            value={windowOrientation}
            onChangeText={setWindowOrientation}
            placeholder="e.g. South"
            icon={<Ionicons name="compass" size={18} color="#9CA3AF" />}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
