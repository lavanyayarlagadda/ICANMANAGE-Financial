export interface ColumnPreferencesPayload {
  tableName: string;
  userId: string;
  columns: Record<string, boolean>;
}

// In-memory mock DB to simulate backend persistence during a session
const mockDb: Record<string, Record<string, boolean>> = {};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchColumnPreferences = async (
  tableName: string,
  userId: string,
): Promise<ColumnPreferencesPayload> => {
  await delay(500); // Simulate loading

  const key = `${userId}_${tableName}`;

  if (mockDb[key]) {
    return {
      tableName,
      userId,
      columns: mockDb[key],
    };
  }

  // If no preferences found, return a dummy response with some columns hidden
  // so you can see the API applying the visibility rules on refresh!
  return {
    tableName,
    userId,
    columns: {
      transactionNo: true,
      status: false, // Hidden by default from the dummy API
      variance: false, // Hidden by default from the dummy API
    },
  };
};

export const updateColumnPreferences = async (
  payload: ColumnPreferencesPayload,
): Promise<ColumnPreferencesPayload> => {
  await delay(800); // Simulate saving delay

  const key = `${payload.userId}_${payload.tableName}`;

  // Save to our in-memory "database"
  mockDb[key] = payload.columns;

  // Echo the payload back as the response
  return payload;
};
