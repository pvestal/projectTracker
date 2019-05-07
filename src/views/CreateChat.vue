<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create Chat</h4>
        <form @submit.prevent="addChat" ref="form">
            <v-text-field v-model="chatName" label="Chat Name" required></v-text-field>
            <v-btn type="submit">Create</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        chatName: '',
      }
    },
    computed: {
      user() {
        this.$store.getters.user
      }
    },
    methods: {
      addChat () {
        if(!this.chatName) {
          return
        }
        const chatData = {
          chatName: this.chatName,
        }
        this.$store.dispatch('addChat',  chatData)
        this.$router.push('/lobby')
        this.dialog = false
        this.$refs.form.reset()
      }
    }
  }
</script>