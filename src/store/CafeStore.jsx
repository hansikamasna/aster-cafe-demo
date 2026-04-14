import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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
        orders: parsed.orders || [],
        staffCalls: parsed.staffCalls || [],
        tables: parsed.tables || defaultTables.map(t => ({ ...t })),
        revenue: parsed.revenue || 0,
        ordersCompleted: parsed.ordersCompleted || 0,
        _v: parsed._v || 0,
      };
    }
  } catch { /* ignore */ }
  return { ...defaultState, tables: defaultTables.map(t => ({ ...t })), _v: 0 };
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function CafeProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const channelRef = useRef(null);
  const versionRef = useRef(state._v || 0);

  // Initialize BroadcastChannel + all sync listeners + polling fallback
  useEffect(() => {
    // Create channel
    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    } catch { /* not supported */ }

    const syncFromStorage = () => {
      const latest = loadState();
      if ((latest._v || 0) > versionRef.current) {
        versionRef.current = latest._v;
        setState(latest);
      }
    };

    // BroadcastChannel listener (instant)
    const handleBroadcast = () => syncFromStorage();
    channelRef.current?.addEventListener('message', handleBroadcast);

    // Storage event listener (fires in other tabs on localStorage change)
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) syncFromStorage();
    };
    window.addEventListener('storage', handleStorage);

    // Polling fallback — checks every 1.5s for version changes
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
    try { channelRef.current?.postMessage('sync'); } catch { /* ignore */ }
  }, []);

  const updateShared = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const version = (prev._v || 0) + 1;
      const finalState = { ...next, _v: version };
      saveState(finalState);
      versionRef.current = version;
      broadcast();
      return finalState;
    });
  }, [broadcast]);

  // === Cart Actions (local only) ===
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
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
      setCart(prev => prev.map(i => i.id === itemId ? { ...i, qty } : i));
    }
  }, []);

  const updateCartNote = useCallback((itemId, notes) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, notes } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // === Order Actions ===
  const placeOrder = useCallback((items, table) => {
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      tableNumber: table,
      items,
      status: 'pending',
      timestamp: Date.now(),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    };

    updateShared(prev => ({
      ...prev,
      orders: [...prev.orders, order],
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

    setCart([]);
    return order;
  }, [updateShared]);

  const updateOrderStatus = useCallback((orderId, status) => {
    updateShared(prev => {
      const order = prev.orders.find(o => o.id === orderId);
      if (!order) return prev;

      const tableStatusMap = {
        'accepted': 'accepted',
        'preparing': 'preparing',
        'ready': 'ready',
        'served': 'served',
      };

      return {
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, status } : o),
        tables: prev.tables.map(t =>
          t.id === order.tableNumber && tableStatusMap[status]
            ? { ...t, status: tableStatusMap[status] }
            : t
        ),
      };
    });
  }, [updateShared]);

  const cancelOrder = useCallback((orderId) => {
    updateShared(prev => {
      const order = prev.orders.find(o => o.id === orderId);
      if (!order) return prev;
      return {
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o),
        tables: prev.tables.map(t =>
          t.id === order.tableNumber
            ? { ...t, currentBill: Math.max(0, t.currentBill - order.total) }
            : t
        ),
      };
    });
  }, [updateShared]);

  // === Table Actions ===
  const markTablePaid = useCallback((tableId) => {
    updateShared(prev => {
      const table = prev.tables.find(t => t.id === tableId);
      const bill = table?.currentBill || 0;
      const completedCount = prev.orders.filter(
        o => o.tableNumber === tableId && o.status !== 'cancelled'
      ).length;

      return {
        ...prev,
        tables: prev.tables.map(t =>
          t.id === tableId
            ? { ...t, status: 'paid', currentBill: 0, orderCount: 0 }
            : t
        ),
        orders: prev.orders.map(o =>
          o.tableNumber === tableId && o.status !== 'cancelled'
            ? { ...o, status: 'paid' }
            : o
        ),
        revenue: prev.revenue + bill,
        ordersCompleted: prev.ordersCompleted + completedCount,
      };
    });
  }, [updateShared]);

  const resetTable = useCallback((tableId) => {
    updateShared(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId
          ? { id: tableId, status: 'empty', occupiedAt: null, currentBill: 0, orderCount: 0 }
          : t
      ),
    }));
  }, [updateShared]);

  // === Staff Actions ===
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
      staffCalls: prev.staffCalls.map(c => c.id === callId ? { ...c, resolved: true } : c),
    }));
  }, [updateShared]);

  // === Derived Data ===
  const getTableOrders = useCallback((tableId) => {
    return state.orders.filter(o => o.tableNumber === tableId && o.status !== 'cancelled' && o.status !== 'paid');
  }, [state.orders]);

  const getRunningBill = useCallback((tableId) => {
    const orders = state.orders.filter(
      o => o.tableNumber === tableId && o.status !== 'cancelled' && o.status !== 'paid'
    );
    const subtotal = orders.reduce((sum, o) => sum + o.total, 0);
    const gst = Math.round(subtotal * 0.05);
    const serviceCharge = Math.round(subtotal * 0.05);
    return { orders, subtotal, gst, serviceCharge, total: subtotal + gst + serviceCharge };
  }, [state.orders]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const login = useCallback((username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const value = {
    // Shared state
    ...state,
    // Local state
    cart,
    tableNumber,
    isAdmin,
    cartTotal,
    // Table & URL
    setTableNumber,
    // Cart
    addToCart,
    removeFromCart,
    updateCartQty,
    updateCartNote,
    clearCart,
    // Orders
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    // Tables
    markTablePaid,
    resetTable,
    // Staff
    callStaff,
    resolveStaffCall,
    // Derived
    getTableOrders,
    getRunningBill,
    // Auth
    login,
    logout,
  };

  return (
    <CafeContext.Provider value={value}>
      {children}
    </CafeContext.Provider>
  );
}