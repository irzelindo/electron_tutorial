// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// alert('Render Log')

const { ipcRenderer } = require('electron')

const items = require('./items');

let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

// Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
});

// Open item from menu
ipcRenderer.on('menu-read-item', () => {
    items.open();
});

// Delete item from menu
ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem();
    items.delete(selectedItem.index);
});

// Open item on native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
    items.openNative();
});

// Search item from menu
ipcRenderer.on('menu-focus-search', () => {
    search.focus()
});

// Filter items with "search"

search.addEventListener('keyup', e => {

    // console.log(Array.from(document.getElementsByClassName('read-item')))

    // Loop items
    Array.from( document.getElementsByClassName('read-item')).forEach( item => {

        let hasMatch = item.innerText.toLowerCase().includes(search.value);

        item.style.display = hasMatch ? 'flex' : 'none'

    })

});

// Navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        items.changeSelection(e.key);
    }
});


// Disable and enable module buttons
const toggleModalButtons = () => {
    // Check state of buttons
    if(addItem.disabled === true){
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'

    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
});

addItem.addEventListener('click', e => {

    if(itemUrl){
        // console.log(itemUrl.value);
        // Send the new item to main.js
        ipcRenderer.send('new-item', itemUrl.value)

        toggleModalButtons();
    }

})

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // console.log(res);

    // Add new item to "items node"
    items.addItem(newItem, true);

    toggleModalButtons();

    // Hide the model and clear the value
    modal.style.display = 'none';
    itemUrl.value = '';
})

// Listem for a key event for input on addItem
itemUrl.addEventListener('keyup', e => {
    if(e.key == 'Enter'){
        addItem.click();
    }
})

