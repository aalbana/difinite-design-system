document.addEventListener('DOMContentLoaded', function () {
  var tabsContainer = document.querySelector('.dfn-tabs-list')

  tabsContainer.addEventListener('click', function (event) {
    // Check if a tab item was clicked
    if (event.target.matches('.dfn-tab-item')) {

      // Get the target tab id from the href attribute
      var tabId = event.target.getAttribute('href').substring(1)

      // Call the changeTab function
      changeTab(tabId)
    }
    event.preventDefault()
  })
})

function changeTab(tabId) {
  // Hide all tab contents
  var tabContents = document.querySelectorAll('.dfn-tab-content')
  tabContents.forEach(function (content) {
    content.classList.remove('active')
  })

  // Deactivate all tabs
  var tabs = document.querySelectorAll('.dfn-tab-item')
  tabs.forEach(function (tab) {
    tab.classList.remove('active')
  })

  // Show the selected tab content and activate the selected tab
  document.getElementById(tabId).classList.add('active')
  document.querySelector('a[href="#' + tabId + '"]').classList.add('active')
}
