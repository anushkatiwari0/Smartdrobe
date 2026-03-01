
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { ClosetItem, UserOutfit, FeedPost, Comment, Poll, Purchase } from '../lib/types';
import { useAuth } from './use-auth';

const STARTER_ITEMS: ClosetItem[] = [
  {
    id: 'starter-1',
    name: 'Classic White T-Shirt',
    category: 'Tops',
    description: 'A premium cotton classic fit white t-shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    aiHint: 'white tshirt',
    color: 'white',
  },
  {
    id: 'starter-2',
    name: 'Slim Black Jeans',
    category: 'Bottoms',
    description: 'Essential slim-fit black denim jeans.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    aiHint: 'black jeans',
    color: 'black',
  },
  {
    id: 'starter-3',
    name: 'Beige Hoodie',
    category: 'Outerwear',
    description: 'Oversized comfortable beige hoodie.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    aiHint: 'beige hoodie',
    color: 'beige',
  },
  {
    id: 'starter-4',
    name: 'Cozy Knit Sweater',
    category: 'Tops',
    description: 'Warm thick knit sweater for chilly days.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80',
    aiHint: 'knit sweater',
    color: 'cream',
  },
  {
    id: 'starter-5',
    name: 'Formal White Shirt',
    category: 'Tops',
    description: 'Crisp white button-down shirt.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    aiHint: 'white shirt',
    color: 'white',
  },
  {
    id: 'starter-6',
    name: 'White Sneakers',
    category: 'Shoes',
    description: 'Clean minimalist white leather sneakers.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    aiHint: 'white sneakers',
    color: 'white',
  },
  {
    id: 'starter-7',
    name: 'Tailored Trousers',
    category: 'Bottoms',
    description: 'Smart tailored trousers for work or events.',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    aiHint: 'trousers',
    color: 'navy',
  },
];

const initialUserOutfits: UserOutfit[] = [];
const initialPosts: FeedPost[] = [];

type ScheduledOutfit = {
  title: string;
  description: string;
  itemIds: string[];
};

type OutfitNotes = {
  [date: string]: ScheduledOutfit;
};

interface ClosetContextType {
  closetItems: ClosetItem[];
  isLoadingCloset: boolean;
  addClosetItem: (item: ClosetItem) => void;
  removeClosetItem: (itemId: string) => void;
  itemsMap: Map<string, ClosetItem>;
  scheduledOutfits: OutfitNotes;
  scheduleOutfit: (date: string, outfit: ScheduledOutfit) => void;
  removeScheduledOutfit: (date: string) => void;
  userOutfits: UserOutfit[];
  addUserOutfit: (outfit: UserOutfit) => void;
  removeUserOutfit: (outfitId: string) => void;
  renameUserOutfit: (outfitId: string, newName: string) => void;
  feedPosts: FeedPost[];
  addFeedPost: (post: FeedPost) => void;
  removeFeedPost: (postId: string) => void;
  likePost: (postId: string) => void;
  addCommentToPost: (postId: string, comment: Comment) => void;
  voteOnPoll: (postId: string, optionId: 'A' | 'B') => void;
  budget: number;
  setBudget: (amount: number) => void;
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  removePurchase: (purchaseId: string) => void;
  updatePurchase: (purchase: Purchase) => void;
  aiSuggestionsCount: number;
  acceptedSuggestionsCount: number;
  recordAiSuggestion: (itemIds: string[]) => void;
  acceptAiSuggestion: (itemIds: string[], outfitName: string) => void;
  recordItemWorn: (itemId: string) => void;
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

// ------- localStorage helper (still used for non-wardrobe state) -------
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// ------- localStorage wardrobe (for guest / unauthenticated mode) -------
const useLocalStorageWardrobe = () => {
  const [items, setItems] = useLocalStorage<ClosetItem[]>('closetItems', []);

  useEffect(() => {
    if (items.length < 5) {
      setItems((prev) => {
        const existingIds = prev.map(i => i.id);
        const newStarters = STARTER_ITEMS.filter(s => !existingIds.includes(s.id));
        return [...newStarters, ...prev];
      });
    }
    // Cleanup base64 images
    const hasBase64 = items.some(item => item.imageUrl?.startsWith('data:'));
    if (hasBase64) {
      setItems(items.map(item => ({
        ...item,
        imageUrl: item.imageUrl?.startsWith('data:') ? 'https://placehold.co/400x400?text=Image+Removed' : item.imageUrl,
      })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, setItems };
};

export const ClosetProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // ---- Wardrobe items: Supabase when authenticated, localStorage when guest ----
  const [cloudItems, setCloudItems] = useState<ClosetItem[]>([]);
  const [isLoadingCloset, setIsLoadingCloset] = useState(false);
  const { items: localItems, setItems: setLocalItems } = useLocalStorageWardrobe();

  const isAuthenticated = Boolean(user);
  const closetItems = isAuthenticated ? cloudItems : localItems;

  // Fetch from Supabase when user logs in
  useEffect(() => {
    if (!user) return;
    const fetchWardrobe = async () => {
      setIsLoadingCloset(true);
      try {
        const res = await fetch('/api/wardrobe');
        if (res.ok) {
          const data = await res.json();
          setCloudItems(data.items || []);
        }
      } catch {
        // Network error — silently fall back to empty state, user can refresh
      } finally {
        setIsLoadingCloset(false);
      }
    };
    fetchWardrobe();
  }, [user]);

  const addClosetItem = useCallback((item: ClosetItem) => {
    const itemToSave = { ...item };
    delete itemToSave.photoDataUri;
    // Prevent base64 in imageUrl
    if (itemToSave.imageUrl?.startsWith('data:')) {
      itemToSave.imageUrl = 'https://placehold.co/400x400?text=Upload+Failed';
    }

    if (isAuthenticated) {
      // Optimistically add to UI
      setCloudItems(prev => [itemToSave, ...prev]);
      // Persist to Supabase
      fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: itemToSave.name,
          category: itemToSave.category,
          description: itemToSave.description,
          imageUrl: itemToSave.imageUrl,
          aiHint: itemToSave.aiHint,
          color: itemToSave.color,
          colors: itemToSave.colors,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            // Replace optimistic item with DB item (gets real UUID)
            setCloudItems(prev => prev.map(i => i.id === itemToSave.id ? { ...i, id: data.item.id } : i));
          }
        })
        .catch(console.error);
    } else {
      setLocalItems(prev => [itemToSave, ...prev]);
    }
  }, [isAuthenticated, setLocalItems]);

  const removeClosetItem = useCallback((itemId: string) => {
    if (isAuthenticated) {
      setCloudItems(prev => prev.filter(i => i.id !== itemId));
      fetch(`/api/wardrobe/${itemId}`, { method: 'DELETE' }).catch(console.error);
    } else {
      setLocalItems(prev => prev.filter(i => i.id !== itemId));
    }
  }, [isAuthenticated, setLocalItems]);

  const itemsMap = useMemo(() => new Map(closetItems.map(item => [item.id, item])), [closetItems]);

  // ---- Non-wardrobe state (still localStorage) ----
  const [scheduledOutfits, setScheduledOutfits] = useLocalStorage<OutfitNotes>('scheduledOutfits', {});
  const [userOutfits, setUserOutfits] = useLocalStorage<UserOutfit[]>('userOutfits', initialUserOutfits);
  const [feedPosts, setFeedPosts] = useLocalStorage<FeedPost[]>('feedPosts', initialPosts);
  const [budget, setBudget] = useLocalStorage<number>('monthlyBudget', 10000);
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('monthlyPurchases', []);
  const [aiSuggestionsCount, setAiSuggestionsCount] = useLocalStorage<number>('aiSuggestionsCount', 0);
  const [acceptedSuggestionsCount, setAcceptedSuggestionsCount] = useLocalStorage<number>('acceptedSuggestionsCount', 0);

  const scheduleOutfit = (date: string, outfit: ScheduledOutfit) => {
    setScheduledOutfits(prev => ({ ...prev, [date]: outfit }));
  };
  const removeScheduledOutfit = (date: string) => {
    setScheduledOutfits(prev => { const n = { ...prev }; delete n[date]; return n; });
  };
  const addUserOutfit = (outfit: UserOutfit) => setUserOutfits(prev => [outfit, ...prev]);
  const removeUserOutfit = (outfitId: string) => setUserOutfits(prev => prev.filter(o => o.id !== outfitId));
  const renameUserOutfit = (outfitId: string, newName: string) =>
    setUserOutfits(prev => prev.map(o => o.id === outfitId ? { ...o, name: newName.trim() || o.name } : o));
  const addFeedPost = (post: FeedPost) => setFeedPosts(prev => [post, ...prev]);
  const removeFeedPost = (postId: string) => setFeedPosts(prev => prev.filter(p => p.id !== postId));
  const likePost = (postId: string) => {
    setFeedPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
    ));
  };
  const addCommentToPost = (postId: string, comment: Comment) => {
    setFeedPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };
  const voteOnPoll = (postId: string, optionId: 'A' | 'B') => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll && !p.poll.userVote) {
        const newPoll: Poll = { ...p.poll };
        newPoll.totalVotes += 1;
        newPoll.userVote = optionId;
        newPoll.options = newPoll.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ) as [typeof newPoll.options[0], typeof newPoll.options[1]];
        return { ...p, poll: newPoll };
      }
      return p;
    }));
  };
  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    setPurchases(prev => [{ id: new Date().toISOString(), ...purchase }, ...prev]);
  };
  const removePurchase = (purchaseId: string) => setPurchases(prev => prev.filter(p => p.id !== purchaseId));
  const updatePurchase = (purchaseToUpdate: Purchase) => {
    setPurchases(prev => prev.map(p => p.id === purchaseToUpdate.id ? purchaseToUpdate : p));
  };

  const recordAiSuggestion = (itemIds: string[]) => {
    setAiSuggestionsCount(prev => prev + 1);
    if (isAuthenticated) {
      setCloudItems(prev => prev.map(item =>
        itemIds.includes(item.id) ? { ...item, aiSuggestionCount: (item.aiSuggestionCount || 0) + 1 } : item
      ));
    } else {
      setLocalItems(prev => prev.map(item =>
        itemIds.includes(item.id) ? { ...item, aiSuggestionCount: (item.aiSuggestionCount || 0) + 1 } : item
      ));
    }
  };

  const acceptAiSuggestion = (itemIds: string[], outfitName: string) => {
    setAcceptedSuggestionsCount(prev => prev + 1);
    const newOutfit: UserOutfit = {
      id: `ai-outfit-${Date.now()}`,
      name: outfitName,
      itemIds,
      aiGenerated: true,
      aiAccepted: true,
      wearCount: 1,
      lastWorn: new Date().toISOString(),
    };
    addUserOutfit(newOutfit);

    const updateItems = (prev: ClosetItem[]) =>
      prev.map(item =>
        itemIds.includes(item.id)
          ? { ...item, wearCount: (item.wearCount || 0) + 1, lastWorn: new Date().toISOString() }
          : item
      );

    if (isAuthenticated) {
      setCloudItems(updateItems);
      // Persist wearCount updates
      itemIds.forEach(id => {
        const item = cloudItems.find(i => i.id === id);
        if (item) {
          fetch(`/api/wardrobe/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wearCount: (item.wearCount || 0) + 1, lastWorn: new Date().toISOString() }),
          }).catch(console.error);
        }
      });
    } else {
      setLocalItems(updateItems);
    }
  };

  const recordItemWorn = (itemId: string) => {
    const update = (prev: ClosetItem[]) =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, wearCount: (item.wearCount || 0) + 1, lastWorn: new Date().toISOString() }
          : item
      );
    if (isAuthenticated) {
      setCloudItems(update);
    } else {
      setLocalItems(update);
    }
  };

  const value: ClosetContextType = {
    closetItems,
    isLoadingCloset,
    addClosetItem,
    removeClosetItem,
    itemsMap,
    scheduledOutfits,
    scheduleOutfit,
    removeScheduledOutfit,
    userOutfits,
    addUserOutfit,
    removeUserOutfit,
    renameUserOutfit,
    feedPosts,
    addFeedPost,
    removeFeedPost,
    likePost,
    addCommentToPost,
    voteOnPoll,
    budget,
    setBudget,
    purchases,
    addPurchase,
    removePurchase,
    updatePurchase,
    aiSuggestionsCount,
    acceptedSuggestionsCount,
    recordAiSuggestion,
    acceptAiSuggestion,
    recordItemWorn,
  };

  return (
    <ClosetContext.Provider value={value}>
      {children}
    </ClosetContext.Provider>
  );
};

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (context === undefined) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
};
