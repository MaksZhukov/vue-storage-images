import { st, fs, firebase } from '../../../firebase'

const getDefaultState = () => ({
  images: [],
  numberInsertNext: 0,
  responseAddImage: {},
  responseAddImageToDB: {},
  responseAddImageToStorage: {},
  responseGetImage: {},
  responseGetImages: {},
  responseDeleteImage: {},
  responseDeleteImageFromDB: {},
  responseDeleteImageFromStorage: {}
})

const userModule = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    updateNumberInsertNext (state, newNumberInsertNext) {
      state.numberInsertNext = newNumberInsertNext
    },
    addImagePending (state, responseAddImage) {
      state.responseAddImage = responseAddImage
    },
    addImageSuccess (state, { response, imageInfo }) {
      state.images.push(imageInfo)
      state.responseAddImage = response
    },
    addImageError (state, responseAddImage) {
      state.responseAddImage = responseAddImage
    },
    addImageToStoragePending (state, responseAddImageToStorage) {
      state.responseAddImageToStorage = responseAddImageToStorage
    },
    addImageToStorageSuccess (state, responseAddImageToStorage) {
      state.responseAddImageToStorage = responseAddImageToStorage
    },
    addImageToStorageError (state, responseAddImageToStorage) {
      state.responseAddImageToStorage = responseAddImageToStorage
    },
    addImageToDBPending (state, responseAddImageToDB) {
      state.responseAddImageToDB = responseAddImageToDB
    },
    addImageToDBSuccess (state, responseAddImageToDB) {
      state.responseAddImageToDB = responseAddImageToDB
    },
    addImageToDBError (state, responseAddImageToDB) {
      state.responseAddImageToDB = responseAddImageToDB
    },
    getImagePending (state, responseGetImage) {
      state.responseGetImage = responseGetImage
    },
    getImageSuccess (state, responseGetImage) {
      state.responseGetImage = responseGetImage
    },
    getImageError (state, responseGetImage) {
      state.responseGetImage = responseGetImage
    },
    getImagesPending (state, responseGetImages) {
      state.responseGetImages = responseGetImages
    },
    getImagesSuccess (state, responseGetImages) {
      state.responseGetImages = responseGetImages
    },
    getImagesError (state, responseGetImages) {
      state.responseGetImages = responseGetImages
    },
    deleteImagePending (state, responseDeleteImage) {
      state.responseDeleteImage = responseDeleteImage
    },
    deleteImageSuccess (state, response) {
      const images = state.images.slice(0)
      state.images = images.filter(imageInfo => !imageInfo.selected)
      state.responseDeleteImage = response
    },
    deleteImageError (state, responseDeleteImage) {
      state.responseDeleteImage = responseDeleteImage
    },
    deleteImageFromDBPending (state, responseDeleteImageDB) {
      state.responseDeleteImageDB = responseDeleteImageDB
    },
    deleteImageFromDBSuccess (state, responseDeleteImageDB) {
      state.responseDeleteImageDB = responseDeleteImageDB
    },
    deleteImageFromDBError (state, responseDeleteImageDB) {
      state.responseDeleteImageDB = responseDeleteImageDB
    },
    deleteImageFromStoragePending (state, responseDeleteImageFromStorage) {
      state.responseDeleteImageFromStorage = responseDeleteImageFromStorage
    },
    deleteImageFromStorageSuccess (state, responseDeleteImageFromStorage) {
      state.responseDeleteImageFromStorage = responseDeleteImageFromStorage
    },
    deleteImageFromStorageError (state, responseDeleteImageFromStorage) {
      state.responseDeleteImageFromStorage = responseDeleteImageFromStorage
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
    }
  },
  actions: {
    getImages ({ commit, dispatch }) {
      commit('getImagesPending', { pending: true })
      const id = this.state.userModule.user.uid
      fs.collection('images')
        .doc(id)
        .get()
        .then(function (images) {
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
        })
        .catch(function (error) {
          commit('getImagesError', {
            pending: false,
            status: 'error',
            message: error
          })
        })
    },
    async addImage ({ commit, state, dispatch }, file) {
      try {
        const id = this.state.userModule.user.uid
        const key = state.numberInsertNext + 1
        commit('updateNumberInsertNext', key)
        const { name } = file
        commit('addImagePending', { pending: true })
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
        commit('addImageError', { error, pending: false })
      }
    },
    async getImage ({ commit }, { id, key, name }) {
      try {
        let url
        commit('getImagePending', { pending: false })
        await st
          .ref(`images/${id}/${key + name}`)
          .getDownloadURL()
          .then(urlResponse => {
            commit('getImageSuccess', {
              status: 'success',
              pending: false,
              message: 'image get success'
            })
            url = urlResponse
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
    addImageToDB ({ commit }, { id, key, name, url }) {
      commit('addImageToDBPending', { pending: true })
      return fs
        .collection('images')
        .doc(id)
        .set({ [key]: { name, url } }, { merge: true })
        .then(() => {
          commit('addImageToDBSuccess', {
            status: 'success',
            message: 'added to database'
          })
        })
        .catch(function (error) {
          commit('addImageError', {
            status: 'error',
            pending: false,
            message: error
          })
        })
    },
    addImageToStorage ({ commit, dispatch }, { id, key, name, file }) {
      try {
        commit('addImageToStoragePending', { pending: true })
        return st
          .ref(`images/${id}/${key + name}`)
          .put(file)
          .then(doc => {
            commit('addImageToStorageSuccess', {
              pending: false,
              status: 'success',
              message: 'add to storage success'
            })
            dispatch('getImage', { id, key, name })
          })
      } catch (error) {
        commit('addImageToStorageError', {
          pending: true,
          status: 'error',
          message: error
        })
      }
    },
    deleteFromDB ({ commit, state }, id) {
      commit('deleteImageFromDBPending', { pending: true })
      const update = {}
      for (let imageInfo of state.images) {
        if (imageInfo.selected) {
          update[imageInfo.key] = firebase.firestore.FieldValue.delete()
        }
      }
      return fs
        .collection('images')
        .doc(id)
        .update(update)
        .then(doc => {
          commit('deleteImageFromDBSuccess', {
            pending: false,
            status: 'success',
            message: 'image was deleted from DB'
          })
        })
        .catch(error => {
          commit('deleteImageFromDBError', {
            pending: false,
            status: 'error',
            message: error
          })
        })
    },
    deleteFromStorage ({ commit, state }, id) {
      commit('deleteImageFromStoragePending', { pending: true })
      const selectedImages = state.images.filter(imageInfo => imageInfo.selected)
      const arrayPromise = selectedImages.map(async imageInfo => {
        const name = imageInfo.key + imageInfo.name
        const promise = await st
          .ref(`images/${id}/${name}`)
          .delete()
          .then(() => {
            commit('deleteImageFromStorageSuccess', {
              pending: false,
              status: 'success',
              message: `image ${name} was deleted from storage`
            })
          })
          .catch(error => {
            commit('deleteImageFromStorageError', {
              pending: false,
              status: 'error',
              message: name + error.message
            })
          })
        return promise
      })
      return Promise.all(arrayPromise)
    },
    async deleteImages ({ commit, dispatch }) {
      try {
        commit('deleteImagePending', { pending: true })
        const id = this.state.userModule.user.uid
        await dispatch('deleteFromDB', id)
        await dispatch('deleteFromStorage', id)
        commit('deleteImageSuccess', {
          pending: false,
          status: 'success',
          message: 'images was deleted'
        })
      } catch (error) {
        commit('deleteImageError', {
          pending: false,
          status: 'error',
          message: 'error'
        })
      }
    }
  }
}

export default userModule
