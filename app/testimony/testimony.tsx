import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Testimony {
  id: string;
  details: string;
  domain: string;
  date: Date;
  author: string;
}

interface TestimonyCardProps {
  testimony: Testimony;
  onPress: () => void;
}

const TestimonyCard: React.FC<TestimonyCardProps> = ({ testimony, onPress }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.testimonyCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.domainBadge}>
          <Text style={styles.domainText}>{testimony.domain}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(testimony.date)}</Text>
      </View>
      <Text style={styles.detailsText} numberOfLines={3}>
        {testimony.details}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle" size={16} color="#666" />
          <Text style={styles.authorText}>{testimony.author}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );
};

export default function TestimonyScreen() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([
    {
      id: '1',
      details: 'God has been so faithful in my life. Through the challenges and victories, His love has never failed me. I am grateful for His grace and mercy.',
      domain: 'Faith',
      date: new Date('2024-01-15'),
      author: 'Sarah Johnson',
    },
    {
      id: '2',
      details: 'I was struggling with anxiety and depression, but through prayer and community support, I found peace and healing. God is truly amazing!',
      domain: 'Healing',
      date: new Date('2024-01-10'),
      author: 'Michael Chen',
    },
    {
      id: '3',
      details: 'After losing my job, I was worried about providing for my family. But God opened new doors and blessed me with an even better opportunity.',
      domain: 'Provision',
      date: new Date('2024-01-05'),
      author: 'David Rodriguez',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTestimony, setNewTestimony] = useState({
    details: '',
    domain: '',
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  const domains = ['Faith', 'Healing', 'Provision', 'Guidance', 'Protection', 'Breakthrough', 'Other'];

  const handleCreateTestimony = async () => {
    if (!newTestimony.details.trim() || !newTestimony.domain.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const testimony: Testimony = {
        id: Date.now().toString(),
        details: newTestimony.details,
        domain: newTestimony.domain,
        date: newTestimony.date,
        author: 'You', // In real app, this would come from user context
      };

      setTestimonies(prev => [testimony, ...prev]);
      setNewTestimony({ details: '', domain: '', date: new Date() });
      setModalVisible(false);
      setIsSubmitting(false);
      
      Alert.alert('Success', 'Your testimony has been shared!');
    }, 1000);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewTestimony(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Testimonies</Text>
        <Text style={styles.headerSubtitle}>Share God's goodness in your life</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {testimonies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart" size={64} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No Testimonies Yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to share how God has worked in your life
            </Text>
          </View>
        ) : (
          testimonies.map((testimony) => (
            <TestimonyCard
              key={testimony.id}
              testimony={testimony}
              onPress={() => {
                // Handle testimony detail view
                Alert.alert('Testimony', testimony.details);
              }}
            />
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Testimony Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Testimony</Text>
            <TouchableOpacity
              onPress={handleCreateTestimony}
              style={[styles.modalButton, styles.submitButton]}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Sharing...' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Domain *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.domainContainer}>
                  {domains.map((domain) => (
                    <TouchableOpacity
                      key={domain}
                      style={[
                        styles.domainChip,
                        newTestimony.domain === domain && styles.domainChipSelected,
                      ]}
                      onPress={() => setNewTestimony(prev => ({ ...prev, domain }))}
                    >
                      <Text
                        style={[
                          styles.domainChipText,
                          newTestimony.domain === domain && styles.domainChipTextSelected,
                        ]}
                      >
                        {domain}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.dateInputText}>
                  {formatDateForDisplay(newTestimony.date)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Testimony *</Text>
              <TextInput
                style={styles.textArea}
                value={newTestimony.details}
                onChangeText={(text) => setNewTestimony(prev => ({ ...prev, details: text }))}
                placeholder="Share how God has worked in your life..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {showDatePicker && (
            <DateTimePicker
              value={newTestimony.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  testimonyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  domainText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  detailsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#FF9500',
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  domainContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  domainChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    marginRight: 8,
  },
  domainChipSelected: {
    backgroundColor: '#FF9500',
  },
  domainChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  domainChipTextSelected: {
    color: 'white',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateInputText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 120,
  },
  bottomPadding: {
    height: 100,
  },
});