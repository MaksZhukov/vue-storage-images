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
			<transition-group name="list" tag="div" class="list-images" :style="{height: listImagesHeight}">
			<div :class="[image.selected ? 'list-images-item-selected' : '', 'list-images-item']" v-for="image in images.slice((paginationNum-1)*countImageOnPagination,paginationNum*countImageOnPagination)" :key="image.key">
				<img :src="image.url" :alt="image.name" :data-key="image.key" class="responsive-img" @click="clickImg">
			</div>
			</transition-group>
      <ul class="pagination center-align" v-if="images.length">
        <li :class="[number === paginationNum ? 'active' : '','waves-effect']" v-for="number in Math.ceil(images.length/countImageOnPagination)" :key="number"><a @click="clickPaginationItem(number)" :href="'#'+number">{{number}}</a></li>
      </ul>
		</div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      paginationNum: 1,
      countImageOnPagination: 12,
      isBtnRemoveActive: false
    };
  },
  created() {
    if (!this.images.length && this.responseGetImages.pending !== true) {
      this.getImages();
    }
  },
  computed: {
    ...mapState("imagesModule", ["images", "responseGetImages"]),
    listImagesHeight: ()=>{
      if (this.images){
        const currentImageOnPagination = this.images.slice((paginationNum-1)*countImageOnPagination,paginationNum*countImageOnPagination).length
        return currentImageOnPagination > countImageOnPagination / 2 && currentImageOnPagination / countImageOnPagination <=1 ? '310px' : '150px'
      }
    }},
  methods: {
    ...mapActions("imagesModule", ["getImages", "addImage", "deleteImages"]),
    ...mapMutations("imagesModule", ["selectImage"]),
    changeAdd({ target }) {
      for (let file of target.files) {
        this.addImage(file);
      }
    },
    clickImg({ target }) {
      if (this.isBtnRemoveActive) {
        const key = +target.dataset.key;
        this.selectImage(key);
      }
    },
    clickRemove(event) {
      this.isBtnRemoveActive = !this.isBtnRemoveActive;
    },
    clickDelete(event) {
      if (this.isBtnRemoveActive) {
        this.deleteImages();
      }
    },
    clickPaginationItem(number){
      this.paginationNum = number
    }
  }
};
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
.list-images-item
  display: flex
  align-items: center
  justify-content: center
  &-selected
    border: 2px solid red
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */
  opacity: 0
  transform: translateX(10px)
.list-enter-active
  transition: all 1s
.list-leave-active
  transition: all .5s
  position: absolute
  transform: translateX(-30px)
</style>
