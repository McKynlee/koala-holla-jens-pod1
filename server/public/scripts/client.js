console.log('js');

$(document).ready(function () {
  console.log('JQ');
  // Establish Click Listeners
  setupClickListeners();
  // load existing koalas on page load
  getKoalas();
}); // end doc ready

function setupClickListeners() {
  $(document).on('click', '.koala-transfer-button', updateTransfer);
  $(document).on('click', '.koala-row', editKoala); //.closest('td');
  $('#addButton').on('click', function () {
    console.log('in addButton on click');

    // get user input and put in an object
    let koalaToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      gender: $('#genderIn').val(),
      ready_to_transfer: $('#readyToTransferIn').val(),
      notes: $('#notesIn').val(),
    };

    //Reset inputs to empty:
    $('#nameIn').val('');
    $('#ageIn').val('');
    $('#genderIn').val('');
    $('#readyToTransferIn').val('');
    $('#notesIn').val('');

    // call saveKoala with the new obejct
    saveKoala(koalaToSend);
  });
}

function getKoalas() {
  console.log('in getKoalas');
  // ajax call to server to get koalas
  $.ajax({
    method: 'GET',
    url: '/koalas',
  })
    .then(function (koalaArray) {
      let koalaOnDom = $('#viewKoalas');

      koalaOnDom.empty();

      console.log('getKoalas GET response:', koalaArray);

      for (let koala of koalaArray) {
        let transferButton = `<button class="koala-transfer-button" 
        data-id="${koala.id}" data-status="${koala.ready_to_transfer}">
        Toggle ready to transfer</button>`;

        koalaOnDom.append(`
          <tr class="koala-row">
            <td data-info="${koala.name}">${koala.name}</td>
            <td data-info="${koala.age}">${koala.age}</td>
            <td data-info="${koala.gender}">${koala.gender}</td>
            <td data-info="${koala.ready_to_transfer}">${koala.ready_to_transfer}</td>
            <td data-info="${koala.notes}">${koala.notes}</td>
            <td>${transferButton}</td>
          </tr>
        `);
      }
    })
    .catch(function (error) {
      console.log('error in GET', error);
    });
} // end getKoalas

function saveKoala(newKoala) {
  console.log('in saveKoala', newKoala);

  let koala_to_add = newKoala;

  // ajax call to server to post koalas:
  $.ajax({
    method: 'POST',
    url: '/koalas',
    data: koala_to_add,
  })
    .then(function (response) {
      console.log('saveKoala POST response:', response);
      getKoalas();
    })
    .catch(function (err) {
      console.log('error posting koala:', err);
    });
}

function updateTransfer() {
  console.log('transfer update');
  let thisKoalaId = $(this).data('id');
  let thisKoalaStatus = $(this).data('status');
  $.ajax({
    method: 'PUT',
    url: `/koalas/${thisKoalaId}`,
    data: {
      thisKoalaStatus,
    },
  })
    .then((response) => {
      console.log('Successful transfer!');
      getKoalas();
    })
    .catch((error) => {
      alert('Error with transfer', error);
    });
}

function editKoala() {
  //let closestKoala = $(this).closest('td');
  let dataBox = $(this).data('info');
  console.log('editing koala');
  console.log('dataBox', dataBox);
  // console.log('closestKoala', closestKoala);
  console.log('this:', this);
}
