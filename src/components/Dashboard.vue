<template>
  <div class="dashboard">
    <div class="container dashboard-container">
      <div class="row">
        <div class="col s12">
          <button class="btn-floating waves-effect file-field input-field waves-light red btn-add-image">
            <i class="material-icons">add</i>
            <input type="file" multiple @change="changeAdd" accept=".jpg, .jpeg, .png">
          </button>
            <button class="btn-floating waves-effect waves-light red" @click="isBtnRemoveActive = !isBtnRemoveActive">
              <i class="material-icons">remove</i>
            </button>
            <button class="btn-floating waves-effect waves-light red" @click="isBtnDownloadActive = !isBtnDownloadActive">
              <i class="material-icons">file_download</i>
            </button>
            <button v-if="isBtnRemoveActive" :class="['btn',images.some(imageInfo => imageInfo.selected === true ) ? '' : 'disabled']" @click="clickDelete">delete</button>
            <button v-if="isBtnDownloadActive" :class="['btn',images.some(imageInfo => imageInfo.selected === true ) ? '' : 'disabled']" @click="clickDownload">download</button>
        </div>
      </div>
      <transition-group name="list" tag="div" class="list-images">
        <div :class="[image.selected ? 'list-images-item-selected' : '', 'list-images-item']" v-for="image in images.slice((paginationNum-1)*countImageOnPagination,paginationNum*countImageOnPagination)" :key="image.key">
          <img :src="image.url" :alt="image.name" :data-key="image.key" class="responsive-img" @click="clickImg">
        </div>
      </transition-group>
      <ul class="pagination center-align" v-if="images.length">
        <li v-if="Math.ceil(images.length/countImageOnPagination) >= 2" :class="[paginationNum === 1 ? 'disabled' : 'waves-effect']">
          <a @click="clickPaginationItem(paginationNum-1)" :href="'#'+ paginationNumPrev">
            <i class="material-icons">chevron_left</i>
          </a>
        </li>
        <li v-if="paginationNum < number+countVisiblePaginationNum && paginationNum > number-countVisiblePaginationNum" :class="[number === paginationNum ? 'active' : '','waves-effect']" v-for="number in Math.ceil(this.images.length/this.countImageOnPagination)" :key="number">
          <a @click="clickPaginationItem(number)" :href="'#'+number">{{number}}</a>
        </li>
        <li v-if="Math.ceil(images.length/countImageOnPagination) >= 2" :class="[Math.ceil(this.images.length/this.countImageOnPagination) === paginationNum ? 'disabled' : 'waves-effect']">
          <a @click="clickPaginationItem(paginationNum+1)" :href="'#'+paginationNumNext">
            <i class="material-icons">chevron_right</i>
          </a>
        </li>
      </ul>
      <div class="progress" v-if="pendingWorkWithImages">
        <div class="indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      paginationNum: 1,
      countVisiblePaginationNum: 10,
      countImageOnPagination: 12,
      isBtnRemoveActive: false,
      isBtnDownloadActive: false
    };
  },
  created() {
    if (!this.images.length && this.responseGetImages.pending !== true) {
      this.getImages();
    }
  },
  computed: {
    ...mapState("imagesModule", [
      "images",
      "responseGetImages",
      "responseDeleteImages",
      "responseAddImage"
    ]),
    ...mapGetters("imagesModule", ["pendingWorkWithImages"]),
    paginationNumNext(){
      let countPagination = Math.ceil(this.images.length/this.countImageOnPagination)
      return countPagination === this.paginationNum ? countPagination : this.paginationNum + 1
    },
    paginationNumPrev(){
      return this.paginationNum === 1 ? 1 : this.paginationNum - 1
    }
  },
  methods: {
    ...mapActions("imagesModule", [
      "getImages",
      "addImage",
      "deleteImages",
      "downloadImages"
    ]),
    ...mapMutations("imagesModule", ["selectImage"]),
    changeAdd({ target }) {
      for (let file of target.files) {
        this.addImage(file);
      }
    },
    clickImg({ target }) {
      if (this.isBtnRemoveActive || this.isBtnDownloadActive) {
        const key = +target.dataset.key;
        this.selectImage(key);
      }
    },
    clickDelete(event) {
      if (this.isBtnRemoveActive) {
        this.deleteImages();
      }
    },
    clickDownload() {
      if (this.isBtnDownloadActive) {
        this.downloadImages();
      }
    },
    clickPaginationItem(number) {
      if (
        number === 0 ||
        number ===
          Math.ceil(this.images.length / this.countImageOnPagination) + 1
      ) {
        return;
      }
      this.paginationNum = number;
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
.dashboard-container
  position: relative
.progress
  position: absolute
  width: 100%
.btn-add-image
	margin: 0
.list-images
	display: grid
	grid-gap: 10px
	grid-template-columns: repeat(6,1fr)
	grid-auto-rows: 150px
.list-images-item
  padding: 10px
  display: flex
  align-items: center
  justify-content: center
  &-selected
    border: 2px solid #da9b9b
    padding: 8px
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
