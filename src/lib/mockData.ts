import { Video, Category } from '@/types';

// Categories Google News FR
const GOOGLE_NEWS_CATEGORIES: Category[] = [
  { id: '1', name: 'Pour vous', slug: 'pour-vous', isDynamic: false, icon: '⭐' },
  { id: '2', name: 'Actualité locale', slug: 'actualite-locale', isDynamic: false, icon: '📍' },
  { id: '3', name: 'France', slug: 'france', isDynamic: false, icon: '🇫🇷' },
  { id: '4', name: 'Monde', slug: 'monde', isDynamic: false, icon: '🌍' },
  { id: '5', name: 'Économie', slug: 'economie', isDynamic: false, icon: '💼' },
  { id: '6', name: 'Science', slug: 'science', isDynamic: false, icon: '🔬' },
  { id: '7', name: 'Santé', slug: 'sante', isDynamic: false, icon: '🏥' },
  { id: '8', name: 'Technologie', slug: 'technologie', isDynamic: false, icon: '💻' },
  { id: '9', name: 'Culture', slug: 'culture', isDynamic: false, icon: '🎭' },
  { id: '10', name: 'Sport', slug: 'sport', isDynamic: false, icon: '⚽' },
  { id: '11', name: 'Divertissement', slug: 'divertissement', isDynamic: false, icon: '🎬' },
];

const generateMockVideos = (): Video[] => {
  const titles = {
    'pour-vous': [
      'Breaking: Nouvelle politique climatique annoncée',
      'Élections: Les derniers sondages révèlent des surprises',
      'Économie: Les marchés réagissent aux nouvelles mesures',
      'Sport: Victoire historique de l\'équipe de France',
      'Tech: Intelligence artificielle, révolution en cours',
    ],
    'actualite-locale': [
      'Paris: Nouvelle ligne de métro inaugurée',
      'Lyon: Festival culturel attire des milliers de visiteurs',
      'Marseille: Projet urbain ambitieux dévoilé',
      'Toulouse: Innovation spatiale, nouvelle mission',
      'Bordeaux: Vignobles face aux défis climatiques',
    ],
    'france': [
      'Assemblée Nationale: Vote crucial sur la réforme',
      'Gouvernement: Remaniement ministériel en vue',
      'Justice: Affaire judiciaire majeure développements',
      'Éducation: Réforme scolaire, réactions mitigées',
      'Sécurité: Nouvelles mesures antiterroristes',
    ],
    'monde': [
      'Ukraine: Négociations diplomatiques intensifiées',
      'États-Unis: Élections présidentielles, candidats',
      'Chine: Économie mondiale, impacts analysés',
      'Brexit: Conséquences sur l\'Europe évaluées',
      'Afrique: Développement durable, projets innovants',
    ],
    'economie': [
      'CAC 40: Envolée des valeurs technologiques',
      'Crypto: Bitcoin franchit nouveau seuil historique',
      'PME: Plan de relance, premiers résultats',
      'Commerce: Accords internationaux signés récemment',
      'Inflation: Impact consommation, analyse détaillée',
    ],
    'science': [
      'Espace: Découverte exoplanète potentiellement habitable',
      'Climat: Recherche révolutionnaire sur réchauffement',
      'Médecine: Percée majeure traitement cancer',
      'Physique: Expérience quantique résultats surprenants',
      'Biologie: Génétique, avancées thérapeutiques prometteuses',
    ],
    'sante': [
      'Covid-19: Nouveau variant détecté, recommandations',
      'Nutrition: Étude révèle bienfaits alimentation méditerranéenne',
      'Mental: Campagne sensibilisation santé psychologique',
      'Recherche: Traitement innovant maladie rare',
      'Prévention: Dépistage précoce, nouvelles techniques',
    ],
    'technologie': [
      'IA: ChatGPT révolutionne industrie éducative',
      'Smartphones: Nouveau flagship, fonctionnalités révolutionnaires',
      'Cybersécurité: Alerte menaces, protection renforcée',
      'Start-up: Licorne française lève fonds record',
      'Informatique: Quantique, avancées computationnelles majeures',
    ],
    'culture': [
      'Cannes: Palme d\'or 2024, cinéma français',
      'Musique: Festival été, programmation exceptionnelle',
      'Littérature: Prix Goncourt, sélection annoncée',
      'Patrimoine: Restauration monument historique achevée',
      'Art: Exposition moderne, succès public critique',
    ],
    'sport': [
      'Football: PSG remporte match décisif européen',
      'Tennis: Roland Garros, finale française historique',
      'Rugby: XV France prépare tournoi',
      'JO 2024: Athlètes français, préparation intensive',
      'Cyclisme: Tour France, étape spectaculaire',
    ],
    'divertissement': [
      'Cinéma: Blockbuster français cartonne international',
      'TV: Nouvelle série succès plateforme française',
      'Célébrités: Interview exclusive star internationale',
      'Mode: Fashion Week Paris, créateurs émergents',
      'Gaming: Jeu vidéo français remporte prix',
    ],
  };

  const sources: Array<{ type: Video['source']; prefix: string }> = [
    { type: 'youtube', prefix: 'YT' },
    { type: 'rss', prefix: 'RSS' },
    { type: 'creator', prefix: 'CR' },
  ];

  const dynamicTags = [
    'breaking-news', 'elections-2024', 'climate-summit', 'tech-innovation',
    'covid-updates', 'ukraine-conflict', 'economic-crisis', 'sports-finals',
    'cultural-events', 'health-breakthrough'
  ];

  const videos: Video[] = [];
  let idCounter = 1;

  // Generate videos for each Google News category
  Object.entries(titles).forEach(([category, categoryTitles]) => {
    categoryTitles.forEach((title, index) => {
      const daysAgo = Math.floor(Math.random() * 7) + 1;
      const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const source = sources[Math.floor(Math.random() * sources.length)];
      const duration = Math.floor(Math.random() * 1800) + 30; // 30s to 30min
      const views = Math.floor(Math.random() * 2000000) + 1000;
      const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
      const comments = Math.floor(likes * (Math.random() * 0.2 + 0.1));

      // Premier video de chaque catégorie = main video (plus de vues)
      const isMainVideo = index === 0;
      const adjustedViews = isMainVideo ? views * 3 : views;

      videos.push({
        id: `${idCounter++}`,
        title,
        description: `${title} - Analyse approfondie avec experts et témoignages. Restez informé des derniers développements.`,
        category,
        dynamicTags: [dynamicTags[Math.floor(Math.random() * dynamicTags.length)]],
        source: source.type,
        url: `https://example.com/video/${idCounter}`,
        thumbnail: `https://images.pexels.com/photos/${1000000 + idCounter}/pexels-photo-${1000000 + idCounter}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360`,
        durationSec: duration,
        publishedAt: publishedAt.toISOString(),
        views: adjustedViews,
        language: 'fr',
        visible: true,
        likes,
        comments,
        creator: {
          id: `creator-${Math.floor(index / 2) + 1}`,
          name: index === 0 ? 'BFM TV' : index === 1 ? 'France Info' : index === 2 ? 'Le Figaro' : `Créateur ${Math.floor(index / 2) + 1}`,
          subscriberCount: Math.floor(Math.random() * 1000000) + 50000,
        },
      });
    });
  });

  return videos;
};

export const MOCK_VIDEOS = generateMockVideos();
export const CATEGORIES = GOOGLE_NEWS_CATEGORIES;

export const getDynamicCategories = (videos: Video[]): Category[] => {
  const tagCounts = new Map<string, number>();
  
  videos.forEach(video => {
    video.dynamicTags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag, count], index) => ({
      id: `dynamic-${tag}`,
      name: tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: tag,
      isDynamic: true,
    }));
};