$(function () {
  app.init()
})

const app = {
  init() {
    this.addEventListeners()
  },
  addEventListeners() {
    $('.pager').on('click', '.disable', (e) => {
      e.preventDefault()
    })
  }
}
