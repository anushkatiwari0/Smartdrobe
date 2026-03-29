
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { ClosetItem, UserOutfit, FeedPost, Comment, Poll, Purchase } from '../lib/types';
import { useAuth } from './use-auth';

const STARTER_ITEMS: ClosetItem[] = [
  {
    id: 'starter-1',
    name: 'White Round Neck T-Shirt',
    category: 'Tops',
    description: 'Classic white cotton round neck tee - everyday essential',
    imageUrl: 'https://image.hm.com/assets/hm/2c/8d/2c8d61b4dcc740a6c49f75f8dec7976231930905.jpg?imwidth=2160',
    aiHint: 'tops white round neck tshirt basic',
    color: 'white',
  },
  {
    id: 'starter-2',
    name: 'Basic Black T-Shirt',
    category: 'Tops',
    description: 'Essential black cotton tee - timeless wardrobe staple',
    imageUrl: 'https://m.media-amazon.com/images/I/31PRC8X+MeL._AC_UY1100_.jpg',
    aiHint: 'tops black basic tshirt',
    color: 'black',
  },
  {
    id: 'starter-3',
    name: 'Blue Denim Jeans',
    category: 'Bottoms',
    description: 'Classic blue denim jeans - versatile and comfortable',
    imageUrl: 'https://image.hm.com/assets/hm/2f/ec/2fec0da7331a2461ecc1ca819a963758ba50f6a3.jpg?imwidth=2160',
    aiHint: 'bottoms blue denim jeans',
    color: 'blue',
  },
  {
    id: 'starter-4',
    name: 'White Sneakers',
    category: 'Shoes',
    description: 'Classic white sneakers - perfect for casual wear',
    imageUrl: 'https://image.hm.com/assets/hm/fb/8d/fb8d78018ef31d1891a4e96c7ad7b0bb80348db8.jpg?imwidth=2160',
    aiHint: 'shoes white sneakers casual',
    color: 'white',
  },
  {
    id: 'starter-5',
    name: 'Black Leather Belt',
    category: 'Accessories',
    description: 'Classic black leather belt - essential accessory',
    imageUrl: 'https://image.hm.com/assets/hm/42/3a/423a3723cfc0be3cfadc6f148c458374ed092ccb.jpg?imwidth=1260',
    aiHint: 'accessories black leather belt',
    color: 'black',
  },
  {
    id: 'starter-6',
    name: 'Black Stiletto Heels',
    category: 'Shoes',
    description: 'Elegant black heels - perfect for formal occasions',
    imageUrl: 'https://assets.myntassets.com/w_360,q_50,,dpr_2,fl_progressive,f_webp/assets/images/25570256/2023/10/20/d99283db-0414-44c2-8879-d4f009ba8db31697801461405HMCourtshoes1.jpg',
    aiHint: 'shoes black heels stiletto formal',
    color: 'black',
  },
  {
    id: 'starter-7',
    name: 'White Collared Shirt',
    category: 'Tops',
    description: 'Crisp white button-down shirt - professional essential',
    imageUrl: 'https://image.hm.com/assets/hm/d2/69/d269b3ab29cb44cb6b01b8704ddfbc7ff70194d1.jpg?imwidth=2160',
    aiHint: 'tops white collared shirt button down',
    color: 'white',
  },
  {
    id: 'starter-8',
    name: 'Black Tailored Blazer',
    category: 'Outerwear',
    description: 'Sleek black blazer - polished and professional',
    imageUrl: 'https://image.hm.com/assets/hm/cd/e4/cde42cafdbc1d3919b58c3a469e639f421735ea1.jpg?imwidth=2160',
    aiHint: 'outerwear black blazer tailored',
    color: 'black',
  },
  {
    id: 'starter-9',
    name: 'Black Midi Dress',
    category: 'Dresses',
    description: 'Elegant black midi dress - versatile and chic',
    imageUrl: 'https://image.hm.com/assets/hm/1a/82/1a82add0267dcde556232d51b4610f1605b8413d.jpg?imwidth=2160',
    aiHint: 'dresses black midi dress',
    color: 'black',
  },
  {
    id: 'starter-10',
    name: 'Denim Shorts',
    category: 'Bottoms',
    description: 'Casual blue denim shorts - summer essential',
    imageUrl: 'https://image.hm.com/assets/hm/d0/b5/d0b5c86a4f86509e45e26dc84be7df49d05f31ed.jpg?imwidth=2160',
    aiHint: 'bottoms blue denim shorts casual',
    color: 'blue',
  },
  {
    id: 'starter-11',
    name: 'Black Activewear Leggings',
    category: 'Bottoms',
    description: 'High-waisted black leggings - gym to street',
    imageUrl: 'https://image.hm.com/assets/hm/91/a9/91a9cf5a311fad70a3455b2c76f04196d821b7d1.jpg?imwidth=2160',
    aiHint: 'bottoms black leggings activewear gym',
    color: 'black',
  },
  {
    id: 'starter-12',
    name: 'Black Crop Top',
    category: 'Tops',
    description: 'Trendy black crop top - modern and stylish',
    imageUrl: 'https://image.hm.com/assets/hm/a4/17/a4176a0a2b30041c84dbc3f6b76f1eddb44ab3d4.jpg',
    aiHint: 'tops black crop top',
    color: 'black',
  },
  {
    id: 'starter-13',
    name: 'Black Bralette',
    category: 'Tops',
    description: 'Comfortable black bralette - layering essential',
    imageUrl: 'https://image.hm.com/assets/hm/39/05/3905a9602e4ccb5465a914afddfc10805442e678.jpg?imwidth=2160',
    aiHint: 'tops black bralette sports bra',
    color: 'black',
  },
  {
    id: 'starter-14',
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    description: 'Edgy black leather jacket - timeless classic',
    imageUrl: 'https://i.pinimg.com/736x/9b/6f/61/9b6f612bdaa428c921413aff2d749c06.jpg',
    aiHint: 'outerwear black leather jacket',
    color: 'black',
  },
  {
    id: 'starter-15',
    name: 'Black Bodycon Maxi Dress',
    category: 'Dresses',
    description: 'Sleek black bodycon maxi dress - evening ready',
    imageUrl: 'https://images.meesho.com/images/products/469804805/wgvyt_512.webp?width=512',
    aiHint: 'dresses black bodycon maxi long dress',
    color: 'black',
  },
  {
    id: 'starter-16',
    name: 'Black Ankle Boots',
    category: 'Shoes',
    description: 'Classic black ankle boots - versatile footwear',
    imageUrl: 'https://image.hm.com/assets/hm/e1/ed/e1ed99d07f5cb929b3a983317324f0320365ac94.jpg?imwidth=2160',
    aiHint: 'shoes black ankle boots',
    color: 'black',
  },
  {
    id: 'starter-17',
    name: 'Black Tailored Trousers',
    category: 'Bottoms',
    description: 'Professional black tailored trousers - office essential',
    imageUrl: 'https://cdn.platform.next/common/items/default/default/itemimages/3_4Ratio/product/lge/AM3679s5.jpg?im=Resize,width=180',
    aiHint: 'bottoms black tailored trousers pants',
    color: 'black',
  },
  {
    id: 'starter-18',
    name: 'White Satin Shirt',
    category: 'Tops',
    description: 'Luxurious white satin shirt - elegant and refined',
    imageUrl: 'https://image.hm.com/assets/hm/b1/67/b167c43e014ab21bbdb4599f202b30e12df1c039.jpg?imwidth=2160',
    aiHint: 'tops white satin shirt silk blouse',
    color: 'white',
  },
  {
    id: 'starter-19',
    name: 'Sequin Party Dress',
    category: 'Dresses',
    description: 'Glamorous party dress - night out essential',
    imageUrl: 'https://image.hm.com/assets/hm/60/dd/60dde90b563014927b9d93de0e7312133689543b.jpg?imwidth=2160',
    aiHint: 'dresses party wear cocktail dress evening',
    color: 'black',
  },
  {
    id: 'starter-20',
    name: 'Black Structured Shoulder Bag',
    category: 'Bags',
    description: 'Elegant black structured bag - professional accessory',
    imageUrl: 'https://i.pinimg.com/474x/74/e6/8a/74e68a2141c57a47a42e824dda8049f9.jpg',
    aiHint: 'bags black structured shoulder bag handbag',
    color: 'black',
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
  updateClosetItem: (itemId: string, updates: Partial<ClosetItem>) => void;
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

  const updateClosetItem = useCallback((itemId: string, updates: Partial<ClosetItem>) => {
    if (isAuthenticated) {
      setCloudItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
      fetch(`/api/wardrobe/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(console.error);
    } else {
      setLocalItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
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
    updateClosetItem,
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
