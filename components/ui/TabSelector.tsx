import { View, Text, TouchableOpacity } from "react-native";

interface TabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <View className="flex-row bg-dark-card rounded-xl p-1">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`flex-1 py-2 rounded-lg items-center ${
            activeTab === tab ? "bg-violet-accent" : ""
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-sm font-semibold ${
              activeTab === tab ? "text-white" : "text-gray-text"
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
