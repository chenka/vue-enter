<template>
    <div id="leaderboard">
    <h2>Leaderboard</h2>
    <p v-for="(user, index) in limitedUser" :key="index" :class="'top-'+ (index + 1)">
        {{ index + 1 }}. {{ user.name }} - {{ user.score }}
    </p>
    </div>
</template>

<script>
export default {
    props: ['users'],
    data: function () {
        return { limitedUser: this.users.slice(0, 10) }
    }
}
</script>

<style>
  
</style>
