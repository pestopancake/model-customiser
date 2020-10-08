<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <router-link to="/model">Model</router-link>
    </div>
    <img alt="Vue logo" src="./assets/logo.png" v-show="$store.state.isLoading">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#c {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: block;
  position: fixed;
  z-index: -1;
}
</style>
