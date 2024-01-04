"use strict";

const clock = document.querySelector("#clock");
const date = document.querySelector("#date");
const cities = document.querySelector("#cities");
const athanTimesColumns = document.querySelector("#athan-times-columns");
const FajrAthanColumn = athanTimesColumns.children[0];
const SunriseAthanColumn = athanTimesColumns.children[1];
const DhuhrAthanColumn = athanTimesColumns.children[2];
const AsrAthanColumn = athanTimesColumns.children[3];
const MaghribAthanColumn = athanTimesColumns.children[4];
const IshaAthanColumn = athanTimesColumns.children[5];

const setClock = () =>
  (clock.textContent = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);

setInterval(setClock, 1000);

const fetchingData = (cityName) => {
  new Promise((resolve, reject) => {
    fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${cityName}`)
      .then((response) => {
        if (response.ok) return response.json();
        else reject(Error("Error connection"));
      })
      .then((json) => {
        const fetchedData = {
          // Athan times
          FajrAthanTime: json.data.timings.Fajr,
          SunriseAthanTime: json.data.timings.Sunrise,
          DhuhrAthanTime: json.data.timings.Dhuhr,
          AsrAthanTime: json.data.timings.Asr,
          MaghribAthanTime: json.data.timings.Maghrib,
          IshaAthanTime: json.data.timings.Isha,
          // date things
          dayNameEn: json.data.date.gregorian.weekday.en,
          dayNameAr: json.data.date.hijri.weekday.ar,
          gregorianDate: json.data.date.gregorian.date,
          hijriDate: json.data.date.hijri.date,
        };

        return fetchedData;
      })
      .then((fetchedData) => {
        // manipulating DOM: Athan times
        FajrAthanColumn.textContent = fetchedData.FajrAthanTime;
        SunriseAthanColumn.textContent = fetchedData.SunriseAthanTime;
        DhuhrAthanColumn.textContent = fetchedData.DhuhrAthanTime;
        AsrAthanColumn.textContent = fetchedData.AsrAthanTime;
        MaghribAthanColumn.textContent = fetchedData.MaghribAthanTime;
        IshaAthanColumn.textContent = fetchedData.IshaAthanTime;
        date.querySelector(".hijri").textContent =
          fetchedData.dayNameAr + ": " + fetchedData.hijriDate;
        date.querySelector(".gregorian").textContent =
          fetchedData.dayNameEn + ": " + fetchedData.gregorianDate;
      });

    resolve();
  })
    .then(() => {})
    .catch((err) => console.log(err));
};

window.addEventListener("load", () =>
  fetchingData(cities.selectedOptions[0].value)
);

const targetingArr = [];
cities.onclick = (e) => {
  targetingArr.push(e.target.value);
  if (targetingArr.length === 2) {
    if (targetingArr[0] !== targetingArr[1]) {
      fetchingData(cities.selectedOptions[0].value);
      targetingArr.length = 0;
    } else {
      targetingArr.shift();
    }
  }
};
