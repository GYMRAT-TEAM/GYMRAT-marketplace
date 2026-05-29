import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

// Realistic initial notifications for a sports marketplace
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'promo',
    icon: '',
    title: 'Flash Sale — 25% OFF Supplements',
    body: 'Gold Standard Whey, C4 Pre-Workout and more. Today only!',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'new_item',
    icon: '',
    title: 'New Arrival: Nike Air Zoom SuperRep 4',
    body: 'The latest CrossFit shoe just dropped. Limited stock available.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'promo',
    icon: '',
    title: 'Weekend Deal — Gymshark Apparel',
    body: 'Buy 2 get 1 free on all Gymshark clothing. Valid until Sunday.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'new_item',
    icon: '',
    title: 'New: Rogue Monster Barbell 20kg',
    body: 'Professional-grade Olympic barbell now in stock. 38,000 DZD.',
    time: '3 hr ago',
    read: false,
  },
  {
    id: 5,
    type: 'promo',
    icon: '',
    title: 'VIP Members — Exclusive Discount',
    body: 'VIP & Business members get extra 15% off all equipment this week.',
    time: '5 hr ago',
    read: true,
  },
  {
    id: 6,
    type: 'new_item',
    icon: '',
    title: 'New: Adidas Ultraboost 23 Running',
    body: 'Ultraboost 23 available in 5 colorways. Starting at 29,000 DZD.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 7,
    type: 'promo',
    icon: '',
    title: 'Free Delivery on Orders +10,000 DZD',
    body: 'Add more to your cart and enjoy free shipping across Algeria.',
    time: '2 days ago',
    read: true,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
