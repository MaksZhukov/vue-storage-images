<template>
  <div class="dashboard">
		<div class="container">
		<div class="file-field input-field">
      <div class="btn-floating waves-effect waves-light red">
        <i class="material-icons">add</i>
        <input type="file" multiple @change="changeAdd" id="file" accept=".jpg, .jpeg, .png">
      </div>
    </div>
		<div class="row">
			<div class="col s2" v-for="image in images">
				<img :src="image.url" :alt="image.name" :data-key="image.key" class="responsive-img" @click="clickImg">
			</div>
		</div>
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
</style>
