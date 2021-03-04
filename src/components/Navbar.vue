<template>
    <nav>
        <v-snackbar v-model="snackbar" :timeout="4000" top color="blue">
            <span>User added/updated a project.</span>
            <v-btn flat color="white" @click="snackbar=false">Close</v-btn>
        </v-snackbar>
        <v-toolbar flat app>
            <v-toolbar-side-icon class="grey--text" @click="leftDrawer=!leftDrawer"></v-toolbar-side-icon>
            <v-toolbar-title class="text-uppercase grey--text">
                <span class="font-weight-light">Team Workspace</span>
                <span v-if="user != undefined"> Hello {{user.displayName}}</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
    
            <!--dropdown menu-->
            <v-menu offset-y>
                <v-btn flat slot="activator" color="grey">
                    <v-icon left>expand_more</v-icon>
                    <span>menu</span>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                        <v-list-title>{{link.text}}</v-list-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <!--Login and Signout Buttons-->

            <!--<v-btn flat color="grey" v-if="user" @click="googleSignOut">-->
            <!--    <span>Sign Out</span>-->
            <!--    <v-icon right>exit_to_app</v-icon>-->
            <!--</v-btn>-->
            <v-btn v-if="!user" color="grey" flat to='/login' exact >
                <span>Login</span>
                <v-icon right>face</v-icon>
            </v-btn>
            <v-toolbar-side-icon class="grey--text" @click="rightDrawer=!rightDrawer"></v-toolbar-side-icon>
        </v-toolbar>
        <v-navigation-drawer left app v-model="leftDrawer" class="blue">
            <v-layout column align-center>
                <v-flex class="mt-5">
                    <v-avatar :size="100" class="grey lighten-2" >
                        <img v-if="!user" src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar" />
                        <img v-else :src="user.photoURL" router :to="login"/>
                    </v-avatar>
                    <p v-if="!user" class="white--text subheading mt-1">User</p>
                    <p v-else class="white--text subheading mt-1">{{user.displayName}}</p>
                </v-flex>
                <v-flex class="mt-4 mb-3">
                    <addNewProject v-if="user" @projectAdded="snackbar = true" />
                </v-flex>
            </v-layout>
            <v-list>
                <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-tile-action>
                        <v-icon class="white--text">{{link.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="white--text">{{link.text}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <!--Display Number of Users Online-->
            <v-list>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon dark>supervisor_account</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content class="white--text">
                     <!--numChildren is 0 in vuex onlineUsers array-->
                    Online Users {{onlineUsers[0]}}
                  </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <!--Display List of Users Online-->
            <v-list>
                <v-list-tile avatar v-for="authUser in onlineUsers[1]" :key="authUser.key">
                    <v-list-tile-avatar>
                        <img v-if="!user" src="https://randomuser.me/api/portraits/lego/1.jpg" />
                        <img v-else :src="authUser.user.photoURL" />
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <!--google auth returns user obj then user details-->
                        <v-list-tile-title class="white--text">{{authUser.user.displayName}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-navigation-drawer right app v-model="rightDrawer" class="blue">
          <v-list dark>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>chat</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="white--text">Chats</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import addNewProject from './addNewProject'

  export default {
    components: {addNewProject},
    data() {
        return {
            // user: null,
            leftDrawer: false,
            rightDrawer: false,
            snackbar: false,
            links: [
                {icon: 'dashboard', text: 'Dashboard', route: '/'},
                {icon: 'face', text: 'Login', route: '/login'},
                {icon: 'folder', text: 'My Projects', route: '/projects'},
                {icon: 'person', text: 'Team', route: '/team'},
                // {icon: 'chat', text: 'Chat', route: '/chat'},
                {icon: 'meeting_room', text: 'Lobby', route: '/lobby'},
                {icon: 'group', text: 'Users', route: '/users'},
            ],
            
        }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          console.log("user change detected: ", value)
        }
      }
    },
    computed: {
        user() {
          return this.$store.getters.user  
        },
        onlineUsers() {
            return this.$store.getters.onlineUsers
        }
    },
    methods: {
        googleSignOut() {
            this.$store.dispatch('googleSignOut')
        }
    }
  }
</script>