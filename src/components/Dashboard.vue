<template>
  <div class="dashboard">
		<div class="container">
			<div class="row">
				<div class="col s12">
					<button class="btn-floating waves-effect file-field input-field waves-light red btn-add-image">
						<i class="material-icons">add</i>
						<input type="file" multiple @change="changeAdd" id="file" accept=".jpg, .jpeg, .png">
					</button>
					<button class="btn-floating waves-effect waves-light red" @click="clickRemove">
						<i class="material-icons">remove</i>
					</button>
					<button v-if="isBtnRemoveActive" :class="['btn',images.some(imageInfo => imageInfo.selected === true ) ? '' : 'disabled']" @click="clickDelete">delete</button>
				</div>
		</div>
			<transition-group name="list" tag="div" class="list-images">
			<div :class="[image.selected ? 'list-images-item-selected' : '', 'list-images-item']" v-for="image in images" :key="image.key">
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
			isBtnRemoveActive: false
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
			'deleteImages'
		]),
		...mapMutations('imagesModule',[
			'selectImage'
		]),
		changeAdd({target}){
      for (let file of target.files){
				this.addImage(file)
      }
    },
    clickImg({target}){
			if (this.isBtnRemoveActive){
			const key = +target.dataset.key
			this.selectImage(key)
			}
		},
		clickRemove(event){
			this.isBtnRemoveActive = !this.isBtnRemoveActive
		},
		clickDelete(event){
			if (this.isBtnRemoveActive){
				this.deleteImages()
			}
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
.btn-add-image
	margin: 0 10px 0 0
.list-images
	display: grid
	grid-gap: 10px
	grid-template-columns: repeat(6,1fr)
	grid-auto-rows: 150px
	&-item
		height: 100%
		display: flex
		align-items: center
		&-selected
			border: 2px solid red
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */
  opacity: 0
  transform: translateY(30px)
.list-enter-active, .list-leave-active
  transition: all 1s;
</style>
