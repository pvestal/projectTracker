<template>
  <div class="welcome">
    <h3>Before Entering Chat</h3>
    <v-form ref="form" v-if="user==undefined || user==null">
          <v-text-field v-model="name" label="Enter Name" required></v-text-field>
          <p v-if="feedback" class="red--text">{{feedback}}</p>
      <v-btn flat @click.prevent="enterChat" :disabled="this.name.length < 3">Enter</v-btn>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'getName',
    feedback: null,
    data: () => ({
      name: '',
    }),
    computed: {
      user() {
        return this.$store.getters.user  
      }
    },
    created: {
      if (user) {
        
        this.$router.push({ name: 'chat', params: { name: this.user.displayName } })
        this.$refs.form.reset()
        this.$store.dispatch('loadMessages')
      }
    },
    methods: {
      enterChat() {
          if(this.name) {
            this.$router.push({ name: 'chat', params: { name: this.name } })
            this.$refs.form.reset()
            this.$store.dispatch('loadMessages')
          } else {
            this.feedback = 'Must enter name to join'
          }
          
      }
    }
  }
</script>

<style scoped>
  .welcome {
    max-width: 400px;
  }
</style>