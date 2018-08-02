import Vue from 'vue'
import { storage, fs } from '../../../firebase'

const userModule = {
  namespaced: true,
  state: {
    images: [],
    responseAddImage: {},
    responseAddImageToDB: {},
    responseAddImageToStorage: {},
    responseGetImageUrl: {}
  },
  mutations: {
    addImagePending (state, responseAddImage) {
      state.responseAddImage = responseAddImage
    },
    addImageSuccess (state, responseAddImage) {
      state.responseAddImage = responseAddImage
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
    getImagePending (state, responseGetImageUrl) {
      state.responseGetImageUrl = responseGetImageUrl
    },
    getImageSuccess (state, {response, imageInfo}) {
			state.images.push(imageInfo)
			state.responseGetImageUrl = response
    },
    getImageError (state, responseGetImageUrl) {
      state.responseGetImageUrl = responseGetImageUrl
    },
    getImagesPending (state, newStateGetImagesResponse) {
      state.images = newStateGetImagesResponse
    },
    getImagesSuccess (state, newStateGetImagesResponse) {
      state.images.push(newStateGetImagesResponse)
    },
    getImagesError (state, newStateGetImagesResponse) {
      state.images = newStateGetImagesResponse
    }
  },
  actions: {
    getImages ({commit, dispatch}) {
      const id = this.state.userModule.user.uid
      fs.collection('images').doc(id).get().then().then(function (doc) {
        if (doc.exists) {
          const data = doc.data()
          console.log('Document data:', doc.data())
          for (let key in data) {
            dispatch('getImage', {id, key, name:data[key]}).then((url) => {
              console.log(`images/${id}/${key + data[key]}`)
              //commit('getImagesSuccess', url)
            })
          }
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!')
        }
      }).catch(function (error) {
        console.log('Error getting document:', error)
      })
    },
    async addImage ({commit, state, dispatch}, file) {
      try {
        const id = this.state.userModule.user.uid
				const key = state.images.length
				const { name } = file 
				commit('addImagePending', { pending: true })
				await dispatch('addImageToDB', {id, key, name})
				await dispatch('addImageToStorage', {id, key, name, file})
				commit('addImageSuccess', {pending: false, status: 'success', message: 'add image succcess' })
      } catch (error) {
        commit('addImageError', { error, pending: false })
      }
		},
		getImage ({commit}, {id, key, name}) {
			try{
				commit('getImagePending', { pending: false })
			storage.ref(`images/${id}/${key + name}`).getDownloadURL()        
				.then((url) => {
					commit('getImageSuccess', { response: {status: 'success', pending: false, message: 'image get success'}, imageInfo: {key, name, url} })
				})
			} catch(error){
				commit('getImageError', { pending: false, status: 'error', message: error })
			}
    },
    addImageToDB ({commit}, {id, key, name}) {
			commit('addImageToDBPending', { pending: true })
			return fs.collection('images').doc(id).set({[key]: name}, { merge: true })
			.then(() => {
				commit('addImageToDBSuccess', {status: 'success', message: 'added to database'})
			})
			.catch(function (error) {
				commit('addImageError', { status: 'error', pending: false, message: error })
			})
    },
    async addImageToStorage ({commit, dispatch}, {id, key, name, file}) {
			try {
			commit('addImageToStoragePending', { pending: true })
			storage.ref(`images/${id}/${key + name}`).put(file).then(() => {
				commit('addImageToStorageSuccess', { pending: false, status: 'success', message: 'add to storage success' })
				dispatch('getImage', { id, key, name })
			})
			} catch(error){
				commit('addImageToStorageError', { pending: true, status: 'error', message: error })
			}
    }
  }
}

export default userModule
