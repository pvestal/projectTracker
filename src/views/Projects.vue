<template>
  <div class="projects">
    <h1 class="subheading grey--text">Projects</h1>
    <v-container class="my-5">
      <p>Authors</p>
      <v-expansion-panel>
        <v-expansion-panel-content v-for="project in projects" :key="project.title">
          <div slot="header">{{project.person}}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div class="font-weight-bold">{{project.due}}</div>
              <div class="font-weight-bold">{{project.content}}</div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
    
  </div>
</template>

<script>

export default {
  name: 'projects',
  data() {
    return {
    }
  },
  computed: {
    projects() {
      return this.$store.getters.getAllProjects
    },
  }
}
</script>
