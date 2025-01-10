import { toast } from "sonner";
import { MAX_ROWS } from "./constants";

export interface TestCase {
  url: string;
  referralSource: string;
}

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Compress data before storing - with better compression ratio
const compressData = (data: any[]): string => {
  try {
    // Remove unnecessary whitespace and minimize the JSON string
    const minifiedData = data.map(item => ({
      u: item.url.trim(),
      r: (item.referralSource || '').trim()
    }));
    return btoa(JSON.stringify(minifiedData));
  } catch (error) {
    console.error('Compression error:', error);
    return '';
  }
};

// Decompress data after retrieving - handle the new compression format
export const decompressData = (compressed: string): TestCase[] => {
  try {
    const decompressed = JSON.parse(atob(compressed));
    // Convert back from minimized format to full format
    return decompressed.map((item: any) => ({
      url: item.u,
      referralSource: item.r
    }));
  } catch {
    return [];
  }
};

export const parseCSVData = (text: string): TestCase[] => {
  // Split into lines and remove empty lines
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const parsedData: TestCase[] = [];
  let droppedRowCount = 0;
  
  // Parse each line
  for (let i = 0; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim());
    
    // Ensure we have at least 2 columns
    if (columns.length >= 2) {
      const url = columns[0];
      const referralSource = columns[1];
      
      if (isValidUrl(url)) {
        parsedData.push({ 
          url, 
          referralSource: referralSource || 'direct' 
        });
      } else {
        droppedRowCount++;
      }
    } else {
      droppedRowCount++;
    }

    // Check if we've reached the maximum number of rows
    if (parsedData.length >= MAX_ROWS) {
      if (lines.length > MAX_ROWS) {
        toast.warning(`File exceeds maximum row limit`, {
          description: `Only the first ${MAX_ROWS} rows will be processed.`,
        });
      }
      break;
    }
  }

  if (droppedRowCount > 0) {
    toast.warning(`${droppedRowCount} invalid rows were skipped`, {
      description: "These rows had missing data or invalid URLs",
    });
  }

  return parsedData;
};

export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove any existing protocol and add https://
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const urlWithProtocol = `https://${cleanUrl}`;
    const urlObj = new URL(urlWithProtocol);
    
    // Sort parameters alphabetically and ensure they're lowercase
    const params = new URLSearchParams(urlObj.search);
    const sortedParams = new URLSearchParams();
    
    // Convert all parameter values to lowercase and sort them
    Array.from(params.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .forEach(([key, value]) => {
        sortedParams.append(key, value.toLowerCase());
      });
    
    // Reconstruct URL with sorted parameters
    urlObj.search = sortedParams.toString();
    return urlObj.toString();
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url;
  }
};

export const getRandomTestCase = (testCases: TestCase[]): TestCase => {
  const randomIndex = Math.floor(Math.random() * testCases.length);
  const selectedCase = testCases[randomIndex];
  
  return {
    ...selectedCase,
    url: normalizeUrl(selectedCase.url)
  };
};

export const saveTestCases = (testCases: TestCase[]): boolean => {
  try {
    // Only remove test cases related items
    localStorage.removeItem('testCases');
    localStorage.removeItem('uploadedFileName');
    
    // Wait a brief moment to ensure clearing is complete
    setTimeout(() => {}, 100);
    
    // Truncate to maximum allowed rows and remove any empty entries
    const cleanedTestCases = testCases
      .slice(0, MAX_ROWS)
      .filter(tc => tc.url && tc.url.trim().length > 0);
    
    // Try to save with improved compression
    const compressed = compressData(cleanedTestCases);
    if (!compressed) {
      throw new Error('Compression failed');
    }
    
    localStorage.setItem('testCases', compressed);
    return true;
  } catch (error) {
    console.error('Error saving test cases:', error);
    
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      toast.error("Storage limit exceeded", {
        description: "The test cases file is too large. Trying to optimize...",
      });
      
      // Try again with fewer test cases
      try {
        const reducedTestCases = testCases.slice(0, Math.floor(MAX_ROWS / 2));
        const compressed = compressData(reducedTestCases);
        localStorage.setItem('testCases', compressed);
        toast.success("Loaded with reduced dataset", {
          description: `Successfully loaded ${reducedTestCases.length} test cases`,
        });
        return true;
      } catch (retryError) {
        toast.error("Storage optimization failed", {
          description: "Please try with a smaller test case file",
        });
      }
    } else {
      toast.error("Failed to save test cases", {
        description: "Please try with fewer test cases or smaller data",
      });
    }
    
    return false;
  }
};

export const loadTestCases = (): TestCase[] => {
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
