<template>
  <div>
    <div class="nav-container">
      <navbar />
    </div>
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'BasicLayout',
  components: {
    Navbar
  }
}
</script>
