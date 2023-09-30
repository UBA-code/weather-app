let apiKey = "071bb7711dcf700209dda66f609e119e";

// https://api.openweathermap.org/data/2.5/weather?q={city id}&units=metric&appid=${apiKey} ==> current

// https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&cnt=5&units=metric&appid=${apiKey} == daily

// http://api.openweathermap.org/geo/1.0/direct?q=ben\%20guerir&appid=071bb7711dcf700209dda66f609e119e geo


let dateArea = document.querySelector(".app-container .date");
let timeArea = document.querySelector(".app-container .time");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


// ? set the time when the page loading

let date = new Date();

dateArea.textContent = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
timeArea.textContent = `${date.toLocaleTimeString().match(/\d{1,2}:\d{1,2}/)[0]} ${date.toLocaleTimeString().match(/[a-zA-Z]{2}/)[0]}`

// ? update the time and date each second
setInterval(() => {
	date = new Date();
	dateArea.textContent = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
	timeArea.textContent = `${date.toLocaleTimeString().match(/\d{1,2}:\d{1,2}/)[0]} ${date.toLocaleTimeString().match(/[a-zA-Z]{2}/)[0]}`
}, 1000);

let searchBox = document.querySelector(".app-container .weather-area .search-box");
let searchInput = searchBox.querySelector("input");
let searchBtn = searchBox.querySelector("button");

async function displayWarning(text) {
	let box = document.createElement("div");
	box.className = "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]";
	box.innerHTML = `
		<h1 class="text-red-400 font-bold text-xl border-2 border-solid p-5 border-red-400 rounded-lg bg-[#000000e0]">${text}</h1>
	`;
	document.body.appendChild(box);
	await (new Promise((res) => setTimeout(res, 2000)));
	box.remove();
}
searchInput.value = "london";
search();
searchInput.value = "";

searchBtn.addEventListener("click", search);
document.body.addEventListener("keydown", n => n.key === "Enter" ? search() : "")

async function search() {
	if (searchInput.value.length) {
		let weatherIcon = document.querySelector(".app-container .weather-area .weather-big-icon");
		let temp = document.querySelector(".app-container .weather-area .degree");
		let otherDaysArea = document.querySelector(".app-container .other-days-area");
		let cityName = document.querySelector(".app-container .city");

		await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&appid=${apiKey}`)
			.then((resolve) => {
				if (resolve.status != 200)
					throw ("Unvalid City");
				return resolve.json()
			})
			.then(async (resolve) => {
				if (!resolve.length)
					throw ("Unvalid City");
				await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${resolve[0].lat}&lon=${resolve[0].lon}&units=metric&appid=${apiKey}`)
					.then((res) => { return res.json(); })
					.then((res) => {
						cityName.textContent = resolve[0].name;
						weatherIcon.classList.remove('opacity-0');
						changeIcon(weatherIcon, res.weather[0].main);
						// if ()
						temp.classList.remove('opacity-0');
						temp.textContent = Math.ceil(res.main.feels_like)
					})
					.then(async (_) => {
						otherDaysArea.classList.remove('opacity-0');
						await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${resolve[0].lat}&lon=${resolve[0].lon}&units=metric&appid=${apiKey}`)
							.then((resolver) => {
								if (resolver.status != 200)
									throw ("Unvalid City");
								return resolver.json()
							})
							.then(res => {
								return (res.list);
							})
							.then(res => {
								let now = new Date();
								let year = now.getFullYear();
								let month = now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
								let day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
								res = res.filter(elem => {
									if (elem.dt_txt.match(/\d{4}-\d{1,2}-\d{1,2}/)[0] === `${year}-${month}-${day}`
										|| (elem.dt_txt.match(/\d{4}-\d{1,2}-\d{1,2}/)[0] !== `${year}-${month}-${day}`
											&& !elem.dt_txt.match(/15:00:00/)))
										return 0;
									return 1;
								})
								otherDaysArea.querySelectorAll(".other-days-container .day-block").forEach(async (n, index) => {
									let day_date = new Date(res[index].dt_txt);

									otherDaysArea.firstElementChild.textContent = days[now.getDay()]
									n.querySelector(".little-day").textContent = days[day_date.getDay()];
									changeIcon(n.querySelector(".weather-little-icon"), res[index].weather[0].main);
									if (["Rain", ""])
									n.querySelector(".little-degree").textContent = Math.ceil(res[index].main.temp);
								})
							})
							.catch(err => {
								console.log(err);
								displayWarning(err);
							})
					})
					.catch(err => {
						console.log(err);
						displayWarning(err);
					})
			})
			.catch(err => {
				console.log(err);
				displayWarning(err);
			})
	}
}

function changeIcon(element, weather) {
	switch (weather) {
		case "Clear":
			element.firstElementChild.className = "fa-solid fa-sun";
			break;
		case "Clouds":
			element.firstElementChild.className = "fa-duotone fa-clouds";
			break;
		case "Atmosphere":
			element.firstElementChild.className = "fa-solid fa-cloud-showers-heavy";
			break;
		case "Rain":
			element.firstElementChild.className = "fa-solid fa-cloud-showers-heavy";
			break;
		case "Snow":
			element.firstElementChild.className = "fa-regular fa-cloud-snow";
			break;
		case "Thunderstorm":
			element.firstElementChild.className = "fa-sharp fa-light fa-cloud-bolt";
			break;
		case "Fog":
			element.firstElementChild.className = "fa-duotone fa-smoke";
			break;
		case "Tornado":
			element.firstElementChild.className = "fa-regular fa-tornado";
			break;
		case "Sleet":
			element.firstElementChild.className = "fa-regular fa-cloud-sleet";
			break;
		case "Drizzle":
			element.firstElementChild.className = "fa-thin fa-cloud-drizzle";
			break;
	}
}