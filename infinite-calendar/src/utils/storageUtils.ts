import { JournalEntry } from "../types";

const STORAGE_KEY = "hair-journal-entries";

const defaultEntries: JournalEntry[] = [
  {
    id: "1",
    imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 4.8,
    categories: [
      "Deep Conditioning",
      "Moisture",
      "Hair Growth",
      "Natural Products",
    ],
    date: "05/08/2025",
    description:
      "Finally tried the coconut oil deep conditioning treatment. My hair feels incredibly soft and manageable. Noticed significantly less breakage during combing.",
  },
  {
    id: "2",
    imgUrl:
      "https://images.pexels.com/photos/33669506/pexels-photo-33669506.jpeg",
    rating: 3.5,
    categories: ["Protein Treatment", "Hair Repair", "Salon Visit"],
    date: "12/08/2025",
    description:
      "Protein treatment at the salon. Hair feels a bit stiff - might have been too much protein. Need to balance with more moisture next time.",
  },
  {
    id: "3",
    imgUrl:
      "https://images.pexels.com/photos/33653029/pexels-photo-33653029.jpeg",
    rating: 4.5,
    categories: ["Protective Style", "Braids", "Scalp Care"],
    date: "20/08/2025",
    description:
      "Got box braids installed. Used tea tree oil on scalp before installation. Feeling confident about this protective style for the next few weeks.",
  },
  {
    id: "4",
    imgUrl:
      "https://images.pexels.com/photos/33659051/pexels-photo-33659051.png",
    rating: 4.2,
    categories: ["Hair Mask", "DIY Treatment", "Hydration"],
    date: "28/08/2025",
    description:
      "Made a DIY avocado and honey hair mask. Hair feels incredibly nourished. Will definitely repeat this treatment next month.",
  },
  {
    id: "5",
    imgUrl:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    rating: 5.0,
    categories: ["New Product", "Leave-in Conditioner", "Curl Definition"],
    date: "03/09/2025",
    description:
      "Tried the new curl-defining leave-in conditioner. Amazing results! Perfect curl definition without any crunch. Found my holy grail product!",
  },
  {
    id: "6",
    imgUrl:
      "https://images.pexels.com/photos/33699867/pexels-photo-33699867.jpeg",
    rating: 3.8,
    categories: ["Trim", "Hair Health", "Split Ends"],
    date: "10/09/2025",
    description:
      "Got a much-needed trim today. Removed about an inch of damaged ends. Hair looks healthier but shorter than expected.",
  },
  {
    id: "7",
    imgUrl:
      "https://images.pexels.com/photos/33703919/pexels-photo-33703919.jpeg",
    rating: 4.6,
    categories: ["Oil Treatment", "Scalp Massage", "Growth"],
    date: "15/09/2025",
    description:
      "Weekly scalp massage with rosemary oil blend. Starting to notice new growth at temples. Consistent routine is paying off!",
  },
  {
    id: "8",
    imgUrl:
      "https://images.pexels.com/photos/33681810/pexels-photo-33681810.jpeg",
    rating: 4.0,
    categories: ["Wash Day", "Detangling", "Deep Clean"],
    date: "20/09/2025",
    description:
      "Thorough wash day with clarifying shampoo. Took time to properly section and detangle. Hair feels clean and refreshed.",
  },
  {
    id: "9",
    imgUrl:
      "https://images.pexels.com/photos/33711580/pexels-photo-33711580.jpeg",
    rating: 4.7,
    categories: ["Heatless Styling", "Overnight Routine", "Waves"],
    date: "25/09/2025",
    description:
      "Tried silk rope braid overnight for heatless waves. Woke up to beautiful, bouncy waves. Love this damage-free styling method!",
  },
  {
    id: "10",
    imgUrl:
      "https://images.pexels.com/photos/33714711/pexels-photo-33714711.jpeg",
    rating: 4.3,
    categories: ["Color Care", "Purple Shampoo", "Toning"],
    date: "30/09/2025",
    description:
      "Used purple shampoo to tone highlights. Color looks refreshed and brassy tones are gone. Need to remember not to leave it on too long next time.",
  },
  {
    id: "11",
    imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 4.5,
    categories: ["Special Treatment", "Leap Year", "Deep Conditioning"],
    date: "29/02/2024",
    description:
      "Special leap day treatment! Extra deep conditioning session to celebrate this rare day. Hair feels amazing after this intensive care routine.",
  },
];

export const loadJournalEntries = (): JournalEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const entries = JSON.parse(stored);
      return entries.length > 0 ? entries : defaultEntries;
    }
    saveJournalEntries(defaultEntries);
    return defaultEntries;
  } catch (error) {
    console.error("Failed to load entries from localStorage:", error);
    return defaultEntries;
  }
};

export const saveJournalEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Failed to save entries to localStorage:", error);
  }
};

export const generateId = (): string => {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const exportEntries = (entries: JournalEntry[]): void => {
  const dataStr = JSON.stringify(entries, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `hair-journal-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
};

export const importEntries = (file: File): Promise<JournalEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const entries = JSON.parse(e.target?.result as string);
        if (Array.isArray(entries) && entries.every(isValidJournalEntry)) {
          resolve(entries);
        } else {
          reject(new Error("Invalid journal entries format"));
        }
      } catch (error) {
        reject(new Error("Failed to parse JSON file"));
      }
    };
    reader.readAsText(file);
  });
};

const isValidJournalEntry = (entry: any): entry is JournalEntry => {
  return (
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    typeof entry.imgUrl === "string" &&
    typeof entry.rating === "number" &&
    Array.isArray(entry.categories) &&
    typeof entry.date === "string" &&
    typeof entry.description === "string"
  );
};
