const STORAGE_KEY = 'mouvementsStock';

type TypeMouvement = 'entree' | 'sortie' | 'ajustement' | 'inventaire';

// Interface pour un mouvement de stock
interface MouvementStock {
  id: string;
  articleId: string;
  type: TypeMouvement;
  quantite: number;
  date: string;
  utilisateurId: string;
  reference?: string;
  fournisseurId?: string;
  notes?: string;
}

// Récupérer tous les mouvements
export const getMouvements = (filters = {}): MouvementStock[] => {
  const mouvements = localStorage.getItem(STORAGE_KEY);
  let result = mouvements ? JSON.parse(mouvements) : [];
  
  // Appliquer les filtres
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      result = result.filter(mouvement => mouvement[key] === value);
    }
  });
  
  return result;
};

// Ajouter un mouvement de stock
export const addMouvement = (mouvement: Omit<MouvementStock, 'id' | 'date'>): MouvementStock => {
  const mouvements = getMouvements();
  const newMouvement = {
    ...mouvement,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  
  const updatedMouvements = [...mouvements, newMouvement];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMouvements));
  return newMouvement;
};

// Récupérer l'historique d'un article
export const getHistoriqueArticle = (articleId: string): MouvementStock[] => {
  return getMouvements({ articleId }).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Calculer le stock actuel d'un article
export const getStockActuel = (articleId: string): number => {
  const mouvements = getMouvements({ articleId });
  return mouvements.reduce((total, mvt) => {
    if (mvt.type === 'entree' || mvt.type === 'ajustement') {
      return total + mvt.quantite;
    } else if (mvt.type === 'sortie') {
      return total - mvt.quantite;
    }
    return total;
  }, 0);
};

// Générer un rapport de stock
export const genererRapportStock = (filters = {}) => {
  const mouvements = getMouvements(filters);
  
  // Grouper par article
  const rapport = mouvements.reduce((acc, mvt) => {
    if (!acc[mvt.articleId]) {
      acc[mvt.articleId] = {
        articleId: mvt.articleId,
        entrees: 0,
        sorties: 0,
        ajustements: 0,
        stockInitial: 0,
        stockFinal: 0
      };
    }
    
    if (mvt.type === 'entree') {
      acc[mvt.articleId].entrees += mvt.quantite;
    } else if (mvt.type === 'sortie') {
      acc[mvt.articleId].sorties += mvt.quantite;
    } else if (mvt.type === 'ajustement') {
      acc[mvt.articleId].ajustements += mvt.quantite;
    }
    
    return acc;
  }, {});
  
  // Calculer les totaux
  return Object.values(rapport).map(article => ({
    ...article,
    stockFinal: article.stockInitial + article.entrees - article.sorties + article.ajustements
  }));
};
