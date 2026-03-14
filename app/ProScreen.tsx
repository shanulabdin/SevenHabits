import Heading from '@/components/Heading';
import { useThemeColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
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
  description: string;
};

const ProScreen = ({ onPurchase, onClose }: ProScreenProps) => {
  const { colors } = useThemeColors();
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<'monthly' | 'yearly' | 'lifetime' | null>('lifetime');
  const features: Feature[] = [
    { icon: 'infinite', text: 'Unlimited Habits', description: 'Create and track unlimited habits.' },
    { icon: 'color-palette', text: 'Custom Themes', description: 'Personalize app colors and accents.' },
    { icon: 'cube', text: 'Widgets', description: 'Home-screen widgets for quick glances.' },
    { icon: 'download', text: 'Export your Data', description: 'Export habit history as JSON.' },
    { icon: 'share', text: 'Import your Data', description: 'Import backups or migrate data.' },
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, padding: 12, }]}>
      {/* Header */}

      <Heading title="Forge Pro" iconTitle="" icon="close" onIconPress={() =>
        router.canGoBack() ? router.back() : router.replace("/(tabs)")
      } />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.headerArea}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/3d1.png')} // Use require for local images
              style={styles.image}
            />
          </View>
          <Text style={[styles.subtitle, { color: colors.text }]}>Limited time Offer, 50% OFF.</Text>
          <Text style={[styles.title, { color: colors.text }]}>Pay Once, own forever</Text>
        </View> */}

        <View style={styles.headerArea}>
          <View style={[styles.iconCircle, { backgroundColor: colors.orangeMuted }]}>
            <Ionicons name="flash" size={100} color={colors.orange} />
          </View>
          <Text style={[styles.subtitle, { color: colors.text }]}>Limited time Offer, 50% OFF.</Text>
          <Text style={[styles.title, { color: colors.text }]}>Pay Once, own forever</Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>

          {/* 3. Lifetime Plan */}
          <View style={[styles.badge, { backgroundColor: colors.orange }]}>
            <Text style={[styles.badgeText, { color: '#000' }]}>BEST VALUE</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.orangeMuted, borderColor: colors.border },
              selectedPackage === 'lifetime' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('lifetime')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Lifetime</Text>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.planPriceDiscount, { color: colors.text }]}>4,000 PKR</Text>
                <Text style={[styles.planPrice, { color: colors.orange }]}>2,000 PKR</Text>
              </View>
            </View>
          </TouchableOpacity>


          <View style={styles.planSeparator}>
            <Text style={[styles.planSeparatorText, { color: colors.text }]}>Other Plans</Text>
          </View>

          {/* 2. Yearly Plan (Best Value) */}
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.orangeMuted, borderColor: colors.border },
              selectedPackage === 'yearly' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('yearly')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Yearly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>1,000 PKR / year</Text>
            </View>
          </TouchableOpacity>

          {/* 1. Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard, styles.cardShadow,
              { backgroundColor: colors.orangeMuted, borderColor: colors.border },
              selectedPackage === 'monthly' && { borderWidth: 2, borderColor: colors.orange }
            ]}
            onPress={() => setSelectedPackage('monthly')}
          >
            <View style={styles.planCardText}>
              <Text style={[styles.planTitle, { color: colors.text }]}>Monthly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>200 PKR / month</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={{ backgroundColor: colors.orange + '25', width: 36, height: 36, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={f.icon} size={20} style={{ color: colors.orange }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
                <Text style={[styles.featureDes, { color: colors.text }]}>{f.description}</Text>
              </View>
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
  scrollContent: { padding: 10, paddingTop: 20 },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 150, height: 150, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 16 },
  featuresList: { marginBottom: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  featureText: { marginLeft: 15, fontSize: 16, marginBottom: 1 },
  featureDes: { marginLeft: 15, fontSize: 12, opacity: 0.8 },
  plansContainer: { gap: 15, marginBottom: 30 },
  planCard: {
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'visible',
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
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -10, zIndex: 1, width: 100, alignSelf: 'center' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  purchaseButton: { padding: 18, borderRadius: 10, alignItems: 'center', },
  purchaseButtonText: { fontSize: 18, fontWeight: '700' },
  buttonDisabled: {},
  restoreBtn: { marginTop: 15, alignItems: 'center' },
  restoreText: { fontSize: 12 },
  purchaseButtonContainer: { paddingBottom: 22, paddingHorizontal: 16, paddingTop: 10, borderRadius: 10 },
  planSeparator: { alignItems: 'center' },
  planSeparatorText: { fontSize: 12, fontWeight: '400', opacity: 0.7, marginTop: 6 },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 350,
  },
});

export default ProScreen;