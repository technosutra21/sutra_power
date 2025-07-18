// Text data loader utility for performance optimization
class TextLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Set();
  }

  // Load text content with caching
  async loadText(filename) {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    if (this.loading.has(filename)) {
      // Wait for existing request to complete
      return new Promise((resolve) => {
        const checkCache = () => {
          if (this.cache.has(filename)) {
            resolve(this.cache.get(filename));
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    this.loading.add(filename);

    try {
      const response = await fetch(`/data/txt/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      
      const text = await response.text();
      this.cache.set(filename, text);
      this.loading.delete(filename);
      
      return text;
    } catch (error) {
      this.loading.delete(filename);
      console.error('Error loading text:', error);
      throw error;
    }
  }

  // Preload multiple text files
  async preloadTexts(filenames) {
    const promises = filenames.map(filename => this.loadText(filename));
    return Promise.allSettled(promises);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.loading.clear();
  }

  // Get cache size
  getCacheSize() {
    return this.cache.size;
  }
}

// Export singleton instance
export const textLoader = new TextLoader();

// Helper function to parse character profile text
export function parseCharacterProfile(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  const profile = {
    name: '',
    description: '',
    location: '',
    specialPowers: [],
    physicalDescription: '',
    spiritualAttributes: [],
    mysticExperience: '',
    additionalInfo: []
  };

  let currentSection = 'description';
  let currentText = '';

  for (const line of lines) {
    // Check for section headers
    if (line.toLowerCase().includes('localização') || line.toLowerCase().includes('location')) {
      if (currentText.trim()) {
        profile[currentSection] = currentText.trim();
        currentText = '';
      }
      currentSection = 'location';
      continue;
    }
    
    if (line.toLowerCase().includes('poderes') || line.toLowerCase().includes('powers')) {
      if (currentText.trim()) {
        profile[currentSection] = currentText.trim();
        currentText = '';
      }
      currentSection = 'specialPowers';
      continue;
    }
    
    if (line.toLowerCase().includes('descrição física') || line.toLowerCase().includes('physical')) {
      if (currentText.trim()) {
        profile[currentSection] = currentText.trim();
        currentText = '';
      }
      currentSection = 'physicalDescription';
      continue;
    }
    
    if (line.toLowerCase().includes('atributos espirituais') || line.toLowerCase().includes('spiritual')) {
      if (currentText.trim()) {
        profile[currentSection] = currentText.trim();
        currentText = '';
      }
      currentSection = 'spiritualAttributes';
      continue;
    }
    
    if (line.toLowerCase().includes('experiência mística') || line.toLowerCase().includes('mystic')) {
      if (currentText.trim()) {
        profile[currentSection] = currentText.trim();
        currentText = '';
      }
      currentSection = 'mysticExperience';
      continue;
    }

    // Add line to current section
    if (line.startsWith('- ') || line.startsWith('• ')) {
      // Handle bullet points
      if (Array.isArray(profile[currentSection])) {
        profile[currentSection].push(line.substring(2));
      } else {
        currentText += line + '\n';
      }
    } else {
      currentText += line + ' ';
    }
  }

  // Add final section
  if (currentText.trim()) {
    profile[currentSection] = currentText.trim();
  }

  return profile;
}

// Helper function to get character filename from name
export function getCharacterFilename(characterName) {
  // Convert character name to filename format
  const filename = characterName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .concat('_Perfil.txt');
  
  return filename;
}