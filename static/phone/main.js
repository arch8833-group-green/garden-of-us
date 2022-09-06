//if people click on the petal before selecting a color it will turn light grey, hopefully, indicating they should pick a color.
let draw_color = "#ebebeb";

//create an array to house the three final selected colors. i'll send this array to the payload to send to server to display
//to do: you could add default values to colorArray instead of starting empty in case the 
//user forgets to fill in one of the triangles
let colorArray = [
  "#a6a6a6",
  "#e2e2e2",
  "#f0907c"
];

//variable get all the paths in the svg file
const paths = document.querySelectorAll("path");

let prevSelectedColorEl = null

//function to use one of the selected flowers to paint
function change_color(element) {
  draw_color = element.style.getPropertyValue("--color");
  if (prevSelectedColorEl) {
    prevSelectedColorEl.classList.remove('selected')
  }
  element.classList.add('selected')
  prevSelectedColorEl = element
}

//after ppl pick a color, they can click specific path and paint it with selected color.
//it will also add their  selected color to colorArray
paths.forEach(function (path, i) {
  path.onclick = function (event) {
    //fill in the array with selected color
    colorArray[i] = draw_color;

    //money maker; changes color
    event.target.style.fill = draw_color;
  };
});

console.log(colorArray);

//submit selected colors to the media bridge
const submit = document.querySelector("#submit");

submit.onclick = () => {
  // Assemble payload, e.g. { color: "#ffffff" }

  const payload = {
    //i'm trying to get the final color section of each triangle segment.
    colorArray: colorArray,

    //so this is only pulling the single color from the draw_color function
    //color: draw_color,
    shapeId: 0,
  };

  // Send JSON payload to server via a POST request

  fetch("/spawn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
