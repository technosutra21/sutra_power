import Papa from 'papaparse';

/**
 * Data loader for parsing CSV character data and providing model paths
 */
export class CharacterDataLoader {
  constructor() {
    this.characters = [];
    this.loaded = false;
  }

  /**
   * Load and parse the CSV data
   */
  async loadCharacters() {
    try {
      const response = await fetch('/src/data/caps.csv');
      const csvText = await response.text();
      
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ',',
        quoteChar: '"',
        escapeChar: '"'
      });

      this.characters = result.data.map((row, index) => {
        const chapterMatch = row['Capítulo']?.match(/CAPÍTULO (\d+)/);
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : index + 1;
        
        return {
          id: `character-${chapterNumber}`,
          chapter: chapterNumber,
          name: row['PERSONAGEM CENTRAL'] || `Character ${chapterNumber}`,
          location: row['LOCALIZAÇÃO'] || '',
          context: row['CONTEXTO'] || '',
          mainTeaching: row['ENSINAMENTO PRINCIPAL'] || '',
          miraculousManifestations: row['MANIFESTAÇÕES MIRACULOSAS'] || '',
          mainDialogue: row['DIÁLOGO PRINCIPAL'] || '',
          presentAssembly: row['ASSEMBLEIA PRESENTE'] || '',
          spiritualProgression: row['PROGRESSÃO ESPIRITUAL'] || '',
          transition: row['TRANSIÇÃO'] || '',
          uniqueElements: row['ELEMENTOS ÚNICOS'] || '',
          modelUrl: `/src/data/models/modelo${chapterNumber}.glb`,
          imageUrl: `/images/character-${chapterNumber}.jpg`,
          available: true,
          type: 'Character',
          tags: this.extractTags(row),
          description: this.createDescription(row)
        };
      });

      this.loaded = true;
      return this.characters;
    } catch (error) {
      console.error('Failed to load character data:', error);
      return [];
    }
  }

  /**
   * Extract tags from character data
   */
  extractTags(row) {
    const tags = [];
    const name = row['PERSONAGEM CENTRAL'] || '';
    
    if (name.includes('Buda') || name.includes('Buddha')) tags.push('Buddha');
    if (name.includes('Bodhisattva')) tags.push('Bodhisattva');
    if (name.includes('bhikṣu') || name.includes('monge')) tags.push('Monk');
    if (name.includes('bhikṣuṇī') || name.includes('monja')) tags.push('Nun');
    if (name.includes('Rei') || name.includes('King')) tags.push('Ruler');
    if (name.includes('mercador') || name.includes('comerciante')) tags.push('Merchant');
    
    return tags.length > 0 ? tags : ['Character'];
  }

  /**
   * Create a description from the character data
   */
  createDescription(row) {
    const context = row['CONTEXTO'] || '';
    const teaching = row['ENSINAMENTO PRINCIPAL'] || '';
    
    if (context && teaching) {
      return `${context.substring(0, 200)}...`;
    } else if (context) {
      return context.substring(0, 200) + '...';
    } else if (teaching) {
      return teaching.substring(0, 200) + '...';
    }
    
    return 'A mystical character from the universal wisdom tradition.';
  }

  /**
   * Get character by ID
   */
  getCharacterById(id) {
    return this.characters.find(char => char.id === id);
  }

  /**
   * Get character by chapter number
   */
  getCharacterByChapter(chapter) {
    return this.characters.find(char => char.chapter === chapter);
  }

  /**
   * Get all characters
   */
  getAllCharacters() {
    return this.characters;
  }

  /**
   * Get available characters
   */
  getAvailableCharacters() {
    return this.characters.filter(char => char.available);
  }

  /**
   * Get characters by type
   */
  getCharactersByType(type) {
    return this.characters.filter(char => char.type === type);
  }

  /**
   * Get characters by tag
   */
  getCharactersByTag(tag) {
    return this.characters.filter(char => char.tags.includes(tag));
  }

  /**
   * Search characters
   */
  searchCharacters(query) {
    const searchTerm = query.toLowerCase();
    return this.characters.filter(char => 
      char.name.toLowerCase().includes(searchTerm) ||
      char.location.toLowerCase().includes(searchTerm) ||
      char.description.toLowerCase().includes(searchTerm) ||
      char.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get stats
   */
  getStats() {
    const total = this.characters.length;
    const available = this.characters.filter(char => char.available).length;
    const types = [...new Set(this.characters.map(char => char.type))];
    const tags = [...new Set(this.characters.flatMap(char => char.tags))];
    
    return {
      total,
      available,
      types: types.length,
      tags: tags.length,
      completionRate: total > 0 ? Math.round((available / total) * 100) : 0
    };
  }
}

// Create a singleton instance
export const characterDataLoader = new CharacterDataLoader();

// Legacy compatibility functions
export const getCharacterById = (id) => characterDataLoader.getCharacterById(id);
export const getAvailableCharacters = () => characterDataLoader.getAvailableCharacters();
export const getCharactersByType = (type) => characterDataLoader.getCharactersByType(type);
export const getAllCharacters = () => characterDataLoader.getAllCharacters();