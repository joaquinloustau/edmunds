var bonuses = [];
var bonuses_buffer_size = 30;
var current_bonus = 0;
var delay = 1000
var i = 0;

$(document).ready(function() {
  load_bonuses(bonuses_buffer_size);
  setInterval(function() { 
    load_bonuses(bonuses_buffer_size)
  }, 5 * delay);
});

function makeUL(bonuses) {
  console.log('makeUL');
  var list = document.getElementById('list-bonuses');
  
  for (var i = 0; i < bonuses.length; i++) {
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(bonuses[i].reason));
    list.appendChild(item);
  }
}

function refreshList(bonuses) {
  console.log('refresh');
  var oldList = document.getElementById('list-bonuses');
  var newList = $('<ul id="newlist"></ul>');
  newList.empty();
  

  for (var i = 0; i < bonuses.length; i++) {
    console.log('appendeando');
    newList.append($("<li>").text(bonuses[i].reason));
  }

  console.log('newList');
  console.log(newList);

  $('#list-bonuses').empty().append(newList.contents()).fadeIn();

  console.log('exit fadeOut');

}


function append_bonus(bonuses) {
  console.log('inside_append');
  var ul = $('ul');
  for (var i = 0; i < array.length; i++) {
    ul.append($("<li>").text(bonuses[i].reason_html));
  }
}


function load_bonuses(bonuses_buffer_size) {
  console.log("loading bonuses");
  endpoint = "https://bonus.ly/api/v1/bonuses?limit="+bonuses_buffer_size+"&top_level=true";
  access_token = '3625b98290b8600fefc94919be80947c';
  if(access_token != '') {
    endpoint += "&access_token="+access_token;
  }
  $.getJSON(endpoint, function(data) {
    bonuses = eval(data['result']);

    console.log ('length: ', $('#list-bonuses li').length); 
    if ($('#list-bonuses li').length === 0) {
      makeUL(bonuses);
    } else {
      refreshList(bonuses);
    }

    $('#widget').vTicker('init', {
      speed: 400,
      pause: 1000,
      showItems: 5,
      height: 0,
      // animation: 'fade',
      padding: 4
    });
  });

    
} 


