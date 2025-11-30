import React, { useEffect, useMemo, useState } from "react";
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

import { useCommunity } from "@/components/community-context";

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
  invitedTalent: string;
  confirmed: boolean;
  chatId?: string;
  createdAt: string;
};

type GroupChat = {
  id: string;
  projectId: string;
  name: string;
  scheduledFor: string;
  members: string[];
  createdAt: string;
};

export default function RecruitmentScreen() {
  const { profile } = useCommunity();
  const organizerName = profile?.name || "Organizer";
  const organizerOccupation = profile?.occupation || "Recruiter";

  const [form, setForm] = useState({
    title: "",
    role: "",
    rehearsalTime: "",
    shootTime: "",
    compensation: "",
    foodProvided: false,
    address: "",
    description: "",
    invitedTalent: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setPosts((existing) =>
      existing.map((post) =>
        post.confirmed
          ? post
          : {
              ...post,
              invitedTalent: post.invitedTalent || profile.name,
            }
      )
    );
  }, [profile]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      role: "",
      rehearsalTime: "",
      shootTime: "",
      compensation: "",
      foodProvided: false,
      address: "",
      description: "",
      invitedTalent: "",
    });
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
      confirmed: false,
      createdAt: new Date().toISOString(),
    } as Post;

    setPosts((prev) => [newPost, ...prev]);
    resetForm();

    Alert.alert(
      "Post created",
      "Your opportunity has been posted locally on this device."
    );
  };

  const buildChatMembers = (post: Post) => {
    const invited = post.invitedTalent
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    const members = [organizerName, ...invited];

    return members.length ? members : ["Organizer"];
  };

  const confirmRecruitment = (postId: string) => {
    setPosts((prev) => {
      const target = prev.find((post) => post.id === postId);

      if (!target) return prev;

      const chat: GroupChat = {
        id: `chat-${postId}`,
        projectId: postId,
        name: `${target.title} • Project Chat`,
        scheduledFor: target.rehearsalTime || target.shootTime || "Schedule TBC",
        members: buildChatMembers(target),
        createdAt: new Date().toISOString(),
      };

      setGroupChats((existing) => [chat, ...existing.filter((c) => c.projectId !== postId)]);

      Alert.alert(
        "Group chat ready",
        `${chat.name} created with ${chat.members.length} people."
      );

      return prev.map((post) =>
        post.id === postId ? { ...post, confirmed: true, chatId: chat.id } : post
      );
    });
  };

  const activeChatsById = useMemo(
    () => Object.fromEntries(groupChats.map((chat) => [chat.projectId, chat])),
    [groupChats]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Recruitment Post</Text>

      <View style={styles.organizerCard}>
        <Text style={styles.organizerLabel}>Organizer</Text>
        <Text style={styles.organizerName}>{organizerName}</Text>
        <Text style={styles.organizerSubtitle}>{organizerOccupation}</Text>
        <Text style={styles.organizerHelper}>
          These details will be shown as the contact in group chats once you confirm a
          project.
        </Text>
      </View>

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

      <Text style={styles.label}>People confirmed for this project</Text>
      <TextInput
        style={styles.input}
        value={form.invitedTalent}
        onChangeText={(text) => handleChange("invitedTalent", text)}
        placeholder="Comma-separated: Jamie (DP), Alex (dancer), Jordan"
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

      {posts.map((post) => {
        const chat = post.chatId ? activeChatsById[post.id] : undefined;
        return (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{post.title}</Text>
                <Text style={styles.cardSubtitle}>Role: {post.role}</Text>
              </View>
              <Text style={[styles.statusChip, post.confirmed ? styles.statusConfirmed : styles.statusPending]}>
                {post.confirmed ? "Confirmed" : "Draft"}
              </Text>
            </View>
            <Text style={styles.cardText}>Rehearsal: {post.rehearsalTime || "TBC"}</Text>
            <Text style={styles.cardText}>Shoot: {post.shootTime}</Text>
            <Text style={styles.cardText}>
              Compensation: {post.compensation || "Not specified"}
            </Text>
            <Text style={styles.cardText}>
              Food/Drink: {post.foodProvided ? "Provided" : "Not specified"}
            </Text>
            <Text style={styles.cardText}>Address: {post.address || "Not provided"}</Text>
            {post.description ? (
              <Text style={styles.cardText}>Notes: {post.description}</Text>
            ) : null}
            {post.invitedTalent ? (
              <Text style={styles.cardText}>
                Added to chat: {post.invitedTalent.split(",").map((name) => name.trim()).join(", ")}
              </Text>
            ) : null}

            {!post.confirmed && (
              <View style={styles.buttonRow}>
                <Button title="Confirm project & create chat" onPress={() => confirmRecruitment(post.id)} />
              </View>
            )}

            {chat && (
              <View style={styles.chatSummary}>
                <Text style={styles.chatTitle}>{chat.name}</Text>
                <Text style={styles.chatMeta}>When: {chat.scheduledFor}</Text>
                <Text style={styles.chatMeta}>Members: {chat.members.join(", ")}</Text>
              </View>
            )}
          </View>
        );
      })}

      <Text style={[styles.title, { marginTop: 24 }]}>Group Chats</Text>
      {groupChats.length === 0 && (
        <Text style={{ color: "#666", marginTop: 4 }}>
          Confirm a post to automatically spin up a project chat with everyone.
        </Text>
      )}
      {groupChats.map((chat) => (
        <View key={chat.id} style={styles.chatCard}>
          <Text style={styles.chatTitle}>{chat.name}</Text>
          <Text style={styles.chatMeta}>Schedule: {chat.scheduledFor}</Text>
          <Text style={styles.chatMeta}>Members: {chat.members.join(", ")}</Text>
          <Text style={styles.chatMeta}>
            Created: {new Date(chat.createdAt).toLocaleString()}
          </Text>
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
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
  statusChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  statusPending: {
    backgroundColor: "#fff6e5",
    color: "#b26a00",
  },
  statusConfirmed: {
    backgroundColor: "#e8f9f1",
    color: "#0a8f5d",
  },
  buttonRow: {
    marginTop: 8,
  },
  chatSummary: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  chatTitle: {
    fontWeight: "700",
    fontSize: 14,
  },
  chatMeta: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  chatCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0e4ff",
  },
  organizerCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  organizerLabel: {
    fontSize: 12,
    color: "#666",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  organizerSubtitle: {
    fontSize: 13,
    color: "#555",
  },
  organizerHelper: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
});
