import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Generator } from './components/Generator';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { DigitalIncense } from './components/DigitalIncense';
import type { User, SubscriptionTier, GoogleJwtPayload } from './types';
import { Tiers } from './constants';
import { redirectToCheckout } from './services/stripeService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('touchfeets_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('touchfeets_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('touchfeets_user');
    }
  }, [user]);

  // Handle successful Google Sign-In, now receiving the payload directly
  const handleAuthSuccess = useCallback((payload: GoogleJwtPayload) => {
    // This is a placeholder for fetching user data from your database.
    const existingUser = localStorage.getItem(`user_${payload.sub}`);
    if (existingUser) {
        setUser(JSON.parse(existingUser));
    } else {
        const newUser: User = {
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            tier: Tiers.FREE,
            generationsLeft: Tiers.FREE.generations,
        };
        localStorage.setItem(`user_${payload.sub}`, JSON.stringify(newUser));
        setUser(newUser);
    }
  }, []);
  
  const handleSignOut = useCallback(() => {
      if(user) {
        // In a real app, you'd also invalidate the session on the backend.
        localStorage.removeItem(`user_${user.googleId}`);
      }
      setUser(null);
      localStorage.removeItem('touchfeets_user');
  }, [user]);
  
  const handleUpgrade = useCallback(async (tier: SubscriptionTier) => {
      if (!user) {
          alert("Please sign in to upgrade your plan.");
          return;
      }
      try {
        // Store the tier the user is trying to purchase before redirecting
        localStorage.setItem('touchfeets_upgrade_tier', JSON.stringify(tier));
        await redirectToCheckout(tier.priceId, user.email);
      } catch (error) {
        console.error("Stripe Checkout Error:", error);
        alert((error as Error).message);
      }
  }, [user]);

  const decrementGenerations = useCallback(() => {
    setUser(prevUser => {
      if (!prevUser || prevUser.generationsLeft <= 0) return prevUser;
      const updatedUser = { ...prevUser, generationsLeft: prevUser.generationsLeft - 1 };
      // Also update the specific user record in storage
      localStorage.setItem(`user_${updatedUser.googleId}`, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);
  
  // Effect to handle redirect from Stripe checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("checkout_success")) {
      console.log("Order placed! You will receive an email confirmation.");
      // In a real application, a backend webhook is the reliable way to update entitlements.
      // For this demo, we simulate the upgrade on the client-side after redirect.
      const upgradingUser = user;
      const targetTier = localStorage.getItem('touchfeets_upgrade_tier');

      if (upgradingUser && targetTier) {
        const tier = JSON.parse(targetTier) as SubscriptionTier;
        setUser({
          ...upgradingUser,
          tier: tier,
          generationsLeft: upgradingUser.generationsLeft + tier.generations,
        });
        localStorage.removeItem('touchfeets_upgrade_tier');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (query.get("checkout_canceled")) {
      console.log("Order canceled -- continue to shop around and checkout when you're ready.");
       localStorage.removeItem('touchfeets_upgrade_tier');
       window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);


  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden">
      <DigitalIncense />
      <div className="relative z-10">
        <Header user={user} onSignOut={handleSignOut} onAuthSuccess={handleAuthSuccess} />
        <main>
          <Hero />
          <Generator user={user} onGenerate={decrementGenerations} />
          <Pricing onUpgrade={handleUpgrade} />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;