import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  Box,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  TablePagination,
  useMediaQuery,
  useTheme,
  Grid,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  FileDownload as FileDownloadIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ArticleForm from '../components/articles/ArticleForm';
import DashboardStats from '../components/dashboard/DashboardStats';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const { t } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Fonction pour exporter en Excel
  const exportToExcel = () => {
    try {
      // Créer un nouveau classeur
      const wb = XLSX.utils.book_new();
      
      // Préparer les données pour l'export
      const data = filteredArticles.map(article => ({
        'Référence': article.reference,
        'Désignation': article.nom,
        'Description': article.description,
        'Catégorie': article.categorie,
        'Quantité': article.quantite,
        'Prix': article.prix,
        'Devise': article.currency || 'XOF',
        'Date d\'ajout': formatDate(article.dateAjout),
        'Seuil d\'alerte': article.seuilAlerte || 5
      }));
      
      // Créer une feuille de calcul
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Ajuster la largeur des colonnes
      const wscols = [
        { wch: 15 }, // Référence
        { wch: 25 }, // Désignation
        { wch: 30 }, // Description
        { wch: 20 }, // Catégorie
        { wch: 10 }, // Quantité
        { wch: 15 }, // Prix
        { wch: 10 }, // Devise
        { wch: 15 }, // Date d'ajout
        { wch: 15 }  // Seuil d'alerte
      ];
      ws['!cols'] = wscols;
      
      // Ajouter la feuille au classeur
      XLSX.utils.book_append_sheet(wb, ws, 'Inventaire');
      
      // Générer le fichier Excel
      const fileName = `inventaire_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      // Fermer le menu déroulant
      setAnchorEl(null);
      
      // Afficher un message de succès
      showSuccessMessage('exportSuccess');
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      showErrorMessage('exportError');
    }
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Fonction pour formater la date au format lisible
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const showSuccessMessage = (messageKey) => {
    setSnackbar({
      open: true,
      message: t(messageKey),
      severity: 'success',
    });
  };
  
  const showErrorMessage = (message) => {
    setSnackbar({
      open: true,
      message: message || t('error'),
      severity: 'error',
    });
  };

  // Charger les articles depuis le localStorage au chargement
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('inventory')) || [
      // Données de démonstration
      {
        id: '1',
        reference: 'REF-001',
        nom: 'Ordinateur portable',
        description: 'PC portable haute performance',
        quantite: 15,
        prix: 999.99,
        categorie: 'Informatique',
        dateAjout: new Date().toISOString(),
        seuilAlerte: 5
      },
      {
        id: '2',
        reference: 'REF-002',
        nom: 'Smartphone',
        description: 'Smartphone dernier cri',
        quantite: 30,
        prix: 699.99,
        categorie: 'Électronique',
        dateAjout: new Date().toISOString(),
        seuilAlerte: 10
      }
    ];
    setArticles(savedArticles);
  }, []);

  // Sauvegarder les articles dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(articles));
  }, [articles]);

  const filteredArticles = articles.filter(article => 
    article.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddArticle = () => {
    setCurrentArticle(null);
    setOpenForm(true);
  };

  const handleEditArticle = (article) => {
    setCurrentArticle(article);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        const updatedArticles = articles.filter(article => article.id !== id);
        setArticles(updatedArticles);
        localStorage.setItem('inventory', JSON.stringify(updatedArticles));
        showSuccessMessage('articleDeleted');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        showErrorMessage('deleteError');
      }
    }
  };

  const handleSubmitArticle = (articleData) => {
    try {
      if (currentArticle) {
        // Mise à jour d'un article existant
        const updatedArticles = articles.map(a => 
          a.id === articleData.id ? { ...articleData } : a
        );
        setArticles(updatedArticles);
        localStorage.setItem('inventory', JSON.stringify(updatedArticles));
        showSuccessMessage('articleUpdated');
      } else {
        // Ajout d'un nouvel article
        const newArticle = {
          ...articleData,
          id: Date.now().toString(),
          dateAjout: new Date().toISOString(),
        };
        const updatedArticles = [...articles, newArticle];
        setArticles(updatedArticles);
        localStorage.setItem('inventory', JSON.stringify(updatedArticles));
        showSuccessMessage('articleAdded');
      }
      setOpenForm(false);
      setCurrentArticle(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'article:', error);
      showErrorMessage('saveError');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getQuantityColor = (quantity, threshold) => {
    if (quantity === 0) return 'error';
    if (quantity <= threshold) return 'warning';
    return 'success';
  };

  const paginatedArticles = filteredArticles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
          ml: { sm: '240px' },
        }}
      >
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h4" component="h1">{t('dashboard')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
              {!isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportToExcel}
                  size="medium"
                  sx={{ 
                    minWidth: 'auto',
                    order: 1
                  }}
                >
                  {t('exportExcel')}
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setCurrentArticle(null);
                  setOpenForm(true);
                }}
                fullWidth={isMobile}
                size={isMobile ? 'large' : 'medium'}
                sx={{ 
                  minWidth: isMobile ? '100%' : 'auto',
                  order: isMobile ? 2 : 2
                }}
              >
                {t('addArticle')}
              </Button>
              
              {isMobile && (
                <IconButton
                  color="primary"
                  onClick={handleMenuOpen}
                  size="large"
                  sx={{ order: 1 }}
                  aria-label="plus d'options"
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
              >
                <MenuItem onClick={exportToExcel}>
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('exportExcel')}</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('search')}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardStats articles={articles} isMobile={isMobile} />
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%', overflowX: 'auto' }}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  {!isMobile && <TableCell>{t('reference')}</TableCell>}
                  <TableCell>{t('designation')}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>{t('category')}</TableCell>
                      <TableCell align="right">{t('purchasePrice')}</TableCell>
                    </>
                  )}
                  <TableCell align="right">{t('salePrice')}</TableCell>
                  <TableCell align="center">{t('stock')}</TableCell>
                  <TableCell align="center">{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <TableRow 
                      key={article.id}
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      {!isMobile && <TableCell>{article.reference}</TableCell>}
                      <TableCell sx={{ fontWeight: 'medium' }}>{article.nom}</TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>{article.categorie}</TableCell>
                          <TableCell align="right">{article.prix}</TableCell>
                        </>
                      )}
                      <TableCell align="right">{article.prix}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={article.quantite}
                          color={getQuantityColor(article.quantite, article.seuilAlerte || 5)}
                          size="small"
                          variant={article.quantite <= (article.seuilAlerte || 5) ? 'filled' : 'outlined'}
                          icon={article.quantite === 0 ? <WarningIcon /> : null}
                        />
                        {article.quantite <= (article.seuilAlerte || 5) && (
                          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                            {article.quantite === 0 
                              ? 'Rupture de stock' 
                              : `Seuil d'alerte: ${article.seuilAlerte || 5}`}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t('edit')}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditArticle(article)}
                            size="small"
                            aria-label={t('edit')}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('delete')}>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(article.id)}
                            size="small"
                            aria-label={t('delete')}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ color: 'text.secondary' }}>
                        {searchTerm 
                          ? t('noResults')
                          : t('noArticles')}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredArticles.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredArticles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? `${t('rowsPerPage')}` : t('rowsPerPage')}
                labelDisplayedRows={({ from, to, count }) => 
                  isMobile 
                    ? `${from}-${to}/${count}` 
                    : `${from}-${to} ${t('of')} ${count !== -1 ? count : `more than ${to}`}`}
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  },
                  '& .MuiTablePagination-actions': {
                    margin: 0,
                  },
                  '& .MuiTablePagination-displayedRows': {
                    margin: '8px 0',
                  }
                }}
              />
            )}
          </TableContainer>
        </Container>
      </Box>
      
      {/* Formulaire d'ajout/modification d'article */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <ArticleForm
          open={openForm}
          handleClose={() => {
            setOpenForm(false);
            setCurrentArticle(null);
          }}
          article={currentArticle}
          onSubmit={handleSubmitArticle}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default Dashboard;
