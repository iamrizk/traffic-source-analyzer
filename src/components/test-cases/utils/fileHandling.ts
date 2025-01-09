import { toast } from "sonner";
import { MAX_ROWS } from "./constants";

export const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`));
  } catch (e) {
    return false;
  }
};

// Compress data before storing
const compressData = (data: any[]): string => {
  return btoa(JSON.stringify(data));
};

// Decompress data after retrieving
export const decompressData = (compressed: string): any[] => {
  try {
    return JSON.parse(atob(compressed));
  } catch {
    return [];
  }
};

export const parseCSVData = (text: string): { url: string; referralSource: string; droppedRows?: number }[] => {
  // Split into lines and remove empty lines
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  let startIndex = 0;
  let urlIndex = 0;
  let sourceIndex = 1;
  let hasHeaders = false;

  // Try to detect headers
  const possibleHeaders = lines[0].toLowerCase().split(',').map(h => h.trim());
  if (possibleHeaders.some(h => h.includes('url') || h.includes('source'))) {
    hasHeaders = true;
    startIndex = 1;
    const urlIdx = possibleHeaders.findIndex(h => h.includes('url') || h.includes('link'));
    const sourceIdx = possibleHeaders.findIndex(h => h.includes('source') || h.includes('referral'));
    if (urlIdx !== -1) urlIndex = urlIdx;
    if (sourceIdx !== -1) sourceIndex = sourceIdx;
  }

  const parsedData: { url: string; referralSource: string }[] = [];
  let droppedRowCount = 0;
  
  // Parse data rows
  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim());
    
    if (columns.length >= 2) {
      const url = columns[urlIndex];
      const referralSource = columns[sourceIndex] || 'direct';
      
      if (isValidUrl(url)) {
        parsedData.push({ url, referralSource });
      } else {
        droppedRowCount++;
      }
    } else {
      droppedRowCount++;
    }
  }

  // Show toast for dropped rows if any
  if (droppedRowCount > 0) {
    toast.warning(`${droppedRowCount} invalid rows were skipped`, {
      description: "These rows had invalid URLs or missing data",
    });
  }

  // Enforce MAX_ROWS limit
  if (parsedData.length > MAX_ROWS) {
    const removedRows = parsedData.length - MAX_ROWS;
    toast.warning(`File exceeds maximum row limit`, {
      description: `Only the first ${MAX_ROWS} rows will be processed. ${removedRows} rows were removed.`,
    });
    return parsedData.slice(0, MAX_ROWS);
  }

  return parsedData;
};

// Save test cases with compression
export const saveTestCases = (testCases: { url: string; referralSource: string }[]): boolean => {
  try {
    const compressed = compressData(testCases);
    localStorage.setItem('testCases', compressed);
    return true;
  } catch (error) {
    console.error('Error saving test cases:', error);
    toast.error("Failed to save test cases", {
      description: "The data size exceeds storage limits. Try with fewer test cases.",
    });
    return false;
  }
};

// Load test cases with decompression
export const loadTestCases = (): { url: string; referralSource: string }[] => {
  try {
    const compressed = localStorage.getItem('testCases');
    if (!compressed) return [];
    return decompressData(compressed);
  } catch (error) {
    console.error('Error loading test cases:', error);
    return [];
  }
};