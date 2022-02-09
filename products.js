import {
  createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

let productModal = null;
let delProductModal = null;
let fileInput = null;

const app = createApp({
  components: {
    pagination,
  },
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io",
      path: "otispath",
      products: [],
      editProduct: {
        imagesUrl: [],
        promotion:[]
      },
      isNew: false,
      pagination: {},
    }
  },
  methods: {
    checkAdmin() {
      axios.post(`${this.url}/v2/api/user/check`)
        .then(res => {
          this.getProducts();
        })
        .catch(err => {
          alert("無法登入");
          window.location = 'index.html';
        })
    },
    getProducts(page = 1) {
      axios.get(`${this.url}/v2/api/${this.path}/admin/products/?page=${page}`)
        .then(res => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch(err => {
          console.log(err);
          alert("無法登入");
          window.location = 'index.html';
        })
    },
    openModal(isNew, item) {
      // 參數 isNew 是 根據 @click="fn()" 所帶的字串
      if (isNew === "new") {
        this.editProduct = {
          imagesUrl: [],
          promotion:[]
        }; // 清空 editProduct 資料
        this.isNew = true; // 新資料
        productModal.show();
      } else if (isNew === "edit") {
        this.editProduct = {
          imagesUrl: [],
          promotion:[]
        };
        this.editProduct = {
          ...item
        };
        // 參數 item 是 <tr v-for...> 的 item (product)
        this.isNew = false; // 舊資料
        productModal.show();
      } else if (isNew === 'delete') {
        this.editProduct = {
          ...item
        };
        delProductModal.show();
      }
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
      keyboard: false, // 避免鍵盤按鍵關閉 Modal
    });

    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
      keyboard: false,
    });
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)otisToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
  }
});

app.component('templateForProductModal', {
  template: '#templateForProductModal',
  props: ['editProduct', 'url', 'path', 'isNew'],
  methods: {
    upload() {
      let file = fileInput.files[0]; // 使用 console.dir 找到 fileInput.files 類陣列的位置
      const formData = new FormData(); // 建立 api 上傳資料 所需格式
      formData.append('file-to-upload', file);
      axios.post(`${this.url}/v2/api/${this.path}/admin/upload/`, formData)
        .then(res => {
          this.editProduct.imageUrl = res.data.imageUrl;
        })
        .catch(err => {
          console.log(err.data.message);
        })
    },
    updateProduct() {
      if (!this.isNew) {
        axios.put(`${this.url}/v2/api/${this.path}/admin/product/${this.editProduct.id}`, {
            data: this.editProduct
          })
          .then(res => {
            alert(res.data.message);
            productModal.hide();
            this.$emit('update');
          })
          .catch(err => {
            alert(err.data.message);
          })
      } else {
        axios.post(`${this.url}/v2/api/${this.path}/admin/product`, {
            data: this.editProduct
          })
          .then(res => {
            alert(res.data.message);
            productModal.hide();
            this.$emit('backToFirstPage');
            this.$emit('update');
          })
          .catch(err => {
            alert(err.data.message);
          });
      };
    },
    createImagesUrl() {
      this.editProduct.imagesUrl = [];
      this.editProduct.imagesUrl.push('');
    },
  },
  mounted() {
    fileInput = document.querySelector("#file");
  }
});

app.component('templateFordelProductModal', {
  template: '#templateFordelProductModal',
  props: ['editProduct', 'url', 'path'],
  methods: {
    deleteProduct() {
      axios.delete(`${this.url}/v2/api/${this.path}/admin/product/${this.editProduct.id}`)
        .then(res => {
          alert(res.data.message);
          delProductModal.hide(); //記得把 modal 收起來
          this.$emit('update');
        })
        .catch(err => {
          alert(err.data.message);
        });
    },
  }
})



app.mount("#app");