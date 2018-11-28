<template>
  <div class="dashboard">
    <div class="container dashboard-container">
      <div class="row">
        <div class="col s12">
          <div class="row">
            <div class="col s12 m4 l3">
              <button
                class="btn-floating waves-effect file-field input-field waves-light red btn-add-image"
              >
                <i class="material-icons">add</i>
                <input type="file" multiple @change="changeAdd" accept=".jpg, .jpeg, .png">
              </button>
              <button
                class="btn-floating waves-effect waves-light red"
                @click="isBtnRemoveActive = !isBtnRemoveActive"
              >
                <i class="material-icons">remove</i>
              </button>
              <button
                class="btn-floating waves-effect waves-light red"
                @click="isBtnDownloadActive = !isBtnDownloadActive"
              >
                <i class="material-icons">file_download</i>
              </button>
            </div>
            <div class="col s12 m6">
              <button
                v-if="isBtnRemoveActive"
                :class="['btn',images.some(imageInfo => imageInfo.selected === true ) ? '' : 'disabled']"
                @click="clickDelete"
              >delete</button>
              <button
                v-if="isBtnDownloadActive"
                :class="['btn',images.some(imageInfo => imageInfo.selected === true ) ? '' : 'disabled']"
                @click="clickDownload"
              >download</button>
            </div>
          </div>
        </div>
      </div>
      <transition-group name="list" tag="div" class="list-images">
        <div
          :class="[image.selected ? 'list-images-item-selected' : '', 'list-images-item']"
          v-for="image in images.slice((paginationNum-1)*countImagesOnPagination,paginationNum*countImagesOnPagination)"
          :key="image.key"
        >
          <img
            :src="image.url"
            :alt="image.name"
            :data-key="image.key"
            class="responsive-img"
            @click="clickImg"
          >
        </div>
      </transition-group>
      <pagination
        v-if="images.length"
        :minPaginationNum="minPaginationNum"
        :maxPaginationNum="maxPaginationNum"
        :countVisiblePaginationNum="countVisiblePaginationNum"
        :paginationNum="paginationNum"
      ></pagination>
      <div class="progress" v-if="pendingWorkWithImages">
        <div class="indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import Pagination from './Pagination'
export default {
  name: 'Dashboard',
  components: {Pagination},
  data () {
    return {
      paginationNum: +this.$route.params.page,
      minPaginationNum: 1,
      maxPaginationNum: null,
      countVisiblePaginationNum: 10,
      countImagesOnPagination: 12,
      isBtnRemoveActive: false,
      isBtnDownloadActive: false
    }
  },
  mounted () {
    const {countImagesOnPagination, images, responseGetImages} = this
    this.maxPaginationNum = Math.ceil(images.length / countImagesOnPagination)
    if (!images.length && responseGetImages.pending !== true) {
      this.getImages()
    }
  },
  computed: {
    ...mapState('imagesModule', ['images', 'responseGetImages', 'pendingWorkWithImages'])
  },
  methods: {
    ...mapActions('imagesModule', [
      'getImages',
      'addImage',
      'deleteImages',
      'downloadImages'
    ]),
    ...mapMutations('imagesModule', ['selectImage']),
    changeAdd ({ target }) {
      for (let file of target.files) {
        this.addImage(file)
      }
    },
    clickImg ({ target }) {
      if (this.isBtnRemoveActive || this.isBtnDownloadActive) {
        const key = +target.dataset.key
        this.selectImage(key)
      }
    },
    clickDelete (event) {
      if (this.isBtnRemoveActive) {
        this.deleteImages()
      }
    },
    clickDownload () {
      if (this.isBtnDownloadActive) {
        this.downloadImages()
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.paginationNum = +to.params.page
    },
    images () {
      const {images, countImagesOnPagination} = this
      this.maxPaginationNum = images && Math.ceil(images.length / countImagesOnPagination)
      if (!+this.$route.params.page || +this.$route.params.page < this.minPaginationNum || +this.$route.params.page > this.maxPaginationNum) {
        this.$router.replace('/dashboard/1')
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
@media screen and (max-width: 1200px)
  .list-images
    grid-template-columns: repeat(3,1fr)
@media screen and (max-width: 600px)
  .list-images
    grid-template-columns: repeat(2,1fr)
@media screen and (max-width: 480px)
  .list-images
    grid-template-columns: repeat(1,1fr)

</style>
