import { router } from "expo-router";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import {
  demoColors as c,
  demoFonts as f,
  demoSpace as s,
} from "../../theme/demo";
import { Pal } from "./Pal";
import { Action, Eyebrow, ui } from "./ui";

export function Profile({
  name,
  setName,
  showPal,
  setShowPal,
}: {
  name: string;
  setName: (name: string) => void;
  showPal: boolean;
  setShowPal: (value: boolean) => void;
}) {
  return (
    <>
      <View style={ui.stack}>
        <Eyebrow>Your little corner</Eyebrow>
        <Text style={ui.title}>
          Make yourself{"\n"}
          <Text style={{ fontFamily: f.italic, color: c.roseInk }}>
            at home.
          </Text>
        </Text>
      </View>
      <View style={styles.pal}>
        <Pal size={120} />
        <Text style={ui.heading}>{name.trim() || "Your"}’s VitaPal</Text>
        <Text style={ui.body}>Here for the little everyday wins.</Text>
      </View>
      <View style={ui.card}>
        <Text style={ui.label}>What should we call you?</Text>
        <TextInput
          accessibilityLabel="Your name"
          value={name}
          onChangeText={setName}
          maxLength={24}
          placeholder="Your name"
          placeholderTextColor={c.muted}
          style={styles.input}
        />
        <Text style={ui.small}>This is how we’ll greet you on Home.</Text>
      </View>
      <View style={[ui.card, ui.row]}>
        <View style={{ flex: 1, gap: s.xs }}>
          <Text style={ui.label}>A little company</Text>
          <Text style={ui.small}>Show your pal on Home</Text>
        </View>
        <Switch
          accessibilityLabel="Show your pal on Home"
          value={showPal}
          onValueChange={setShowPal}
          trackColor={{ false: c.line, true: c.teal }}
          thumbColor={c.surface}
        />
      </View>
      <View style={ui.stack}>
        <Eyebrow>Your journal, with you</Eyebrow>
        <Text style={ui.body}>
          Your meals, habits, daily history, and preferences are saved on this
          device. They’ll be here when you come back. There’s no account or
          cross-device sync.
        </Text>
        <Action
          label="Open the original app"
          secondary
          onPress={() => router.push("/")}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  pal: {
    alignItems: "center",
    backgroundColor: c.sage,
    borderRadius: 24,
    padding: s.lg,
    gap: s.sm,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: c.line,
    paddingVertical: s.md,
    fontFamily: f.heading,
    fontSize: 26,
    color: c.ink,
    minHeight: 50,
  },
});
