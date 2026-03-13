import { useThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Purchases from 'react-native-purchases/dist/purchases';

type ProScreenProps = {
  onPurchase: (packageId: string) => void;
  onClose: () => void;
};

type Feature = {
  icon: 'infinite' | 'stats-chart' | 'cloud-upload' | 'color-palette';
  text: string;
};

const ProScreen = ({ onPurchase, onClose }: ProScreenProps) => {
  const { colors } = useThemeColors();

  const [selectedPackage, setSelectedPackage] = useState<'yearly' | 'lifetime' | null>(null);

  const features: Feature[] = [
    { icon: 'infinite', text: 'Unlimited Habits' },
    { icon: 'stats-chart', text: 'Advanced Analytics & Heatmaps' },
    { icon: 'cloud-upload', text: 'Cloud Sync & Backups' },
    { icon: 'color-palette', text: 'Exclusive Premium Themes' },
  ];
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('No Package Selected', 'Please select a subscription package.');
      return;
    }

    try {
      // Now selectedPackage is guaranteed to be string (not null)
      // use purchaseProduct when you have a product identifier string
      await Purchases.purchaseProduct(selectedPackage);
      // ...existing code...
    } catch (error) {
      // ...existing code...
    }
  };
  return (
    <View style={[ styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="flash" size={50} color={colors.orange} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Forge Pro</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Build the best version of yourself.</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Ionicons name={f.icon} size={20} color={colors.orange} />
              <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          {/* Example of a Plan Card - You'll eventually map these from RevenueCat offerings */}
          <TouchableOpacity
            style={[styles.planCard, selectedPackage === 'yearly' && styles.selectedCard, { borderColor: colors.orange, backgroundColor: '#252210' }]}
            onPress={() => setSelectedPackage('yearly')}
          >
            <View>
              <Text style={[styles.planTitle, { color: colors.text }]}>Yearly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>1,500 PKR / year</Text>
            </View>
            <View style={[styles.badge, {backgroundColor: colors.orange}]}>
              <Text style={[styles.badgeText, { color: colors.text }]}>BEST VALUE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, { backgroundColor: colors.card }, selectedPackage === 'lifetime' && styles.selectedCard, { backgroundColor: '#252210' }]}
            onPress={() => setSelectedPackage('lifetime')}
          >
            <Text style={[styles.planTitle, { color: colors.text }]}>Lifetime</Text>
            <Text style={[styles.planPrice, { color: colors.text }]}>3,000 PKR once</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, !selectedPackage && styles.buttonDisabled, {  backgroundColor: colors.orange }]}
          onPress={handlePurchase}
          disabled={!selectedPackage}
        >
          <Text style={[  styles.purchaseButtonText, { color: colors.text, backgroundColor: colors.card }]}>
            {selectedPackage ? 'Upgrade Now' : 'Select a Package'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreBtn}>
          <Text style={[styles.restoreText, { color: colors.text }]}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  scrollContent: { padding: 20, paddingTop: 100 },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16 },
  featuresList: { marginBottom: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  featureText: { marginLeft: 15, fontSize: 16 },
  plansContainer: { gap: 15, marginBottom: 30 },
  planCard: {

    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedCard: {  },
  planTitle: {  fontSize: 18, fontWeight: '600' },
  planPrice: {  fontSize: 14 },
  badge: {  paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: {  fontSize: 10, fontWeight: '800' },
  purchaseButton: { padding: 18, borderRadius: 15, alignItems: 'center' },
  purchaseButtonText: { fontSize: 18, fontWeight: '700' },
  buttonDisabled: {  },
  restoreBtn: { marginTop: 20, alignItems: 'center' },
  restoreText: { fontSize: 12 }
});

export default ProScreen;