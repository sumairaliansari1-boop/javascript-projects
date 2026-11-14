let Api_key = "PRIVATE_KEY";

let input = document.querySelector("#inp");
let searchBtn = document.querySelector("#searchBtn");
let msg = document.querySelector("#msg");
let dynmicDiv = document.querySelector("#dynamic");

searchBtn.addEventListener("click", () => {
  let checkCity = input.value.trim();
  if (checkCity === "") {
    msg.textContent = "Please write the city first";
  } else {
    console.log(checkCity);
    msg.textContent = "";

    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${checkCity}&appid=${Api_key}&units=metric`;

    async function newFun() {
      try {
        msg.textContent = "Loading weather...";
        let res = await fetch(apiURL);
        if (!res.ok) {
          dynmicDiv.innerHTML = "";
          throw new Error("Page is Not Found " + res.status);
        }

        let data = await res.json();
        let iconCode = data.weather[0].icon;
        let iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        dynmicDiv.innerHTML = `
        <div id="hey">
            <h2>${data.name}</h2>
            <p>${data.weather[0].description}</p>
            <img src="${iconURL}" alt="Weather Icon">
            
        
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p>Feels like ${Math.round(data.main.feels_like)}°C</p>
            
                <h2>Humidity</h2>
                <p>${data.main.humidity}%</p>
    
                <h2>Condition</h2>
                <p>${data.weather[0].main}</p>
        </div>
`;

        msg.textContent = "";
      } catch (error) {
        dynmicDiv.innerHTML = "";
        msg.textContent = error.message;
      }
    }
    newFun();
  }
});

input.addEventListener("input", () => {
  dynmicDiv.innerHTML = "";
});
