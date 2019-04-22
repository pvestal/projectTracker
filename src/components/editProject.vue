<template>
    <v-dialog max-width="600px" v-model="dialog">
        <v-btn small fab accent slot="activator">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-card>
            <v-card-title>
                <h2>Edit Project</h2>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-text-field label="Title" v-model="editedTitle" prepend-icon="folder" :rules="inputRules"></v-text-field>
                    <v-text-field label="Person" v-model="editedPerson" prepend-icon="person" :rules="inputRules"></v-text-field>
                    <v-textarea label="Project Info" v-model="editedContent" prepend-icon="edit" :rules="inputRules"></v-textarea>
                    <v-text-field label="Status" v-model="editedStatus" prepend-icon="edit" :rules="inputRules"></v-text-field>
                    
                    <v-menu>
                    <v-text-field :value="formatDate" slot="activator" label="Due Date" :rules="inputRules" prepend-icon="date_range"></v-text-field>
                    <v-date-picker v-model="editedDue"></v-date-picker>
                    </v-menu>
                    
                    <v-spacer></v-spacer>
                    
                    <v-btn flat class="success mx-0 mt-3" @click="update" :loading="loading">Update</v-btn>
                    <v-btn flat class="mx-0 mt-3" @click="dialog = false">Cancel</v-btn>
                    <v-btn flat color="warning" class="mx-0 mt-3 right" @click="dialog = false">Delete</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import format from 'date-fns/format'

    export default {
        name: 'editProject',
        props: ['project'],
        data() {
            return {
                dialog: false,
                editedTitle: this.project.title,
                editedContent: this.project.content,
                editedPerson: this.project.person,
                editedStatus: this.project.status,
                editedDue: this.project.due,
                menu: false,
                inputRules: [
                    v => !!v || 'This field is required',
                    v => (v && v.length >= 3) || 'Minimum Length is 3 Characters'
                    ],
                feedback: null,
                loading: false
            }
        },
        methods: {
            update() {
                if(this.$refs.form.validate()) {
                    this.loading = true
                                        
                    const updatedData = {
                        id: this.project.id,
                        title: this.editedTitle,
                        content: this.editedContent,
                        person: this.editedPerson,
                        status: this.editedStatus,
                        due: this.editedDue
                    }
                    
                    this.$store.dispatch('updateProject', updatedData)
                    this.dialog = false
                } else {
                    this.feedback = "You must enter the required fields to save"
                    return
                }
            }
        },
        computed: {
            formatDate() {
                return this.editedDue ? format(this.editedDue, 'YYYY-MM-DD') : ''
            }
        }
    }
</script>