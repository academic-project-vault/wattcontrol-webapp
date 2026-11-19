"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Bill,
  DEFAULT_BILLS,
  DEFAULT_ROOMS,
  DEFAULT_SETTINGS,
  Room,
  Settings,
  calculateExcess,
  calculateFine,
  calculateUsage,
  determineStatus,
  getCurrentPeriodName,
} from "@/lib/energyService";

interface EnergyContextType {
  settings: Settings;
  rooms: Room[];
  bills: Bill[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unpaidCount: number;
  isLoaded: boolean;
  updateSettings: (newSettings: Settings) => void;
  resetSimulation: () => void;
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: string, roomData: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  saveBatchReadings: (readings: { id: string; currentMeter: number }[]) => void;
  saveSingleReading: (id: string, currentMeter: number) => void;
  toggleBillPaid: (billId: string) => void;
}

const STORAGE_KEYS = {
  SETTINGS: "wattroom_settings_v1",
  ROOMS: "wattroom_rooms_v1",
  BILLS: "wattroom_bills_v1",
};

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [rooms, setRoomsState] = useState<Room[]>(DEFAULT_ROOMS);
  const [bills, setBillsState] = useState<Bill[]>(DEFAULT_BILLS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettingsState(JSON.parse(savedSettings));
      } else {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }

      const savedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
      if (savedRooms) {
        setRoomsState(JSON.parse(savedRooms));
      } else {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
      }

      const savedBills = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (savedBills) {
        setBillsState(JSON.parse(savedBills));
      } else {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(DEFAULT_BILLS));
      }
    } catch (e) {
      console.error("Failed to load WattRoom data from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save updates to localStorage
  const updateSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const updateRooms = (newRooms: Room[]) => {
    setRoomsState(newRooms);
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(newRooms));
    } catch (e) {
      console.error(e);
    }
  };

  const updateBills = (newBills: Bill[]) => {
    setBillsState(newBills);
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(newBills));
    } catch (e) {
      console.error(e);
    }
  };

  const resetSimulation = () => {
    setSettingsState(DEFAULT_SETTINGS);
    setRoomsState(DEFAULT_ROOMS);
    setBillsState(DEFAULT_BILLS);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(DEFAULT_BILLS));
    } catch (e) {
      console.error(e);
    }
  };

  const addRoom = (roomData: Omit<Room, "id">) => {
    const nextNum = rooms.length + 1;
    const newId = `rm-${String(nextNum).padStart(2, "0")}-${Date.now().toString().slice(-4)}`;
    const newRoom: Room = {
      ...roomData,
      id: newId,
    };
    const updated = [...rooms, newRoom];
    updateRooms(updated);
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    const updated = rooms.map((r) => (r.id === id ? { ...r, ...roomData } : r));
    updateRooms(updated);
  };

  const deleteRoom = (id: string) => {
    const updated = rooms.filter((r) => r.id !== id);
    updateRooms(updated);
  };

  const saveBatchReadings = (readings: { id: string; currentMeter: number }[]) => {
    const period = getCurrentPeriodName();
    const readingMap = new Map(readings.map((r) => [r.id, r.currentMeter]));

    const updatedRooms = rooms.map((room) => {
      if (readingMap.has(room.id)) {
        return {
          ...room,
          currentMeter: readingMap.get(room.id)!,
        };
      }
      return room;
    });

    updateRooms(updatedRooms);

    // Synchronize over-limit rooms with bills
    let updatedBills = [...bills];

    updatedRooms.forEach((room) => {
      if (room.status !== "Terisi") return;

      const used = calculateUsage(room.currentMeter, room.previousMeter);
      const status = determineStatus(used, settings.defaultQuota);

      if (status === "OVER LIMIT") {
        const excess = calculateExcess(used, settings.defaultQuota);
        const fine = calculateFine(excess, settings.tariffPerKwh);

        // Check if an existing bill for this room & period already exists
        const existingIndex = updatedBills.findIndex(
          (b) => b.roomId === room.id && b.period === period
        );

        if (existingIndex >= 0) {
          // Update bill details while keeping payment status if already paid, or keep updated
          updatedBills[existingIndex] = {
            ...updatedBills[existingIndex],
            usedKwh: used,
            excessKwh: excess,
            totalFine: fine,
            tenantName: room.tenantName,
            whatsapp: room.whatsapp,
          };
        } else {
          // Create new unpaid bill
          const newBill: Bill = {
            id: `bill-${Date.now()}-${room.id}`,
            period,
            roomId: room.id,
            roomNumber: room.roomNumber,
            tenantName: room.tenantName,
            whatsapp: room.whatsapp,
            usedKwh: used,
            excessKwh: excess,
            totalFine: fine,
            paid: false,
            createdAt: new Date().toISOString(),
          };
          updatedBills = [newBill, ...updatedBills];
        }
      }
    });

    updateBills(updatedBills);
  };

  const saveSingleReading = (id: string, currentMeter: number) => {
    saveBatchReadings([{ id, currentMeter }]);
  };

  const toggleBillPaid = (billId: string) => {
    const updated = bills.map((b) => (b.id === billId ? { ...b, paid: !b.paid } : b));
    updateBills(updated);
  };

  const unpaidCount = bills.filter((b) => !b.paid).length;

  return (
    <EnergyContext.Provider
      value={{
        settings,
        rooms,
        bills,
        searchQuery,
        setSearchQuery,
        unpaidCount,
        isLoaded,
        updateSettings,
        resetSimulation,
        addRoom,
        updateRoom,
        deleteRoom,
        saveBatchReadings,
        saveSingleReading,
        toggleBillPaid,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error("useEnergy must be used within an EnergyProvider");
  }
  return context;
}

