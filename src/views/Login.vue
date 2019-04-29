<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!authUser">
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignIn" v-if="showLoginForm">
                <span>Welcome Back</span>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email1" label="eMail" id="email1" v-model="loginForm.email" type="email"></v-text-field>
                    <v-text-field name="password1" label="Password" id="password1" v-model="loginForm.password" type="password" required></v-text-field>
                    <v-btn type="submit" :disabled="loading" :loading="loading">Signin<span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                      </span></v-btn>
                    <img src="@/assets/btn_google_signin_light_focus_web.png" @click="googleSignIn" class="right"/>
                    <div>
                      <a @click="toggleForm">Create an Account</a>
                      <a @click="togglePasswordReset" class="right">Forgot Password</a>
                    </div>
                  </v-flex>
                </v-layout>
              </form>
              <form @submit.prevent="onRegister" v-if="!showLoginForm && !showForgotPassword">
                <span>Register</span>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="name" label="User Name" id="name" v-model="registerForm.name" type="text"></v-text-field>
                    <v-text-field name="email2" label="eMail" id="email2" v-model="registerForm.email" type="email"></v-text-field>
                    <v-text-field name="password2" label="Password" id="password2" v-model="registerForm.password" type="password"></v-text-field>
                    <v-btn type="submit" :disabled="loading" :loading="loading">Register<span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                      </span></v-btn>
                    <div class="extras">
                        <a @click="toggleForm">Back to Log In</a>
                    </div>
                  </v-flex>
                </v-layout>
              </form>
              <form @submit.prevent="resetPassword" v-if="showForgotPassword">
                <div v-if="!passwordResetSuccess">
                <span>Password Reset</span>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email3" label="eMail" id="email3" v-model="passwordResetForm.email" type="email"></v-text-field>
                    <v-btn type="submit" :disabled="loading" :loading="loading">Submit<span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                      </span></v-btn>
                    <div class="extras">
                        <a @click="toggleForm">Back to Log In</a>
                    </div>
                  </v-flex>
                </v-layout>
                </div>
                <div v-else>
                  <h1>Email Sent</h1>
                  <p>check your email for a link to reset your password</p>
                  <v-btn @click="togglePasswordReset">Back to login</v-btn>
                </div>
              </form>
              <div v-if="errorMsg !== ''" class="red--text">
                <p>{{ errorMsg }}</p>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="authUser">
      <v-flex xs12 sm6 offset-sm3>
        <div>
          <p>Email: {{authUser.email}}</p>
          <p>Name: {{authUser.displayName}}</p>
          <img v-if="user!=undefined" :src="user.photoURL" />
          <img v-else src="https://randomuser.me/api/portraits/lego/1.jpg" />
          
          <br>
          <v-btn @click="googleSignOut">SIGNOUT</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import firebase from 'firebase/app'
// import 'firebase/auth'

  export default {
    data() {
      return {
        authUser: null,
        displayName: '',
        photoUrl: '',
        errorMsg: '',
        loginForm: {
          email: '',
          password: ''
        },
        registerForm: {
          name: '',
          email: '',
          password: ''
        },
        passwordResetForm: {
          email: ''
        },
        showLoginForm: true,
        showForgotPassword: false,
        passwordResetSuccess: false,
      }
    },
    // created() {
      
    //   firebase.auth().onAuthStateChanged(result => {
    //     this.authUser = result
    //     if(result) {
    //       this.displayName = result.displayName
    //       this.photoUrl = result.photoURL
    //     }
    //   })
    // },
    computed: {
      user() {
        return this.$store.getters.user
      },
      loading() {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/lobby')
        }
      }
    },
    methods: {
      toggleForm() {
        this.showLoginForm = !this.showLoginForm
      },
      togglePasswordReset() {
        
        if (this.showForgotPassword) {
            this.showLoginForm = true
            this.showForgotPassword = false
            this.passwordResetSuccess = false
        } else {
            this.showLoginForm = false
            this.showForgotPassword = true
        }
      },
      onRegister() {
        console.log('attempting to createUserWithEmailAndPassword')
        this.$store.dispatch('signUserUp', {email: this.registerForm.email, password: this.registerForm.password, name: this.registerForm.name})
        
      },
      onSignIn() {
        console.log('attempting to sign user in with creditials')
        this.$store.dispatch('signUserIn', {email: this.loginForm.email, password: this.loginForm.password})
      },
      googleSignIn() {
        this.$store.dispatch('googleSignIn')
      },
      googleSignOut() {
        this.$store.dispatch('googleSignOut')
      }
    }
  }
</script>

<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>