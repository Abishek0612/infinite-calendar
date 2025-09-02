import { useState, useEffect, useCallback } from "react";
import { JournalEntry } from "../types";
import {
  loadJournalEntries,
  saveJournalEntries,
  generateId,
} from "../utils/storageUtils";

export const useJournalStorage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const loadedEntries = loadJournalEntries();
        setEntries(loadedEntries);
      } catch (error) {
        console.error("Failed to load journal entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const addEntry = useCallback((newEntry: Omit<JournalEntry, "id">) => {
    const entryWithId: JournalEntry = {
      ...newEntry,
      id: generateId(),
    };

    setEntries((prev) => {
      const updated = [...prev, entryWithId];
      saveJournalEntries(updated);
      return updated;
    });

    return entryWithId;
  }, []);

  const updateEntry = useCallback(
    (id: string, updatedEntry: Partial<JournalEntry>) => {
      setEntries((prev) => {
        const updated = prev.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        );
        saveJournalEntries(updated);
        return updated;
      });
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      saveJournalEntries(updated);
      return updated;
    });
  }, []);

  const getEntryById = useCallback(
    (id: string) => {
      return entries.find((entry) => entry.id === id);
    },
    [entries]
  );

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
  };
};
