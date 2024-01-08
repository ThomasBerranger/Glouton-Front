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

![Login](https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/7df2db62-ce40-4e8c-b62a-d00f63ce10ef)

</div>

<details>
  <summary>Authentification</summary>
  <img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/7df2db62-ce40-4e8c-b62a-d00f63ce10ef">
</details>
<details>
  <summary>Ajout d'un article</summary>
</details>
<details>
  <summary>Modification d'un article</summary>
</details>
<details>
  <summary>Liste de course</summary>
</details>

## Les composants du projet

<a href="https://vuejs.org/"><img src="https://github.com/ThomasBerranger/Glouton-Front/assets/15357887/c4f8d90b-ef06-44ae-9778-4ed0c99ebae6" alt="Vue.js logo" width="120" height="40"></a>

Glouton est une application web Vue.js 3.
Les appels à l'API sont réalisés via vuex et le routing de l'application est pris en charge par vue router.

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
Le package <a href="https://momentjs.com">Moment.js<a> pour le traitement et la conversion des dates.
</li>

<li>
Le package <a href="https://ismail9k.github.io/vue3-carousel">Vue3-carousel<a> pour la navigation horizontal.
</li>
</ul>

## Comment faire tourner en local Glouton

```sh
npm install

npm install -g firebase-tools
firebase login
firebase init

npm run dev
```

## L'auteur

Thomas Berranger - <a href="https://www.linkedin.com/in/thomas-berranger/">Linkedin</a> - tberranger@hotmail.fr

<!-- 🥚
Commandes pour la mise en production
```
npm run build
firebase deploy
```
-->
