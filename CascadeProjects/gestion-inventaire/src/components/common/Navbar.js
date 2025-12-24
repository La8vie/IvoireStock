import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageCurrencySelector from './LanguageCurrencySelector';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useApp();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: isMobile ? '1rem' : '1.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: isMobile ? '150px' : 'none'
          }}
        >
          {t('inventoryManagement')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageCurrencySelector />
          
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  {t('dashboard')}
                </Button>
                {user.role === 'admin' && (
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/admin"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    {t('admin')}
                  </Button>
                )}
                {user && (
                  <>
                    <Tooltip title={t('settings.title')}>
                      <IconButton 
                        color="inherit" 
                        component={RouterLink} 
                        to="/settings"
                        sx={{ 
                          marginRight: 1,
                          display: { xs: 'none', sm: 'flex' }
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                    <Button color="inherit" onClick={handleLogout}>
                      {t('auth.logout')}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {t('login')}
                </Button>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/register"
                  sx={{ 
                    display: { xs: 'none', sm: 'inline-flex' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t('register')}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
