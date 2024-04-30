function togglePicSelector() {
    let picSelector = document.getElementById('picSelector');
    picSelector.style.display = picSelector.style.display === 'none' ? 'block' : 'none';
}

function changeProfilePic(picPath) {
    let profilePic = document.getElementById('profilePic');
    profilePic.src = picPath;
    togglePicSelector();  
}
