import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const CafeContext = createContext(null);
export const useCafe = () => useContext(CafeContext);

const STORAGE_KEY = 'astor-cafe-shared';
const CHANNEL_NAME = 'astor-cafe-sync';
const TABLES_COUNT = 12;

const defaultTables = Array.from({ length: TABLES_COUNT }, (_, i) => ({
  id: i + 1,
  status: 'empty',
  occupiedAt: null,
  currentBill: 0,
  orderCount: 0,
}));

const defaultState = {
  orders: [],
  staffCalls: [],
  tables: defaultTables,
  revenue: 0,
  ordersCompleted: 0,
  _v: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        orders: [],
        staffCalls: parsed.staffCalls || [],
        tables: parsed.tables || defaultTables.map(t => ({ ...t })),
        revenue: parsed.revenue || 0,
        ordersCompleted: parsed.ordersCompleted || 0,
        _v: parsed._v || 0,
      };
    }
  } catch {}
  return { ...defaultState, tables: defaultTables.map(t => ({ ...t })), _v: 0 };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function CafeProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const channelRef = useRef(null);
  const versionRef = useRef(state._v || 0);

  // Firebase realtime orders listener
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const firebaseOrders = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
      }));

      setState(prev => ({
        ...prev,
        orders: firebaseOrders,
      }));
    });

    return () => unsub();
  }, []);

  // local sync for tables/staff calls etc.
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    } catch {}

    const syncFromStorage = () => {
      const latest = loadState();

      if ((latest._v || 0) > versionRef.current) {
        versionRef.current = latest._v;

        setState(prev => ({
          ...latest,
          orders: prev.orders, // keep Firebase orders
        }));
      }
    };

    const handleBroadcast = () => syncFromStorage();
    channelRef.current?.addEventListener('message', handleBroadcast);

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) syncFromStorage();
    };

    window.addEventListener('storage', handleStorage);

    const pollInterval = setInterval(syncFromStorage, 1500);

    return () => {
      channelRef.current?.removeEventListener('message', handleBroadcast);
      channelRef.current?.close();
      channelRef.current = null;
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  const broadcast = useCallback(() => {
    try {
      channelRef.current?.postMessage('sync');
    } catch {}
  }, []);

  const updateShared = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const version = (prev._v || 0) + 1;

      const finalState = {
        ...next,
        orders: prev.orders,
        _v: version,
      };

      saveState(finalState);
      versionRef.current = version;
      broadcast();

      return finalState;
    });
  }, [broadcast]);

  // CART
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);

      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1, notes: '' }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateCartQty = useCallback((itemId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== itemId));
    } else {
      setCart(prev =>
        prev.map(i => i.id === itemId ? { ...i, qty } : i)
      );
    }
  }, []);

  const updateCartNote = useCallback((itemId, notes) => {
    setCart(prev =>
      prev.map(i => i.id === itemId ? { ...i, notes } : i)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // FIREBASE PLACE ORDER
  const placeOrder = useCallback(async (items, table) => {
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      tableNumber: table,
      items,
      status: 'pending',
      timestamp: Date.now(),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    };

    await addDoc(collection(db, 'orders'), order);

    setCart([]);

    updateShared(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === table
          ? {
              ...t,
              status: t.status === 'empty' ? 'waiting' : t.status,
              occupiedAt: t.occupiedAt || Date.now(),
              orderCount: (t.orderCount || 0) + 1,
              currentBill: (t.currentBill || 0) + order.total,
            }
          : t
      ),
    }));

    return order;
  }, [updateShared]);

  // LOCAL ORDER STATUS UPDATE
  const updateOrderStatus = useCallback((orderId, status) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o =>
        o.id === orderId ? { ...o, status: 'cancelled' } : o
      ),
    }));
  }, []);

  // TABLES
  const markTablePaid = useCallback((tableId) => {
    updateShared(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId
          ? { ...t, status: 'paid', currentBill: 0, orderCount: 0 }
          : t
      ),
    }));
  }, [updateShared]);

  const resetTable = useCallback((tableId) => {
    updateShared(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId
          ? {
              id: tableId,
              status: 'empty',
              occupiedAt: null,
              currentBill: 0,
              orderCount: 0,
            }
          : t
      ),
    }));
  }, [updateShared]);

  // STAFF
  const callStaff = useCallback((table) => {
    const call = {
      id: `CALL-${Date.now().toString(36).toUpperCase()}`,
      tableNumber: table,
      timestamp: Date.now(),
      resolved: false,
    };

    updateShared(prev => ({
      ...prev,
      staffCalls: [...prev.staffCalls, call],
    }));
  }, [updateShared]);

  const resolveStaffCall = useCallback((callId) => {
    updateShared(prev => ({
      ...prev,
      staffCalls: prev.staffCalls.map(c =>
        c.id === callId ? { ...c, resolved: true } : c
      ),
    }));
  }, [updateShared]);

  // DERIVED
  const getTableOrders = useCallback((tableId) => {
    return state.orders.filter(
      o =>
        o.tableNumber === tableId &&
        o.status !== 'cancelled' &&
        o.status !== 'paid'
    );
  }, [state.orders]);

  const getRunningBill = useCallback((tableId) => {
    const orders = state.orders.filter(
      o =>
        o.tableNumber === tableId &&
        o.status !== 'cancelled' &&
        o.status !== 'paid'
    );

    const subtotal = orders.reduce((sum, o) => sum + o.total, 0);
    const gst = Math.round(subtotal * 0.05);
    const serviceCharge = Math.round(subtotal * 0.05);

    return {
      orders,
      subtotal,
      gst,
      serviceCharge,
      total: subtotal + gst + serviceCharge,
    };
  }, [state.orders]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const login = useCallback((username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const value = {
    ...state,
    cart,
    tableNumber,
    isAdmin,
    cartTotal,

    setTableNumber,

    addToCart,
    removeFromCart,
    updateCartQty,
    updateCartNote,
    clearCart,

    placeOrder,
    updateOrderStatus,
    cancelOrder,

    markTablePaid,
    resetTable,

    callStaff,
    resolveStaffCall,

    getTableOrders,
    getRunningBill,

    login,
    logout,
  };

  return (
    <CafeContext.Provider value={value}>
      {children}
    </CafeContext.Provider>
  );
}