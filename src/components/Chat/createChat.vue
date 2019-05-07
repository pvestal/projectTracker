<template>
    <v-dialog max-width="400px" v-model="dialog" v-if="!user">
        <v-btn small fab accent slot="activator" color="blue" class="right">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-card>
            <v-card-title>
                <h2>Create Chat</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="chatName" label="Chat Name" required></v-text-field>
                  <v-btn flat @click.prevent="addChat">Create</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
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
        // if (this.chatName !== '' && this.user !== undefined) {
          this.$store.dispatch('addChat',  {chatName: this.chatName})
          this.dialog = false
          this.$refs.form.reset()
        // }
      }
    }
  }
</script>