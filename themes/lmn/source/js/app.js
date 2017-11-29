$(function() {
  app.init()
})

const app = {
  init() {
    this.initNav()
    this.addEventListeners()
    this.initPostScollHeader()
  },
  addEventListeners() {
    $('.pager').on('click', '.disable', (e) => e.preventDefault())
  },
  initNav() {
    [].forEach.call(document.querySelectorAll('.navbar .category-list-link'), (el) => {
      if (el.href === location.href) el.classList.add('active')
    })
  },
  initPostScollHeader() {
    const $post = $('#post')
    if ($post.length === 0) return

    const $document = $(document)
    const $scrollHeader = $post.find('.scroll-header')
    const $progress = $post.find('.progress')
    const contentTop = $post.find('.content').offset().top
    let prevScroll = getScrollTop()
    let prevAction = ''

    $document
      .on('scroll', () => {
        const top = getScrollTop()

        // set progress width
        $progress.width(top / ($(document).height() - $(window).height()) * $document.width())

        // animation header
        if (top - prevScroll < 0 && top > contentTop) {
          const action = 'top'
          if (action !== prevAction) {
            // 向上
            prevAction = action
            $scrollHeader.show()
            $scrollHeader.width()
            $scrollHeader.addClass('scrolled')
          }
        } else {
          const action = 'bottom'
          if (action !== prevAction) {
            // 向下
            prevAction = action
            // 快速到顶直接消失
            if (top === 0) $scrollHeader.hide()
            $scrollHeader.removeClass('scrolled')
          }
        }
        prevScroll = top
      })
      .on('transitionend', (e) => {
        if (e.target === $scrollHeader[0]) {
          if (!$scrollHeader.hasClass('scrolled')) {
            $scrollHeader.hide()
          }
        }
      })
  }
}

function getScrollTop() {
  return document.scrollingElement.scrollTop
}
