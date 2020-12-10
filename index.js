const initDataTodo = key => localStorage.getItem(key) ? 
    JSON.parse(localStorage.getItem(key)) : [];

const updateDataTodo = (key, todoData) => localStorage.setItem(key, JSON.stringify(todoData));

const createToDo = (title, form, list) => {
  const todoContainer = document.createElement('div');
  const todoRow = document.createElement('div');
  const todoHeader = document.createElement('h1');
  const wrapperForm = document.createElement('div');
  const wrapperList = document.createElement('div');
  
  todoContainer.classList.add('container');
  todoRow.classList.add('row');
  todoHeader.classList.add('text-center', 'mb-5');
  wrapperForm.classList.add('col-6');
  wrapperList.classList.add('col-6');
  todoHeader.textContent = title;
  wrapperForm.append(form);
  wrapperList.append(list);
  todoRow.append(wrapperForm, wrapperList);
  todoContainer.append(todoHeader, todoRow);

  return todoContainer;
}

const createFormTodo = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const textArea = document.createElement('textarea');
  const btnSubmit = document.createElement('button');

  input.placeholder = 'Наименование';
  textArea.placeholder = 'Описание';

  btnSubmit.textContent = 'Добавить';
  btnSubmit.type = 'submit';

  form.classList.add('form-group');
  input.classList.add('form-control', 'mb-3');
  textArea.classList.add('form-control', 'mb-3');
  btnSubmit.classList.add('btn', 'btn-info');

  form.append(input, textArea, btnSubmit);

  return {input, textArea, btnSubmit, form};
}

const createListTodo = () => {
  const listTodo = document.createElement('ul');
  listTodo.classList.add('list-group');

  return listTodo;
}

const createItemTodo = (item, listTodo) => {
  const itemTodo = document.createElement('li');
  const btnItem = document.createElement('button');

  itemTodo.classList.add('list-group-item', 'p-0', 'mb-3', 'border-0');
  btnItem.classList.add('list-item', 'btn', 'btn-block', item.success ? 'btn-success' : item.important ? 'btn-primary' : 'btn-warning');
  btnItem.textContent = item.nameTodo;
  btnItem.id = item.id;

  itemTodo.append(btnItem);
  listTodo.append(itemTodo);
}

const addTodoItem = (key, todoData, listTodo, nameTodo, descriptionTodo) => {
  const id = `${(+new Date()).toString(16)}`;
  todoData.push({ id, nameTodo, descriptionTodo, success: false, important: false});
  updateTodo(listTodo, todoData, key);
}

const createModal = () => {
  const modalElem = document.createElement('div');
  const modalDialog = document.createElement('div');
  const modalContent = document.createElement('div');
  const modalHeader = document.createElement('div');
  const modalBody = document.createElement('div');
  const modalFooter = document.createElement('div');
  const itemTitle = document.createElement('h2');
  const itemDescription = document.createElement('p');
  const btnImportant = document.createElement('button');
  const btnClose = document.createElement('button');
  const btnReady = document.createElement('button');
  const btnDelete = document.createElement('button');
   
  modalElem.classList.add('modal', 'bg');
  modalDialog.classList.add('modal-dialog', 'modal-lg');
  modalContent.classList.add('modal-content');
  modalHeader.classList.add('modal-header', 'desc');
  modalBody.classList.add('modal-body', 'desc-2');
  modalFooter.classList.add('modal-footer');
  itemTitle.classList.add('modal-title', 'desc-1');
  btnImportant.classList.add('btn','bg-primary','btn-modal', 'text-white');
  btnClose.classList.add('btn-danger', 'close', 'btn-modal');
  btnReady.classList.add('btn', 'btn-success', 'btn-modal');
  btnDelete.classList.add('btn', 'btn-danger', 'btn-delete', 'btn-modal');

  btnImportant.innerHTML = 'Важное &#x02605;';
  btnClose.innerHTML = '&times;';
  btnReady.textContent = 'Выполнено';
  btnDelete.textContent = 'Удалить';

  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(itemTitle, btnClose);
  modalBody.append(itemDescription);
  modalFooter.append( btnImportant,btnReady, btnDelete);
  
  modalElem.append(modalDialog);

  const closeModal = event => {
    const target = event.target;
    if (target.classList.contains('btn-modal') || target === modalElem) {    
      modalElem.classList.remove('d-block');
    }
  };
  
  const showModal = (titleTodo, descriptionTodo, id) => {
    modalElem.dataset.idItem = id;
    modalElem.classList.add('d-block');
    itemTitle.textContent = titleTodo;
    itemDescription.textContent = descriptionTodo;
  };

  modalElem.addEventListener('click', closeModal);

  return {modalElem, btnImportant,btnReady, btnDelete, showModal}
}

const updateTodo = (listTodo, todoData, key) => {
  listTodo.textContent = '';
  todoData.forEach(item => createItemTodo(item, listTodo));
  updateDataTodo(key, todoData);
};

const initTodo = (selector, key = 'todo') => {
  const todoData = initDataTodo(key);
  const wrapper = document.querySelector(selector);
  const formTodo = createFormTodo();
  const listTodo = createListTodo();
  const modal = createModal();
  const todoApp = createToDo(key, formTodo.form, listTodo);
  
  document.body.append(modal.modalElem);
  wrapper.append(todoApp);
  formTodo.form.addEventListener('submit', event => {
    event.preventDefault(); //! чтобы страница не перезагружалась

    formTodo.input.classList.remove('is-invalid');
    formTodo.textArea.classList.remove('is-invalid');

    if(formTodo.input.value) {
      addTodoItem(key, todoData, listTodo, formTodo.input.value, formTodo.textArea.value);
      formTodo.form.reset();
    } else {
      if (!formTodo.input.value) {
        formTodo.input.classList.add('is-invalid');
      }
    }
  });

  listTodo.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('list-item')) {
      const item = todoData.find(elem => elem.id === target.id);
      modal.showModal(item.nameTodo, item.descriptionTodo, item.id);
    }
  })

  modal.btnImportant.addEventListener('click', () => {
    const itemTodo = todoData.find(elem => elem.id === modal.modalElem.dataset.idItem); 
    const index = todoData.findIndex(elem => elem.id === modal.modalElem.dataset.idItem);
    if (todoData[index].success == false) {
    itemTodo.important = !itemTodo.important;
    updateTodo(listTodo, todoData, key);
    } else {
      alert('это дело уже выполнено');
    }
  });
  modal.btnReady.addEventListener('click', () => {
    const itemTodo = todoData.find(elem => elem.id === modal.modalElem.dataset.idItem); 
    itemTodo.success = !itemTodo.success;
    updateTodo(listTodo, todoData, key);
  });
  modal.btnDelete.addEventListener('click', () => {
    const index = todoData.findIndex(elem => elem.id === modal.modalElem.dataset.idItem);
    todoData.splice(index, 1);
    updateTodo(listTodo, todoData, key);
  })
  let trashButton = document.getElementById('trash');
   trashButton.addEventListener('click', () => {
   todoData.splice(0, todoData.length);
   updateTodo(listTodo, todoData, key);
  })
  let resetButton = document.getElementById('reset');
   resetButton.addEventListener('click', () => {
   function resetArr(arr) { 
    let n = arr.length;
   for (let i = 0; i < n; i++) {
     if (todoData[i].success == true) {
       todoData.unshift(todoData[i]);
       todoData.splice(i+1, 1);
     }
   }
    for (let i = 0; i < n; i++) {
     if (todoData[i].important == false && todoData[i].success == false) {
      todoData.unshift(todoData[i]);
      todoData.splice(i+1, 1);
     }
    }
    for (let i = 0; i < n; i++) {
      if (todoData[i].important == true) {
      todoData.unshift(todoData[i]);
      todoData.splice(i+1, 1);
      }
    }
   return arr;
  }
   resetArr(todoData);
   updateTodo(listTodo, todoData, key);
  })

  document.title = key;

  updateTodo(listTodo, todoData, key);
}

initTodo('.app', ' ') //! как в css

let temaBlack = document.getElementById('black');
temaBlack.addEventListener('click', () => {
 document.body.className = 'bg-dark';
}); 

let temaWhite = document.getElementById('white');
temaWhite.addEventListener('click', () => {
 document.body.className = 'bg-light';
}); 

