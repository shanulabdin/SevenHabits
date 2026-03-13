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
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="flash" size={50} color="#FFD700" />
          </View>
          <Text style={styles.title}>Forge Pro</Text>
          <Text style={styles.subtitle}>Build the best version of yourself.</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Ionicons name={f.icon} size={20} color="#FFD700" />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          {/* Example of a Plan Card - You'll eventually map these from RevenueCat offerings */}
          <TouchableOpacity
            style={[styles.planCard, selectedPackage === 'yearly' && styles.selectedCard]}
            onPress={() => setSelectedPackage('yearly')}
          >
            <View>
              <Text style={styles.planTitle}>Yearly</Text>
              <Text style={styles.planPrice}>1,500 PKR / year</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST VALUE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, selectedPackage === 'lifetime' && styles.selectedCard]}
            onPress={() => setSelectedPackage('lifetime')}
          >
            <Text style={styles.planTitle}>Lifetime</Text>
            <Text style={styles.planPrice}>3,000 PKR once</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, !selectedPackage && styles.buttonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage}
        >
          <Text style={styles.purchaseButtonText}>
            {selectedPackage ? 'Upgrade Now' : 'Select a Package'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  closeButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  scrollContent: { padding: 20, paddingTop: 100 },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#252525', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#aaa', fontSize: 16 },
  featuresList: { marginBottom: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  featureText: { color: '#eee', marginLeft: 15, fontSize: 16 },
  plansContainer: { gap: 15, marginBottom: 30 },
  planCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedCard: { borderColor: '#FFD700', backgroundColor: '#252210' },
  planTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  planPrice: { color: '#aaa', fontSize: 14 },
  badge: { backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#000', fontSize: 10, fontWeight: '800' },
  purchaseButton: { backgroundColor: '#FFD700', padding: 18, borderRadius: 15, alignItems: 'center' },
  purchaseButtonText: { color: '#000', fontSize: 18, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#333' },
  restoreBtn: { marginTop: 20, alignItems: 'center' },
  restoreText: { color: '#666', fontSize: 12 }
});

export default ProScreen;