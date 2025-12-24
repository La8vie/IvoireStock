import React, { useState, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useApp } from '../context/AppContext';

// Définition des rôles et permissions
const ROLES = {
  superadmin: {
    label: 'Super Admin',
    permissions: ['all'],
    canManage: ['admin', 'moderator', 'user']
  },
  admin: {
    label: 'Administrateur',
    permissions: ['manage_users', 'manage_subscriptions', 'view_reports'],
    canManage: ['moderator', 'user']
  },
  moderator: {
    label: 'Modérateur',
    permissions: ['manage_users', 'view_reports'],
    canManage: ['user']
  },
  user: {
    label: 'Utilisateur',
    permissions: [],
    canManage: []
  }
};

const subscriptionPlans = [
  { id: 'free', name: 'Gratuit', features: ['Accès de base'] },
  { id: 'premium', name: 'Premium', features: ['Toutes les fonctionnalités', 'Support prioritaire'] },
  { id: 'enterprise', name: 'Entreprise', features: ['Fonctionnalités avancées', 'Support 24/7'] }
];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'free',
    status: 'inactive',
    expiryDate: '',
    features: []
  });
  const [roleData, setRoleData] = useState({
    role: 'user',
    permissions: []
  });
  const { t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setSubscriptionData({
      plan: user.subscription?.plan || 'free',
      status: user.subscription?.status || 'inactive',
      expiryDate: user.subscription?.expiryDate || '',
      features: user.subscription?.features || []
    });
    setRoleData({
      role: user.role || 'user',
      permissions: user.permissions || []
    });
    setOpenEditDialog(true);
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRoleData({
      role: newRole,
      permissions: ROLES[newRole]?.permissions || []
    });
  };

  const togglePermission = (permission) => {
    setRoleData(prev => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: newPermissions };
    });
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      const updates = {
        role: roleData.role,
        permissions: roleData.permissions,
        updatedAt: serverTimestamp()
      };

      // Mettre à jour l'abonnement uniquement si nécessaire
      if (subscriptionData) {
        updates.subscription = {
          ...subscriptionData,
          updatedAt: serverTimestamp()
        };
      }

      await updateDoc(userRef, updates);

      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              ...updates,
              subscription: updates.subscription || user.subscription
            } 
          : user
      ));

      setOpenEditDialog(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const renderRoleBadge = (role) => {
    const roleConfig = ROLES[role] || { label: role, color: 'default' };
    return (
      <Chip 
        label={roleConfig.label} 
        color={
          role === 'superadmin' ? 'primary' : 
          role === 'admin' ? 'secondary' : 
          role === 'moderator' ? 'info' : 'default'
        }
        size="small"
      />
    );
  };

  const canManageRole = (targetRole) => {
    if (!currentUser) return false;
    const currentRole = currentUser.role;
    return ROLES[currentRole]?.canManage.includes(targetRole) || false;
  };

  const handleSubscriptionChange = (e) => {
    const { name, value } = e.target;
    setSubscriptionData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'plan' && {
        features: subscriptionPlans.find(p => p.id === value)?.features || []
      })
    }));
  };

  const renderSubscriptionStatus = (status) => {
    const statusColors = {
      active: 'success',
      inactive: 'error',
      pending: 'warning',
      expired: 'default'
    };

    return (
      <Chip 
        label={status} 
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  const currentUserRole = currentUser?.role || 'user';
  const manageableRoles = Object.entries(ROLES)
    .filter(([role]) => canManageRole(role))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  useEffect(() => {
    // Simuler la récupération de l'utilisateur actuel
    const fetchCurrentUser = async () => {
      // À remplacer par votre logique de récupération de l'utilisateur actuel
      const currentUserData = {
        id: 'current-user-id',
        role: 'superadmin' // À remplacer par le rôle réel de l'utilisateur
      };
      setCurrentUser(currentUserData);
      fetchUsers();
    };
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Chargement des utilisateurs...</Typography>
      </Container>
    );
  }

  if (!currentUser || !ROLES[currentUser.role]?.permissions.includes('all')) {
    return (
      <Container>
        <Typography color="error">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
      </Container>
    );
  }

  const handleOpenDialog = () => {
    setSelectedUser({ name: '', email: '', role: 'user' });
    setRoleData({ role: 'user', permissions: [] });
    setSubscriptionData({
      plan: 'free',
      status: 'inactive',
      expiryDate: '',
      features: []
    });
    setOpenEditDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        // Ici, vous devriez ajouter la logique pour supprimer l'utilisateur de votre base de données
        // Par exemple : await deleteUserFromDb(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Administration
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.displayName || 'Non défini'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {renderRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditUser(user)}
                    size="small"
                    disabled={!canManageRole(user.role)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteUser(user.id)}
                    size="small"
                    disabled={!canManageRole(user.role) || user.role === 'superadmin'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>
          Édition de l'utilisateur
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, pt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              value={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                value={roleData.role || 'user'}
                label="Rôle"
                onChange={handleRoleChange}
              >
                {Object.keys(manageableRoles).map(role => (
                  <MenuItem key={role} value={role}>
                    {manageableRoles[role].label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Abonnement</InputLabel>
              <Select
                value={subscriptionData.plan || 'free'}
                label="Abonnement"
                onChange={handleSubscriptionChange}
              >
                {subscriptionPlans.map(plan => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut de l'abonnement</InputLabel>
              <Select
                value={subscriptionData.status || 'inactive'}
                label="Statut de l'abonnement"
                onChange={handleSubscriptionChange}
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="inactive">Inactif</MenuItem>
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="expired">Expiré</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
          <Button 
            onClick={updateUser} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!selectedUser?.name || !selectedUser?.email}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
