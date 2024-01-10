<div align="center">
  <a href="https://glouton-1.web.app">
      <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/0e3494c1-36f9-492d-be39-586d18905de7" alt="Glouton logo" title="Glouton" />
  </a>

Glouton est une application visant à réduire le gaspillage alimentaire 🍏
<br>
Elle vous permet de mieux gérer votre garde-manger et éviter de perdre des aliments périmés.
<br>
<a href="https://glouton-1.web.app">Pourquoi ne pas essayer ?</a>
</div>

## Projet

<div align="center">

![navigation](https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/25fd6d83-af48-4d86-98ab-c44bd7fae2d5)

</div>

<details>
  <summary>Authentification</summary>
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/fe36c22e-0e2f-457c-af2d-adc64802d12a">
</details>
<details>
  <summary>Scan d'un article</summary>
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/7ff29b0b-7adb-4f6f-89b6-a5f4107bbcd6">
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/c5fb10c0-5216-4195-b460-a51d105e9b17"> 
</details>
<details>
  <summary>Modification d'un article</summary>
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/f3a3a5e4-ca0b-4904-9213-9cf80f3c0dfc">
</details>
<details>
  <summary>Liste de course</summary>
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/dfded788-0a87-4045-bb61-73db1641f10d">
</details>

## Les composants du projet

<a href="https://vuejs.org/"><img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/c4f8d90b-ef06-44ae-9778-4ed0c99ebae6" alt="Vue.js logo" width="120" height="40"></a>

Glouton est une application web Vue.js 3.
La gestion du store et les appels à l'API sont réalisés via vuex et le routing de l'application est pris en charge par vue router.

<a href="https://firebase.google.com/"><img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/31f9b051-7324-43b5-b766-1770441a20cc" alt="Firebase logo" width="140" height="50"></a>

Le stockage des données, l'authentification et l'hébergement du projet sont rendus possibles grâce aux services proposés par Firebase.

<ul>
<li>
<a href="https://fontawesome.com/">Fontawesome</a> pour les icons de l'application.
</li>

<li>
Le package <a href="https://github.com/mebjas/html5-qrcode">html5-qrcode</a> pour l'utilisation de la caméra et la d'tection de code-barres.
</li>

<li>
Le framework css <a href="https://tailwindcss.com">Tailwind</a> et tw-element pour la réalisation d'un visuel professionel et responsive.
</li>

<li>
L'outil de construction <a href="https://vitejs.dev/guide">Vite</a> et du package <a href="https://vite-pwa-org.netlify.app">vite-plugin-pwa</a> pour la construction d'une Progressive Web App optimisée.
</li>

<li>
Le package <a href="https://momentjs.com">Moment.js</a> pour le traitement et la conversion des dates.
</li>

<li>
Le package <a href="https://ismail9k.github.io/vue3-carousel">Vue3-carousel</a> pour la navigation horizontal.
</li>
</ul>

## Roadmap

- [x] Création du projet Vue.js x Vite
- [x] Création du compte firebase
- [x] Configuration PWA
- [x] Création des interfaces
- [x] Intégration du scan de code-barres
- [x] Création des appels API aux services Firebase
- [x] Configuration du store
- [x] Intégration de vue3-carousel
- [ ] Correction du bug de scan sur Iphone
- [ ] Utilisation de l'API Laravel une fois prête
- [ ] Ajout d'articles sans code-barres
- [ ] Création des recettes

## Comment faire tourner en local Glouton

```sh
npm install

npm install -g firebase-tools
firebase login
firebase init

npm run dev
```

## Contact

Thomas Berranger - <a href="https://www.linkedin.com/in/thomas-berranger/">Linkedin</a> - tberranger@hotmail.fr




<!-- 🥚
Commandes pour la mise en production
```
npm run build
firebase deploy
```
-->
