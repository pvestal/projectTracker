<template>
    <v-dialog max-width="400px" v-model="dialog" v-if="user==undefined">
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
                  <v-btn flat @click="onPickFile">Set Image</v-btn>
                  <br>
                  <input type="file" v-show="false" ref="fileInput" accept="image/*" @change="onFilePicked">
                  <img :src="imageUrl" v-model="imageUrl" height="100">
                  <br>
                  <v-btn raised @click.prevent="addChat">Create</v-btn>
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
        imageUrl: '',
        image: null
      }
    },
    computed: {
      user() {
        this.$store.getters.user
      }
    },
    methods: {
      addChat () {
        const chatObj = {
          chatName: this.chatName,
          image: this.image
        }
        // if (this.chatName !== '' && this.user !== undefined) {
          this.$store.dispatch('addChat', chatObj)
          this.dialog = false
          this.$refs.form.reset()
        // }
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      onFilePicked(event) {
        const files = event.target.files
        let fileName = files[0].name
        //make sure it has an extension
        if (fileName.lastIndexOf('.') <= 0) {
          return alert("Please add a valid file.")
        }
        //turn into base-64 string value
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
          this.image = files[0]
      }
    }
  }
</script>