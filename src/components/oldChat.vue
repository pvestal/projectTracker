<!--<template>-->
<!--  <v-layout row>-->
<!--    <v-flex xs12 sm6 offset-sm3>-->
<!--      <newMsgDialog :name="name"></newMsgDialog>-->
<!--      <v-card v-for="message in messages" :key="message.id">-->
<!--        <div>-->
<!--          <div>{{message.name}}</div>-->
<!--          <div>{{message.content}}</div>-->
<!--          <div>{{message.timestamp}}</div>-->
<!--        </div>-->
        <!--<v-toolbar color="blue" dark>-->
        <!--  <v-toolbar-title class="text-xs-center">Welcome {{name}} to the Chat</v-toolbar-title>-->
        <!--  <v-spacer></v-spacer>-->

        <!--</v-toolbar>-->

        <!--<v-list three-line>-->
        <!--<v-list subheader>-->
        <!--  <v-subheader>Recent chat</v-subheader>-->
        <!--  <v-list-tile-->
        <!--    v-for="message in messages" :key="message.id"-->
        <!--    avatar-->
        <!--    @click=""-->
        <!--  >-->
        <!--    <v-list-tile-avatar>-->
        <!--      <img :src="message.avatar">-->
        <!--    </v-list-tile-avatar>-->

        <!--    <v-list-tile-content>-->
        <!--      <v-list-tile-title v-html="message.content"></v-list-tile-title>-->
        <!--      <span>{{message.timestamp}}</span>-->
        <!--    </v-list-tile-content>-->

            <!--<v-list-tile-action>-->
            <!--  <v-icon :color="message.active ? 'blue' : 'grey'">chat_bubble</v-icon>-->
            <!--</v-list-tile-action>-->
        <!--  </v-list-tile>-->
        <!--</v-list>-->

<!--      </v-card>-->
<!--    </v-flex>-->
<!--  </v-layout>-->
<!--</template>-->

<template>
    <div class="chat">
      <h3>Welcome {{user.displayName}} to the Chat</h3>
        <newMsgDialog :name="name"></newMsgDialog>
        <ul class="messages">
            <li v-for="message in messages" :key="message.id">
                <span>{{message.name}}</span>
                <span>{{message.content}}</span>
                <span>{{message.timestamp}}</span>
            </li>
        </ul>
        <v-card>
            <newMessage :user="user" />
        </v-card>

    </div>
</template>

<script>
import newMsgDialog from './newMsgDialog'

    export default {
        props: ['user'],
        components: {
            newMsgDialog
        },
        name: 'Chat',
        data: () => ({
 
        }),
        computed: {
            messages() {
                return this.$store.getters.messages
            },
            user() {
                return this.$store.getters.user
            }
        }
    }
</script>

<style scoped>
    .chat {
        margin-bottom: 40px;
        max-height: 300px;
        overflow: auto;
    }
    .messages {
        list-style-type: none;
    }
    .messages span {
        display: block;
    }
</style>