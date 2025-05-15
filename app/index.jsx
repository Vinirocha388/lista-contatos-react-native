import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { FAB, Dialog, Portal, TextInput, Button, Provider } from "react-native-paper";
import ContactItem from '../components/ContactItem'; 

export default function ContactListScreen() {
  const [contacts, setContacts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCategory, setContactCategory] = useState("Pessoal");
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0.4))[0];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const handleSaveContact = () => {
    if (!contactName || !contactPhone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const newContact = { name: contactName, phone: contactPhone, category: contactCategory };

    if (editIndex === null) {
      setContacts([...contacts, newContact]);
    } else {
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = newContact;
      setContacts(updatedContacts);
      setEditIndex(null);
    }

    setContactName("");
    setContactPhone("");
    setContactCategory("Pessoal");
    setDialogVisible(false);
  };

  const handleDeleteContact = (index) => {
    Alert.alert("Excluir contato", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedContacts = contacts.filter((_, i) => i !== index);
          setContacts(updatedContacts);
        },
      },
    ]);
  };

  const handleEditContact = (index) => {
    setContactName(contacts[index].name);
    setContactPhone(contacts[index].phone);
    setContactCategory(contacts[index].category);
    setEditIndex(index);
    setDialogVisible(true);
  };

  const renderSkeleton = () => (
    <View>
      {/* Skeleton loading view can be added here if needed */}
    </View>
  );

  return (
    <Provider>
      <View style={styles.container}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <View>
            {contacts.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum contato adicionado ainda!</Text>
            ) : (
              contacts.map((contact, index) => (
                <ContactItem
                  key={index}
                  contact={contact}
                  onEdit={() => handleEditContact(index)}
                  onDelete={() => handleDeleteContact(index)}
                />
              ))
            )}
          </View>
        )}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setContactName("");
            setContactPhone("");
            setContactCategory("Pessoal");
            setEditIndex(null);
            setDialogVisible(true);
          }}
        />

        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title>
              {editIndex === null ? "Novo Contato" : "Editar Contato"}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nome"
                value={contactName}
                onChangeText={setContactName}
                style={styles.input}
                mode="outlined"
                color="#000"
              />
              <TextInput
                label="Telefone"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                style={styles.input}
                mode="outlined"
                color="#000"
              />
              <View style={styles.categoryContainer}>
                {["Pessoal", "Trabalho", "Família"].map((category) => (
                  <Button
                    key={category}
                    mode={contactCategory === category ? "contained" : "outlined"}
                    onPress={() => setContactCategory(category)}
                    style={styles.categoryButton}
                  >
                    {category}
                  </Button>
                ))}
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
              <Button onPress={handleSaveContact}>
                {editIndex === null ? "Salvar" : "Atualizar"}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#282D36",
  },
  emptyText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 32,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});