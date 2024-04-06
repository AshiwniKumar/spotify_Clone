

let currentSong = new Audio();
let songs;
let currFolder;

//Changing Song duration seconds to minuites

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00 : 00"
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes  = String(minutes).padStart(2, '0');
    const formattedSeconds  = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes} : ${formattedSeconds}`
}

async function getSongs(folder){

    currFolder = folder;

    let a = await fetch(`/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []

    for(let index = 0; index < as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //Show all the Songs onn the playlist    
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                  <img src="images/music.svg" alt="">
                  <div class="info">
                    <div>${ song.replaceAll("%20", " ")}</div>
                  </div>

                  <div class="playnow">
                    <img src="images/play.svg" alt="">

                  </div>
        </li>`; 
    }

  //Attach an eventListner to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{

    e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

  return songs;
  
};

const playMusic =(track, pause = false)=>{
//let audio = new Audio("/songs/" + track)

currentSong.src = `/${currFolder}/` + track
if(!pause){
    currentSong.play();
    play.src = "images/pause.svg"
}


document.querySelector(".songinfo").innerHTML = decodeURI(track);
document.querySelector(".songtime").innerHTML = "00 : 00 / 00 : 00";

}

async function displayAlbums(){

  let a = await fetch(`/songs/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")

  let array = Array.from(anchors)

    for(let index = 2; index < array.length; index++){

      
      const e = array[index]
    
    if(e.href.includes("/songs") && !e.href.includes(".htaccess")){

      let folder = (e.href.split("/").slice(-1)[0])

      //get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
      <div class="play">
        
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" style="width: 80%; height: 80%; overflow: visible;">
              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" fill="#ffffff"/>
          </svg>
      </div>
      
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h2>${response.title}</h2>
      <p>${response.discription}</p>
  </div>`
    }
  }

       //Load the playlist whenever card is Clicked
       Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item =>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
      })  
}
          

async function main(){

//get all the Songs list

   await getSongs("songs/ncs");
    playMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums();

  //Attach an event listner to play, next and previous Song

  play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "images/pause.svg"
    }
    else{
        currentSong.pause();
        play.src = "images/play.svg"
    }
  })

  //EventListner for time update event

  currentSong.addEventListener("timeupdate",()=>{

    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
  })

  //Add an EventListner to the SeekBar:-

  document.querySelector(".seekbar").addEventListener("click", e=>{

    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent +"%";

    currentSong.currentTime = ((currentSong.duration)*percent)/100;

  })

  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"
  })

  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"
  })

  //Adding eventListners to Previous or next buttons

  previous.addEventListener("click", ()=>{

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) >=0){
        playMusic(songs[index-1])
    }
  });

  next.addEventListener("click", ()=>{
    currentSong.pause();

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < (songs.length)){
        playMusic(songs[index+1])
    }
  });
  
}

main()

