<template>
    <v-dialog max-width="600px" v-model="dialog">
        <v-btn flat slot="activator" class="success">Add Project</v-btn>
        <v-card>
            <v-card-title>
                <h2>Add Project</h2>
            </v-card-title>
            <v-card-text>
                <v-form class="px-3" ref="form">
                    <v-text-field label="Title" v-model="title" prepend-icon="folder" :rules="inputRules"></v-text-field>
                    <v-text-field label="Person" v-model="person" prepend-icon="person" :rules="inputRules"></v-text-field>
                    <v-textarea label="Project Info" v-model="content" prepend-icon="edit" :rules="inputRules"></v-textarea>
                    <v-text-field label="Status" v-model="status" prepend-icon="edit" :rules="inputRules"></v-text-field>
                    
                    <v-menu>
                    <template v-slot:activator="{ on }">
                    <v-text-field :value="formatDate" v-on="on" label="Due Date" prepend-icon="date_range"></v-text-field>
                    </template>
                    <v-date-picker v-model="due" @change="menu = false"></v-date-picker>
                    </v-menu>
                    
                    <v-spacer></v-spacer>
                    
                    <v-btn flat class="success mx-0 mt-3" @click="submit" :loading="loading">Add Project</v-btn>
                    <v-btn flat class="mx-0 mt-3 right" @click="dialog = false">Cancel</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import format from 'date-fns/format'

    export default {
        data: () => ({
                dialog: false,
                title: '',
                content: '',
                person: '',
                status: '',
                due: new Date().toISOString().substr(0, 10),
                menu: false,
                inputRules: [
                    v => !!v || 'This field is required',
                    v => (v && v.length >= 3) || 'Minimum Length is 3 Characters'
                    ],
                feedback: null,
                loading: false
            
        }),
        methods: {
            submit() {
                if(this.$refs.form.validate()) {
                    this.loading = true
                    const projectData = {
                        title: this.title,
                        content: this.content,
                        person: this.person,
                        status: this.status,
                        due: this.due
                    }
                    
                    this.$store.dispatch('addProject', projectData)
                    this.dialog = false
                    this.$emit('projectAdded')
                    this.$refs.form.reset()
                } else {
                    this.loading = false
                    return
                }
            }
        },
        computed: {
            formatDate() {
                return this.due ? format(this.due, 'YYYY-MM-DD') : ''
            }
        }
    }
</script>