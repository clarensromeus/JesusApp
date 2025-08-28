import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'digital' | 'bank';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isSelected: boolean;
}

interface DonationAmount {
  id: string;
  amount: number;
  label: string;
  isPopular?: boolean;
}

export default function GiveScreen() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'offering' | 'tithe' | 'other'>('offering');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const donationAmounts: DonationAmount[] = [
    { id: '1', amount: 25, label: '$25' },
    { id: '2', amount: 50, label: '$50', isPopular: true },
    { id: '3', amount: 100, label: '$100' },
    { id: '4', amount: 250, label: '$250' },
  ];
  
  const donationTypes = [
    { id: 'offering', name: 'Offrande', color: '#FF9500', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'tithe', name: 'Dîme', color: '#FF6B35', icon: 'leaf' as keyof typeof Ionicons.glyphMap },
    { id: 'mission', name: 'Moisson', color: '#FFB366', icon: 'globe' as keyof typeof Ionicons.glyphMap },
    { id: 'other', name: 'Autre', color: '#FF8C42', icon: 'gift' as keyof typeof Ionicons.glyphMap },
  ];
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const selectPaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isSelected: method.id === methodId
    })));
  };
  
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };
  
  const getCurrentAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount) || 0;
    return 0;
  };
  
  const handleDonate = () => {
    const amount = getCurrentAmount();
    const selectedPayment = paymentMethods.find(method => method.isSelected);
    
    if (amount <= 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner un montant valide.');
      return;
    }
    
    if (!selectedPayment) {
      Alert.alert('Erreur', 'Veuillez sélectionner une méthode de paiement.');
      return;
    }
    
    Alert.alert(
      'Confirmation',
      `Confirmer le don de $${amount} via ${selectedPayment.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => processDonation(amount, selectedPayment) }
      ]
    );
  };
  
  const processDonation = (amount: number, paymentMethod: PaymentMethod) => {
    // Simulate donation processing
    Alert.alert(
      'Merci!',
      `Votre don de $${amount} a été traité avec succès. Que Dieu vous bénisse!`,
      [{ text: 'OK' }]
    );
  };
  
  const renderDonationType = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.donationTypeScrollView}
        contentContainerStyle={styles.donationTypeContainer}
      >
        {donationTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.donationTypeChip,
              donationType === type.id && {
                backgroundColor: type.color,
                borderColor: type.color,
              }
            ]}
            onPress={() => setDonationType(type.id as any)}
          >
            <Ionicons 
              name={type.icon} 
              size={16} 
              color={donationType === type.id ? 'white' : type.color} 
            />
            <Text style={[
              styles.donationTypeText,
              { color: donationType === type.id ? 'white' : type.color }
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  const renderAmountSelection = () => {
    return (
      <View style={styles.amountSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Montant</ThemedText>
        
        <View style={styles.amountGrid}>
          {donationAmounts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.amountCard,
                selectedAmount === item.amount && styles.amountCardSelected,
                item.isPopular && styles.popularAmount
              ]}
              onPress={() => handleAmountSelect(item.amount)}
            >
              {item.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Populaire</Text>
                </View>
              )}
              <Text style={[
                styles.amountText,
                selectedAmount === item.amount && styles.amountTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.customAmountContainer}>
          <Text style={styles.customAmountLabel}>Montant personnalisé</Text>
          <View style={styles.customAmountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>
    );
  };
  
  const renderPaymentMethods = () => {
    return (
      <View style={styles.paymentSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Méthode de paiement</ThemedText>
        
        <View style={styles.paymentGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                method.isSelected && styles.paymentCardSelected
              ]}
              onPress={() => selectPaymentMethod(method.id)}
            >
              <View style={[
                styles.paymentIcon,
                { backgroundColor: method.color }
              ]}>
                <Ionicons name={method.icon} size={24} color="white" />
              </View>
              <Text style={[
                styles.paymentText,
                method.isSelected && styles.paymentTextSelected
              ]}>
                {method.name}
              </Text>
              {method.isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color="#FF9500" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Master Card Display */}
        <View style={styles.cardDisplay}>
          <LinearGradient
            colors={['#FF9500', '#FF6B35'] as const}
            style={styles.creditCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>Master Card</Text>
              <View style={styles.cardChip} />
            </View>
            <Text style={styles.cardNumber}>•••• •••• •••• 4342</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>Titulaire</Text>
                <Text style={styles.cardValue}>John Doe</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expire</Text>
                <Text style={styles.cardValue}>12/25</Text>
              </View>
            </View>
          </LinearGradient>
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
          <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Give heartfelt donations </Text>
              <View style={styles.placeholder} />
            </View>
            
            <View style={styles.headerStats}>
              <View style={styles.statCard}>
                <Ionicons name="heart" size={20} color="white" />
                <Text style={styles.statText}>Soutenir l'œuvre</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
        
        <Animated.View style={[styles.content, { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }]}>
          {/* Donation Type Selection */}
          {renderDonationType()}
          
          {/* Amount Selection */}
          {renderAmountSelection()}
          
          {/* Payment Methods */}
          {renderPaymentMethods()}
          
          {/* Recurring Option */}
          <View style={styles.recurringSection}>
            <TouchableOpacity 
              style={styles.recurringOption}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View style={styles.recurringLeft}>
                <Ionicons name="repeat" size={20} color={tintColor} />
                <Text style={[styles.recurringText, { color: textColor }]}>Don récurrent mensuel</Text>
              </View>
              <View style={[
                styles.toggle,
                isRecurring && styles.toggleActive
              ]}>
                <View style={[
                  styles.toggleThumb,
                  isRecurring && styles.toggleThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Montant:</Text>
              <Text style={styles.summaryValue}>${getCurrentAmount()}</Text>
            </View>
            {isRecurring && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fréquence:</Text>
                <Text style={styles.summaryValue}>Mensuel</Text>
              </View>
            )}
          </View>
          {/* Donate Button */}
          <View style={styles.donateSection}>
            <TouchableOpacity 
              style={[
                styles.donateButton,
                getCurrentAmount() <= 0 && styles.donateButtonDisabled
              ]}
              onPress={handleDonate}
              disabled={getCurrentAmount() <= 0}
            >
              <LinearGradient
                colors={getCurrentAmount() > 0 ? ['#FF9500', '#FF6B35'] : ['#ccc', '#999'] as const}
                style={styles.donateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.donateButtonText}>CONFIRMER</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Cash',
    type: 'bank',
    icon: 'cash',
    color: '#FF8C42',
    isSelected: false,
  },
  {
    id: '2',
    name: 'Visa',
    type: 'card',
    icon: 'card',
    color: '#FF6B35',
    isSelected: false,
  },
  {
    id: '3',
    name: 'Mastercard',
    type: 'card',
    icon: 'card',
    color: '#FF9500',
    isSelected: true,
  },
  {
    id: '4',
    name: 'PayPal',
    type: 'digital',
    icon: 'logo-paypal',
    color: '#FFB366',
    isSelected: false,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerGradient: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  headerStats: {
    alignItems: 'flex-start',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  statText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  donationTypeScrollView: {
    marginBottom: 30,
  },
  donationTypeContainer: {
    flexDirection: 'row',
    // paddingHorizontal: 20,
    paddingBottom: 4
  },
  donationTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donationTypeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  amountSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountCard: {
    width: (width - 60) / 2,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  amountCardSelected: {
    borderColor: '#FF9500',
    backgroundColor: '#FFF8F0',
  },
  popularAmount: {
    borderColor: '#FF9500',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amountTextSelected: {
    color: '#FF9500',
  },
  customAmountContainer: {
    marginTop: 10,
  },
  customAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  paymentSection: {
    marginBottom: 30,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  paymentCardSelected: {
    borderColor: '#FF9500',
    backgroundColor: '#FFF8F0',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paymentTextSelected: {
    color: '#FF9500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardDisplay: {
    marginTop: 10,
  },
  creditCard: {
    height: 180,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardChip: {
    width: 30,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  cardNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  recurringSection: {
    marginBottom: 30,
  },
  recurringOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recurringLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurringText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#FF9500',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  donateSection: {
    marginTop: 30,
    paddingHorizontal: 0,
  },
  donateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  donateButtonDisabled: {
    opacity: 0.6,
  },
  donateButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});