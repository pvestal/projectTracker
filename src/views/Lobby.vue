<template>
  <v-container>
    <!--<v-layout>-->
    <!--  <v-flex xs12 class="text-xs-center">-->
    <!--    <v-progress-circular v-if="loading" indeterminate class="primary--text" :width="7" :size="50"></v-progress-circular>-->
    <!--  </v-flex>-->
    <!--</v-layout>-->
        <createChat :chat="chat"></createChat>
    <v-layout row wrap v-for="chat in chats" :key="chat.chatID" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
      <v-flex xs12>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-img :src="chat.imageURL" height="100px"></v-img>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title>
                  <div class="white--text">
                  <h3 class="mb-0">{{chat.chatName}}</h3>
                  <p>Id: {{chat.chatID}}</p>
                  <p>Created: {{chat.created}}</p>
                  <p>Created By: {{chat.uDisplayName}}</p>
                  <!--<div>Messages Count: {{messages}}</div>-->
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="'/chat/' + chat.chatID">
                    <v-icon left dark>arrow_forward</v-icon>
                  View Room
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </V-layout>
          </v-container>
        </v-card>
      </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import createChat from '@/components/Chat/createChat'

  export default {
    name: 'Lobby',
    components: {
      createChat
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      chats() {
        return this.$store.getters.chats
      },
      messages() {
        return this.$store.getters.getMessageCounts
      },
      loading() {
        return this.$store.getters.loading
      }
    }
  }
</script>

<style scoped>
  .title {
    position: absolute;
    bottom: 50px;
    background-color: rgba(0, 0, 0, .5);
    color: white;
    font-size: 2em;
    padding: 20px;
  }
</style>
