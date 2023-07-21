<script setup>
import {ref} from 'vue'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import router from "@/router";
import {RouterLink} from "vue-router";

const email = ref('');
const password = ref('');

const onSubmit = () => {
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        router.push('/');
      })
      .catch(error => {
        console.log(error.code);
      })
}
</script>

<template>

  <main class="flex flex-1 flex-col justify-center px-8 pb-20">

    <div class="mx-auto w-full max-w-sm">
      <img class="mx-auto h-20 w-auto" src="/public/logo.webp" alt="Your Company" />
      <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Création de compte</h2>
    </div>

    <div class="mt-8 mx-auto w-full max-w-sm">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm px-2" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
            <!--            <div class="text-sm">-->
            <!--              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>-->
            <!--            </div>-->
          </div>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm px-2" />
          </div>
        </div>

        <div class="flex items-center justify-center gap-x-6 pt-2">
          <button class="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm">
            Me créer un compte
          </button>
          <RouterLink to="/login" class="text-sm font-semibold text-gray-900">Connexion <span
              aria-hidden="true">&rarr;</span></RouterLink>
        </div>
      </form>
    </div>

  </main>

</template>