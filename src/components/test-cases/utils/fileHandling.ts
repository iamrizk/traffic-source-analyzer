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

  // Try to detect headers
  const possibleHeaders = lines[0].toLowerCase().split(',').map(h => h.trim());
  if (possibleHeaders.some(h => h.includes('url') || h.includes('source'))) {
    startIndex = 1;
  }

  const parsedData: { url: string; referralSource: string }[] = [];
  let droppedRowCount = 0;
  
  // Parse data rows
  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim());
    
    if (columns.length >= 1) {
      const url = columns[urlIndex];
      const referralSource = columns[sourceIndex] || '';
      
      // Accept any non-empty URL string
      if (url && url.length > 0) {
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
      description: "These rows had missing data",
    });
  }

  // Show warning if file exceeds row limit
  if (lines.length > MAX_ROWS + startIndex) {
    const removedRows = lines.length - MAX_ROWS - startIndex;
    toast.warning(`File exceeds maximum row limit`, {
      description: `Only the first ${MAX_ROWS} rows will be processed. ${removedRows} rows were removed.`,
    });
  }

  return parsedData.slice(0, MAX_ROWS);
};

// Save test cases with compression
export const saveTestCases = (testCases: { url: string; referralSource: string }[]): boolean => {
  try {
    // Ensure we don't exceed MAX_ROWS when saving
    const truncatedTestCases = testCases.slice(0, MAX_ROWS);
    if (testCases.length > MAX_ROWS) {
      toast.warning(`Test cases exceed maximum limit`, {
        description: `Only the first ${MAX_ROWS} test cases will be saved.`,
      });
    }
    
    const compressed = compressData(truncatedTestCases);
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
    const decompressed = decompressData(compressed);
    // Ensure we don't exceed MAX_ROWS when loading
    return decompressed.slice(0, MAX_ROWS);
  } catch (error) {
    console.error('Error loading test cases:', error);
    return [];
  }
};