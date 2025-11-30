import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  Button,
  Alert,
} from "react-native";

type Post = {
  id: string;
  title: string;
  role: string;
  rehearsalTime: string;
  shootTime: string;
  compensation: string;
  foodProvided: boolean;
  address: string;
  description: string;
  createdAt: string;
};

export default function RecruitmentScreen() {
  const [form, setForm] = useState({
    title: "",
    role: "",
    rehearsalTime: "",
    shootTime: "",
    compensation: "",
    foodProvided: false,
    address: "",
    description: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreatePost = () => {
    if (!form.title || !form.role || !form.shootTime) {
      Alert.alert(
        "Missing info",
        "Please fill at least title, role, and shoot time."
      );
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);

    // reset form
    setForm({
      title: "",
      role: "",
      rehearsalTime: "",
      shootTime: "",
      compensation: "",
      foodProvided: false,
      address: "",
      description: "",
    });

    Alert.alert(
      "Post created",
      "Your opportunity has been posted locally on this device."
    );

    // 💬 Later: here is where we will also create a group chat for this project.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Recruitment Post</Text>

      <Text style={styles.label}>Project Title</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => handleChange("title", text)}
        placeholder="e.g. Music Video - Street Style"
      />

      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        value={form.role}
        onChangeText={(text) => handleChange("role", text)}
        placeholder="e.g. Background dancer / Videographer / Actor"
      />

      <Text style={styles.label}>Rehearsal Time</Text>
      <TextInput
        style={styles.input}
        value={form.rehearsalTime}
        onChangeText={(text) => handleChange("rehearsalTime", text)}
        placeholder="e.g. Dec 12, 7–10pm"
      />

      <Text style={styles.label}>Shoot Time</Text>
      <TextInput
        style={styles.input}
        value={form.shootTime}
        onChangeText={(text) => handleChange("shootTime", text)}
        placeholder="e.g. Dec 15, 2–8pm"
      />

      <Text style={styles.label}>Compensation</Text>
      <TextInput
        style={styles.input}
        value={form.compensation}
        onChangeText={(text) => handleChange("compensation", text)}
        placeholder="e.g. $150/day + credits"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Food / Drink Provided</Text>
        <Switch
          value={form.foodProvided}
          onValueChange={(value) => handleChange("foodProvided", value)}
        />
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
        placeholder="e.g. 123 Queen St W, Toronto"
      />

      <Text style={styles.label}>Description / Notes</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        placeholder="Any extra info (wardrobe, vibe, requirements...)"
        multiline
      />

      <View style={styles.buttonWrapper}>
        <Button title="Post Opportunity" onPress={handleCreatePost} />
      </View>

      <Text style={[styles.title, { marginTop: 24 }]}>Your Local Posts</Text>
      {posts.length === 0 && (
        <Text style={{ color: "#666", marginTop: 4 }}>
          No posts yet. Create your first recruitment above.
        </Text>
      )}

      {posts.map((post) => (
        <View key={post.id} style={styles.card}>
          <Text style={styles.cardTitle}>{post.title}</Text>
          <Text style={styles.cardSubtitle}>Role: {post.role}</Text>
          <Text style={styles.cardText}>Rehearsal: {post.rehearsalTime}</Text>
          <Text style={styles.cardText}>Shoot: {post.shootTime}</Text>
          <Text style={styles.cardText}>
            Compensation: {post.compensation || "Not specified"}
          </Text>
          <Text style={styles.cardText}>
            Food/Drink: {post.foodProvided ? "Provided" : "Not specified"}
          </Text>
          <Text style={styles.cardText}>Address: {post.address}</Text>
          {post.description ? (
            <Text style={styles.cardText}>Notes: {post.description}</Text>
          ) : null}
        </View>
      ))}
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  card: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  cardText: {
    fontSize: 13,
    marginTop: 4,
  },
});
