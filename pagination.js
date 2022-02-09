export default {
props:['pages'],
template:`
<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{disabled:!pages.has_pre}">
      <a class="page-link" href="#" @click="$emit('getProducts', pages.current_page - 1)">Previous</a>
    </li>
    <li class="page-item" v-for="page in pages.total_pages" :key="'page'+ page">
      <a class="page-link" href="#" @click="$emit('getProducts', page)">{{page}}</a>
    </li>
    <li class="page-item" :class="{disabled:!pages.has_next}">
      <a class="page-link" href="#" @click="$emit('getProducts', pages.current_page + 1)">Next</a>
    </li>
  </ul>
</nav>
`
}