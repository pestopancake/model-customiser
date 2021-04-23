<template>
    <div id="app">
        <b-spinner
            small
            label="Small Spinner"
            class="global-loading-spinner"
            v-show="$store.state.isLoading || $store.state.isLoadingSoft"
        ></b-spinner>
        <div id="nav">
            <router-link to="/">Select your jersey</router-link>
            <!-- <router-link to="/about">About</router-link> -->
        </div>
        <!-- <img alt="Loading..." src="./assets/loading.png" v-show="$store.state.isLoading"> -->
        <b-spinner
            large
            label="Small Spinner"
            v-show="$store.state.isLoading"
        ></b-spinner>
        <router-view />
        <dev v-if="env === 'development'"></dev>
        <canvas id="texturecanvas"></canvas>
        <canvas id="resizecanvas"></canvas>
    </div>
</template>
<script>
import Dev from "@/components/Dev.vue";

export default {
    name: "App",
    data() {
        return {
            env: process.env.NODE_ENV,
        };
    },
    components: {
        Dev,
    },
};
</script>
<style lang="scss">
canvas {
    outline: none;
    cursor: move;
    cursor: grab;
}
canvas:active{
  cursor: grabbing;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    .global-loading-spinner {
        position: fixed;
        top: 10px;
        right: 10px;
    }
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

#texturecanvas {
    display: none;
}

#resizecanvas {
    display: none;
}
</style>
