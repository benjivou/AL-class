# Weekly  Report

## Video

Here is the link to the 3min video: https://drive.google.com/file/d/1qhSdAippekcajeylZ9w_BTwaKLUXPtX8/view

## Week 8
**Done :** 
- Préparer la présentation 
- Règler un problème avec Kafka : on a fait un topic par trip après les tests on a trouvé que ce n'était pas le bon choix on a donc remplacé ça par des partitions 
- Ajouter quelques tests
 
**Future tasks :** 
- Finaliser la présentation 
- Faire des diagrammes pour la présentation 
- Terminer le rapport 

## Week 7
**Done :** 
- Intégrer Kafka dans les statistiques
- Réaliser des tests d'intégration
- Mettre en place l'étude du cache 
- Commencer le rapport 
 
**Future tasks :** 
- Préparer la présentation 
- Terminer le rapport

## Week 6
**Done :** 
 - Dimensionner le cache côté application du contrôleur
 - Load balancer
 - Correction de bugs avec Kafka
 - Refactoring des BD par composant
 - Subscribe de FraudManager au changement des stations
 - composant Fraud Check intégré
 
**Future tasks :** 
- Intégrer Kafka dans les statistiques
- Réaliser des tests d'intégration


## Week 5
**Done :** 
 - Intégration de bus Kafka dans le scénario des fraudes 
 - Etude du volume de tickets à traiter / tests de charge pour valider notre architecture, et adapter le passage à l'échelle (pour l'instant pas implémenté)
**Future tasks :** 
- Intégrer Kafka dans les statistiques
- Réaliser des tests d'intégration
- Dimensionner le cache côté application du contrôleur

## Week 4 
**Done :** 
 - Intégration de bus Kafka dans le scénario du controle ticket 
 - Sépartion du sevice ticket control en deux composants ticket-check et ticket manager ( ticket check est le composant responsable du la lecture de données pour décider à la fin si un ticket est valide ou pas et ticket manager est le composant qui est toujours à l'écoute du kafka et qui est responsable d'écrire ces données dans la bd ) 
 - Réalisation des tests massives pour décider le passage à l'échelle nécessaire pour nos composants 
 - Précision de tous les topics kafka des différents scénarios de notre application
**Future tasks :** 
- Intégration de bus kafka dans le scério de déclaration de Fraud 
- Trouver le sytème de cache adéquat pour résoudre les problèmes éventuels de réseau 

## Week 3 
**Done :**
 - Validation d'architecture 
 - Rédaction du rapport 
 - Création de Fraud check pour assurer la cohérence de données ( on sanctionne pas un passager qui a acheté son billet récemment et qui n'a pas été récupéré par l'application du controleur )
 - La répartition des taches coté code 
 
 
**Future tasks planned :*** 
- Avoir un scénario qui marche avec kafka 
- Créer les tests correspondants 

## Week 2 
**Done : **
 - Modification de l'architecture général de système pour répondre aux contraintes ajoutées : 
   * L'ajout de Bus Kafka 
   * Héberger les services à l'exterieur du train 
   * Redécoupage de service 
   * L'ajout de l'API Gateway ( load balancer intégré ) pour assurer la communication entre l'app mobile et les services 

**Future tasks planned :**
- Trouver un compromis pour palier au problème de réseau 
- Développer d'avantage la justification de choix 
- Valider avec le prof l'architecture finale 
- Répartir les taches entre les membres de l'équipe et commencer à coder 

**Color & Feedbacks of the week**
- Green

## Week 46
**Done :**
- Moc Presentation done 
- Deliveriables

**Future tasks planned :**
- Add the statistics component 
- add tests UI 

**Color & Feedbacks of the week**
- Green

## Week 45
**Done :**
- End Scenario of scanning a ticket
- End Scenario of creating a fraud

**Future tasks planned :**
- Add the staistics component 
- Prepare the interview 

**Color & Feedbacks of the week**
- Orange

## Week 44
**Done :**
- The Android App can scan a QR Code 
- The Android App Navigation graph is done 
- We finished the payment and fraud back end components 
- The authorization component is also done

**Future tasks planned :**
- End Scenario of scanning a ticket
- End Scenario of creating a fraud
- Add the staistics component 

**Color & Feedbacks of the week**
- Android Application: Issue cause by the integration of the QR scanner : Orange

## Week 43
**Done :**
- Add architecture details and justification (which component is used + flow)
- We discuss where services should be located physically
- We are implementing tests, integration CI and try to connect our services to have a minimal connection bewteen them, and linking MongoDB

 **Future tasks planned :**
 - Focus on the "work" implementation inside services
 - Make the app usable with simple UI and simple scenario

## Week 42
**Done :**
 - We discussed the different technologies that we can use for every part of the project .
 - We added the explanation and the reasons of every choice we made for both project architecture and project technologies to architecture.pdf. 
 - We modified the roadmap to make it more technical oriented.
 - We started the set up of the project : 
     * Client-UI : We started the implementation of the android project. 
     * Services : We started creating Control Ticket API , Ticket's infos API and Train's infos API. 

 **Future tasks planned :**
 - Continue implementing the scan QR functionality in our Android/Kotlin project
 - Start services implementation
 - Link MangoDB to our components
 
 
 #### Flag : <img alt="green" src="https://upload.wikimedia.org/wikipedia/commons/d/de/Color-Green.JPG" width="25" height="15"/>

## Week 41
**Done :**
 - Taking into account feedback from last week to rework scernarios.
 - Infrastructure architecture / components diagram
 - Roadmap
 
 **Waiting for :**
 - Approval from the client of our new scope and reworked scenarios

 **Next week tasks planned :**
 - Start coding (cf. roadmap)
 
 #### Flag : We did all the tasks that we planned to do so our flag this week is Green
## Week 40
**Done :**
 - Main scope version 1
 - Main scenario ready to be validated by the client
 
 **Waiting for :**
 - Approval from the client of our scope and scenario

 **Next week tasks planned :**
 - Logiciel architecture
 - Infrastructure architecture
 
 #### Flag : We did all the tasks that we planned to do so our flag this week is Green
