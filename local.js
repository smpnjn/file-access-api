let saveFile;
document.getElementById('someButton').addEventListener('click', async () => {
    try {
        saveFile = await window.showSaveFilePicker({
            suggestedName: 'My First File.txt',
            types: [{
                accept: {
                    'text/plain': ['.txt'],
                }
            }],
        });
        const file = await saveFile.getFile();
        const contents = await file.text();
        document.getElementById('add-text').removeAttribute('disabled');
        document.getElementById('add-text').setAttribute('placeholder', 'Type here to save content to your new file');
    } catch(e) {
        console.log(e);
    }
});

document.getElementById('add-text').addEventListener('keyup', async(e) => {
    if(typeof saveFile !== "undefined") {
        if ((await saveFile.queryPermission()) === 'granted') {
            const writable = await saveFile.createWritable();
            await writable.write(document.getElementById('add-text').value);
            await writable.close();
        }
    }
});

let directory;
document.getElementById('addToFolder').addEventListener('click', async () => {
    try {
        directory = await window.showDirectoryPicker({
            startIn: 'desktop'
        });

        document.getElementById('folder-info').innerHTML = '<h3>We found these files..<?h3>'
        for await (const entry of directory.values()) {
            let newEl = document.createElement('div');
            newEl.innerHTML = `<strong>${entry.name}</strong> - ${entry.kind}`;
            document.getElementById('folder-info').append(newEl);
        }
        document.getElementById('folder-info-add-new').classList.remove('hidden');
    } catch(e) {
        console.log(e);
    }
});

document.getElementById('addAFile').addEventListener('click', async () => {
    if(typeof directory !== "undefined") {
        if ((await directory.queryPermission()) === 'granted') {
            let newFile = await directory.getFileHandle('myFile.html', { create: true });
            document.getElementById('file-message').textContent = 'File "myFile.html" has been created!';
        }
    }
})