<template>
    <ul class="pagination" style="margin-bottom: 4em;">
        <i class="material-icons" :class="{ 'disabled': currentPage == minPage }">chevron_left</i>
        <li v-for="index in maxPage" v-bind:key="index" :class="{ 'active': (index == currentPage), 'waves-effect': (index != minPage && index != maxPage) }">
            <router-link @click.prevent="navegar(index)" :to="{ path: url, query: { page: index }}">
                {{ index }}
            </router-link>
        </li>
        <i class="material-icons" :class="{ 'disabled': currentPage == maxPage }">chevron_right</i>
    </ul>
</template>


<script>
import {api_url} from "../main"

export default ({
    props: [
        'currentPage',
        'maxPage',
        'minPage',
        'url'
    ],
    data(){
        return { 
            api_url: api_url
        }
    },
    methods:{
        navegar(index){
            this.$router.push({ path: this.url, query: { page: index }})
            this.cambiarRuta()
            
        },
        cambiarRuta(){
            return new Promise(() => {
                setTimeout(() => {
                    this.$emit('CambioRuta')
                }, 300)
            })
        }
    }
})
</script>
