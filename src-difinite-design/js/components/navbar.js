document.addEventListener('DOMContentLoaded', function () {
  var navbarItems = document.querySelectorAll(
    '.dfn-navbar-item-container.dfn-navbar-dropdown'
  )

  navbarItems.forEach(function (item) {
    item.addEventListener('click', function (event) {
      var dropdownId = item.id
      var dropdownContainer = document.querySelector(
        `.dfn-dropdown-container#${dropdownId}`
      )

      if (dropdownContainer) {
        dropdownContainer.classList.toggle('active')
      }

      event.stopPropagation()
    })
  })

  document.addEventListener('click', function (event) {
    var isInsideNavbarContent = event.target.closest('.dfn-navbar-content')
    var isInsideHamburgerMenu = event.target.closest('.dfn-hamburger-menu')

    navbarItems.forEach(function (item) {
      var dropdownId = item.id
      var dropdownContainer = document.querySelector(
        `.dfn-dropdown-container#${dropdownId}`
      )

      if (
        dropdownContainer &&
        dropdownContainer.classList.contains('active') &&
        !isInsideNavbarContent &&
        !isInsideHamburgerMenu
      ) {
        dropdownContainer.classList.remove('active')
      }
    })

    // Close .dfn-navbar-content when clicking outside
    const navbarContent = document.querySelector('.dfn-navbar-content')
    if (
      navbarContent &&
      navbarContent.classList.contains('active') &&
      !isInsideNavbarContent &&
      !isInsideHamburgerMenu
    ) {
      navbarContent.classList.remove('active')
      hamburgerMenu.classList.toggle('active')
    }
  })

  const hamburgerMenu = document.createElement('div')
  const hamburgerIcon = document.createElement('i')

  hamburgerIcon.classList.add('bi', 'bi-list')
  hamburgerMenu.classList.add('dfn-hamburger-menu')

  hamburgerMenu.append(hamburgerIcon)

  const navbarContainer = document.querySelector('.dfn-navbar-container')

  function updateHamburgerMenu() {
    if (window.innerWidth <= 1024) {
      if (!navbarContainer.querySelector('.dfn-hamburger-menu')) {
        navbarContainer.append(hamburgerMenu)
      }
    } else {
      const existingHamburgerMenu = navbarContainer.querySelector(
        '.dfn-hamburger-menu'
      )
      if (existingHamburgerMenu) {
        existingHamburgerMenu.remove()
      }
    }
  }

  updateHamburgerMenu()

  window.addEventListener('resize', updateHamburgerMenu)

  hamburgerMenu.addEventListener('click', function () {
    const navbarContent = document.querySelector('.dfn-navbar-content')
    navbarContent.classList.toggle('active')
    hamburgerMenu.classList.toggle('active') // Toggle 'active' class on the hamburger menu itself
  })
})
