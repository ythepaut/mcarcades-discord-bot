[![Workflow](https://img.shields.io/github/workflow/status/ythepaut/mcarcades-discord-bot/Deployment/master?style=for-the-badge)](#)
[![License](https://img.shields.io/github/license/ythepaut/mcarcades-discord-bot?style=for-the-badge)](https://github.com/ythepaut/mcarcades-discord-bot/blob/master/LICENSE)

## A propos

Bot discord pour un serveur communautaire.
Il implémente diverses fonctionnalités organisées en modules. Quelques exemples :

- Modération à travers une analyse de la "toxicité" des messages,
- Possibilité de lier un compte discord à un compte Minecraft,
- La surveillance et l'acquisition de statistiques sur le serveur et ses membres.

Technologies utilisées :

- Typescript
- DiscordTS
- MongoDB
- NodeJS
- Express

## Déploiement d'une instance

### Pré-requis :

 - Compte discord
 - Machine hôte
 - Une base de donnée MongoDB

### Instructions

1. Cloner le dépôt et installer les dépendances

    ```$ git clone git@github.com:ythepaut/mcarcades-discord-bot.git```
    ```$ cd mcarcades-discord-bot && npm i```

2. Copier et remplir le fichier de configuration

    ```$ cp config.sample.json config.json && vi config.json```

3. Démarrer l'instance

    ```$ npm start```
