let url = "http://localhost:8000/api/v1/titles/"
let modal = document.querySelector("#movie-modal");
let main_div = document.querySelector('.contain-all')
let container_shadow = document.querySelector('#container-shadow')
let open_modal_selector = document.getElementsByClassName('open-modal');
let close_modal_selector = document.getElementsByClassName('close-modal');
let carousel_prev_button = document.getElementsByClassName('btn-prev');
let carousel_next_button = document.getElementsByClassName('btn-next');
let slider_container_selector = document.querySelector(".slider-container")
let i = 0;

getBestMovie()
getMovieList([null, "crime", "horror", "animation"])

Array.prototype.forEach.call(open_modal_selector, function(element) {
  element.addEventListener('click', function() {
    class_name_len = element.className.split(' ').length;
    let modal_class = class_name_len == 2 ? element.className.split(' ')[1] : element.className.split(' ')[2];
    setModalData(modal_class);
  });
});

Array.prototype.forEach.call(close_modal_selector, function(element){
  element.addEventListener('click', function() {
     modal.style.display = "none";
     container_shadow.style.display = "none";
  });

});


function UrlExists(url) {
    let http = new XMLHttpRequest();
    try {
        http.open('GET', url, false);
        http.send();
    } catch (error) {
        return false
    }
    if (http.status != 404){
        return true
    }
}

function getMovieList(movie_category=[]){
    for(let i = 0; i < movie_category.length; i++){
        let url_imdb = "";
        let id_movie_cat = ""
        if(movie_category[i] != null){
            url_imdb = url + "?sort_by=-imdb_score&genre=" + movie_category[i];
            id_movie_cat = "#slide-best-" + movie_category[i] + "-index-";
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
                for(let index = 0; index < 5 ; index++){
                    id = id_movie_cat + index;
                    if(UrlExists(json.results[index].image_url) == false){
                        document.querySelector(id).src = "404-img-not-found.svg"
                    }else{
                        document.querySelector(id).src = json.results[index].image_url;
                    }
                    document.querySelector(id).alt = json.results[index].title;
                    document.querySelector(id).classList.add(json.results[index].id);
                    if(index == 4){
                        document.querySelector(id).style.display = "none";
                    }
                }
                return json.next
            }).then(function(next){
                fetch(next).then(function(next_response){
                    if(next_response.ok){
                        return next_response.json();
                    }
                }).then(function(json){
                    for(let index = 1; index < 3 ; index++){
                        let id_nb = 4 + index;
                        let id = id_movie_cat + id_nb;
                        if(UrlExists(json.results[index].image_url) == false){
                            document.querySelector(id).src = "404-img-not-found.svg"
                        }else{
                            document.querySelector(id).src = json.results[index].image_url;
                        }
                        document.querySelector(id).alt = json.results[index].title;
                        document.querySelector(id).classList.add(json.results[index].id);
                        document.querySelector(id).style.display = "none";
                    }
                })
            })
    }
}

function getBestMovie(){
    let url_imdb = url + "?sort_by=-imdb_score";
    fetch(url_imdb)
      .then(function(response) {
        /* get promise */
        return response.json();
      }).then(function(json){
        let url_imdb_movie_id = url + json.results[0].id;
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

function setModalData(id){
    let url_imdb = url + id;
    fetch(url_imdb)
      .then(function(response) {
        /* get promise */
        return response.json();
    }).then(function(json){
       // selected movie data
        document.querySelector("#movie-modal-title").innerHTML = json.title;
        document.querySelector("#movie-resume").innerHTML = json.long_description;
        if(UrlExists(json.image_url) == false){
            document.querySelector("#movie-img").src = "404-img-not-found.svg"
        }else{
            document.querySelector("#movie-img").src = json.image_url;
        }
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
        modal.style.display = "grid";
        container_shadow.style.height = document.querySelector("body").scrollHeight +"px";
        container_shadow.style.display = "block";
        document.querySelector('html').style.background = "#101215";
    })
}

Array.prototype.forEach.call(carousel_prev_button, function(element) {
  element.addEventListener('click', function() {
    let movie_category_selector = document.querySelectorAll(".slide-best-"+element.id.split('-')[0]);
    let array = [];
    for(let index = 0; index < movie_category_selector.length ; index++){
        if(movie_category_selector[index].style.display == ""){
            array.push((movie_category_selector[index].id).split('-')[4])
        }
    }
    if(array[0] > 0){
        movie_category_selector[array[array.length-1]].style.display = "none";
        // clear last index
        array.pop()
        // get prev index
        prev_index = parseInt(array[0]) - 1
        // push new value in array
        array.unshift((movie_category_selector[prev_index].id).split('-')[4])
        // display new value.
        movie_category_selector[prev_index].style.display = "";
    }

  });
});


Array.prototype.forEach.call(carousel_next_button, function(element) {
  element.addEventListener('click', function() {
    let movie_category_selector = document.querySelectorAll(".slide-best-"+element.id.split('-')[0]);
    let array = [];
    for(let index = 0; index < movie_category_selector.length ; index++){
        if(movie_category_selector[index].style.display == ""){
            array.push((movie_category_selector[index].id).split('-')[4])
        }
    }
    if(array[array.length-1] < 6){
        movie_category_selector[array[0]].style.display = "none";
        // clear index 0
        array.shift()
        // get next index
        next_index = parseInt(array[array.length-1]) + 1
        // push new value in array
        array.push((movie_category_selector[next_index].id).split('-')[4])
        // display new value.
        movie_category_selector[next_index].style.display = "";
    }
  });
});