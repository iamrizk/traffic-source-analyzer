import { toast } from "sonner";
import { MAX_ROWS } from "./constants";

export const isValidUrl = (urlString: string): boolean => {
  return Boolean(urlString && urlString.trim().length > 0);
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

export const parseCSVData = (text: string): { url: string; referralSource: string; }[] => {
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
    
    if (columns.length >= Math.max(urlIndex, sourceIndex) + 1) {
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

    // Check if we've reached the maximum number of rows
    if (parsedData.length >= MAX_ROWS) {
      if (lines.length > MAX_ROWS + startIndex) {
        toast.warning(`File exceeds maximum row limit`, {
          description: `Only the first ${MAX_ROWS} rows will be processed.`,
        });
      }
      break;
    }
  }

  if (droppedRowCount > 0) {
    toast.warning(`${droppedRowCount} invalid rows were skipped`, {
      description: "These rows had missing data",
    });
  }

  return parsedData;
};

export const saveTestCases = (testCases: { url: string; referralSource: string }[]): boolean => {
  try {
    // Clear storage first
    localStorage.clear();
    
    // Truncate to maximum allowed rows
    const truncatedTestCases = testCases.slice(0, MAX_ROWS);
    
    // Try to save with compression
    const compressed = compressData(truncatedTestCases);
    localStorage.setItem('testCases', compressed);
    
    return true;
  } catch (error) {
    console.error('Error saving test cases:', error);
    
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      toast.error("Storage limit exceeded", {
        description: "The test cases file is too large for browser storage. Try with fewer test cases.",
      });
    } else {
      toast.error("Failed to save test cases", {
        description: "Please try with fewer test cases or smaller data.",
      });
    }
    
    return false;
  }
};

export const loadTestCases = (): { url: string; referralSource: string }[] => {
  try {
    const compressed = localStorage.getItem('testCases');
    if (!compressed) return [];
    const decompressed = decompressData(compressed);
    return decompressed.slice(0, MAX_ROWS);
  } catch (error) {
    console.error('Error loading test cases:', error);
    return [];
  }
};