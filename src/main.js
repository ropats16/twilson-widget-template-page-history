import Widget from './Widget.svelte'

const el = document.getElementById('page-history')
// const dataset = el.dataset

const widget = new Widget({
  target: el,
  // props: dataset
})