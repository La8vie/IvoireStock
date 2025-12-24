import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Switch, 
  FormControlLabel, 
  Button, 
  Grid,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Settings() {
  const { currentUser } = useAuth();
  const { t, darkMode, toggleDarkMode, language, changeLanguage, currency, changeCurrency } = useApp();
  
  const [settings, setSettings] = useState({
    theme: darkMode ? 'dark' : 'light',
    language: language,
    notifications: true,
    itemsPerPage: 10,
    currency: currency,
  });
  
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'userSettings', currentUser.uid));
          if (userDoc.exists()) {
            setSettings(prev => ({
              ...prev,
              ...userDoc.data()
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des paramètres:', error);
        }
      }
    };
    loadSettings();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Mise à jour immédiate pour le thème
    if (name === 'theme') {
      toggleDarkMode(newValue === 'dark');
    }
    // Mise à jour immédiate pour la langue
    else if (name === 'language') {
      changeLanguage(newValue);
    }
    // Mise à jour immédiate pour la devise
    else if (name === 'currency') {
      changeCurrency(newValue);
    }
  };

  const saveSettings = async () => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'userSettings', currentUser.uid), settings, { merge: true });
      setSuccess(t('settings.saveSuccess'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>{t('settings.title')}</Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{t('settings.appearance')}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.theme')}</InputLabel>
              <Select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                label={t('settings.theme')}
              >
                <MenuItem value="light">{t('settings.light')}</MenuItem>
                <MenuItem value="dark">{t('settings.dark')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.language')}</InputLabel>
              <Select
                name="language"
                value={settings.language}
                onChange={handleChange}
                label={t('settings.language')}
              >
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{t('settings.display')}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.itemsPerPage')}</InputLabel>
              <Select
                name="itemsPerPage"
                value={settings.itemsPerPage}
                onChange={handleChange}
                label={t('settings.itemsPerPage')}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('settings.currency')}</InputLabel>
              <Select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                label={t('settings.currency')}
              >
                <MenuItem value="XOF">FCFA</MenuItem>
                <MenuItem value="EUR">€ Euro</MenuItem>
                <MenuItem value="USD">$ US Dollar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>{t('settings.notifications')}</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={handleChange}
              name="notifications"
              color="primary"
            />
          }
          label={t('settings.enableNotifications')}
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={saveSettings}
          disabled={!currentUser}
        >
          {t('settings.save')}
        </Button>
      </Box>
    </Container>
  );
}
