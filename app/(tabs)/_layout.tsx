import { Tabs } from 'expo-router';
import { CalendarCheck2, ChartNoAxesCombined, Plus, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ size, color }) => <CalendarCheck2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Manage',
          tabBarIcon: ({ size, color }) => <Plus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Views',
          tabBarIcon: ({ size, color }) => <ChartNoAxesCombined size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
