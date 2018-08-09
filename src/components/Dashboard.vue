<template>
  <div class="dashboard">
		<div class="container">
		<div class="file-field input-field">
      <div class="btn-floating waves-effect waves-light red">
        <i class="material-icons">add</i>
        <input type="file" multiple @change="changeAdd" id="file" accept=".jpg, .jpeg, .png">
      </div>
    </div>
			<transition-group name="list" tag="div" class="list-images">
			<div class="list-images-item" v-for="image in images" :key="image.key">
				<img :src="image.url" :alt="image.name" :data-key="image.key" class="responsive-img" @click="clickImg">
			</div>
			</transition-group>
		</div>
  </div>
</template>

<script>
	import { mapMutations, mapState, mapActions	} from 'vuex'
export default {
  name: 'Dashboard',
  data () {
    return {
    }
	},
	created(){
		if (!this.images.length && this.responseGetImages.pending !== true){
			this.getImages()
		}
	},
	computed: mapState('imagesModule',[
		'images',
		'responseGetImages',
	]),
	methods: {
		...mapActions('imagesModule',[
			'getImages',
      'addImage',
      'deleteImage'
		]),
		changeAdd({target}){
      for (let file of target.files){
				this.addImage(file)
      }
    },
    clickImg({target}){
      const key = +target.dataset.key
      this.deleteImage(key)
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.dashboard
	width: 100%
	min-height: 300px
	padding: 20px 0 
.list-images
	display: grid
	grid-gap: 10px
	align-items: center
	grid-template-columns: repeat(6,1fr)
	grid-auto-rows: 150px
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */
  opacity: 0
  transform: translateY(30px)
.list-enter-active, .list-leave-active
  transition: all 1s;
</style>
