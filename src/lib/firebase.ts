
// This is a client-side file.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getRemoteConfig, fetchAndActivate, getValue, setLogLevel } from 'firebase/remote-config';
import type { RemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let remoteConfigInstance: RemoteConfig | null = null;

// Check if all necessary Firebase config values are present
export const isFirebaseConfigured = firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn("Firebase configuration is missing. Firebase services will be disabled. Please set up your .env file.");
}


/**
 * Gets the singleton instance of Firebase Remote Config.
 * Initializes it if it hasn't been already.
 * @returns {RemoteConfig} The Firebase Remote Config instance.
 */
function getRemoteConfigInstance(): RemoteConfig | null {
  if (!isFirebaseConfigured || typeof window === 'undefined') {
    return null;
  }

  if (app && !remoteConfigInstance) {
    remoteConfigInstance = getRemoteConfig(app);
    // For development, you might want to set a low minimum fetch interval.
    // For production, the default is 12 hours.
    if (process.env.NODE_ENV === 'development') {
      remoteConfigInstance.settings.minimumFetchIntervalMillis = 10000; // 10 seconds
      setLogLevel(remoteConfigInstance, 'debug');
    }
    // Set default values
    remoteConfigInstance.defaultConfig = {
      'fashion_feed_enabled': false
    };
  }
  return remoteConfigInstance;
}

/**
 * Fetches the latest remote config values and activates them.
 * @returns {Promise<boolean>} A promise that resolves to true if the new values were activated, false otherwise.
 */
async function fetchConfig(): Promise<boolean> {
  const remoteConfig = getRemoteConfigInstance();
  if (remoteConfig) {
    try {
      return await fetchAndActivate(remoteConfig);
    } catch (error) {
      console.error("Remote Config fetch failed:", error);
      return false;
    }
  }
  return false;
}

/**
 * Retrieves the boolean value for a given key from Remote Config.
 * This function ensures the latest config is fetched before returning a value.
 * @param {string} key - The Remote Config key to retrieve.
 * @returns {Promise<boolean>} A promise that resolves to the boolean value of the key.
 */
export async function getRemoteConfigValue(key: string): Promise<boolean> {
  await fetchConfig();
  const remoteConfig = getRemoteConfigInstance();
  if (remoteConfig) {
    const val = getValue(remoteConfig, key);
    return val.asBoolean();
  }
  // Default to false if not configured or on server
  return false;
}

/**
 * NOTE: This function is for demonstration and would typically be implemented
 * in a secure backend or a custom admin dashboard to programmatically
 * change Remote Config values. Directly changing them from the client is not
 * a standard practice for production apps.
 * 
 * To toggle the feature, please go to your Firebase Console:
 * 1. Navigate to 'Remote Config' under the 'Engage' section.
 * 2. Find the 'fashion_feed_enabled' parameter.
 * 3. Change its value to `true` or `false` and publish the changes.
 */
export function setFashionFeedEnabled(enabled: boolean) {
  console.info("To change the 'fashion_feed_enabled' flag, please visit your Firebase Remote Config console.");
  console.info(`You would set it to: ${enabled}`);
}

export { app, firestore, storage };
