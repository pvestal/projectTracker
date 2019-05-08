<template>
  <v-layout row>
    <v-flex xs12 sm10 order-xs2 style="position: relative;">
      <div class="chat-container" ref="chatContainer" >
        <p v-for="message in messages" :key="message.content">
          {{message.content}} by {{message.user}} at {{message.created}}
        </p>
      </div>
     
      <div class="typer">
        <input type="text" placeholder="Type here..." v-on:keyup.enter="storeMessage" v-model="content">
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import format from 'date-fns/format'

  export default {
    data () {
      return {
        messages: [],
        content: '',
        loading: false,
      }
    },
    props: [
      'chatID'
    ],
    created() {
      // value = snapshot.val() | key = snapshot.key
      firebase.database().ref('/chats/').child(this.chatID).child('/messages/').on('child_added', snapshot => {
        this.messages.push({
          ...snapshot.val(),
          id: snapshot.key
        })
      })
    },
    computed: {
      user () {
        return this.$store.getters.user.displayName
      },
    },
    methods: {
      storeMessage () {
        firebase.database().ref('/chats/').child(this.chatID).child('/messages/')
        .push({
          user: this.user, 
          created: format(Date.now(), 'DD/MM/YY HH:mm:ss'), 
          content: this.content})
        this.content = ''
      },
    }
  }
</script>

<style>
  .scrollable {
    overflow-y: auto;
    height: 90vh;
  }
  .typer{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 4.9rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
  }
  .typer .emoji-panel{
    /*margin-right: 15px;*/
  }
  .typer input[type=text]{
    position: absolute;
    left: 2.5rem;
    padding: 1rem;
    width: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.25rem;
  }
  .chat-container{
    box-sizing: border-box;
    height: calc(100vh - 9.5rem);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;
  }
  .message{
    margin-bottom: 3px;
  }
  .message.own{
    text-align: right;
  }
  .message.own .content{
    background-color: lightskyblue;
  }
  .chat-container .username{
    font-size: 18px;
    font-weight: bold;
  }
  .chat-container .content{
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display:inline-block;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    max-width: 50%;
    word-wrap: break-word;
    }
  @media (max-width: 480px) {
    .chat-container .content{
      max-width: 60%;
    }
  }
</style>