import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  FormHelperText,
  Box,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { useApp } from '../../context/AppContext';

const ArticleForm = ({ open, handleClose, article, onSubmit }) => {
  const { currencies, currency, formatCurrency } = useApp();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [formData, setFormData] = useState({
    reference: '',
    nom: '',
    description: '',
    quantite: 0,
    quantiteParLot: 1,
    prixAchat: 0,
    prixVente: 0,
    categorie: '',
    dateAjout: new Date(),
    seuilAlerte: 5,
    typeAlimentation: '',
    dateExpiration: null,
    fournisseur: ''
  });

  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données de l'article en mode édition
  useEffect(() => {
    if (article) {
      setFormData({
        reference: article.reference || '',
        nom: article.nom || '',
        description: article.description || '',
        quantite: article.quantite || 0,
        quantiteParLot: article.quantiteParLot || 1,
        prixAchat: article.prixAchat || 0,
        prixVente: article.prixVente || 0,
        categorie: article.categorie || '',
        dateAjout: article.dateAjout ? new Date(article.dateAjout) : new Date(),
        seuilAlerte: article.seuilAlerte || 5,
        typeAlimentation: article.typeAlimentation || '',
        dateExpiration: article.dateExpiration ? new Date(article.dateExpiration) : null,
        fournisseur: article.fournisseur || ''
      });
    } else {
      // Réinitialiser le formulaire pour un nouvel article
      setFormData({
        reference: '',
        nom: '',
        description: '',
        quantite: 0,
        quantiteParLot: 1,
        prixAchat: 0,
        prixVente: 0,
        categorie: '',
        dateAjout: new Date(),
        seuilAlerte: 5,
        fournisseur: ''
      });
    }
  }, [article, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.reference.trim()) newErrors.reference = 'La référence est requise';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (formData.quantite < 0) newErrors.quantite = 'La quantité ne peut pas être négative';
    if (formData.quantiteParLot <= 0) newErrors.quantiteParLot = 'La quantité par lot doit être supérieure à 0';
    if (formData.prixAchat < 0) newErrors.prixAchat = 'Le prix d\'achat ne peut pas être négatif';
    if (formData.prixVente < 0) newErrors.prixVente = 'Le prix de vente ne peut pas être négatif';
    if (formData.prixVente < formData.prixAchat) newErrors.prixVente = 'Le prix de vente doit être supérieur au prix d\'achat';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantite' || name === 'prix' || name === 'seuilAlerte' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateAjout: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        id: article ? article.id : Date.now().toString(),
        currency: selectedCurrency,
        dateAjout: formData.dateAjout.toISOString()
      });
      handleClose();
    }
  };

  const categories = [
    'Alimentation',
    'Électronique',
    'Informatique',
    'Bureautique',
    'Mobilier',
    'Fournitures',
    'Autre'
  ];
  
  // Vérifie si la catégorie est Alimentation
  const isAlimentation = formData.categorie === 'Alimentation';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {article ? 'Modifier l\'article' : 'Nouvel article'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Référence *"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                margin="normal"
                error={!!errors.reference}
                helperText={errors.reference}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom *"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                margin="normal"
                error={!!errors.nom}
                helperText={errors.nom}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantité en stock (en unités) *"
                name="quantite"
                type="number"
                value={formData.quantite}
                onChange={handleChange}
                margin="normal"
                error={!!errors.quantite}
                helperText={errors.quantite || `Total: ${formData.quantite * formData.quantiteParLot} unités`}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantité par lot *"
                name="quantiteParLot"
                type="number"
                value={formData.quantiteParLot}
                onChange={handleChange}
                margin="normal"
                error={!!errors.quantiteParLot}
                helperText={errors.quantiteParLot || 'Nombre d\'unités par lot'}
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    label="Prix d'achat (par lot)"
                    name="prixAchat"
                    type="number"
                    value={formData.prixAchat}
                    onChange={handleChange}
                    error={!!errors.prixAchat}
                    helperText={errors.prixAchat || `Prix unitaire: ${(formData.prixAchat / formData.quantiteParLot).toFixed(2)} ${selectedCurrency}`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            variant="standard"
                            sx={{
                              '& .MuiSelect-select': {
                                paddingRight: '8px',
                                paddingLeft: '8px',
                                minWidth: '60px',
                                fontSize: '0.875rem',
                                border: 'none',
                                '&:focus': {
                                  background: 'transparent',
                                },
                              },
                              '&:before, &:after': {
                                display: 'none',
                              },
                              '& .MuiSelect-icon': {
                                right: 0,
                              },
                            }}
                          >
                            {Object.entries(currencies).map(([code, data]) => (
                              <MenuItem key={code} value={code}>
                                {code} - {data.symbol}
                              </MenuItem>
                            ))}
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <Box sx={{ mt: 1, ml: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {formatCurrency(formData.prixAchat || 0, selectedCurrency)} par lot
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    label="Prix de vente (par lot)"
                    name="prixVente"
                    type="number"
                    value={formData.prixVente}
                    onChange={handleChange}
                    error={!!errors.prixVente}
                    helperText={errors.prixVente || `Marge: ${formData.prixVente > 0 ? (((formData.prixVente - formData.prixAchat) / formData.prixAchat * 100).toFixed(2) + '%') : '0%'}`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            variant="standard"
                            sx={{
                              '& .MuiSelect-select': {
                                paddingRight: '8px',
                                paddingLeft: '8px',
                                minWidth: '60px',
                                fontSize: '0.875rem',
                                border: 'none',
                                '&:focus': {
                                  background: 'transparent',
                                },
                              },
                              '&:before, &:after': {
                                display: 'none',
                              },
                              '& .MuiSelect-icon': {
                                right: 0,
                              },
                            }}
                          >
                            {Object.entries(currencies).map(([code, data]) => (
                              <MenuItem key={code} value={code}>
                                {code} - {data.symbol}
                              </MenuItem>
                            ))}
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ mt: 1, ml: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {formatCurrency(formData.prixVente / formData.quantiteParLot || 0, selectedCurrency)} unité
                    </Typography>
                  </Box>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" error={!!errors.categorie}>
                <InputLabel>Catégorie *</InputLabel>
                <Select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  label="Catégorie *"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categorie && (
                  <FormHelperText>{errors.categorie}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fournisseur"
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                margin="normal"
                helperText="Nom du fournisseur"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date d'ajout"
                  value={formData.dateAjout}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      helperText="Date d'ajout de l'article"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            {isAlimentation && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Type d'alimentation"
                    name="typeAlimentation"
                    value={formData.typeAlimentation || ''}
                    onChange={handleChange}
                    margin="normal"
                    helperText="Ex: Végétarien, Végétalien, Sans gluten, etc."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <DatePicker
                      label="Date d'expiration"
                      value={formData.dateExpiration || null}
                      onChange={(date) => 
                        setFormData(prev => ({ ...prev, dateExpiration: date }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          helperText="Date de péremption du produit"
                        />
                      )}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {article ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ArticleForm;
