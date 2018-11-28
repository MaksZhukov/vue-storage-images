<template>
  <ul class="pagination center-align">
    <li
      v-if="maxPaginationNum >= 2"
      :class="[paginationNum === minPaginationNum ? 'disabled' : 'waves-effect']"
    >
      <router-link
        :to="{ name: 'dashboard', params: { page: paginationNum === minPaginationNum ? minPaginationNum : paginationNum - 1 }}"
      >
        <i class="material-icons">chevron_left</i>
      </router-link>
    </li>
    <li
      v-if="paginationNum < number+countVisiblePaginationNum && paginationNum > number-countVisiblePaginationNum"
      :class="[number === paginationNum ? 'active' : '','waves-effect']"
      v-for="number in maxPaginationNum"
      :key="number"
    >
      <router-link :to="{ name: 'dashboard', params: { page: number }}">{{number}}</router-link>
    </li>
    <li
      v-if="maxPaginationNum >= 2"
      :class="[maxPaginationNum === paginationNum ? 'disabled' : 'waves-effect']"
    >
      <router-link
        :to="{ name: 'dashboard', params: { page: paginationNum === maxPaginationNum ? maxPaginationNum : paginationNum + 1 }}"
      >
        <i class="material-icons">chevron_right</i>
      </router-link>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'Dashboard',
  props: {
    paginationNum: Number,
    maxPaginationNum: Number,
    minPaginationNum: Number,
    countVisiblePaginationNum: Number
  }
}
</script>
