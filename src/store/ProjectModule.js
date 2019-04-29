import firebase from 'firebase/app'

const ProjectsModule = {
  state: {
      projects: []
  },
  mutations: {
    SET_PROJECTS(state, payload) {
      state.projects = payload
    },
    UPDATE_PROJECT(state, payload) {
      console.log("payload", payload)
      const project = state.projects.find(project => {
        return project.id === payload.id
      })
      if(payload.title) {
        project.title = payload.title
      }
      if(payload.content) {
        project.content = payload.content
      }
      if(payload.person) {
        project.person = payload.person
      }
      if(payload.status) {
        project.status = payload.status
      }
      if(payload.due) {
        project.due = payload.due
      }
    },
    ADD_PROJECT(state, payload) {
      state.projects.push(payload)
    }
  },
  actions: {
    loadProjects({commit}) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('projects').get()
      .then((querySnapshot) => {
        let projectsArray = []
        querySnapshot.forEach((doc) => {
        let project = doc.data()
            project.id = doc.id
            projectsArray.push(project)
        })
        commit('SET_PROJECTS', projectsArray)
        commit('SET_LOADING', false)
      })
      .catch((error) => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    },
    addProject({commit}, payload) {
      commit('SET_LOADING', true)
      firebase.firestore().collection('projects').add(payload)
      .then(() => {
        console.log("project added to db")
        commit('ADD_PROJECT', payload)
        commit('SET_LOADING', false)
      })
      .catch(err => {
        console.log(err)
        commit('SET_LOADING', false)
        })
    },
    updateProject({commit}, payload) {
      commit('SET_LOADING', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if(payload.content) {
        updateObj.content = payload.content
      }
      if(payload.person) {
        updateObj.person = payload.person
      }
      if(payload.status) {
        updateObj.status = payload.status 
      }
      if(payload.due) {
        updateObj.due = payload.due 
      }
      firebase.firestore().collection('projects').doc(payload.id).update(updateObj)
      .then(() => {
        console.log("project updated in db")
        commit('UPDATE_PROJECT', payload)
        commit('SET_LOADING', false)
      })
      .catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
      })
    }
  },
  getters: {
    getProject(state) {
      return (projectId) => {
        return state.projects.find((project) => {
          return project.id === projectId
        })
      }
    },
    getAllProjects(state) {
      return state.projects
    }
  }
}

export default ProjectsModule