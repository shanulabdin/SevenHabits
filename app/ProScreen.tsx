import { useThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Purchases from 'react-native-purchases/dist/purchases';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProScreenProps = {
  onPurchase: (packageId: string) => void;
  onClose: () => void;
};

type Feature = {
  icon: 'infinite' | 'stats-chart' | 'cloud-upload' | 'color-palette' | 'cube' | 'download' | 'share';
  text: string;
};

const ProScreen = ({ onPurchase, onClose }: ProScreenProps) => {
  const { colors } = useThemeColors();

  const [selectedPackage, setSelectedPackage] = useState<'monthly' | 'yearly' | 'lifetime' | null>('lifetime');

  const features: Feature[] = [
    { icon: 'infinite', text: 'Unlimited Habits' },
    // { icon: 'stats-chart', text: 'Advanced Analytics & Heatmaps' },
    // { icon: 'cloud-upload', text: 'Cloud Sync & Backups' },
    { icon: 'color-palette', text: 'Custom Themes' },
    { icon: 'cube', text: 'Widgets' },
    { icon: 'download', text: 'Export your Data' },
    { icon: 'share', text: 'Import your Data' },
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="flash" size={50} color={colors.orange} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Forge Pro</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Build the best version of yourself.</Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>

          {/* <View style={[styles.badge, { backgroundColor: colors.orange }]}>
              <Text style={[styles.badgeText, { color: '#000' }]}>BEST VALUE</Text>
            </View> */}

          {/* 3. Lifetime Plan */}
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedPackage === 'lifetime' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('lifetime')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Lifetime</Text>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.planPriceDiscount, { color: colors.text }]}>4,500 PKR</Text>
                <Text style={[styles.planPrice, { color: colors.orange }]}>2,000 PKR</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.planSeparator}>
            <Text style={[styles.planSeparatorText, { color: colors.text }]}>Other Plans</Text>
          </View>

          {/* 1. Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedPackage === 'monthly' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('monthly')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Monthly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>200 PKR / month</Text>
            </View>
          </TouchableOpacity>

          {/* 2. Yearly Plan (Best Value) */}
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedPackage === 'yearly' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('yearly')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Yearly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>1,000 PKR / year</Text>
            </View>
          </TouchableOpacity>

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
      </ScrollView>

      {/* Action Button */}
      <View style={styles.purchaseButtonContainer}>
        <TouchableOpacity
          style={[styles.purchaseButton, styles.cardShadow, !selectedPackage && styles.buttonDisabled, { backgroundColor: colors.orange }]}
          onPress={handlePurchase}
          disabled={!selectedPackage}
        >
          <Text style={[styles.purchaseButtonText, { color: colors.text }]}>
            {selectedPackage ? 'Upgrade Now' : 'Select a Package'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreBtn}>
          <Text style={[styles.restoreText, { color: colors.text }]}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  scrollContent: { padding: 20},
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
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  planCardText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  PluginArray: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  selectedCard: {},
  planTitle: { fontSize: 18, fontWeight: '600' },
  planPrice: { fontSize: 14, fontWeight: '600' },
  planPriceDiscount: { fontSize: 12, fontWeight: '600', textDecorationLine: 'line-through' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  purchaseButton: { padding: 18, borderRadius: 10, alignItems: 'center' },
  purchaseButtonText: { fontSize: 18, fontWeight: '700' },
  buttonDisabled: {},
  restoreBtn: { marginTop: 20, alignItems: 'center' },
  restoreText: { fontSize: 12 },
  purchaseButtonContainer: { paddingBottom: 22, paddingHorizontal: 20 },
  planSeparator: { alignItems: 'center' },
  planSeparatorText: { fontSize: 12, fontWeight: '400', opacity: 0.7, marginTop: 6 },
});

export default ProScreen;