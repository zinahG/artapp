const deleteArtwork = btn => {
    const artworkId = btn.parentNode.querySelector('[name=artworkId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  
    const artworkElement = btn.closest('article');
  
    fetch('/artist/artwork/' + artworkId, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log(data);
        artworkElement.parentNode.removeChild(artworkElement);
      })
      .catch(err => {
        console.log(err);
      });
  };


