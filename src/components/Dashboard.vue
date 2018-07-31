<template>
  <div class="dashboard">
		<div class="container">
		<div class="file-field input-field">
      <div class="btn-floating waves-effect waves-light red">
        <i class="material-icons">add</i>
        <input type="file" @change="change" id="file">
      </div>
    </div>
		<div class="row">
			<div class="col s2" v-for="imageData in images">
				<img :src="imageData" alt="" class="responsive-img">
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
		this.getImages()
	},
	computed: mapState('imagesModule',[
		'images'
	]),
	methods: {
		...mapActions('imagesModule',[
			'getImages',
			'addImage'
		]),
		readUploadedFileAsText(inputFile) {
			const temporaryFileReader = new FileReader();

			return new Promise((resolve, reject) => {
				temporaryFileReader.onerror = () => {
					temporaryFileReader.abort();
					reject(new DOMException("Problem parsing input file."));
				};

				temporaryFileReader.onload = () => {
					resolve({name: inputFile.name, data: temporaryFileReader.result });
				};
				temporaryFileReader.readAsDataURL(inputFile);
			});
		},
		change({target}){
			this.readUploadedFileAsText(target.files[0]).then((response)=>{			console.log(response)
				this.addImage(response)
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.dashboard
	width: 100%
</style>
