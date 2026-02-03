import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TrendingSection from '@/components/home/TrendingSection';
import MarketplacePreview from '@/components/home/MarketplacePreview';
import TopContributors from '@/components/home/TopContributors';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <MarketplacePreview />
      <TopContributors />
      <CTASection />
    </Layout>
  );
};

export default Index;
