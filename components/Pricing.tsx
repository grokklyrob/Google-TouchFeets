import React from 'react';
import { Tiers } from '../constants';
import type { SubscriptionTier } from '../types';
import { CheckIcon } from './Icons';

interface PricingProps {
  onUpgrade: (tier: SubscriptionTier) => void;
}

const PricingCard: React.FC<{ tier: SubscriptionTier; onSelect: () => void }> = ({ tier, onSelect }) => {
  const isPro = tier.id === 'pro';
  const isFree = tier.id === 'free';
  
  return (
    <div className={`relative flex flex-col p-8 bg-gray-900/40 rounded-lg border-2 ${isPro ? 'neon-crimson-border' : 'border-gray-700'} transform hover:scale-105 transition-transform duration-300`}>
      {isPro && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Most Divine
        </div>
      )}
      <h3 className="text-2xl font-gothic neon-crimson-text">{tier.name}</h3>
      <p className="mt-4 text-gray-400">{tier.price > 0 ? `For those committed to the sacred art.` : `Begin your spiritual journey.`}</p>
      <div className="mt-6">
        <span className="text-5xl font-bold text-white">${tier.price}</span>
        <span className="text-lg text-gray-400">/month</span>
      </div>
      <ul className="mt-8 space-y-4">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <CheckIcon className="w-6 h-6 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="flex-grow" />
      <button 
        onClick={!isFree ? onSelect : undefined}
        disabled={isFree}
        className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
            isPro ? 'bg-red-600 text-white hover:bg-red-500' 
            : isFree ? 'bg-gray-800 text-gray-500 cursor-default'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
        }`}
      >
        {isFree ? 'Current Plan' : 'Upgrade Plan'}
      </button>
    </div>
  );
};


export const Pricing: React.FC<PricingProps> = ({ onUpgrade }) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-gothic neon-crimson-text">Choose Your Path</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Unlock more blessings with a monthly subscription. All quotas reset on the 1st of each month.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard tier={Tiers.BASIC} onSelect={() => onUpgrade(Tiers.BASIC)} />
          <PricingCard tier={Tiers.PLUS} onSelect={() => onUpgrade(Tiers.PLUS)} />
          <PricingCard tier={Tiers.PRO} onSelect={() => onUpgrade(Tiers.PRO)} />
        </div>
      </div>
    </section>
  );
};