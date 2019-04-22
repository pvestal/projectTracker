<template>
  <div class="team">
    <h1 class="subheading grey--text">Team</h1>
    
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="person in team" :key="person.name">
          <v-card flat class="text-xs-center ma-3">
            <v-responsive class="pt-4">
              <v-avatar :size="100" class="grey lighten-2">
                <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading">{{person.name}}</div>
              <div class="grey--text">{{person.role}}</div>
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center>
                <v-btn flat color="grey">
                  <v-icon>message</v-icon>
                </v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex> 
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Team',
  data() {
    return {
      team: [
      {name: 'Patrick', role: 'Wannabe Web Dev', avatar: 'https://vuetifyjs.com/apple-touch-icon-180x180.png'},
      {name: 'Dean', role: 'Vuetify & Firebase Maverick', avatar: 'https://vuetifyjs.com/apple-touch-icon-180x180.png'},
      {name: 'Logan', role: 'Backend Guru', avatar: 'https://vuetifyjs.com/apple-touch-icon-180x180.png'}
    ]
    }
  }
}
</script>
