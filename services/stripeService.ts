import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY, CREATE_CHECKOUT_SESSION_URL } from '../constants';

// This is a singleton promise to load Stripe.js once.
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

/**
 * This function calls your backend (a Google Cloud Function) to create a Stripe Checkout Session.
 * Then, it redirects the user to the Stripe-hosted checkout page.
 * 
 * @param priceId The ID of the Stripe Price the user wants to purchase.
 * @param userEmail The email of the user for pre-filling Stripe checkout.
 */
export const redirectToCheckout = async (priceId: string, userEmail: string) => {
    // Developer-friendly check: Ensure the backend URL has been configured.
    if (CREATE_CHECKOUT_SESSION_URL.includes('your-region-your-project')) {
        const errorMessage = "Stripe Checkout cannot proceed. The backend URL for creating a checkout session is still a placeholder. Please update `CREATE_CHECKOUT_SESSION_URL` in `src/constants.ts` with your deployed Google Cloud Function URL.";
        console.error(errorMessage);
        alert(errorMessage);
        throw new Error("Backend URL not configured.");
    }

    // 1. Call your Google Cloud Function to create a checkout session.
    // This is a POST request to your backend endpoint.
    // Your backend needs to be configured to handle this request, create a session
    // using the Stripe Node.js library and your secret key, and return the session ID.
    const response = await fetch(CREATE_CHECKOUT_SESSION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            priceId: priceId,
            // The success and cancel URLs are where Stripe will redirect the user after checkout.
            // We append query parameters to know the status on the client-side.
            successUrl: `${window.location.origin}?checkout_success=true`,
            cancelUrl: `${window.location.origin}?checkout_canceled=true`,
            userEmail: userEmail,
         }),
    });
    
    if (!response.ok) {
        // If the backend call fails, show an error to the user.
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Could not create checkout session.');
    }

    const { sessionId } = await response.json();

    // 2. When you have a session ID, redirect to Stripe Checkout.
    const stripe = await stripePromise;
    if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
    }
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    // 3. If `redirectToCheckout` fails due to a browser issue (e.g., pop-up blocker),
    // display the localized error message to your customer.
    if (error) {
        console.error('Stripe redirect failed:', error);
        throw new Error(error.message);
    }
};