let url = "http://localhost:8000/api/v1/titles/"
let modal = document.querySelector("#movie-modal");
let main_div = document.querySelector('.contain-all')
let container_shadow = document.querySelector('#container-shadow')
let open_modal_selector = document.getElementsByClassName('open-modal');

window.addEventListener('load', (event) =>{
    getBestMovie()
    getMovieList()
    getMovieList(movie_category="crime")
    getMovieList(movie_category="horror")
    getMovieList(movie_category="animation")
})

Array.prototype.forEach.call(open_modal_selector, function(element) {
  element.addEventListener('click', function() {
    let modal_class = element.className.split(' ')[1];
    modal.style.display == "none" ? modal.style.display = "grid" : modal.style.display = "none";
    if(modal.style.display == "grid"){
        document.querySelector("#best-movie").style.display = "none";
        container_shadow.style.display = "block";
        document.querySelector('html').style.background = "#101215";
        setModalData(modal_class);
    }else{
        container_shadow.style.display = "none";
        document.querySelector('html').style.background = "#282c34";
    }
  });
});


// return connexion error when used...
function UrlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404)
            return true;
        else
            return false;
    }

function getMovieList(movie_category=null){
    let url_imdb = "";
    let id_movie_cat = ""
    if(movie_category != null){

        url_imdb = url + "?sort_by=-imdb_score&genre=" + movie_category;
        id_movie_cat = "#slide-best-" + movie_category + "-index-";

    }else{
        url_imdb = url + "?sort_by=-imdb_score";
        id_movie_cat = "#slide-best-movies-index-";
    }
    fetch(url_imdb)
        .then(function(response){
            if(response.ok){
                // get promise
                return response.json();
            }
        }).then(function(json){
            for(let i = 0; i < 5 ; i++){
                id = id_movie_cat + i;
                document.querySelector(id).src = json.results[i].image_url;
                document.querySelector(id).alt = json.results[i].title;
                document.querySelector(id).classList.add(json.results[i].id);
            }
            return json.next
        }).then(function(next){
            fetch(next).then(function(next_response){
                if(next_response.ok){
                    return next_response.json();
                }
            }).then(function(json){
                for(let i = 0; i < 3 ; i++){
                    id_nb = 4 + i;
                    id = id_movie_cat + id_nb;
                    document.querySelector(id).src = json.results[i].image_url;
                    document.querySelector(id).alt = json.results[i].title;
                    document.querySelector(id).classList.add(json.results[i].id)
                }
            })
        })
}

function getBestMovie(){
    let url_imdb = url + "?sort_by=-imdb_score";
    fetch(url_imdb)
      .then(function(response) {
        /* get promise */
        return response.json();
      }).then(function(json){
        return json.results[0].id
      }).then(function(id){
        let url_imdb_movie_id = url + id;
        fetch(url_imdb_movie_id)
            .then(function(response){
                return response.json();
            }).then(function(json){
                document.querySelector("#best-movie-name").innerHTML = json.title;
                document.querySelector("#best-movie-picture").src = json.image_url;
                document.querySelector("#best-movie-description>p").innerHTML = json.description
                document.querySelector("#best-movie-button").classList.add(json.id);
            })
      })
}

/* not used for now
function getMovieCategories(){
    let url_movie_cat = "http://localhost:8000/api/v1/genres/";
    const cat_array = new Array();
    fetch(url_movie_cat)
        .then(function(response){
            return response.json();
        }).then(function(json){
            for (var i=0; i < json.results.length; i++) {
                cat_array.push(json.results[i]['name']);
            }
        })
        return cat_array;
} */
/*
function createModal(id){
    selector = document.querySelector("#"+id);
    selector.addEventListener('click', event => {
        modal.style.display == "none" ? modal.style.display = "grid" : modal.style.display = "none";
        if(modal.style.display == "grid"){
            container_shadow.style.display = "block";
            document.querySelector('html').style.background = "#101215";
            setModalData(id);
        }else{
            container_shadow.style.display = "none";
            document.querySelector('html').style.background = "#282c34";
        }
    })
}*/

function setModalData(id){
    let url_imdb = url + id;
    fetch(url_imdb)
      .then(function(response) {
        /* get promise */
        return response.json();
    }).then(function(json){
        fetch(url + json.id)
            .then(function(response){
                console.log(response.json)
                return response.json();
            }).then(function(json){
                // selected movie data
                document.querySelector("#movie-modal-title").innerHTML = json.title;
                document.querySelector("#movie-resume").innerHTML = json.long_description;
                document.querySelector("#movie-img").src = json.image_url;
                document.querySelector("#movie-actors").innerHTML = json.actors;
                document.querySelector("#movie-genre").innerHTML = json.genres;
                document.querySelector("#movie-imdb-score").innerHTML = json.imdb_score;
                document.querySelector("#movie-writers").innerHTML = json.writers;
                document.querySelector("#movie-actors").innerHTML = json.actors;
                document.querySelector("#movie-year").innerHTML = json.year;
                document.querySelector("#movie-directors").innerHTML = json.directors;
                document.querySelector("#movie-imdb-votes").innerHTML = json.votes;
                document.querySelector("#movie-release").innerHTML = json.date_published;
                document.querySelector("#movie-language").innerHTML = json.languages;
                document.querySelector("#movie-duration").innerHTML = json.duration + " mins";
                document.querySelector("#movie-countries").innerHTML = json.countries;
                if(json.worldwide_gross_income){
                    document.querySelector("#movie-worldwideGrossIncome").innerHTML = json.worldwide_gross_income;
                }else{
                    document.querySelector("#movie-worldwideGrossIncome").innerHTML = "Non communiqués"
                }



            })
    })
}

function closeModal(id){
    const selector = document.querySelector("#"+id);
    selector.addEventListener("click", event => {
        document.querySelector("#best-movie").style.display = "flex";
        modal.style.display = "none";
        container_shadow.style.display = "none";
    });
}
