import { st, fs, firebase } from '../../../firebase'

const getDefaultState = () => ({
  images: [],
  numberInsertNext: 0,
  responseAddImage: {},
  responseAddImageToDB: {},
  responseAddImageToStorage: {},
  responseGetImage: {},
  responseGetImages: {},
  responseDeleteImages: {},
  responseDeleteImagesFromDB: {},
  responseDeleteImagesFromStorage: {},
  responseDownloadImages: {}
})

const userModule = {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    selectedImages: state => {
      return state.images.filter(imageInfo => imageInfo.selected)
    },
    noSelectedImages: state => {
      return state.images.filter(imageInfo => !imageInfo.selected)
    },
    pendingWorkWithImages: state => {
      return state.responseAddImage.pending === true || state.responseDeleteImages.pending === true || state.responseGetImages.pending === true
    },
    getImages: state => {
      return state.images
    },
    getResponseGetImages: state => {
      return state.responseGetImages
    },
    getResponseDeleteImages: state => {
      return state.responseDeleteImages
    },
    getResponseAddImages: state => {
      return state.responseAddImage
    }
  },
  mutations: {
    updateNumberInsertNext (state, newNumberInsertNext) {
      state.numberInsertNext = newNumberInsertNext
    },
    addImagePending (state, payload) {
      state.responseAddImage = payload
    },
    addImageSuccess (state, { response, imageInfo }) {
      state.images.push(imageInfo)
      state.responseAddImage = response
    },
    addImageError (state, payload) {
      state.responseAddImage = payload
    },
    addImageToStoragePending (state, payload) {
      state.responseAddImageToStorage = payload
    },
    addImageToStorageSuccess (state, payload) {
      state.responseAddImageToStorage = payload
    },
    addImageToStorageError (state, payload) {
      state.responseAddImageToStorage = payload
    },
    addImageToDBPending (state, payload) {
      state.responseAddImageToDB = payload
    },
    addImageToDBSuccess (state, payload) {
      state.responseAddImageToDB = payload
    },
    addImageToDBError (state, payload) {
      state.responseAddImageToDB = payload
    },
    getImagePending (state, payload) {
      state.responseGetImage = payload
    },
    getImageSuccess (state, payload) {
      state.responseGetImage = payload
    },
    getImageError (state, payload) {
      state.responseGetImage = payload
    },
    getImagesPending (state, payload) {
      state.responseGetImages = payload
    },
    getImagesSuccess (state, payload) {
      state.responseGetImages = payload
    },
    getImagesError (state, payload) {
      state.responseGetImages = payload
    },
    deleteImagePending (state, payload) {
      state.responseDeleteImages = payload
    },
    deleteImageSuccess (state, {response, noSelectedImages}) {
      state.images = noSelectedImages
      state.responseDeleteImages = response
    },
    deleteImageError (state, payload) {
      state.responseDeleteImages = payload
    },
    deleteImageFromDBPending (state, payload) {
      state.responseDeleteImagesDB = payload
    },
    deleteImageFromDBSuccess (state, payload) {
      state.responseDeleteImagesDB = payload
    },
    deleteImageFromDBError (state, payload) {
      state.responseDeleteImagesDB = payload
    },
    deleteImageFromStoragePending (state, payload) {
      state.responseDeleteImagesFromStorage = payload
    },
    deleteImageFromStorageSuccess (state, payload) {
      state.responseDeleteImagesFromStorage = payload
    },
    deleteImageFromStorageError (state, payload) {
      state.responseDeleteImagesFromStorage = payload
    },
    resetImages (state) {
      const defaultState = getDefaultState()
      Object.keys(defaultState).forEach(key => {
        state[key] = defaultState[key]
      })
    },
    selectImage (state, key) {
      const image = state.images.find(image => image.key === key)
      image.selected = !image.selected
    },
    downloadImagesPending (state, payload) {
      state.responseDownloadImages = payload
    },
    downloadImagesSuccess (state, payload) {
      state.responseDownloadImages = payload
    },
    downloadImagesError (state, payload) {
      state.responseDownloadImages = payload
    }
  },
  actions: {
    async getImages ({ commit }) {
      try {
        commit('getImagesPending', { pending: true })
        const id = this.state.userModule.user.uid
        const images = await fs.collection('images').doc(id).get()
        if (images.exists) {
          commit('getImagesSuccess', {
            pending: false,
            status: 'success',
            message: 'images was found'
          })
          const data = images.data()
          for (let key in data) {
            commit('addImageSuccess', {
              response: {
                pending: false,
                status: 'success',
                message: 'add image success'
              },
              imageInfo: {
                key: +key,
                name: data[key].name,
                url: data[key].url,
                selected: false
              }
            })
            commit('updateNumberInsertNext', +key)
          }
        } else {
          commit('getImagesError', {
            pending: false,
            status: 'error',
            message: 'No such document'
          })
        }
      } catch (error) {
        commit('getImagesError', {
          pending: false,
          status: 'error',
          message: error
        })
      }
    },
    async addImage ({ commit, state, dispatch }, file) {
      try {
        commit('addImagePending', { pending: true })
        const id = this.state.userModule.user.uid
        const key = state.numberInsertNext + 1
        commit('updateNumberInsertNext', key)
        const { name } = file
        await dispatch('addImageToStorage', { id, key, name, file })
        const url = await dispatch('getImage', { id, key, name })
        await dispatch('addImageToDB', { id, key, name, url })
        commit('addImageSuccess', {
          response: {
            pending: false,
            status: 'success',
            message: 'add image success'
          },
          imageInfo: { key, name, url, selected: false }
        })
      } catch (error) {
        commit('addImageError', { pending: false, status: 'error', message: error })
      }
    },
    async getImage ({ commit }, { id, key, name }) {
      try {
        commit('getImagePending', { pending: false })
        const url = await st.ref(`images/${id}/${key + name}`).getDownloadURL()
        commit('getImageSuccess', {
          status: 'success',
          pending: false,
          message: 'image get success'
        })
        return url
      } catch (error) {
        commit('getImageError', {
          pending: false,
          status: 'error',
          message: error
        })
      }
    },
    async addImageToDB ({ commit }, { id, key, name, url }) {
      try {
        const promise = fs.collection('images').doc(id).set({ [key]: { name, url } }, { merge: true })
        commit('addImageToDBSuccess', {
          status: 'success',
          message: 'added to database'
        })
        return promise
      } catch (error) {
        commit('addImageError', {
          status: 'error',
          pending: false,
          message: error
        })
      }
    },
    async addImageToStorage ({ commit, dispatch }, { id, key, name, file }) {
      try {
        commit('addImageToStoragePending', { pending: true })
        const promise = await st.ref(`images/${id}/${key + name}`).put(file)
        commit('addImageToStorageSuccess', {
          pending: false,
          status: 'success',
          message: 'add to storage success'
        })
        dispatch('getImage', { id, key, name })
        return promise
      } catch (error) {
        commit('addImageToStorageError', {
          pending: true,
          status: 'error',
          message: error
        })
      }
    },
    async deleteFromDB ({ commit, state, getters }, id) {
      try {
        commit('deleteImageFromDBPending', { pending: true })
        const update = {}
        const selectedImages = getters.selectedImages
        selectedImages.forEach(imageInfo => {
          update[imageInfo.key] = firebase.firestore.FieldValue.delete()
        })
        const promise = await fs.collection('images').doc(id).update(update)
        commit('deleteImageFromDBSuccess', {
          pending: false,
          status: 'success',
          message: 'image was deleted from DB'
        })
        return promise
      } catch (error) {
        commit('deleteImageFromDBError', {
          pending: false,
          status: 'error',
          message: error
        })
      }
    },
    async deleteFromStorage ({ commit, state, getters }, id) {
      commit('deleteImageFromStoragePending', { pending: true })
      const selectedImages = getters.selectedImages
      const arrayPromise = selectedImages.map(async imageInfo => {
        try {
          const name = imageInfo.key + imageInfo.name
          const promise = await st.ref(`images/${id}/${name}`).delete()
          commit('deleteImageFromStorageSuccess', {
            pending: false,
            status: 'success',
            message: `image ${name} was deleted from storage`
          })
          return promise
        } catch (error) {
          commit('deleteImageFromStorageError', {
            pending: false,
            status: 'error',
            message: name + error.message
          })
        }
      })
      const promiseAll = await Promise.all(arrayPromise)
      return promiseAll
    },
    async deleteImages ({ commit, dispatch, getters }) {
      try {
        commit('deleteImagePending', { pending: true })
        const id = this.state.userModule.user.uid
        await dispatch('deleteFromDB', id)
        await dispatch('deleteFromStorage', id)
        commit('deleteImageSuccess', {
          response: { pending: false, status: 'success', message: 'images was deleted' },
          noSelectedImages: getters.noSelectedImages
        })
      } catch (error) {
        commit('deleteImageError', {
          pending: false,
          status: 'error',
          message: error
        })
      }
    },
    async downloadImages ({commit, getters}) {
      try {
        commit('downloadImagesPending', { pending: true })
        const blobs = await Promise.all(getters.selectedImages.map(async image => {
          const response = await fetch(image.url)
          return response.blob()
        }))
        blobs.forEach((blob, index) => {
          let a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = getters.selectedImages[index].name
          a.click()
        })
        commit('downloadImagesSuccess', { pending: false, status: 'success', message: 'download images success' })
      } catch (error) {
        commit('downloadImagesPending', { pending: true, status: 'error', message: error })
      }
    }
  }
}

export default userModule
