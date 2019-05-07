<template>
  <div class="users">
    <h1 class="subheading grey--text">Users</h1>
    
    <v-container class="my-5">
      <v-card flat class="mb-1" v-for="user in users" :key="user.id">
        <v-layout row wrap class="pa-2">
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Photo</div>
            <v-avatar :tile="tile" :size="avatarSize" color="grey lighten-4">
              <img :src="user.photoURL">
            </v-avatar>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Person</div>
            <div>{{user.displayName}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Created</div>
            <div>{{user.created}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">Last Login</div>
            <div>{{user.lastSignIn}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <div class="caption grey--text">User ID</div>
            <div>{{user.id}}</div>
          </v-flex>
          <v-flex xs6 sm3 md2>
            
            <div class="caption grey--text">Status</div>
            <v-chip small>{{onlineUsers[1]}}</v-chip>
          
          </v-flex>
        </v-layout>
      </v-card>
      <v-divider></v-divider>
    </v-container>
    
  </div>
</template>

<script>
    export default {
        name: 'Users',
        data() {
            return {

            }
        },
        methods: {
            sortBy(property) {
                this.users.sort((a, b) => a[property] < b[property] ? -1 : 1)
            }
        },
        created() {
            this.$store.dispatch('getRegUsers')
        },
        computed: {
          users() {
            return this.$store.getters.getRegisteredUsers
          },
          onlineUsers() {
            return this.$store.getters.onlineUsers
          }
        }
    }
</script>

<style scoped>

.onlineUsers.online{
  border-left: 4px solid #3CD1C2;
}
.onlineUsers.offline{
  border-left: 4px solid orange;
}
</style>