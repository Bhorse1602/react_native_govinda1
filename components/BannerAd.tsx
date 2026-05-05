import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface BannerAdProps {
  showPlaceholder?: boolean;
  containerStyle?: any;
  adUnitId?: string;
  bannerSize?: 'banner' | 'largeBanner' | 'mediumRectangle' | 'fullBanner' | 'leaderboard' | 'adaptiveBanner';
}

export default function BannerAdComponent({
  showPlaceholder = true,
  containerStyle,
  adUnitId,
  bannerSize = 'banner',
}: BannerAdProps) {
  const [adError, setAdError] = useState<string | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const isDev = __DEV__;
  const unitId = adUnitId
    ? adUnitId
    : (isDev
      ? TestIds.BANNER
      : 'ca-app-pub-9563251769445067/1756838365');

  const sizeMap: Record<string, BannerAdSize> = {
    banner: BannerAdSize.BANNER,
    largeBanner: BannerAdSize.LARGE_BANNER,
    mediumRectangle: BannerAdSize.MEDIUM_RECTANGLE,
    fullBanner: BannerAdSize.FULL_BANNER,
    leaderboard: BannerAdSize.LEADERBOARD,
    adaptiveBanner: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showPlaceholder) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {shouldRender ? (
        <BannerAd
          key="banner-ad"
          unitId={unitId}
          size={sizeMap[bannerSize] || BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={(error) => {
            console.log('Ad failed to load:', error.message, error.code);
            setAdError(error.message);
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
            setAdError(null);
            setAdLoaded(true);
          }}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      {__DEV__ && adError && (
        <Text style={styles.errorText}>Ad error: {adError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
    backgroundColor: 'transparent',
    marginVertical: 8,
  },
  placeholder: {
    width: 320,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    textAlign: 'center',
    marginTop: 4,
  },
});
