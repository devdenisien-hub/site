# Configuration Google Drive Service Account

## Variables d'environnement requises dans .env.local

```bash
# Service Account Google Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=trail-drive-uploader@trail-pps-uploads.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpUzx3nOxhYs8E\nOwEBUCHpn7aAA68XfcaXigHyLT+7Vjz+uX+6mGrvux0sLk0INPGKqshxJbl8cDQR\nkTPKWq0fC/V+ULGZXlrk6YBO7vAjRtNVjnVKWl4zzifP6zJ5EAUF24Klp9Q5OZxw\neDl4hmiX3XyTq0uy3h7GSvzPBiXeUc1/tcek/IGghoAZeguipQLa0TDthGqiu+Qw\nUiWOeuzxfY50hJA+TxZbG+G8dF39njZKOlaUUXQ3kYB5GAm1J/wGu4GYVVjLH8/5\npsuYmqaznHR5IoxbeiwRsOiG0u6PRTXiH5zJC2+UtAp2MAgd0wn0IKJszs9ep3ca\nSVgnRIAbAgMBAAECggEACcz45wN85ct4/V8HmTKGLqZBQ0+d8YIk3d3twZK/lEb9\nk3uGhR+6sNLnxrLiCo47R4dzFU7Vrvo08/9aPBAw4mcoIn473rYIv3nfJLJ30Sg8\nUJYaUTTB1xsg+svmSVOVYYK/ISTXB9OUgSi0SuGcvuLhtGUUe0SYC2ozuoKPQTrq\ntU49eJnMkBBQq5F8iY3OhOoXhf6BXCTYNVMXK5LW5LZnKeaSwrJi4eqSva6peA98\nkEOhjJgwyoqqR9/Kfc3we57YSVmT/dp+JZlpFZ1IwCpucVBtCYiTk944K0JEGyCK\nwOzx4h0UM9h5+P3b3sGoDI1blXBC7lePRDU6slU24QKBgQDi2CZESXf+S14+KOPp\ni0nx8yCm6uxilrceB0cwIskKxBUigV7+WOY8VHxjSDPNHh+jkLMjWCM6+ylUgzej\ncJFH+QDbg1h8AODhHrdRQOfaCHe158Wp0nThX97Y6CnN/sru8PgYndnVulHsoDvZ\n0bJ6ymoJudUvkNbU7E4P9Vj2DQKBgQC/Fojv3VJQdPOohxJNQfBukrR4AgHN62Lf\nNYH41xaWWji9Rf5K/ob6q0hYu/aoWsu8Z0Vj/YZ+KHeu5LrlqlRpcWKP7uOqtUrP\niP3IsW5X3QyLBmqVYMeULiUcv1cEIDnQEPBB6kvmRpYX+lFvOSC61dg9oM8gqb5w\nQUtZrl8sxwKBgQCi301CdHm6VMT63oMduUvDc6x7DGvjMZGS9ujPD/rHRxhhqP/a\noVvV71dMNZgz6zAOUaO9edf5zkHTk09Mg1NcmNVbxweuKTdNi69VoMOXkcLaEeqj\nTx9qflpT5QW3CP0N6GhJzHSOd3PA8R9n+p8qeND/4LTHrTgCsxQtcxyHtQKBgDsn\nfrzChvjhO4ywQ7om74dLYxLDjEty0ujGZ7Xg390rkOUHBfGxWZe/7mWJypHTib6J\nObH6iegEHwjFRhZS5E7ACwMDsPbnqIEWp3m5c68/fuKK2fPkQeRdZJ/Bm+5rC3qd\nw8KkBVsD/vLtSshjpv4vtQFfBr/VzF5z2B+rG0uBAoGAXTm61zocifDlFLAeHoKg\nQgPEw/754j3Uc2EsgWaQQlSMODLaf6oZG804a++MTaLuzEzuitR8SKH/s00QrS6T\nBy0jGtC5hMpAJdavtGa2oNzgAykK4X/d22QeNASvnymwuN9eGiLVeg3Y5wYkCFQm\nawhlC1VRwavqr95swh8DEDE=\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_PARENT_FOLDER_ID=1AWkArqz9dP_Qy8BDnDOf-U2MaybvAsEQ
```

## Fonctionnalités du système

### 1. Upload automatique vers Google Drive

- Les attestations PPS sont uploadées dans le dossier spécifié
- Les fichiers sont rendus publics automatiquement
- Nommage unique avec timestamp

### 2. Extraction OCR avec Tesseract.js

- Reconnaissance de texte en français
- Extraction automatique des informations PPS
- Patterns de recherche pour nom, prénom, date, numéro PPS, validité

### 3. Validation croisée

- Comparaison des données extraites avec les informations du formulaire
- Vérification de la correspondance nom/prénom/date de naissance
- Messages d'erreur détaillés en cas de non-correspondance

### 4. Auto-remplissage

- Le numéro PPS est automatiquement rempli
- La date de validité PPS est automatiquement remplie
- Interface utilisateur avec indicateurs de statut

## Formats supportés

- PDF
- JPG/JPEG
- PNG
- Taille maximale : 10MB

## Sécurité

- Service Account avec permissions limitées
- Upload dans un dossier spécifique
- Validation côté serveur et client




