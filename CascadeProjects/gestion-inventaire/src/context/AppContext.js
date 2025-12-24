import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Traductions
const translations = {
  fr: {
    // Navigation
    inventoryManagement: 'Gestion d\'Inventaire',
    dashboard: 'Tableau de bord',
    admin: 'Administration',
    login: 'Connexion',
    logout: 'Déconnexion',
    register: 'Inscription',
    
    // Paramètres
    settings: {
      title: 'Paramètres',
      appearance: 'Apparence',
      theme: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      language: 'Langue',
      save: 'Enregistrer les paramètres',
      notifications: 'Notifications',
      emailNotifications: 'Notifications par email',
      display: 'Affichage',
      itemsPerPage: 'Articles par page',
      adminSettings: 'Paramètres administrateur',
      taxRate: 'Taux de TVA (%)',
      currency: 'Devise',
      saveSuccess: 'Paramètres enregistrés avec succès',
      enableNotifications: 'Activer les notifications',
      exportData: 'Exporter les données',
      exportFormat: 'Format d\'exportation',
      exportOptions: {
        xlsx: 'Excel (.xlsx)',
        csv: 'CSV (.csv)',
        json: 'JSON (.json)'
      },
      security: 'Sécurité',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      passwordUpdated: 'Mot de passe mis à jour avec succès',
      profile: 'Profil',
      updateProfile: 'Mettre à jour le profil',
      profileUpdated: 'Profil mis à jour avec succès',
      general: 'Général',
      dateFormat: 'Format de date',
      timeFormat: 'Format d\'heure',
      currencySettings: 'Paramètres de devise',
      decimalPlaces: 'Décimales',
      currencySymbol: 'Symbole monétaire',
      currencyPosition: 'Position du symbole',
      left: 'Gauche',
      right: 'Droite',
      thousandsSeparator: 'Séparateur de milliers',
      decimalSeparator: 'Séparateur décimal',
      about: 'À propos',
      version: 'Version',
      license: 'Licence',
      contactSupport: 'Contacter le support',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: 'Conditions d\'utilisation'
    },
    
    // Articles
    addArticle: 'Ajouter un article',
    editArticle: 'Modifier l\'article',
    articleAdded: 'Article ajouté avec succès',
    articleUpdated: 'Article mis à jour avec succès',
    articleDeleted: 'Article supprimé avec succès',
    
    // Champs de formulaire
    search: 'Rechercher un article...',
    reference: 'Référence',
    designation: 'Désignation',
    description: 'Description',
    category: 'Catégorie',
    purchasePrice: 'Prix d\'achat',
    salePrice: 'Prix de vente',
    stock: 'Stock',
    quantity: 'Quantité',
    alertThreshold: 'Seuil d\'alerte',
    
    // Actions
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    
    // Tableaux
    rowsPerPage: 'Lignes par page:',
    noResults: 'Aucun résultat trouvé',
    
    // Paramètres
    settings: 'Paramètres',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    language: 'Langue',
    currency: 'Devise',
    
    // Messages
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    yes: 'Oui',
    no: 'Non',
    
    // Statistiques
    totalItems: 'Total des articles',
    lowStockItems: 'Articles en alerte',
    outOfStock: 'Rupture de stock',
    totalValue: 'Valeur totale',
    
    // Erreurs
    error: 'Erreur',
    requiredField: 'Ce champ est requis',
    invalidNumber: 'Veuillez entrer un nombre valide'
  },
  en: {
    // Navigation
    inventoryManagement: 'Inventory Management',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    
    // Settings
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      language: 'Language',
      save: 'Save Settings',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      display: 'Display',
      itemsPerPage: 'Items per page',
      adminSettings: 'Admin Settings',
      taxRate: 'Tax Rate (%)',
      currency: 'Currency',
      saveSuccess: 'Settings saved successfully',
      enableNotifications: 'Enable notifications',
      exportData: 'Export Data',
      exportFormat: 'Export Format',
      exportOptions: {
        xlsx: 'Excel (.xlsx)',
        csv: 'CSV (.csv)',
        json: 'JSON (.json)'
      },
      security: 'Security',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordUpdated: 'Password updated successfully',
      profile: 'Profile',
      updateProfile: 'Update Profile',
      profileUpdated: 'Profile updated successfully',
      general: 'General',
      dateFormat: 'Date Format',
      timeFormat: 'Time Format',
      currencySettings: 'Currency Settings',
      decimalPlaces: 'Decimal Places',
      currencySymbol: 'Currency Symbol',
      currencyPosition: 'Currency Position',
      left: 'Left',
      right: 'Right',
      thousandsSeparator: 'Thousands Separator',
      decimalSeparator: 'Decimal Separator',
      about: 'About',
      version: 'Version',
      license: 'License',
      contactSupport: 'Contact Support',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    },
    
    // Articles
    addArticle: 'Add article',
    editArticle: 'Edit article',
    articleAdded: 'Article added successfully',
    articleUpdated: 'Article updated successfully',
    articleDeleted: 'Article deleted successfully',
    
    // Form fields
    search: 'Search an article...',
    reference: 'Reference',
    designation: 'Designation',
    description: 'Description',
    category: 'Category',
    purchasePrice: 'Purchase price',
    salePrice: 'Sale price',
    stock: 'Stock',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    rowsPerPage: 'Rows per page:',
    noResults: 'No results found',
    add: 'Add',
    save: 'Save',
    cancel: 'Cancel',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    language: 'Language',
    currency: 'Currency',
    confirmDelete: 'Are you sure you want to delete this item?',
    yes: 'Yes',
    no: 'No'
  },
  es: {
    // Navegación
    inventoryManagement: 'Gestión de Inventario',
    dashboard: 'Panel de control',
    admin: 'Administración',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    
    // Artículos
    addArticle: 'Añadir artículo',
    editArticle: 'Editar artículo',
    articleAdded: 'Artículo añadido correctamente',
    articleUpdated: 'Artículo actualizado correctamente',
    articleDeleted: 'Artículo eliminado correctamente',
    
    // Campos del formulario
    search: 'Buscar un artículo...',
    reference: 'Referencia',
    designation: 'Designación',
    description: 'Descripción',
    category: 'Categoría',
    purchasePrice: 'Precio de compra',
    salePrice: 'Precio de venta',
    stock: 'Existencias',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    rowsPerPage: 'Filas por página:',
    noResults: 'No se encontraron resultados',
    add: 'Añadir',
    save: 'Guardar',
    cancel: 'Cancelar',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    language: 'Idioma',
    currency: 'Moneda',
    confirmDelete: '¿Estás seguro de que quieres eliminar este elemento?',
    yes: 'Sí',
    no: 'No'
  }
};

// Devises supportées
const currencies = {
  USD: { symbol: '$', name: 'US Dollar', format: (value) => `$${value.toFixed(2)}` },
  EUR: { symbol: '€', name: 'Euro', format: (value) => `${value.toFixed(2)} €` },
  XOF: { symbol: 'FCFA', name: 'Franc CFA', format: (value) => `${Math.round(value).toLocaleString()} FCFA` },
  XAF: { symbol: 'FCFA', name: 'Franc CFA (BEAC)', format: (value) => `${Math.round(value).toLocaleString()} FCFA` },
  GBP: { symbol: '£', name: 'British Pound', format: (value) => `£${value.toFixed(2)}` },
  JPY: { symbol: '¥', name: 'Japanese Yen', format: (value) => `¥${value.toLocaleString()}` },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', format: (value) => `C$${value.toFixed(2)}` },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', format: (value) => `${value.toFixed(2)} CHF` },
  CNY: { symbol: '¥', name: 'Chinese Yuan', format: (value) => `¥${value.toFixed(2)}` },
  INR: { symbol: '₹', name: 'Indian Rupee', format: (value) => `₹${value.toLocaleString()}` },
  MGA: { symbol: 'Ar', name: 'Malagasy Ariary', format: (value) => `${Math.round(value).toLocaleString()} Ar` },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham', format: (value) => `${value.toFixed(2)} DH` },
  TND: { symbol: 'DT', name: 'Tunisian Dinar', format: (value) => `${value.toFixed(3)} DT` },
  DZD: { symbol: 'DA', name: 'Algerian Dinar', format: (value) => `${value.toLocaleString()} DA` },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', format: (value) => `E£${value.toFixed(2)}` },
  ZAR: { symbol: 'R', name: 'South African Rand', format: (value) => `R${value.toFixed(2)}` },
  NGN: { symbol: '₦', name: 'Nigerian Naira', format: (value) => `₦${value.toLocaleString()}` },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', format: (value) => `KSh${value.toLocaleString()}` },
  GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi', format: (value) => `GH₵${value.toFixed(2)}` },
  UGX: { symbol: 'USh', name: 'Ugandan Shilling', format: (value) => `USh${value.toLocaleString()}` },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling', format: (value) => `TSh${value.toLocaleString()}` },
  RWF: { symbol: 'RF', name: 'Rwandan Franc', format: (value) => `${value.toLocaleString()} RF` },
  ETB: { symbol: 'Br', name: 'Ethiopian Birr', format: (value) => `Br${value.toFixed(2)}` },
  ZMW: { symbol: 'K', name: 'Zambian Kwacha', format: (value) => `K${value.toFixed(2)}` },
  MUR: { symbol: 'Rs', name: 'Mauritian Rupee', format: (value) => `Rs ${value.toFixed(2)}` },
  SCR: { symbol: 'SR', name: 'Seychellois Rupee', format: (value) => `SR${value.toFixed(2)}` },
  BWP: { symbol: 'P', name: 'Botswanan Pula', format: (value) => `P${value.toFixed(2)}` },
  MWK: { symbol: 'MK', name: 'Malawian Kwacha', format: (value) => `MK${value.toLocaleString()}` },
  ZWL: { symbol: 'Z$', name: 'Zimbabwean Dollar', format: (value) => `Z$${value.toFixed(2)}` }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [language, setLanguage] = useLocalStorage('language', navigator.language.startsWith('fr') ? 'fr' : 
    navigator.language.startsWith('es') ? 'es' : 'en');
  const [currency, setCurrency] = useLocalStorage('currency', 'XOF');
  
  // Écouter les changements de préférence de thème du système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [setDarkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const changeCurrency = (curr) => {
    if (currencies[curr]) {
      setCurrency(curr);
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || key;
    
    // Remplacer les paramètres dans la traduction
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, value);
    });
    
    return translation;
  };

  const formatCurrency = (value) => {
    const curr = currencies[currency] || currencies['XOF'];
    return curr.format(value);
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
            contrastText: '#fff',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
            contrastText: '#fff',
          },
          error: {
            main: '#f44336',
          },
          warning: {
            main: '#ff9800',
          },
          info: {
            main: '#2196f3',
          },
          success: {
            main: '#4caf50',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: darkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            secondary: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            disabled: darkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
          },
          divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { 
            fontSize: '2.5rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          h2: { 
            fontSize: '2rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          h3: { 
            fontSize: '1.75rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          h4: { 
            fontSize: '1.5rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          h5: { 
            fontSize: '1.25rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          h6: { 
            fontSize: '1rem', 
            fontWeight: 500,
            color: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
          },
          button: {
            textTransform: 'none',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode 
                  ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 12px 20px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 16px rgba(0, 0, 0, 0.15)',
                },
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
              fullWidth: true,
              margin: 'normal',
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        changeLanguage,
        currency,
        changeCurrency,
        t,
        formatCurrency,
        currencies: Object.entries(currencies).map(([code, data]) => ({
          code,
          ...data
        })),
        languages: [
          { code: 'fr', name: 'Français' },
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Español' }
        ]
      }}
    >
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
