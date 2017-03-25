(function (global) {
    'use strict';

    var socket = io.connect('http://localhost:3000');
    var id_group, event_description, date_start, date_end, id_color;

    createForm();

    var submitButton = document.getElementById('submit_button');
    submitButton.addEventListener('click', sendForm);
    
    function sendForm() {
        var group_field = document.getElementById('group_select');
        id_group = group_field.options[group_field.selectedIndex].id;

        date_start = document.getElementById('date_start_input').value;
        date_end = document.getElementById('date_end_input').value;

        event_description = document.getElementById('description_input').value;
        id_color = document.getElementById('color_input').value;

        console.log("form data: " + id_group, event_description, date_start, date_end, id_color);
        socket.emit('create_event',
            {
                group: id_group,
                start: date_start,
                end: date_end,
                description: event_description,
                color: id_color
            });

    }

    /*-----------------------CREATING SUBMIT FROM---------------------------*/
    function createForm() {
        var form = document.getElementById('form');
        var group_select = createDOMelement('select', {
            class: 'group_select',
            id: 'group_select',
            name: 'group_select'
        });

    socket.emit('require_groups');

    socket.on('groups_from_server', function(obj){
        for (var i in obj) {
            var group_option = createDOMelement('option', {
                class: 'group_option',
                id: obj[i].id_group,
            });

            group_option.appendChild(document.createTextNode(obj[i].group_name));
            group_select.appendChild(group_option);
        }
        });
      

       var date_start_input = createDOMelement('input', {
            class: 'date_start_input',
            id: 'date_start_input',
            name: 'date_start_input',
            type: 'date',
            placeholder: 'Дата начала'
        });

        var date_end_input = createDOMelement('input', {
            class: 'date_end_input',
            id: 'date_end_input',
            name: 'date_end_input',
            type: 'date',
            value: '',
            placeholder: 'Дата окончания'
        });

        var description_input = createDOMelement('textarea', {
            class: 'description_input',
            id: 'description_input',
            name: 'description_input',
            rows: 4,
            value: 'Описание события',
            placeholder: 'Описание события'
        });

        var color_input = createDOMelement('input', {
            class: 'color_input',
            id: 'color_input',
            name: 'color_input',
            type: 'color',
            value: 'red'
        });

        var submit_button = createDOMelement('input', {
            class: 'close',
            id: 'submit_button',
            name: 'submit_button',
            type: 'submit',
            value: 'Создать'
        });


        form.appendChild(group_select);
        form.appendChild(date_start_input);
        form.appendChild(date_end_input);
        form.appendChild(description_input);
        form.appendChild(color_input);
        form.appendChild(submit_button);

    }

    function createDOMelement(tag, attr) {
        var elem = document.createElement(tag);
        for (var key in attr) {
            elem.setAttribute(key, attr[key]);
        }
        return elem;
    }
/*
function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = "none";
}
*/
} (window));

