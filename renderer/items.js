const { shell } = require('electron');
const fs = require('fs');

let items = document.getElementById('items');

// Get readerJS content
let readerJS;


// Listen for "done" message from render window from reader.js
window.addEventListener('message', e => {
    // console.log(e.data);
    // this.delete(e.data.itemIndex);
    if (e.data.action === 'delete-reader-item') {

        // Delete item at given index
        this.delete(e.data.itemIndex)

        // close the window 
        // console.log(e.source)
        e.source.close();

    }
});

// Delete item
exports.delete = itemIndex => {

    // Remove item from DOM
    items.removeChild(items.childNodes[itemIndex]);

    // Remove item from storage
    this.storage.splice(itemIndex, 1);

    // Persist Storage
    this.save();

    // Select previous item or new top item
    if(this.storage.length){

        // Get selected item index
        let newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1;

        // Select item at new index
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected');
    }
}

// Fet Select item index
exports.getSelectedItem = () => {

    // Get the selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    // console.log(currentItem);

    // Get selected item index
    let itemIndex = 0

    let child = currentItem

    while((child = child.previousElementSibling) != null) itemIndex++;

    return { node: currentItem, index: itemIndex};

};

fs.readFile(`${__dirname}/reader.js`, (err,data) => {
    readerJS = data.toString();
});

// Set item as selected
exports.select = e => {

    // console.log(document.getElementsByClassName('read-item'));
    // Remove currently select item class
    // Old way of getting the same element
    // document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

    this.getSelectedItem().node.classList.remove('selected');

    // Add to clicked item
    e.currentTarget.classList.add('selected');
}

//  Move to newly select item
exports.changeSelection = direction => {
    // Get selected item
    let currentItem = this.getSelectedItem();

    // Handle up/down
    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling){
        currentItem.node.classList.remove('selected');
        currentItem.node.previousElementSibling.classList.add('selected');
    } else 
    if (direction === 'ArrowDown' && currentItem.node.nextElementSibling){
        currentItem.node.classList.remove('selected');
        currentItem.node.nextElementSibling.classList.add('selected');
    }
}

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Persists storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.openNative = () => {

     // Only if we have item (in case of menu open)
     if(!this.storage.length) return;

     // Get Selected item
     let selectedItem = this.getSelectedItem();
 
     // Get item's url
     let contentUrl = selectedItem.node.dataset.url;

     shell.openExternal(contentUrl);
}

// Open selected item
exports.open = () => {
    // Only if we have item (in case of menu open)
    if(!this.storage.length) return;

    // Get Selected item
    let selectedItem = this.getSelectedItem();

    // Get item's url
    let contentUrl = selectedItem.node.dataset.url;

    // console.log(contentUrl);
    // Open a proxy browser window
    let readerWin = window.open(contentUrl, '',
    `maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1`
    );
    
    // Inject Javascript with specific item index (selectedItem.index)
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
}

exports.addItem = (item, isNew = false) => {

    // Create a new DOM node
    let itemNode = document.createElement('div');
    
    // Assign "read-item" css class
    itemNode.setAttribute('class', 'read-item');

    // Set item url as data attribute
    itemNode.setAttribute('data-url', item.url);

    // Add innet HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h4>${item.title}</h4>`

    // Append new node to "items"
    items.appendChild(itemNode);

    // Attach click handler to select
    itemNode.addEventListener('click', this.select);

    itemNode.addEventListener('dblclick', this.open);

    // If this is the first item select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    // Add item to storage and persist
    if(isNew){
        this.storage.push(item);
        this.save()
    }

}

// Add items from storage whem app loads
this.storage.forEach(item => {
    this.addItem(item, false);
});