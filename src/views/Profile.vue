<template>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="subheading grey--text">User Profile</h1>
        <form @submit.prevent="onProfileUpdate" v-if="user">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
            <p>Name: {{user.displayName}}</p>
            <p>Email: {{user.email}}</p>
            <p>UserId: {{user.id}}</p>
            <p>Status: {{user.status}}</p>
            <p>Account Created: {{user.created}}</p>
            <p>Last Login: {{user.lastSignIn}}</p>
            <img v-if="user.photoURL!=undefined" :src="user.photoURL" />
            <img v-else src="https://randomuser.me/api/portraits/lego/1.jpg" />
            <v-btn raised @click="onPickFile">Change Image</v-btn>
            <input type="file" v-show="false" ref="fileInput" accept="image/*" @change="onFilePicked">
            <img :src="imageUrl" height="150">
            <p>games: {{user.games}}</p>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn type="submit">Update Profile</v-btn>
                <!--class="primary"-->
                <!--:disabled="!formIsValid && loading" :loading="loading"-->
                
                <!--type="submit">Update Profile<span slot="loader" class="custom-loader">-->
                <!--  <v-icon light>cached</v-icon>-->
                <!--      </span></v-btn>-->
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
</template>

<script>
import format from 'date-fns/format'

  export default {
    data() {
        return {
          displayName: '',
          imageUrl: '',
          image: null,
          updated: format(Date.now(), 'YYYY-MM-DD'),
        }
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      loading() {
        return this.$store.getters.loading
      },
      formIsValid() {
        return this.displayName !== '' && this.imageUrl !== '' 
      },
    },
    methods: {
      onProfileUpdate() {
        console.log("update requested")
        // if(!this.formIsValid) {
        //   return 
        // }
        // if(!this.image) {
        //   return
        // }
        const profileData = {
          displayName: this.displayName,
          image: this.image,
          updated: this.updated
        }
        console.log("sending image", this.image)
        this.$store.dispatch('updateProfile', profileData)
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