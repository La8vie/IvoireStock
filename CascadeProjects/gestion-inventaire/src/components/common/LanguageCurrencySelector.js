import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const LanguageCurrencySelector = () => {
  const { 
    language, 
    changeLanguage, 
    currency, 
    changeCurrency, 
    darkMode, 
    toggleDarkMode,
    languages,
    currencies,
    t
  } = useApp();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Options de langue formatées pour le menu déroulant
  const languageOptions = languages.map(lang => ({
    value: lang.code,
    label: lang.name,
    icon: `https://flagcdn.com/16x12/${lang.code === 'en' ? 'us' : lang.code}.png`
  }));
  
  // Options de devise formatées pour le menu déroulant
  const currencyOptions = Object.entries(currencies).map(([code, data]) => ({
    value: code,
    label: `${code} - ${data.name}`,
    symbol: data.symbol
  }));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        justifyContent: isMobile ? 'center' : 'flex-end',
        width: isMobile ? '100%' : 'auto',
        py: isMobile ? 1 : 0
      }}
    >
      {/* Sélecteur de langue */}
      <FormControl 
        size="small" 
        sx={{ 
          minWidth: isMobile ? '45%' : 140,
          mb: isMobile ? 1 : 0,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
          },
        }}
      >
        <InputLabel id="language-select-label" sx={{ color: 'text.primary' }}>
          {isMobile ? <LanguageIcon fontSize="small" /> : t('language')}
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          label={isMobile ? '' : t('language')}
          onChange={(e) => changeLanguage(e.target.value)}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1,
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <img 
                  src={option.icon} 
                  alt={option.label} 
                  style={{ width: 20, height: 15, borderRadius: 2 }} 
                />
                <span style={{ flex: 1 }}>{option.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sélecteur de devise */}
      <FormControl 
        size="small" 
        sx={{ 
          minWidth: isMobile ? '45%' : 140,
          mb: isMobile ? 1 : 0,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 1,
            },
          },
        }}
      >
        <InputLabel id="currency-select-label" sx={{ color: 'text.primary' }}>
          {isMobile ? <CurrencyExchangeIcon fontSize="small" /> : t('currency')}
        </InputLabel>
        <Select
          labelId="currency-select-label"
          id="currency-select"
          value={currency}
          label={isMobile ? '' : t('currency')}
          onChange={(e) => changeCurrency(e.target.value)}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1,
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {currencyOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <span style={{ fontWeight: 500, minWidth: 40 }}>{option.symbol}</span>
                <span style={{ flex: 1 }}>{option.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Bouton de basculement du mode sombre */}
      <Tooltip title={darkMode ? t('lightMode') : t('darkMode')} arrow>
        <IconButton 
          onClick={toggleDarkMode} 
          aria-label={darkMode ? t('lightMode') : t('darkMode')}
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {darkMode ? (
            <Brightness7Icon sx={{ color: theme.palette.warning.main }} />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default LanguageCurrencySelector;
