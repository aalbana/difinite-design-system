document.addEventListener('DOMContentLoaded', function () {
  const collapsibleItems = document.querySelectorAll('.dfn-nav-item')

  collapsibleItems.forEach((item) => {
    const link = item.querySelector('.dfn-nav-link')
    const targetId = link.getAttribute('data-target')
    const collapse = document.getElementById(targetId)

    if (collapse) {
      link.addEventListener('click', function (event) {
        event.preventDefault()
        toggleCollapse(collapse, link)
      })
    }
  })

  function toggleCollapse(element, link) {
    element.classList.toggle('show')
    link.classList.toggle('collapsed', !element.classList.contains('show'))
    link.classList.toggle('expanded', element.classList.contains('show'))
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.dfn-sidebar')
  const actionIcon = document.querySelector('.action-icon')

  if(sidebar){
    sidebar.addEventListener('mouseenter', function () {
      const sidebar = document.querySelector('.dfn-sidebar')
      sidebar.classList.add('opened')
    })
    sidebar.addEventListener('mouseleave', function () {
      sidebar.classList.remove('opened')
    })
  }
  if (sidebar && actionIcon) {
    actionIcon.addEventListener('click', function () {
      if (window.innerWidth < 1024) {
        sidebar.classList.toggle('opened')
      } else {
        sidebar.classList.toggle('collapsed')
        actionIcon.classList.toggle('active')
      }
    })
  }
})
