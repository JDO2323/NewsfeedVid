import { NewsSource } from '@/types/sources';

export const FRENCH_NEWS_SOURCES: NewsSource[] = [
  // 🏛️ Chaînes d'information françaises - Info continue
  {
    id: 'bfmtv',
    name: 'BFM TV',
    type: 'youtube',
    url: 'https://www.youtube.com/@BFMTV',
    channelId: 'UCVhz5v8nOp6wgkKIq7fYyJA',
    rssUrl: 'https://www.bfmtv.com/rss/info/',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '📺',
    description: 'Première chaîne d\'info en continu française'
  },
  {
    id: 'cnews',
    name: 'CNEWS',
    type: 'youtube',
    url: 'https://www.youtube.com/@CNEWS',
    channelId: 'UCj9M_1Uo8FZJTlgBTp7PUpw',
    rssUrl: 'https://www.cnews.fr/rss/actualites',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '📡',
    description: 'Chaîne d\'information en continu du groupe Canal+'
  },
  {
    id: 'franceinfo',
    name: 'France Info',
    type: 'youtube',
    url: 'https://www.youtube.com/@franceinfo',
    channelId: 'UCO6K_kkdP-lnSCiO3tPx7WA',
    rssUrl: 'https://www.francetvinfo.fr/titres.rss',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🇫🇷',
    description: 'Service public d\'information de France Télévisions'
  },
  {
    id: 'lci',
    name: 'LCI',
    type: 'youtube',
    url: 'https://www.youtube.com/@LCI',
    channelId: 'UCTQhTxl6NbNk6_7JOqR0lfQ',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '📺',
    description: 'La Chaîne Info - TF1 Group'
  },

  // 🌍 Chaînes internationales en français
  {
    id: 'euronews_fr',
    name: 'Euronews Français',
    type: 'youtube',
    url: 'https://www.youtube.com/@euronewsfr',
    channelId: 'UCW2QcKZiU8aUGg4yxvEMAEQ',
    rssUrl: 'https://fr.euronews.com/rss',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🇪🇺',
    description: 'Actualité européenne et internationale'
  },
  {
    id: 'tv5monde',
    name: 'TV5 Monde Info',
    type: 'youtube',
    url: 'https://www.youtube.com/@TV5MONDEINFO',
    channelId: 'UCdTyuXBjm-QgOGbHYKlsS6g',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🌍',
    description: 'Information francophone internationale'
  },
  {
    id: 'france24_fr',
    name: 'France 24 Français',
    type: 'youtube',
    url: 'https://www.youtube.com/@FRANCE24',
    channelId: 'UCCCPCZNChQdGa9EkATeye4g',
    rssUrl: 'https://www.france24.com/fr/rss',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🇫🇷',
    description: 'Actualité internationale française 24h/24'
  },

  // 🏛️ Chaînes thématiques / régionales
  {
    id: 'lcp',
    name: 'LCP - Assemblée Nationale',
    type: 'youtube',
    url: 'https://www.youtube.com/@LCP',
    channelId: 'UCVugY8K8OsElJqANG_891dA',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🏛️',
    description: 'Débats parlementaires et vie politique française'
  },
  {
    id: 'publicsenat',
    name: 'Public Sénat',
    type: 'youtube',
    url: 'https://www.youtube.com/@publicsenat',
    channelId: 'UCJt9JY7R_YfEuMRcHFvWKYA',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🏛️',
    description: 'Chaîne parlementaire du Sénat français'
  },
  {
    id: 'france3_regions',
    name: 'France 3 Régions',
    type: 'youtube',
    url: 'https://www.youtube.com/@France3Regions',
    channelId: 'UC-8B7avwsKOxJYGN2mfKwuA',
    category: 'culture',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🗺️',
    description: 'Actualité régionale française'
  },

  // 💼 Chaînes économiques / spécialisées
  {
    id: 'bfm_business',
    name: 'BFM Business',
    type: 'youtube',
    url: 'https://www.youtube.com/@BFMBusiness',
    channelId: 'UCaN1esmBJm7s6jTrp4gZNsw',
    rssUrl: 'https://www.bfmtv.com/economie/rss/',
    category: 'economy',
    language: 'fr',
    verified: true,
    active: true,
    icon: '💼',
    description: 'Information économique et financière'
  },
  {
    id: 'lesechos',
    name: 'Les Echos',
    type: 'youtube',
    url: 'https://www.youtube.com/@LesEchos',
    channelId: 'UCqGz1r0syZLCIvHF1vVKKsA',
    category: 'economy',
    language: 'fr',
    verified: true,
    active: true,
    icon: '📈',
    description: 'Média économique de référence'
  },

  // 🎬 Chaînes alternatives / indépendantes
  {
    id: 'mediapart',
    name: 'Mediapart',
    type: 'youtube',
    url: 'https://www.youtube.com/@mediapart',
    channelId: 'UCX8x5wt4fJHCBmpVrg8lDNw',
    category: 'politics',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🗞️',
    description: 'Journalisme d\'investigation indépendant'
  },
  {
    id: 'konbini',
    name: 'Konbini News',
    type: 'youtube',
    url: 'https://www.youtube.com/@konbininews',
    channelId: 'UCd1CqbqG4DOKHnhCnIJhPWw',
    category: 'culture',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🎥',
    description: 'Actualité décalée pour les jeunes'
  },
  {
    id: 'brut',
    name: 'Brut',
    type: 'youtube',
    url: 'https://www.youtube.com/@brutofficiel',
    channelId: 'UCKy1dAqELo0zrOtPkf0eTMw',
    category: 'culture',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🎬',
    description: 'Média vidéo d\'actualité pour les millennials'
  },

  // 🏅 Chaînes sport
  {
    id: 'lequipe',
    name: 'L\'Équipe',
    type: 'youtube',
    url: 'https://www.youtube.com/@lequipe',
    channelId: 'UCaJl3nEo_cJ4jCgtJ7Qjnfw',
    category: 'sports',
    language: 'fr',
    verified: true,
    active: true,
    icon: '⚽',
    description: 'Toute l\'actualité sportive française'
  },

  // 🔬 Chaînes science/tech
  {
    id: 'scienceetavenir',
    name: 'Sciences et Avenir',
    type: 'youtube',
    url: 'https://www.youtube.com/@sciencesetavenir',
    channelId: 'UC8GJLpAHiWtKLUQdqoOirzg',
    category: 'science',
    language: 'fr',
    verified: true,
    active: true,
    icon: '🔬',
    description: 'Actualité scientifique et innovation'
  }
];

export const getSourcesByCategory = (category: string): NewsSource[] => {
  return FRENCH_NEWS_SOURCES.filter(source => source.category === category && source.active);
};

export const getSourceById = (id: string): NewsSource | undefined => {
  return FRENCH_NEWS_SOURCES.find(source => source.id === id);
};

export const getAllActiveSources = (): NewsSource[] => {
  return FRENCH_NEWS_SOURCES.filter(source => source.active);
};