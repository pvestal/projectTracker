<template>
    <v-dialog max-width="400px" v-model="dialog">
        <v-btn small fab accent slot="activator" color="blue" class="right">
          <v-icon dark>add</v-icon>
        </v-btn>
        <!--<v-btn fab dark color="blue">-->
        <!--  <v-icon dark>add</v-icon>-->
        <!--</v-btn>-->
        <v-card>
            <v-card-title>
                <h2>Post to Chat</h2>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                      <v-text-field
                        v-model="message"
                        label="Enter Msg"
                        required
                      ></v-text-field>
                      <p v-if="feedback" class="red--text">{{feedback}}</p>
                  <v-btn flat @click.prevent="addMessage">Post</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import format from 'date-fns/format'

    export default {
        name: 'newMsgDialog',
        props: ['name'],
        data: () => ({
                dialog: false,
                message: null,
                feedback: null,
                loading: false
            
        }),
        methods: {
            addMessage() {
                if(this.message) {
                    this.dialog = false
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