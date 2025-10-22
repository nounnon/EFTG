# Configuration d'EmailJS pour l'envoi de PDF

Ce document explique comment configurer EmailJS pour permettre l'envoi automatique du formulaire EFTG Pro en format PDF par email.

## Étapes de configuration

1. **Créer un compte EmailJS**
   - Rendez-vous sur [EmailJS](https://www.emailjs.com/) et créez un compte gratuit

2. **Ajouter un service email**
   - Dans le tableau de bord EmailJS, cliquez sur "Add New Service"
   - Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
   - Suivez les instructions pour connecter votre compte email

3. **Créer un modèle d'email**
   - Dans le tableau de bord, allez dans "Email Templates" et cliquez sur "Create New Template"
   - Créez un modèle avec un sujet comme "Nouveau formulaire EFTG Pro"
   - Dans le corps du message, utilisez les variables suivantes:
     ```
     De: {{from_name}}
     Message: {{message}}
     
     Les données complètes du formulaire sont jointes en PDF.
     ```

4. **Récupérer vos identifiants**
   - Service ID: Disponible dans la section "Email Services"
   - Template ID: Disponible dans la section "Email Templates"
   - Public Key: Disponible dans la section "Account" > "API Keys"

5. **Mettre à jour le code**
   - Ouvrez le fichier `app/page.tsx`
   - Remplacez les valeurs suivantes par vos identifiants:
     ```javascript
     const EMAILJS_SERVICE_ID = "votre_service_id";
     const EMAILJS_TEMPLATE_ID = "votre_template_id";
     const EMAILJS_PUBLIC_KEY = "votre_public_key";
     ```
   - Modifiez également l'email de destination:
     ```javascript
     to_email: 'votre_email@example.com'
     ```

## Limitations du plan gratuit

- 200 emails par mois
- Support limité
- Pas d'accès à certaines fonctionnalités premium

Pour plus d'informations, consultez la [documentation officielle d'EmailJS](https://www.emailjs.com/docs/).