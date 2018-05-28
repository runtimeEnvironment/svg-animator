document.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();


    let files = '<p> Files dropped: <p>';
    for(let f of e.dataTransfer.files) {
        files += `<p> ${f.path} </p>`;
    }

    document.getElementsByTagName('h1')[0].innerHTML = files;
});

document.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();

    document.getElementsByTagName('h1')[0].innerHTML = "Drop here";

    console.log('File hover');
});