import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  Inventory as InventoryIcon, 
  Warning as WarningIcon, 
  AttachMoney as MoneyIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Box 
          sx={{ 
            backgroundColor: `${color}20`, 
            borderRadius: '50%', 
            width: 48, 
            height: 48, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2
          }}
        >
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography color="textSecondary" variant="subtitle2">
            {title}
          </Typography>
          <Typography variant="h5">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CategoryPieChart = ({ data }) => {
  const theme = useTheme();
  
  // Préparer les données pour le graphique circulaire
  const categoryData = data.reduce((acc, article) => {
    const category = article.categorie || 'Non catégorisé';
    const existing = acc.find(item => item.id === category);
    
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ id: category, label: category, value: 1 });
    }
    
    return acc;
  }, []);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Répartition par catégorie
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 300 }}>
        <ResponsivePie
          data={categoryData}
          margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLinkLabels={false}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={theme.palette.text.primary}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={theme.palette.common.white}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: theme.palette.text.primary,
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: theme.palette.primary.main,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
};

const StockBarChart = ({ data }) => {
  // Grouper les articles par catégorie et calculer la quantité totale
  const stockData = data.reduce((acc, article) => {
    const category = article.categorie || 'Non catégorisé';
    const existing = acc.find(item => item.categorie === category);
    
    if (existing) {
      existing.quantite += article.quantite;
    } else {
      acc.push({ 
        categorie: category, 
        quantite: article.quantite,
        alerte: article.quantite <= (article.seuilAlerte || 5) ? article.quantite : 0
      });
    }
    
    return acc;
  }, []).sort((a, b) => b.quantite - a.quantite);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Stock par catégorie
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 300 }}>
        <ResponsiveBar
          data={stockData}
          keys={['quantite', 'alerte']}
          indexBy="categorie"
          margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#4caf50', '#ff9800']}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Catégories',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Quantité',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="white"
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 12,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </Box>
    </Paper>
  );
};

const DashboardStats = ({ articles = [] }) => {
  // Vérifier si articles est défini, sinon utiliser un tableau vide
  const safeArticles = Array.isArray(articles) ? articles : [];
  
  const totalArticles = safeArticles.length;
  const totalStock = safeArticles.reduce((sum, article) => sum + (parseInt(article?.quantite) || 0), 0);
  const lowStockItems = safeArticles.filter(article => 
    (article?.quantite || 0) <= (article?.seuilAlerte || 5)
  ).length;
  const totalValue = safeArticles.reduce(
    (sum, article) => sum + ((parseFloat(article?.prix) || 0) * (parseInt(article?.quantite) || 0)), 
    0
  ).toFixed(2);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Articles en stock" 
            value={totalStock} 
            icon={InventoryIcon} 
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Articles différents" 
            value={totalArticles} 
            icon={CategoryIcon} 
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Articles en alerte" 
            value={lowStockItems} 
            icon={WarningIcon} 
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Valeur totale" 
            value={`${new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'EUR' 
            }).format(totalValue)}`} 
            icon={MoneyIcon} 
            color="#9c27b0"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <CategoryPieChart data={safeArticles} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StockBarChart data={safeArticles} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
