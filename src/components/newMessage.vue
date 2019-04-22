<template>
    <div class="newMessage">
        <v-form ref="form">
              <v-text-field
                v-model="message"
                label="Enter Msg"
                required
              ></v-text-field>
              <p v-if="feedback" class="red--text">{{feedback}}</p>
          <v-btn flat @click.prevent="addMessage">Enter</v-btn>
        </v-form>
    </div>
</template>
<script>
import format from 'date-fns/format'

    export default {
        name: 'newMessage',
        props: ['name'],
        data: () => ({
            feedback: null,
            message: null,
            
        }),
        methods: {
            addMessage() {
                if(this.message) {
                    this.feedback = null
                    const msgData = {
                        content: this.message,
                        name: this.name,
                        timestamp: format(Date.now(), 'YYYY-MM-DD')
                    }
                    this.$store.dispatch('addMessage', msgData)
                    this.$refs.form.reset()
                } else {
                    this.feedback = "You must enter a message to send one"
                }
                
            }
        }
    }
</script>

<style scoped>
    .newMessage {
        max-width: 400px;
    }
</style>