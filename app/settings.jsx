import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [missedCallsNotifications, setMissedCallsNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0.4))[0];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem("appSettings");
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          setDarkMode(parsedSettings.darkMode || false);
          setNotificationsEnabled(parsedSettings.notificationsEnabled !== false);
          setMissedCallsNotifications(parsedSettings.missedCallsNotifications !== false);
          setAutoSync(parsedSettings.autoSync !== false);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // Simula atraso para o skeleton
      }
    };

    loadSettings();

    // Animação de pulsação para o skeleton
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

  const saveSettings = async (key, value) => {
    try {
      const settings = await AsyncStorage.getItem("appSettings") || "{}";
      const parsedSettings = JSON.parse(settings);
      const updatedSettings = { ...parsedSettings, [key]: value };
      await AsyncStorage.setItem("appSettings", JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    saveSettings("darkMode", value);
  };

  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    saveSettings("notificationsEnabled", value);
    if (!value) {
      setMissedCallsNotifications(false);
      saveSettings("missedCallsNotifications", false);
    }
  };

  const handleMissedCallsToggle = (value) => {
    setMissedCallsNotifications(value);
    saveSettings("missedCallsNotifications", value);
  };

  const handleAutoSyncToggle = (value) => {
    setAutoSync(value);
    saveSettings("autoSync", value);
  };

  const handleResetApp = () => {
    Alert.alert(
      "Redefinir Aplicativo",
      "Tem certeza que deseja redefinir o aplicativo? Todos os contatos e configurações serão excluídos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Redefinir",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                "Sucesso",
                "Aplicativo redefinido com sucesso. Reinicie o aplicativo para aplicar as alterações.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Erro ao redefinir o aplicativo:", error);
              Alert.alert("Erro", "Não foi possível redefinir o aplicativo.");
            }
          },
        },
      ]
    );
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const renderSkeleton = () => (
    <ScrollView>
      <Animated.View style={[styles.skeletonTitle, theme.skeleton, { opacity: fadeAnim }]} />
      {[...Array(3)].map((_, index) => (
        <Animated.View key={index} style={[styles.skeletonSection, theme.skeletonSection, { opacity: fadeAnim }]}>
          <View style={styles.skeletonSectionTitle} />
          {[...Array(index === 1 ? 2 : 1)].map((_, rowIndex) => (
            <View key={rowIndex} style={styles.skeletonRow}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonSwitch} />
            </View>
          ))}
        </Animated.View>
      ))}
      <Animated.View style={[styles.skeletonSection, theme.skeletonSection, { opacity: fadeAnim }]}>
        <View style={styles.skeletonSectionTitle} />
        {[...Array(3)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.skeletonRow}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonChevron} />
          </View>
        ))}
      </Animated.View>
      <Animated.View style={[styles.skeletonFooter, theme.skeleton, { opacity: fadeAnim }]} />
    </ScrollView>
  );

  return (
    <View style={[styles.container, theme.container]}>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <ScrollView>
          <Text style={[styles.title, theme.title]}>Configurações</Text>

          <View style={[styles.section, theme.section]}>
            <Text style={[styles.sectionTitle, theme.text]}>Aparência</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name={darkMode ? "moon" : "sunny"}
                  size={24}
                  color={darkMode ? "#BB86FC" : "#FFA000"}
                />
                <Text style={[styles.settingText, theme.text]}>Modo Escuro</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: "#767577", true: "#BB86FC" }}
                thumbColor={darkMode ? "#6200EE" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={[styles.section, theme.section]}>
            <Text style={[styles.sectionTitle, theme.text]}>Notificações</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="notifications"
                  size={24}
                  color={notificationsEnabled ? (darkMode ? "#BB86FC" : "#4CAF50") : theme.iconDisabled.color}
                />
                <Text style={[styles.settingText, theme.text]}>Ativar Notificações</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: "#767577", true: darkMode ? "#BB86FC" : "#4CAF50" }}
                thumbColor={notificationsEnabled ? (darkMode ? "#6200EE" : "#007F00") : "#f4f3f4"}
              />
            </View>
            <View style={[styles.settingRow, !notificationsEnabled && styles.disabled]}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="call"
                  size={24}
                  color={
                    notificationsEnabled && missedCallsNotifications
                      ? darkMode
                        ? "#BB86FC"
                        : "#2196F3"
                      : theme.iconDisabled.color
                  }
                />
                <Text
                  style={[styles.settingText, theme.text, !notificationsEnabled && theme.textDisabled]}
                >
                  Chamadas Perdidas
                </Text>
              </View>
              <Switch
                value={missedCallsNotifications}
                onValueChange={handleMissedCallsToggle}
                disabled={!notificationsEnabled}
                trackColor={{ false: "#767577", true: darkMode ? "#BB86FC" : "#2196F3" }}
                thumbColor={missedCallsNotifications ? (darkMode ? "#6200EE" : "#0069C0") : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={[styles.section, theme.section]}>
            <Text style={[styles.sectionTitle, theme.text]}>Sincronização</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="sync"
                  size={24}
                  color={autoSync ? (darkMode ? "#BB86FC" : "#673AB7") : theme.iconDisabled.color}
                />
                <Text style={[styles.settingText, theme.text]}>Sincronização Automática</Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={handleAutoSyncToggle}
                trackColor={{ false: "#767577", true: darkMode ? "#BB86FC" : "#673AB7" }}
                thumbColor={autoSync ? (darkMode ? "#6200EE" : "#4A148C") : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={[styles.section, theme.section]}>
            <Text style={[styles.sectionTitle, theme.text]}>Informações</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => setAboutModalVisible(true)}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle" size={24} color={darkMode ? "#BB86FC" : "#009688"} />
                <Text style={[styles.settingText, theme.text]}>Sobre o App</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text.color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoButton} onPress={() => setPrivacyModalVisible(true)}>
              <View style={styles.settingInfo}>
                <Ionicons name="shield-checkmark" size={24} color={darkMode ? "#BB86FC" : "#F44336"} />
                <Text style={[styles.settingText, theme.text]}>Política de Privacidade</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.text.color} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.infoButton, styles.resetButton]} onPress={handleResetApp}>
              <View style={styles.settingInfo}>
                <Ionicons name="refresh-circle" size={24} color="#F44336" />
                <Text style={[styles.settingText, { color: "#F44336" }]}>Redefinir Aplicativo</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, theme.footerText]}>Contatos App v1.0.0</Text>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={aboutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, theme.title]}>Sobre o App</Text>
              <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text.color} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalLogo}>
              <Ionicons name="people-circle" size={80} color={darkMode ? "#BB86FC" : "#6200EE"} />
            </View>
            <Text style={[styles.modalText, theme.text]}>
              Contatos App é um aplicativo para gerenciar seus contatos pessoais, de trabalho e familiares.
            </Text>
            <Text style={[styles.modalText, theme.text]}>Versão: 1.0.0</Text>
            <Text style={[styles.modalText, theme.text]}>
              Desenvolvido por: Vinícius Rocha SENAI-Valinhos-SP
            </Text>
            <Text style={[styles.modalText, theme.text]}>© 2025 Todos os direitos reservados.</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={privacyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, theme.title]}>Política de Privacidade</Text>
              <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text.color} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.privacyScroll}>
              <Text style={[styles.modalText, theme.text]}>
                Este aplicativo respeita sua privacidade e protege seus dados pessoais.
              </Text>
              <Text style={[styles.modalSubtitle, theme.text]}>1. Coleta de Dados</Text>
              <Text style={[styles.modalText, theme.text]}>
                Os contatos são armazenados apenas localmente no seu dispositivo.
                Não enviamos seus contatos para nenhum servidor remoto.
              </Text>
              <Text style={[styles.modalSubtitle, theme.text]}>2. Permissões</Text>
              <Text style={[styles.modalText, theme.text]}>
                Solicitamos permissão para enviar notificações para alertá-lo sobre chamadas perdidas.
              </Text>
              <Text style={[styles.modalSubtitle, theme.text]}>3. Segurança</Text>
              <Text style={[styles.modalText, theme.text]}>
                Seus dados são protegidos e não são compartilhados com terceiros.
              </Text>
              <Text style={[styles.modalSubtitle, theme.text]}>4. Contato</Text>
              <Text style={[styles.modalText, theme.text]}>
                Para dúvidas sobre privacidade, entre em contato pelo email: vinicius.a.rocha8@aluno.senai.br
              </Text>
              <Text style={[styles.modalText, styles.lastText, theme.text]}>
                Última atualização: 15 de maio de 2025
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const lightTheme = {
  container: { backgroundColor: "#f5f5f5" },
  title: { color: "#333" },
  section: { backgroundColor: "#fff" },
  text: { color: "#333" },
  textDisabled: { color: "#9e9e9e" },
  iconDisabled: { color: "#9e9e9e" },
  modalContent: { backgroundColor: "#fff" },
  footerText: { color: "#757575" },
  skeleton: { backgroundColor: "#e0e0e0" },
  skeletonSection: { backgroundColor: "#e8e8e8" },
};

const darkTheme = {
  container: { backgroundColor: "#121212" },
  title: { color: "#f5f5f5" },
  section: { backgroundColor: "#1e1e1e" },
  text: { color: "#f5f5f5" },
  textDisabled: { color: "#616161" },
  iconDisabled: { color: "#616161" },
  modalContent: { backgroundColor: "#1e1e1e" },
  footerText: { color: "#757575" },
  skeleton: { backgroundColor: "#2a2a2a" },
  skeletonSection: { backgroundColor: "#333333" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  resetButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: "center",
    marginVertical: 16,
  },
  footerText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalLogo: {
    alignItems: "center",
    marginVertical: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  privacyScroll: {
    maxHeight: 400,
  },
  lastText: {
    marginBottom: 40,
  },
  skeletonTitle: {
    width: 150,
    height: 28,
    borderRadius: 4,
    marginBottom: 24,
    alignSelf: "center",
    marginTop: 8,
  },
  skeletonSection: {
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
  },
  skeletonSectionTitle: {
    width: 100,
    height: 18,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: "#4a4f57",
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4a4f57",
  },
  skeletonText: {
    flex: 1,
    height: 16,
    borderRadius: 4,
    marginLeft: 12,
    backgroundColor: "#4a4f57",
  },
  skeletonSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4a4f57",
  },
  skeletonChevron: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#4a4f57",
  },
  skeletonFooter: {
    width: 120,
    height: 14,
    borderRadius: 4,
    alignSelf: "center",
    marginVertical: 16,
  },
});