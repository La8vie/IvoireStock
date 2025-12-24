const STORAGE_KEY = 'fournisseurs';

// Récupérer tous les fournisseurs
export const getFournisseurs = () => {
  const fournisseurs = localStorage.getItem(STORAGE_KEY);
  return fournisseurs ? JSON.parse(fournisseurs) : [];
};

// Ajouter un fournisseur
export const addFournisseur = (fournisseur) => {
  const fournisseurs = getFournisseurs();
  const newFournisseur = {
    id: Date.now().toString(),
    dateCreation: new Date().toISOString(),
    ...fournisseur
  };
  
  const updatedFournisseurs = [...fournisseurs, newFournisseur];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFournisseurs));
  return newFournisseur;
};

// Mettre à jour un fournisseur
export const updateFournisseur = (id, updatedData) => {
  const fournisseurs = getFournisseurs();
  const index = fournisseurs.findIndex(f => f.id === id);
  
  if (index === -1) return null;
  
  const updatedFournisseur = {
    ...fournisseurs[index],
    ...updatedData,
    dateMiseAJour: new Date().toISOString()
  };
  
  fournisseurs[index] = updatedFournisseur;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fournisseurs));
  return updatedFournisseur;
};

// Supprimer un fournisseur
export const deleteFournisseur = (id) => {
  const fournisseurs = getFournisseurs();
  const updatedFournisseurs = fournisseurs.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFournisseurs));
  return id;
};

// Récupérer un fournisseur par son ID
export const getFournisseurById = (id) => {
  const fournisseurs = getFournisseurs();
  return fournisseurs.find(f => f.id === id);
};
