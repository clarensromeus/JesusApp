import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function DevotionScreen() {
  const [currentDay, setCurrentDay] = useState(21);
  const [completedDays, setCompletedDays] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [selectedDevotional, setSelectedDevotional] = useState<{
    id: number;
    title: string;
    subtitle: string;
    content: string;
    verse: string;
    completed: boolean;
    category: string;
  } | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const progressPercentage = Math.round((completedDays / 21) * 100);
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progressPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);
  
  const devotionalContent = [
    {
      id: 1,
      title: "1 Rois services de Dieu, et appris de Jésus Christ pour la foi des élus de Dieu et la connaissance de la vérité qui est selon la piété.",
      subtitle: "Jour 1",
      content: "En espérance de la vie éternelle, que Dieu, qui ne peut mentir, a promise dès les plus anciens temps, et qu'il a manifestée en son temps par sa parole, dans la prédication qui m'a été confiée d'après l'ordre de Dieu notre Sauveur.",
      verse: "Tite 1:1-3",
      completed: true,
      category: "Foi"
    },
    {
      id: 2,
      title: "2 Soyons reconnaissants sur l'espérance de la vie éternelle que Dieu nous a promise.",
      subtitle: "Jour 2",
      content: "Car la grâce de Dieu, source de salut pour tous les hommes, a été manifestée. Elle nous enseigne à renoncer à l'impiété et aux convoitises mondaines, et à vivre dans le siècle présent selon la sagesse, la justice et la piété.",
      verse: "Tite 2:11-12",
      completed: true,
      category: "Grâce"
    },
    {
      id: 3,
      title: "3 Jésus manifestera son espérance de la vie éternelle que Dieu nous a promise.",
      subtitle: "Jour 3",
      content: "En attendant la bienheureuse espérance, et la manifestation de la gloire du grand Dieu et de notre Sauveur Jésus Christ, qui s'est donné lui-même pour nous, afin de nous racheter de toute iniquité.",
      verse: "Tite 2:13-14",
      completed: false,
      category: "Espérance"
    }
  ];
  
  const openDevotional = (devotional: {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    verse: string;
    completed: boolean;
    category: string;
  }) => {
    setSelectedDevotional(devotional);
    setShowModal(true);
  };
  
  const markAsCompleted = (id: number) => {
    if (completedDays < 21) {
      setCompletedDays(prev => prev + 1);
    }
  };
  
  const renderProgressCircle = () => {
    const animatedProgress = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: animatedProgress,
                }
              ]} 
            />
          </View>
          <View style={styles.progressContent}>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            <Text style={styles.progressLabel}>COMPLETE</Text>
          </View>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressDays}>{completedDays} JOURS COMPLÉTÉS</Text>
          <Text style={styles.progressTotal}>sur {currentDay} jours</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={['#FF9500', '#FF6B35'] as const}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Dévotion Quotidienne</Text>
                <Text style={styles.headerSubtitle}>Votre parcours spirituel</Text>
              </View>
            </View>
            
            {renderProgressCircle()}
          </View>
        </LinearGradient>
        
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF9500" />
            <Text style={[styles.statNumber, { color: textColor }]}>7</Text>
            <Text style={styles.statLabel}>Jours de suite</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color="#FF6B35" />
            <Text style={[styles.statNumber, { color: textColor }]}>{completedDays}</Text>
            <Text style={styles.statLabel}>Lectures</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#FF9500" />
            <Text style={[styles.statNumber, { color: textColor }]}>156</Text>
            <Text style={styles.statLabel}>Prières</Text>
          </View>
        </View>
        
        {/* Devotional List */}
        <View style={styles.devotionalContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Mes dévotions</ThemedText>
            <TouchableOpacity>
              <Text style={[styles.filterText, { color: tintColor }]}>Filtrer</Text>
            </TouchableOpacity>
          </View>
          
          {devotionalContent.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.devotionalCard}
              onPress={() => openDevotional(item)}
            >
              <View style={styles.devotionalLeft}>
                <View style={[
                  styles.devotionalIndicator, 
                  { backgroundColor: item.completed ? '#FF9500' : '#FF6B35' }
                ]}>
                  <Ionicons 
                    name={item.completed ? "checkmark" : "time"} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View style={styles.devotionalContent}>
                  <Text style={styles.devotionalSubtitle}>{item.subtitle}</Text>
                  <Text style={[styles.devotionalTitle, { color: textColor }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.devotionalMeta}>
                    <Text style={styles.devotionalVerse}>{item.verse}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
        
      </ScrollView>
      
      {/* Add New Devotional Button */}
      <TouchableOpacity style={styles.addButton}>
        <LinearGradient
          colors={['#FF9500', '#FF6B35'] as const}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Devotional Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>Dévotion</Text>
            <TouchableOpacity onPress={() => selectedDevotional && markAsCompleted(selectedDevotional.id)}>
              <Ionicons name="checkmark-circle" size={24} color="#FF9500" />
            </TouchableOpacity>
          </View>
          
          {selectedDevotional && (
            <ScrollView style={styles.modalContent}>
              <Text style={[styles.modalDevotionTitle, { color: textColor }]}>
                {selectedDevotional.title}
              </Text>
              <Text style={styles.modalVerse}>{selectedDevotional.verse}</Text>
              <Text style={[styles.modalDevotionContent, { color: textColor }]}>
                {selectedDevotional.content}
              </Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="bookmark-outline" size={20} color="#FF9500" />
                  <Text style={[styles.actionText, { color: '#FF9500' }]}>Sauvegarder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={20} color="#FF9500" />
                  <Text style={[styles.actionText, { color: '#FF9500' }]}>Partager</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={20} color="#FF9500" />
                  <Text style={[styles.actionText, { color: '#FF9500' }]}>Aimer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'Foi': return '#FF9500';
    case 'Grâce': return '#FF6B35';
    case 'Espérance': return '#FF8C42';
    default: return '#FFB366';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom: 100,
  },
  headerGradient: {
    // paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 120,
    height: 120,
    position: 'relative',
    marginBottom: 16,
  },
  progressBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'absolute',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 60,
  },
  progressContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  progressLabel: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressDays: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  progressTotal: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  devotionalContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  devotionalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  devotionalLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  devotionalIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  devotionalContent: {
    flex: 1,
  },
  devotionalSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  devotionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  devotionalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devotionalVerse: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 1000,
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDevotionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: 12,
  },
  modalVerse: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalDevotionContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});