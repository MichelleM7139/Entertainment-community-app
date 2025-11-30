import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";

import { Profile, useCommunity } from "@/components/community-context";

const emptyProfile: Profile = {
  name: "",
  gender: "",
  age: "",
  occupation: "",
  experience: "",
  bio: "",
};

export default function ProfileScreen() {
  const { profile, updateProfile } = useCommunity();
  const [form, setForm] = useState<Profile>(profile ?? emptyProfile);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.age) {
      Alert.alert("Missing info", "Please fill at least your name and age.");
      return;
    }

    updateProfile(form);
    Alert.alert("Profile saved", "Your profile has been updated locally.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="e.g. Michelle Ma"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={form.gender}
        onChangeText={(text) => handleChange("gender", text)}
        placeholder="e.g. Female / Non-binary / Prefer not to say"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={form.age}
        onChangeText={(text) => handleChange("age", text)}
        placeholder="e.g. 21"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Occupation</Text>
      <TextInput
        style={styles.input}
        value={form.occupation}
        onChangeText={(text) => handleChange("occupation", text)}
        placeholder="e.g. Student / Dancer / Actor / Photographer"
      />

      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={form.experience}
        onChangeText={(text) => handleChange("experience", text)}
        placeholder="e.g. 3 years in hip-hop, 2 music videos..."
        multiline
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={form.bio}
        onChangeText={(text) => handleChange("bio", text)}
        placeholder="Short intro about yourself"
        multiline
      />

      <View style={styles.buttonWrapper}>
        <Button title="Save Profile" onPress={handleSave} />
      </View>

      {profile && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Current Saved Profile</Text>
          <Text style={styles.summaryText}>Name: {profile.name}</Text>
          <Text style={styles.summaryText}>Gender: {profile.gender}</Text>
          <Text style={styles.summaryText}>Age: {profile.age}</Text>
          <Text style={styles.summaryText}>
            Occupation: {profile.occupation}
          </Text>
          <Text style={styles.summaryText}>
            Experience: {profile.experience}
          </Text>
          <Text style={styles.summaryText}>Bio: {profile.bio}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  buttonWrapper: {
    marginTop: 16,
  },
  summaryCard: {
    marginTop: 24,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  summaryTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    marginTop: 2,
  },
});
