// API KEY
const api_key = '5dcd5462f1e046a1661990e37dc00428' 
const base_url = 'https://api.themoviedb.org/3/'
const api_url = `${base_url}discover/movie?sort_by=popularity.desc&api_key=${api_key}`
const img_url = 'https://image.tmdb.org/t/p/w500'
const search_url = `${base_url}search/movie?api_key=${api_key}`

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const tagEl = document.getElementById('tags')

const genres = [
            {
                "id": 28,
                "name": "Action"
            },
            {
                "id": 12,
                "name": "Adventure"
            },
            {
                "id": 16,
                "name": "Animation"
            },
            {
                "id": 35,
                "name": "Comedy"
            },
            {
                "id": 80,
                "name": "Crime"
            },
            {
                "id": 99,
                "name": "Documentary"
            },
            {
                "id": 18,
                "name": "Drama"
            },
            {
                "id": 10751,
                "name": "Family"
            },
            {
                "id": 14,
                "name": "Fantasy"
            },
            {
                "id": 36,
                "name": "History"
            },
            {
                "id": 27,
                "name": "Horror"
            },
            {
                "id": 10402,
                "name": "Music"
            },
            {
                "id": 9648,
                "name": "Mystery"
            },
            {
                "id": 10749,
                "name": "Romance"
            },
            {
                "id": 878,
                "name": "Science Fiction"
            },
            {
                "id": 10770,
                "name": "TV Movie"
            },
            {
                "id": 53,
                "name": "Thriller"
            },
            {
                "id": 10752,
                "name": "War"
            },
            {
                "id": 37,
                "name": "Western"
            }
]



const getMovies = (url) => {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let movies = data.results
        if(movies.length != 0) {
            showMovies(movies)
        } else {
            main.innerHTML = `<h1 class='no-results'>No Movie Found</h1>`
        }
    })
    .catch(err => console.log(err))
}


let selectedGenre = []

const highlightSelection = () => {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if(selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add('highlight')
        })
    }
}


const setGenre = () => {
    tagEl.innerHTML = ''
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag')
        t.id = genre.id
        t.innerText = genre.name
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            } else {
                if(selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((item, index) => {
                        if(item == genre.id) {
                            //remove index yang diklik dari array
                            selectedGenre.splice(index, 1)
                        }
                    })
                } else {
                    selectedGenre.push(genre.id)
                }
            }

            console.log(selectedGenre)
            getMovies(api_url + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagEl.append(t)  
    })
}

setGenre()

getMovies(api_url)

const showMovies = (data) => {
    main.innerHTML = ''

    data.forEach(movie => {
        const { title, overview, poster_path, vote_average, id, release_date } = movie
        const movieEl = document.createElement('div')
        const seeDetails = document.createElement('div')

        movieEl.classList.add('movie')
        movieEl.innerHTML = `
                <img src="${poster_path ? img_url+poster_path : "http://via.placeholder.com/1000x1580"}" alt="${title}">
                
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>
                <button onclick="togglePopup(${id})">See Details</button>
            
        `

        seeDetails.classList.add('details')
        seeDetails.innerHTML = `
            <div class="popup" id="${id}">
                <div class="overlay"></div>
                <div class="content">
                <div class="close-btn" onclick="togglePopup(${id})">&times;</div>
                <h3>Details</h3>
                <p>${overview}</p>
                <p>📆 Release Date : ${release_date}</p>
                </div>
            </div> 
        `

        main.appendChild(movieEl)
        main.appendChild(seeDetails)
    });
}

const getColor = (vote) => {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if(searchTerm) {
        const url = `${api_url}&query=${searchTerm}`
        getMovies(search_url+'&query='+searchTerm)
    }
})



const togglePopup = (id) => {
    document.getElementById(`${id}`).classList.toggle("active");
}

