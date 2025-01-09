export const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`));
  } catch (e) {
    return false;
  }
};

export const parseCSVData = (text: string): { url: string; referralSource: string }[] => {
  const lines = text.split("\n");
  const startIndex = isValidUrl(lines[0].split(",")[0].trim()) ? 0 : 1;
  const parsedData: { url: string; referralSource: string }[] = [];
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;

    const [url, referralSource] = line.split(",").map(item => item.trim());
    
    if (isValidUrl(url)) {
      parsedData.push({ url, referralSource });
    }
  }

  return parsedData;
};