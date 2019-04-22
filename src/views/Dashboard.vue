<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>
    
    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('title')" slot="activator">
            <v-icon left small>folder</v-icon>
            <span class="caption text-lowercase">By Project Name</span>
          </v-btn>
          <span>Sort By Project Name</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('person')" slot="activator">
            <v-icon left small>person</v-icon>
            <span class="caption text-lowercase">By Person</span>
          </v-btn>
          <span>Sort By Person</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('status')" slot="activator">
            <v-icon left small>assessment</v-icon>
            <span class="caption text-lowercase">By Status</span>
          </v-btn>
          <span>Sort By Status</span>
        </v-tooltip>
      </v-layout>
      <v-card flat class="mb-1" v-for="project in projects" :key="project.title">
        <v-layout row wrap class="pa-2 project" v-bind:class="project.status">
          <v-flex xs12 md4>
            <div class="caption grey--text">Project Title</div>
            <div>{{project.title}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <!--<div class="caption grey--text">Edit</div>-->
            <!--<div>{{project.id}}</div>-->
            <edit-project :project="project"></edit-project>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Person</div>
            <div>{{project.person}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Due By</div>
            <div>{{project.due}}</div>
          </v-flex>
          <v-flex xs2 sm3 md2>
            <div class="right"
              <v-chip small class="white--text caption my-2" v-bind:class="project.status">{{project.status}}</v-chip>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
      <v-divider></v-divider>
    </v-container>
    
  </div>
</template>

<script>
// import format from 'date-fns/format'

export default {
  name: 'dashboard',
  data() {
    return {

    }
  },
  methods: {
    sortBy(property) {
      this.projects.sort((a,b) => a[property] < b[property] ? -1: 1)
    }
  },
  // created() {
  //   let projectsRef = db.collection('projects').orderBy('due')
  //   projectsRef.onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       console.log("change", change.type)
  //       if (change.type == 'added') {
  //         let doc = change.doc
  //         this.projects.push({
  //             id: doc.id,
  //             title: doc.data().title,
  //             person: doc.data().person,
  //             content: doc.data().content,
  //             status: doc.data().status,
  //             due: format(doc.data().due, 'YYYY-MM-DD')
  //         })
  //       }
  //     })
  //   })
  // },
  computed: {
    projects() {
      return this.$store.getters.getAllProjects
    }
  }
}
</script>

<style scoped>

.project.complete{
  border-left: 4px solid #3CD1C2;
}
.project.ongoing{
  border-left: 4px solid orange;
}
.project.overdue{
  border-left: 4px solid tomato;
}
.v-chip.complete{
  background: #3cd1c2;
}
.v-chip.ongoing{
  background: #ffaa2c;
}
.v-chip.overdue{
  background:#f83e70;
}
</style>