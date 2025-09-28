import React, { useState, useRef, useEffect } from 'react';
import type { User, GoogleJwtPayload } from '../types';
import { CrossIcon, SettingsIcon, SyncIcon, BillingIcon, SignOutIcon, ChevronDownIcon, GoogleIcon } from './Icons';

// This tells TypeScript that the 'google' object will be available on the window
// from the GSI script loaded in index.html.
declare const google: any;

interface HeaderProps {
    user: User | null;
    onSignOut: () => void;
    onAuthSuccess: (payload: GoogleJwtPayload) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignOut, onAuthSuccess }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tokenClient = useRef<any>(null);

    useEffect(() => {
        // This function will be called once the GSI script is loaded.
        const initializeGsi = () => {
             if (typeof google === 'undefined' || !google.accounts) {
                // If google isn't loaded, retry shortly.
                setTimeout(initializeGsi, 100);
                return;
            }
            // Initialize the OAuth2 Token Client for a reliable popup flow.
            tokenClient.current = google.accounts.oauth2.initTokenClient({
                client_id: '474815569807-bdronvmnbcu4aghsslr0esjoeq6d38uq.apps.googleusercontent.com',
                scope: 'openid email profile',
                callback: async (tokenResponse: any) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        try {
                            // Use the access token to fetch user profile info
                            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: {
                                    'Authorization': `Bearer ${tokenResponse.access_token}`
                                }
                            });

                            if (!userInfoResponse.ok) {
                                throw new Error('Failed to fetch user info');
                            }

                            const userInfo: GoogleJwtPayload = await userInfoResponse.json();
                            onAuthSuccess(userInfo);
                        } catch (error) {
                            console.error("Error fetching user info:", error);
                            alert("Could not sign you in. Please try again.");
                        }
                    }
                },
            });
        };

        initializeGsi();
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onAuthSuccess]);
    
    const handleSignInClick = () => {
        if (tokenClient.current) {
            // This reliably triggers the popup.
            tokenClient.current.requestAccessToken();
        } else {
            alert("Google Sign-In is preparing. Please click again in a moment.");
        }
    };

    const handleSignOutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDropdownOpen(false);
        onSignOut();
    };


    return (
        <header className="py-4 px-4 sm:px-8 bg-black/50 backdrop-blur-sm border-b border-red-900/50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <CrossIcon className="w-7 h-7 neon-crimson-text relative [top:-2px]" />
                    <h1 className="font-gothic text-2xl sm:text-3xl tracking-wider neon-crimson-text">
                        Touch Feets
                    </h1>
                </div>
                {user ? (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="border border-red-700/60 bg-red-900/20 text-red-300 rounded-full px-4 py-1.5 text-sm font-medium">
                            {user.generationsLeft} Free Uses Left
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(prev => !prev)}
                                className="flex items-center space-x-1.5 text-gray-200 bg-gray-800/50 border border-gray-600 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-700/70 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <span>Account</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-xl origin-top-right z-20">
                                    <div className="p-2 space-y-1">
                                        <div className="px-2 py-2 border-b border-gray-700">
                                            <p className="text-sm font-medium text-white truncate">{user.tier.name} Plan</p>
                                        </div>
                                        {/* Placeholder links. In a real app, these would navigate to pages or trigger actions. */}
                                        <a href="#" className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors">
                                            <SettingsIcon className="w-4 h-4 mr-3 text-gray-400" />
                                            Manage Subscription
                                        </a>
                                        <a href="#" className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors">
                                            <SyncIcon className="w-4 h-4 mr-3 text-gray-400" />
                                            Sync My Plan
                                        </a>
                                        <a href="#" className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors">
                                            <BillingIcon className="w-4 h-4 mr-3 text-gray-400" />
                                            Billing Portal
                                        </a>
                                        <div className="!mt-2 pt-2 border-t border-gray-700">
                                            <a href="#" onClick={handleSignOutClick} className="flex items-center w-full text-left px-2 py-2 text-sm text-red-400 hover:bg-red-900/40 rounded-md transition-colors">
                                                <SignOutIcon className="w-4 h-4 mr-3" />
                                                Sign Out
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleSignInClick}
                        className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 font-semibold rounded-full px-5 py-2.5 hover:bg-gray-200 transition-colors shadow-sm text-sm"
                    >
                        <GoogleIcon className="w-5 h-5" />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </header>
    );
};