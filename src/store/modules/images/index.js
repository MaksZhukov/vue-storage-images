import Vue from 'vue'
import { storage, fs } from '../../../firebase'

const userModule = {
  namespaced: true,
  state: {
    images: [],
    pending: false
  },
  mutations: {
    addImagePending (state, stateAddImageResponse) {
      console.log({ ...state, ...stateAddImageResponse })
      state = { ...state, ...stateAddImageResponse }
    },
    addImageSuccess (state, stateAddImageResponse) {
      state = { ...state, ...stateAddImageResponse }
    },
    addImageError (state, stateAddImageResponse) {
      state = { ...state, ...stateAddImageResponse }
    },
    addImageToStoragePending (state, addImageToStorageResponse) {
      state = { ...state, ...addImageToStorageResponse }
    },
    addImageToStorageSuccess (state, addImageToStorageResponse) {
      state = { ...state, ...addImageToStorageResponse }
    },
    addImageToStorageError (state, addImageToStorageResponse) {
      state = { ...state, ...addImageToStorageResponse }
    },
    addImageToDBPending (state, AddImageToDBResponse) {
      state = { ...state, ...AddImageToDBResponse }
    },
    addImageToDBSuccess (state, AddImageToDBResponse) {
      state = { ...state, ...AddImageToDBResponse }
    },
    addImageToDBError (state, AddImageToDBResponse) {
			state = { ...state, ...AddImageToDBResponse }
		},
    getImagePending (state, getImageResponse) {
      state = { ...state, ...getImageResponse }
    },
    getImageSuccess (state, getImageResponse) {
      state = { ...state, ...getImageResponse }
    },
    getImageError (state, getImageResponse) {
			state = { ...state, ...getImageResponse }
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
						const name = key 
            dispatch('getImage',{id: [key], name: {key+data[key]}}).then((url) => {
							console.log(`images/${id}/${key + data[key]}`)
              commit('getImagesSuccess', url)
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
		getImage ({commit, state, dispatch},{id, name}){
			return storage.ref(`images/${id}/${name}`).getDownloadURL()
		},
    addImage ({commit, state, dispatch}, image) {
			try {
				const id = this.state.userModule.user.uid
				const num = state.images.length
				const nameToStorage = num + image.name
				commit('addImagePending', { pending: true })
				dispatch('addImageToDB',{id, num, name: image.name}).then(() => {
					console.log('Document successfully written!')
					dispatch('addImageToStorage', {id, name: nameToStorage, data: image.data}).then((doc)=>{
						console.log(doc)
						dispatch('getImage', {id, name: nameToStorage}).then((url) => {
							console.log(url)
							commit('getImagesSuccess', url)
						})
					})
					.catch((error)=>{
						commit('addImageError', { error })
					})
				})
				.catch(function (error) {
					commit('addImageError', { error })
				})
			}
			catch(err){
				commit('addImageError', { pending: false })
			}

    },
    addImageToDB ({commit}, {id, num, name}) {
      return fs.collection('images').doc(id).set({[num]: name}, { merge: true })
    },
    addImageToStorage ({commit},{id,name, data}) {
			return storage.ref(`images/${id}/${name}`).putString(data, 'data_url')
    }
  }
}

export default userModule
