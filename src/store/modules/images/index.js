import Vue from 'vue'
import { storage, fs } from '../../../firebase'

const userModule = {
  namespaced: true,
  state: {
    images: {}
  },
  mutations: {
    addImagePending (state, newStateAddImageResponse) {
      state.images = newStateAddImageResponse
    },
    addImageSuccess (state, newStateAddImageResponse) {
      state.images = newStateAddImageResponse
    },
    addImageError (state, newStateAddImageResponse) {
      state.images = newStateAddImageResponse
    },
    getImagesPending (state, newStateGetImagesResponse) {
      state.images = newStateGetImagesResponse
    },
    getImagesSuccess (state, newStateGetImagesResponse) {
      state.images = { ...state.images, newStateGetImagesResponse }
      console.log(state.images)
    },
    getImagesError (state, newStateGetImagesResponse) {
      state.images = newStateGetImagesResponse
    }
  },
  actions: {
    getImages ({commit}) {
      const id = this.state.userModule.user.uid
      storage.ref(`images/${id}/1.png`).getDownloadURL().then((url) => {
        commit('getImagesSuccess', url)
      })
    },
    addImage ({commit, state}, image) {
      const id = this.state.userModule.user.uid
      fs.collection('images').doc(id).set({[Object.keys(state.images).length]: image.name})
        .then(function () {
          console.log('Document successfully written!')
          storage.ref(`images/${id}/${[Object.keys(state.images).length] + image.name}`).putString(image.data, 'data_url').then(() => {
            console.log('Uploaded a blob or file!')
          })
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    }
  }
}

export default userModule
