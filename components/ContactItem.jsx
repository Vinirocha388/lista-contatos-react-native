import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ContactItem = ({ contact, onEdit, onDelete }) => {
  return (
    <View style={styles.contactCard}>
      <View>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        <Text style={styles.contactCategory}>
          Categoria: {contact.category}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: "#E3E5EB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactPhone: {
    fontSize: 14,
    color: "#555",
  },
  contactCategory: {
    fontSize: 14,
    color: "#888",
  },
  actionButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default ContactItem;