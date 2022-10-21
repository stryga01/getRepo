import '../scss/style.scss'

class Search{
  constructor() {
    this.repositories = []
    this.queryString = ''
    this.searchField = document.querySelector('.search__field')
    this.searchList = document.querySelector('.search__list')
    this.repoList = document.querySelector('.repo__list')
    this.getRepoDebounce = this.debounce(this.getRepo, 400)
  }
  debounce(fn, timeout) {
    let timer
    return function(...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, timeout)
    }
  }
  getQueryString(){
    return this.queryString = this.searchField.value
  }
  getRepo(query){
    if (this.queryString) {
      fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then((response) => response.json())
        .then((repo) => {
          this.repositories = [...repo.items]
          this.removeAutocomplete()
          this.renderAutocomplete(this.repositories)
          if (!this.queryString) this.removeAutocomplete()
        })
        .catch(err => alert('Превышено число запросов. Попробуйте позже' + err))
    }
  }
  renderAutocomplete(repos){
    const fragment = document.createDocumentFragment()
    for (let repo of repos) {
      const searchItem = document.createElement('li')
      searchItem.className = 'search__item'
      searchItem.innerText = repo.name
      searchItem.addEventListener('click', () => {
        this.renderRepo(repo)
      })
      fragment.appendChild(searchItem)
    }
    this.searchList.classList.add('search__list--show')
    this.searchList.appendChild(fragment)
  }

  removeAutocomplete() {
    this.searchList.querySelectorAll('li').forEach(el => el.remove())
    this.searchList.classList.remove('search__list--show')
  }
  renderRepo(repo){
    let repoItem = document.createElement('li')
    repoItem.insertAdjacentHTML('afterbegin',
      `<li class='repo__item'>
      <div class='repo__info'>
        Name: ${repo.name} <br>
        Owner: ${repo.owner.login} <br>
        Stars: ${repo.stargazers_count}
      </div>
      <button class='repo__remove-btn'></button>
    </li>`)

    this.repoList.appendChild(repoItem)
    repoItem.addEventListener('click', e => {
      const repoRemove = repoItem.querySelector('.repo__remove-btn')
      if(e.target === repoRemove){
        repoItem.remove()
      }
    })
    this.searchField.value = '';
    this.removeAutocomplete()
  }
  request() {
    this.getQueryString()
    this.getRepoDebounce(this.queryString)
  }
}


const search = new Search();

document.addEventListener('click', (e) => {
  if (e.target !== search.searchField) {
    search.searchList.style.display = 'none'
  }
})
search.searchField.addEventListener('click', () => {
  search.searchList.style.display = 'block'
})
search.searchField.addEventListener('input', search.request.bind(search))
search.searchField.addEventListener('keyup', () => {
  if (!search.queryString) search.removeAutocomplete()
})

