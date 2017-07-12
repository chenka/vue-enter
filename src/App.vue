<template>
  <div id="app">
    <div id="welcome" v-if="state == 'welcome'">
      <h1>What is your name?</h1>
      <input type="text" v-model="name" @keyup.enter="countdown">
      <leaderboard v-if="sortedUsers.length > 0" :users="sortedUsers"></leaderboard>
    </div>
    <div id="countdown" v-else-if="state == 'countdown'">
      <h1>{{ counter }}</h1>
      <img src="http://media.tumblr.com/tumblr_ly2jgyM1Su1r00g3i.gif">
    </div>
    <div id="game" v-else-if="state == 'play'">
      <h1>Press Enter! - {{ countdownPlay }}</h1>
      <h2>{{ count }}</h2>
      <div id="power" :style="{ background: colorBar, height: height + 'px' }"></div>
    </div>
    <div id="game" v-else>
      <h1>Game Over</h1>
      <h2>You score is
        <span style="color: red; font-weight:bolder; font-size:1.3em">{{ count }}</span> point.</h2>
      <button @click="tryAgain">Try Again</button>
      <leaderboard :users="sortedUsers"></leaderboard>
    </div>
  </div>
</template>

<script>
const COUNTER = 3
const COUNTDOWN_PLAY = 10
import Firebase from 'firebase'
import leaderboard from './components/Leaderboard.vue'
const config = {
  apiKey: "AIzaSyDIKgC2VruZ_uSUWFqZzScTD-uB8dWuSNo",
  authDomain: "game-enter.firebaseapp.com",
  databaseURL: "https://game-enter.firebaseio.com",
  projectId: "game-enter",
  storageBucket: "game-enter.appspot.com",
  messagingSenderId: "676216190640"
};
const firebaseApp = Firebase.initializeApp(config)
const db = firebaseApp.database()
export default {
  name: 'app',
  components: {
    leaderboard
  },
  firebase: {
    users: db.ref('users')
  },
  data() {
    return {
      count: 0,
      height: 0,
      name: null,
      state: 'welcome',
      counter: COUNTER,
      countdownPlay: COUNTDOWN_PLAY,
      sortedUsers: [],
      colorBar: 'red'
    }
  },
  methods: {
    enter() {
      this.height += 3
      this.count += 1
      if (this.count % 2 == 0) {
        this.colorBar = 'red'
      } else {
        this.colorBar = 'blue'
      }
    },
    countdown() {
      this.state = 'countdown'
      const count = setInterval(() => {
        this.counter -= 1
        this.countdownText = this.counter
        if (this.counter <= 1) {
          clearInterval(count)
          setTimeout(this.start, 1000)
        }
      }, 1000)
    },
    start() {
      this.state = 'play'
      const count = setInterval(() => {
        this.countdownPlay -= 1
        if (this.countdownPlay <= 0) {
          clearInterval(count)
          setTimeout(this.gameover, 1000)
        }
      }, 1000)
    },
    gameover() {
      this.state = 'gameover'
      document.body.style.backgroundColor = ''
      this.$firebaseRefs.users.push({
        name: this.name,
        score: this.count
      })
    },
    tryAgain() {
      this.height = 0
      this.count = 0
      this.counter = COUNTER
      this.countdownPlay = COUNTDOWN_PLAY
      this.countdown()
    }
  },
  created() {
    // this.sortedUsers = [{name:'A', score:10}]
    db.ref('users').orderByChild('score').on('value', (value) => {
      const values = value.exportVal()
      const t = []
      for (var key in values) {
        if (values.hasOwnProperty(key)) {
          var element = values[key];
          t.push(element)
        }
      }
      this.sortedUsers = t.sort((a,b) => b.score - a.score)
    })

    window.addEventListener('keyup', (event) => {
      if (event.keyCode == 13 && this.state == 'play') {
        this.enter()
      }
    })
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 50px;
}

.top-1 {
  font-size: 40px
}

.top-2 {
  font-size: 35px
}

.top-3 {
  font-size: 30px
}

#power {
  width: 200px;
  margin: 0 auto;
  /*-webkit-transition: height 100ms linear;
    -moz-transition: height 100ms linear;
    -o-transition: height 100ms linear;
    -ms-transition: height 100ms linear;
    transition: height 100ms linear;*/
}



/*h1, h2 {
  font-weight: normal;
}*/

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
