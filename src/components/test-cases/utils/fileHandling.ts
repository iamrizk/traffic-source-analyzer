export const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`));
  } catch (e) {
    return false;
  }
};

export const parseCSVData = (text: string): { url: string; referralSource: string }[] => {
  // Split into lines and remove empty lines
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Get headers from first line and normalize them
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  
  // Find column indices
  const urlIndex = headers.findIndex(h => 
    h.includes('url') || h.includes('link') || h.includes('address')
  );
  const sourceIndex = headers.findIndex(h => 
    h.includes('source') || h.includes('referral') || h.includes('referrer') || h.includes('origin')
  );

  // If required columns are not found, try the first two columns
  const finalUrlIndex = urlIndex === -1 ? 0 : urlIndex;
  const finalSourceIndex = sourceIndex === -1 ? 1 : sourceIndex;

  const parsedData: { url: string; referralSource: string }[] = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim());
    
    if (columns.length >= 2) {
      const url = columns[finalUrlIndex];
      const referralSource = columns[finalSourceIndex] || 'direct';
      
      if (isValidUrl(url)) {
        parsedData.push({ url, referralSource });
      }
    }
  }

  return parsedData;
};