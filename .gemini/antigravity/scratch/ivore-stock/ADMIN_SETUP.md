# Script d'Initialisation Admin - IvoireStock

Ce script vous permet de créer le premier utilisateur administrateur dans Supabase.

## Étapes

### 1. Créer l'utilisateur admin dans Supabase Auth

1. Allez dans votre projet Supabase : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquez sur **"Authentication"** dans le menu de gauche
3. Cliquez sur **"Users"**
4. Cliquez sur **"Add user"** → **"Create new user"**
5. Remplissez :
   - **Email** : `admin@ivoirestock.local`
   - **Password** : `admin` (ou un mot de passe sécurisé)
   - Cochez **"Auto Confirm User"**
6. Cliquez sur **"Create user"**
7. **Copiez l'UUID** de l'utilisateur créé (ex: `a1b2c3d4-...`)

### 2. Créer le profil admin dans la base de données

1. Allez dans **"SQL Editor"**
2. Créez une nouvelle requête
3. Collez le code suivant (en remplaçant `YOUR_USER_UUID` par l'UUID copié) :

```sql
INSERT INTO profiles (id, username, role, permissions)
VALUES (
    'YOUR_USER_UUID',  -- Remplacez par l'UUID de l'utilisateur
    'admin',
    'admin',
    '["dashboard", "pos", "inventory", "reports", "settings"]'::jsonb
);
```

1. Cliquez sur **"Run"**

### 3. Vérification

Vous pouvez maintenant vous connecter à l'application avec :

- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin` (ou celui que vous avez choisi)

## Note importante

Pour les prochains utilisateurs, ils pourront s'inscrire normalement via l'application en utilisant les codes d'invitation que vous générerez depuis les paramètres.
