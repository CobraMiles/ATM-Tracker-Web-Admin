document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    this.classList.add('active');

    const view = this.dataset.view;
    fetch(`view/pages/${view}.php`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('main-view').innerHTML = html;
        viewName = view === 'atms' ? 'ATMs' : view.charAt(0).toUpperCase() + view.slice(1);
        document.getElementById('view-title').textContent = viewName;

        if(view === "atms") {
          loadATMList();
        }
      })
  })
})