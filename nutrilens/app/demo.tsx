import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import {
  SortsMillGoudy_400Regular,
  SortsMillGoudy_400Regular_Italic,
} from "@expo-google-fonts/sorts-mill-goudy";
import { useFonts } from "expo-font";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Discover, NutrientDetail } from "../components/demo/Discover";
import { Home } from "../components/demo/Home";
import { Profile } from "../components/demo/Profile";
import { Routine } from "../components/demo/Routine";
import { JournalSheet } from "../components/demo/JournalTools";
import { useJournal, type Meal } from "../data/journal";
import { ui } from "../components/demo/ui";
import { Icon, type IconName } from "../components/ui/Icon";
import { type DemoNutrient } from "../data/demo";
import { demoColors as c, demoFonts as f, demoSpace as s } from "../theme/demo";

type Tab = "Home" | "Discover" | "Routine" | "Profile";
const tabs: { label: Tab; icon: IconName }[] = [
  { label: "Home", icon: "home" },
  { label: "Discover", icon: "explore" },
  { label: "Routine", icon: "calendar-today" },
  { label: "Profile", icon: "person" },
];

export default function DemoRoute() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    SortsMillGoudy_400Regular,
    SortsMillGoudy_400Regular_Italic,
  });
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const [tab, setTab] = useState<Tab>("Home");
  const [nutrient, setNutrient] = useState<DemoNutrient | null>(null);
  const journal = useJournal();
  const [sheet, setSheet] = useState<"meal" | "habit" | "focus" | null>(null);
  const [editMeal, setEditMeal] = useState<Meal | undefined>();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  function openSheet(mode: "meal" | "habit" | "focus") {
    // Release the launch button before hiding its subtree from web assistive tech.
    if (Platform.OS === "web")
      (document.activeElement as HTMLElement | null)?.blur?.();
    setSheet(mode);
  }
  function logMeal(meal?: Meal) {
    setEditMeal(meal);
    openSheet("meal");
  }
  function openRoutine(day?: string) {
    setSelectedDay(day && day !== journal.today ? day : null);
    navigate("Routine");
  }

  function navigate(next: Tab) {
    setTab(next);
    setNutrient(null);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  function openNutrient(next: DemoNutrient) {
    setNutrient(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  if ((!fontsLoaded && !fontError) || !journal.ready)
    return (
      <View style={[styles.root, styles.loading]}>
        <ActivityIndicator
          color={c.teal}
          accessibilityLabel="Loading VitaPal"
        />
      </View>
    );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {journal.storageError ? (
        <Text accessibilityRole="alert" style={[ui.small, { padding: s.md }]}>
          {journal.storageError}
        </Text>
      ) : null}
      <View
        style={{ flex: 1 }}
        aria-hidden={Boolean(sheet)}
        importantForAccessibility={sheet ? "no-hide-descendants" : "auto"}
      >
        <ScrollView
          ref={scroll}
          contentContainerStyle={ui.page}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {nutrient ? (
            <NutrientDetail
              key={nutrient.id}
              nutrient={nutrient}
              onBack={() => navigate(tab)}
              tasks={journal.tasks}
              onAdd={journal.addCustomTask}
            />
          ) : (
            <>
              {tab === "Home" && (
                <Home
                  journal={journal}
                  onNutrient={openNutrient}
                  onDiscover={() => navigate("Discover")}
                  onProfile={() => navigate("Profile")}
                  onRoutine={openRoutine}
                  onLog={logMeal}
                  onFocus={() => openSheet("focus")}
                  onHabit={() => openSheet("habit")}
                />
              )}
              {tab === "Discover" && <Discover onNutrient={openNutrient} />}
              {tab === "Routine" && (
                <Routine
                  journal={journal}
                  selected={selectedDay ?? journal.today}
                  onSelect={(day) =>
                    setSelectedDay(day === journal.today ? null : day)
                  }
                  onHabit={() => openSheet("habit")}
                />
              )}

              {tab === "Profile" && (
                <Profile
                  name={journal.name}
                  setName={journal.setName}
                  showPal={journal.showPal}
                  setShowPal={journal.setShowPal}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
      {sheet && (
        <JournalSheet
          key={`${sheet}-${editMeal?.id ?? "new"}`}
          mode={sheet}
          meal={sheet === "meal" ? editMeal : undefined}
          journal={journal}
          onClose={() => setSheet(null)}
        />
      )}
      <View
        aria-hidden={Boolean(sheet)}
        importantForAccessibility={sheet ? "no-hide-descendants" : "auto"}
        accessibilityRole="tablist"
        style={[styles.nav, { paddingBottom: Math.max(insets.bottom, s.sm) }]}
      >
        {tabs.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            aria-selected={tab === item.label}
            accessibilityState={{ selected: tab === item.label }}
            onPress={() =>
              item.label === "Routine" ? openRoutine() : navigate(item.label)
            }
            style={({ pressed }) => [styles.tab, pressed && ui.pressed]}
          >
            <View
              style={[styles.navIcon, tab === item.label && styles.navActive]}
            >
              <Icon
                name={item.icon}
                size={22}
                color={tab === item.label ? c.teal : c.muted}
              />
            </View>
            <Text
              style={[styles.navLabel, tab === item.label && { color: c.teal }]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  loading: { justifyContent: "center", alignItems: "center" },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: c.line,
    backgroundColor: c.background,
    paddingTop: s.sm,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: s.xs,
  },
  navIcon: {
    width: 48,
    height: 29,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  navActive: { backgroundColor: c.tealWash },
  navLabel: { fontFamily: f.medium, fontSize: 10, color: c.muted },
});
