<template>
    <div>
        <div>
          <input type="file" accept="image/*" ref="file" @change="onFileSelected">
          <button @click="onUpload">Upload</button><br><br>
        </div>
        <div>
          <img :src=previewImage alt="" width="50%" />
        </div>
    </div>
</template>
  
<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        selectedFile: null,
        src: null
      }
    },
    methods: {
      onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        this.src = URL.createObjectURL(this.selectedFile);
      },
      onUpload() {
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);
        axios.post('', fd, {
          onUploadProcess: uploadEvent => {
            console.log('Upload Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%');
          }
        })
          .then(res => {
            console.log(res)
          })
      }
    },
    computed: {
        previewImage() {
          return this.src;
        }
    }
  }
  </script>