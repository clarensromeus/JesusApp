import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItemProps {
  icon: string;
  title: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  hasArrow?: boolean;
  onPress?: () => void;
  subtitle?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  hasArrow = false,
  onPress,
  subtitle,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color="#4285F4" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {hasSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E5E5E5', true: '#FF9500' }}
            thumbColor={switchValue ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E5E5E5"
          />
        )}
        {hasArrow && (
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );
};

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(true);
  const [facebookLinked, setFacebookLinked] = useState(false);
  const [appleLinked, setAppleLinked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    router.back();
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    setLanguageModalVisible(false);
  };

  const getSelectedLanguageName = () => {
    const language = languages.find(lang => lang.code === selectedLanguage);
    return language ? `${language.flag} ${language.name}` : 'English';
  };

  return (
    <SafeAreaView style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Section>
          <SettingItem
            icon="notifications-outline"
            title={t('settings.notification')}
            hasSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="location-outline"
            title={t('settings.location')}
            hasArrow
            onPress={() => console.log('Location pressed')}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="language-outline"
            title={t('settings.language')}
            subtitle={getSelectedLanguageName()}
            hasArrow
            onPress={() => setLanguageModalVisible(true)}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="moon-outline"
            title={t('settings.darkMode')}
            hasSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="mail-outline"
            title={t('settings.contactUs')}
            hasArrow
            onPress={() => console.log('Contact Us pressed')}
          />
        </Section>

        <Section title={t('settings.linkedAccount')}>
          <SettingItem
            icon="logo-google"
            title="Google"
            hasSwitch
            switchValue={googleLinked}
            onSwitchChange={setGoogleLinked}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="logo-facebook"
            title="Facebook"
            hasSwitch
            switchValue={facebookLinked}
            onSwitchChange={setFacebookLinked}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="logo-apple"
            title="Apple"
            hasSwitch
            switchValue={appleLinked}
            onSwitchChange={setAppleLinked}
          />
        </Section>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity
                onPress={() => setLanguageModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.code && styles.selectedLanguageOption
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={[
                  styles.languageName,
                  selectedLanguage === language.code && styles.selectedLanguageName
                ]}>
                  {language.name}
                </Text>
                {selectedLanguage === language.code && (
                  <Ionicons name="checkmark" size={20} color="#FF9500" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginLeft: 60,
  },
  titleContainer: {
    flex: 1,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedLanguageOption: {
    backgroundColor: '#FFF3E0',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  selectedLanguageName: {
    color: '#FF9500',
    fontWeight: '500',
  },
});