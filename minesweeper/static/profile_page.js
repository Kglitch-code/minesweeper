function togglePicSelector() {
    let picSelector = document.getElementById('picSelector');
    picSelector.style.display = picSelector.style.display === 'none' ? 'block' : 'none';
}

function changeProfilePic(picPath) {
    let profilePic = document.getElementById('profilePic');
    profilePic.src = '/static/images/' + picPath;
    togglePicSelector();  
    
    // AJAX request to update the profile image
    fetch('/update_profile_pic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile_image: picPath })
    }).then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
}

